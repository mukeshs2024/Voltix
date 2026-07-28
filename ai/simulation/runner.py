import asyncio
from typing import Any, Dict
import json
from ai.graph import create_graph
from ai.state import AgentState, DigitalTwinState
from ai.explainability import ExplainabilityEngine

class SimulationRunner:
    """
    Entry point to invoke the AI layer from the external Backend/Digital Twin.
    """
    
    def __init__(self):
        self.graph = create_graph()
        self.explainer = ExplainabilityEngine()
        
    async def run_cycle(self, twin_telemetry: Dict[str, Any], session_id: str = "default_session") -> tuple[AgentState, Dict[str, Any]]:
        """
        Executes one full LangGraph cycle based on current digital twin telemetry.
        Returns the raw state and the explainability trace.
        """
        twin_state = DigitalTwinState(
            occupancy_metrics=twin_telemetry.get("occupancy", {}),
            thermal_metrics=twin_telemetry.get("thermal", {}),
            energy_metrics=twin_telemetry.get("energy", {}),
            equipment_status=twin_telemetry.get("equipment", {}),
            grid_signals=twin_telemetry.get("grid", {})
        )
        
        initial_state: AgentState = {
            "messages": [],
            "twin_state": twin_state,
            "active_agent": None,
            "negotiation_history": [],
            "consensus_reached": False,
            "proposed_actions": []
        }
        
        config = {"configurable": {"thread_id": session_id}}
        final_state = await self.graph.ainvoke(initial_state, config=config)
        
        # Generate human-readable trace
        trace = self.explainer.generate_trace(final_state)
        
        return final_state, trace

async def main():
    print("--- Starting Digital Twin AI Simulation ---")
    runner = SimulationRunner()
    
    mock_telemetry = {
        "occupancy": {"zone_a": 45},
        "thermal": {"zone_a_temp": 23.5},
        "grid": {"pricing_tier": "On-Peak"}
    }
    
    final_state, trace = await runner.run_cycle(mock_telemetry, "sim_test_001")
    
    print("\n--- Final Consensus Reached ---")
    print("\n--- Explainability Trace ---")
    print(json.dumps(trace, indent=2))
            
if __name__ == "__main__":
    asyncio.run(main())
