"""
1. Objective: Detect conflicting recommendations between agents.
2. Folder location: ai/decision_engine/
3. Responsibilities: Evaluate all agent outputs to find logical clashes.
"""
from typing import Dict, Any, List
from .decision_schema import ConflictSchema

class ConflictDetector:
    @staticmethod
    def detect(agent_outputs: Dict[str, Any]) -> List[ConflictSchema]:
        """
        Detects conflicts in agent recommendations.
        Returns a list of ConflictSchema.
        """
        conflicts = []
        
        # Extract specific signals
        thermal = agent_outputs.get("ThermalAgent", {})
        energy = agent_outputs.get("EnergyAgent", {})
        occupancy = agent_outputs.get("OccupancyAgent", {})
        grid = agent_outputs.get("GridAgent", {})
        
        thermal_mode = thermal.get("hvac_mode", "AUTO")
        energy_shedding = energy.get("shedding_recommended", False)
        
        # Conflict 1: Thermal wants cooling but Energy wants load shedding
        if thermal_mode == "COOL" and energy_shedding:
            conflicts.append(ConflictSchema(
                category="HVAC Demand",
                agents=["Thermal", "Energy"]
            ))
            
        # Conflict 2: Occupancy is high but Grid indicates peak pricing
        occ_activity = occupancy.get("activity_level", "EMPTY")
        grid_strategy = grid.get("cost_optimization_strategy", "NORMAL")
        
        if occ_activity in ["HIGH", "PEAK"] and grid_strategy == "PEAK_SHAVING":
            conflicts.append(ConflictSchema(
                category="Energy vs Comfort",
                agents=["Occupancy", "Grid"]
            ))
            
        return conflicts
