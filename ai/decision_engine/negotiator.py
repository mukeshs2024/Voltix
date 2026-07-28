from ai.state import AgentState
from typing import Any, List
import json

class Negotiator:
    """
    Actively parses proposed actions to detect and format conflict resolutions.
    """
    
    def __init__(self, max_cycles: int = 3):
        self.max_cycles = max_cycles
        
    def detect_conflicts(self, state: AgentState) -> List[str]:
        """
        Evaluate proposed actions to find logical conflicts.
        Returns a list of conflict descriptions.
        """
        proposals = state.get("proposed_actions", [])
        conflicts = []
        
        # Simple mock conflict logic: if Thermal wants cooling but Grid says max draw is low
        has_cooling = False
        low_grid_draw = False
        
        for p in proposals:
            if "ThermalAgent" in p and p["ThermalAgent"].get("hvac_mode") == "Cooling":
                has_cooling = True
            if "GridAgent" in p and p["GridAgent"].get("max_allowable_draw_kw", 1000) < 100:
                low_grid_draw = True
                
        if has_cooling and low_grid_draw:
            conflicts.append("ThermalAgent cooling request conflicts with GridAgent low draw constraint.")
            
        return conflicts
        
    def resolve_conflicts(self, state: AgentState) -> dict[str, Any]:
        """
        Updates the negotiation history with conflict constraints.
        """
        history = state.get("negotiation_history", [])
        if len(history) >= self.max_cycles:
            # Force safety default
            return {"consensus_reached": True, "active_agent": None, "forced_fallback": True}
            
        conflicts = self.detect_conflicts(state)
        if not conflicts:
            return {} # No state change needed
            
        history.append({
            "event": "Conflict Detected",
            "details": conflicts,
            "instruction": "Please revise proposals to respect constraints."
        })
        
        # Clear proposed actions to restart the proposal phase
        return {"negotiation_history": history, "consensus_reached": False, "proposed_actions": []}
