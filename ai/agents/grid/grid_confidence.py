"""
1. Purpose: Confidence calculation for Grid Agent.
2. Responsibilities: Determine confidence score for recommendations based on input quality and rules.
3. Folder location: ai/agents/grid/
"""

from typing import Dict, Any, List
from .grid_schema import GridInputState

class GridConfidenceEngine:
    @staticmethod
    def calculate(state: GridInputState, rule_outputs: Dict[str, Any]) -> float:
        # Base confidence
        confidence = 0.90
        
        # Penalize if DR event is active because it introduces uncertainty
        if state.demand_response_event:
            confidence -= 0.10
            
        # Penalize if weather forecast is missing or unknown
        if not state.weather_forecast or state.weather_forecast == "UNKNOWN":
            confidence -= 0.05
            
        # Ensure it stays within bounds
        return max(0.0, min(1.0, confidence))
