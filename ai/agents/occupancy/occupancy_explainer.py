"""
1. Purpose: Explainability Engine for the Occupancy Agent.
2. Responsibilities: Generate data-driven, highly contextual reasoning strings explaining AI decisions.
3. Folder location: ai/agents/occupancy/
"""
from typing import List
from .occupancy_schema import SharedState, OccupancyAnomaly
from .occupancy_constants import ActivityLevel, TrendDirection

class OccupancyExplainabilityEngine:
    @staticmethod
    def generate_reasoning(
        state: SharedState, 
        current_occupancy: int, 
        percentage: float, 
        activity: ActivityLevel, 
        trend: TrendDirection, 
        confidence: float, 
        anomalies: List[OccupancyAnomaly]
    ) -> str:
        
        reasoning = (
            f"Activity Level = {activity.value}. "
            f"Occupancy is {int(percentage * 100)}% ({current_occupancy}/{state.zone.capacity}). "
        )
        
        if trend == TrendDirection.INCREASING:
            reasoning += "Entry rate currently exceeds exit rate. "
        elif trend == TrendDirection.DECREASING:
            reasoning += "Exit rate currently exceeds entry rate. "
        else:
            reasoning += "Occupancy levels are stable. "
            
        if anomalies:
            reasoning += f"Detected {len(anomalies)} anomalies (e.g., {anomalies[0].type}). "
            
        reasoning += f"Confidence = {int(confidence * 100)}% based on sensor telemetry freshness and agreement."
        
        return reasoning
