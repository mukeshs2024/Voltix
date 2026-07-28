
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
            self.llm = ChatGroq(temperature=0, model_name="llama3-70b-8192")
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
        
        # Fallback to static routing if LLM is unavailable
        if not self.llm or not ChatPromptTemplate:
            executed = [list(action.keys())[0] for action in proposed_actions]
            remaining = [a for a in self.available_agents if a not in executed]
            if remaining:
                return {"active_agent": remaining[0], "consensus_reached": False}
            return {"active_agent": None, "consensus_reached": True}

        # Dynamic routing
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Current State: {twin_state}\nProposed Actions so far: {proposals}")
        ])
        
        chain = prompt | self.llm.with_structured_output(NextAgentRoute)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        try:
            # Note: synchronous invoke for simplicity in this node
            result = chain.invoke({
                "available_agents": ", ".join(self.available_agents),
                "twin_state": twin_state_json,
                "proposals": json.dumps(proposed_actions)
            })
            
            if result.next_agent == "END":
                return {"active_agent": None, "consensus_reached": True}
            
            return {"active_agent": result.next_agent, "consensus_reached": False}
        except Exception as e:
            # Fallback if parsing fails
            return {"active_agent": None, "consensus_reached": True}
