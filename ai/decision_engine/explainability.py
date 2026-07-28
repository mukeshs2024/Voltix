"""
1. Objective: Generate a human-readable narrative explaining the final decision.
2. Folder location: ai/decision_engine/
3. Responsibilities: Eliminate generic explanations by citing specific data and overrides.
"""
from typing import Dict, Any, List
from .decision_schema import ConflictSchema

class ExplainabilityEngine:
    @staticmethod
    def explain(
        decision: str, 
        winning_agents: List[str], 
        overridden_agents: List[str], 
        conflicts: List[ConflictSchema], 
        agent_outputs: Dict[str, Any]
    ) -> str:
        
        reasoning_parts = []
        
        if "Occupancy" in agent_outputs:
            occ_pct = agent_outputs["Occupancy"].get("occupancy_percentage", 0.0) * 100
            reasoning_parts.append(f"Occupancy reached {int(occ_pct)}%.")
            
        if "Thermal" in winning_agents:
            reasoning_parts.append("Thermal Agent recommended additional cooling/heating.")
            
        if "Energy" in overridden_agents:
            reasoning_parts.append("Energy Agent suggested reducing HVAC due to load limits, but occupant comfort/safety was prioritized.")
            
        if "Grid" in overridden_agents:
            reasoning_parts.append("Grid pricing was considered but given lower priority.")
            
        if not conflicts:
            reasoning_parts.append("All agents were in alignment with no conflicts detected.")
            
        # Extract max confidence from winning agents to append to the reasoning
        confidences = [agent_outputs.get(a, {}).get("confidence", 0.9) for a in winning_agents]
        max_conf = max(confidences) if confidences else 0.9
        reasoning_parts.append(f"Confidence = {int(max_conf * 100)}%.")
            
        return " ".join(reasoning_parts)
