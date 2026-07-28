"""
1. Objective: The LangGraph Supervisor node.
2. Folder location: ai/decision_engine/
3. Responsibilities: Ingest all agent outputs, validate, and execute ConsensusEngine.
"""
import time
from typing import Dict, Any
from ai.state import AgentState
from .consensus import ConsensusEngine
from .supervisor_logger import SupervisorLogger

class DecisionEngineSupervisor:
    def __init__(self):
        self.available_agents = [
            "OccupancyAgent", "ThermalAgent", "EnergyAgent", 
            "EquipmentAgent", "GridAgent", "SafetyAgent"
        ]

    def process_state(self, state: AgentState) -> dict[str, Any]:
        """
        Routes to each agent sequentially. Once all have executed, builds consensus.
        """
        start_time = time.time()
        
        proposed_actions = state.get("proposed_actions", [])
        
        # Determine which agents haven't run yet in this cycle
        executed = [list(action.keys())[0] for action in proposed_actions]
        remaining = [a for a in self.available_agents if a not in executed]
        
        if remaining:
            # Continue sequential execution
            return {"active_agent": remaining[0], "consensus_reached": False}
        
        # Aggregate all agent outputs into a unified dictionary
        agent_outputs = {}
        for action in proposed_actions:
            for agent_name, payload in action.items():
                # Strip "Agent" suffix to match matrix (e.g. "ThermalAgent" -> "Thermal")
                clean_name = agent_name.replace("Agent", "")
                agent_outputs[clean_name] = payload
                
        # Validate that we have at least one agent output
        if not agent_outputs:
            return {"active_agent": None, "consensus_reached": True, "final_decision": None}
            
        # Execute Consensus Engine
        decision = ConsensusEngine.evaluate(agent_outputs)
        
        latency_ms = (time.time() - start_time) * 1000
        
        # Log the cycle
        SupervisorLogger.log_decision_cycle(agent_outputs, decision, latency_ms)
        
        return {
            "active_agent": None, 
            "consensus_reached": True,
            "final_decision": decision.model_dump(mode="json")
        }
