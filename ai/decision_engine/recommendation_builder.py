"""
1. Objective: Convert consensus into actionable string recommendations.
2. Folder location: ai/decision_engine/
3. Responsibilities: Generate a list of actions for the building.
"""
from typing import Dict, Any, List

class RecommendationBuilder:
    @staticmethod
    def build(winning_agents: List[str], overridden_agents: List[str], agent_outputs: Dict[str, Any]) -> List[str]:
        recommendations = []
        
        if "Occupancy" in winning_agents or (not overridden_agents and "Occupancy" in agent_outputs):
            occ_data = agent_outputs.get("Occupancy", {})
            if occ_data.get("activity_level") in ["HIGH", "PEAK"]:
                recommendations.append("Continue occupancy monitoring due to high density.")
                
        if "Thermal" in winning_agents:
            thermal_data = agent_outputs.get("Thermal", {})
            setpoint = thermal_data.get("recommended_setpoint", 72.0)
            recommendations.append(f"Adjust HVAC setpoint to {setpoint}°F.")
            
        if "Energy" in overridden_agents:
            recommendations.append("Delay energy shedding to prioritize comfort/safety.")
        elif "Energy" in winning_agents:
            recommendations.append("Execute load shedding protocol immediately.")
            
        if "Safety" in winning_agents:
            recommendations.append("Execute emergency protocols.")
            
        if not recommendations:
            recommendations.append("Maintain normal operations.")
            
        return recommendations
