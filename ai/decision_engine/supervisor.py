
from ai.state import AgentState
from typing import Any
from pydantic import BaseModel, Field
import json
import os
from dotenv import load_dotenv

load_dotenv()

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
except ImportError:
    ChatGroq = None
    ChatPromptTemplate = None

class NextAgentRoute(BaseModel):
    next_agent: str = Field(description="The exact name of the next agent to execute, or 'END' if consensus is reached.")
    reasoning: str

class DecisionEngineSupervisor:
    """
    LLM-driven supervisor node that dynamically routes execution based on twin state.
    """
    def __init__(self):
        self.available_agents = [
            "OccupancyAgent", "ThermalAgent", "EnergyAgent", 
            "EquipmentAgent", "GridAgent", "SafetyAgent"
        ]
        if ChatGroq and os.getenv("GROQ_API_KEY"):
            self.llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")
        else:
            self.llm = None
        
        self.system_prompt = """
        You are the Decision Engine Supervisor for a Digital Twin Multi-Agent System.
        Your job is to read the current twin telemetry and decide which specialized agent needs to act next.
        
        Available Agents: {available_agents}
        
        If an agent has already proposed an action in the current cycle, do not call them again unless a conflict occurred.
        If all necessary agents have acted and no conflicts exist, return 'END'.
        """

    def process_state(self, state: AgentState) -> dict[str, Any]:
        proposed_actions = state.get("proposed_actions", [])
        
        # Determine which agents haven't run yet in this cycle
        executed = [list(action.keys())[0] for action in proposed_actions]
        remaining = [a for a in self.available_agents if a not in executed]
        
        print(f"[DEBUG] Supervisor activated. Executed so far: {executed}. Remaining: {remaining}")
        
        # Deterministic routing - much faster, more reliable, and prevents tool hallucination
        if remaining:
            return {"active_agent": remaining[0], "consensus_reached": False}
            
        return {"active_agent": None, "consensus_reached": True}
