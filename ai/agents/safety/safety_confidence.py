"""
1. Purpose: Confidence calculation for Safety Agent.
2. Responsibilities: Determine confidence score for safety evaluations.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any
from .safety_schema import SafetyInputState

class SafetyConfidenceEngine:
    @staticmethod
    def calculate(state: SafetyInputState, rule_outputs: Dict[str, Any]) -> float:
        confidence = 0.95
        
        # Lower confidence slightly if equipment health is unknown
        if not state.equipment_health or state.equipment_health == "UNKNOWN":
            confidence -= 0.05
            
        return max(0.0, min(1.0, confidence))
