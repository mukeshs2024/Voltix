"""
1. Purpose: Explainability engine for Safety Agent.
2. Responsibilities: Generate human-readable reasoning for safety status.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any
from .safety_schema import SafetyInputState

class SafetyExplainabilityEngine:
    @staticmethod
    def generate_reasoning(
        state: SafetyInputState,
        rule_outputs: Dict[str, Any],
        validation_outputs: Dict[str, list],
        confidence: float
    ) -> str:
        status = rule_outputs.get("safety_status", "UNKNOWN")
        emergency = rule_outputs.get("emergency_flag", False)
        
        reasoning = f"Overall safety status is {status}. "
        
        if emergency:
            reasoning += "Emergency mode is active due to critical violations. "
            
        if len(rule_outputs.get("violations", [])) > 0:
            reasoning += f"Detected {len(rule_outputs['violations'])} violations. "
            
        blocked = len(validation_outputs.get("blocked_actions", []))
        if blocked > 0:
            reasoning += f"{blocked} actions were blocked for safety. "
            
        reasoning += f"Confidence: {confidence:.0%}."
        
        return reasoning
