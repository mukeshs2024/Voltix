"""
1. Purpose: Validation engine for Safety Agent.
2. Responsibilities: Validate allowed vs blocked actions based on rules.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any, List
from .safety_schema import SafetyInputState

class SafetyValidator:
    @staticmethod
    def validate_actions(state: SafetyInputState, rule_outputs: Dict[str, Any]) -> Dict[str, List[str]]:
        allowed_actions = []
        blocked_actions = []
        
        emergency_flag = rule_outputs.get("emergency_flag", False)
        
        for rec in state.current_building_recommendations:
            if emergency_flag:
                # Rule: Emergency Mode -> Only emergency actions allowed
                if "evacuate" in rec.lower() or "ventilation" in rec.lower():
                    allowed_actions.append(rec)
                else:
                    blocked_actions.append(rec)
            else:
                # In normal conditions, generally allow actions unless specific violations block them.
                allowed_actions.append(rec)
                
        return {
            "allowed_actions": allowed_actions,
            "blocked_actions": blocked_actions
        }
