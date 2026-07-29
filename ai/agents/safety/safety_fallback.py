"""
Fallback Engine for the Safety Agent.
Ensures ultra-reliable, deterministic rule-based safety validation
when the primary pipeline or LLM fails.
"""

import logging
from typing import Dict, Any

from .safety_schema import SafetyInputState, SafetyOutput
from .safety_constants import SafetyStatus, RiskLevel
from .safety_rules import SafetyRulesEngine
from .safety_validator import SafetyValidator

logger = logging.getLogger(__name__)

class SafetyFallbackEngine:
    @staticmethod
    def execute_rules(state: SafetyInputState) -> SafetyOutput:
        """
        Executes deterministic rules fallback.
        """
        logger.warning(f"SafetyFallbackEngine engaged.")

        # Deterministic rules evaluation
        rule_outputs = SafetyRulesEngine.evaluate(state)
        validation_outputs = SafetyValidator.validate_actions(state, rule_outputs)

        return SafetyOutput(
            safety_status=rule_outputs["safety_status"],
            violations=rule_outputs["violations"],
            risk_level=rule_outputs["risk_level"],
            allowed_actions=validation_outputs["allowed_actions"],
            blocked_actions=validation_outputs["blocked_actions"],
            emergency_flag=rule_outputs["emergency_flag"],
            recommendations=rule_outputs["recommendations"],
            confidence=0.4,  # Lower confidence for fallback
            reasoning="[FALLBACK TRIGGERED] Deterministic safety validation applied due to pipeline failure."
        )

    @staticmethod
    def rescue_state(raw_state: Dict[str, Any], exception_msg: str) -> Dict[str, Any]:
        """
        The main entry point for rescuing a failed pipeline.
        """
        try:
            state = SafetyInputState.model_validate(raw_state)
            fallback_output = SafetyFallbackEngine.execute_rules(state)
            
            state.safety_metrics = fallback_output
            state.errors.append(f"Pipeline failed: {exception_msg}. Fallback engaged.")
            return state.model_dump(mode="json", by_alias=True)

        except Exception as e:
            logger.critical(f"Safety Fallback Engine also failed to parse state: {e}")
            if isinstance(raw_state, dict):
                if "errors" not in raw_state:
                    raw_state["errors"] = []
                raw_state["errors"].append(str(e))
                raw_state["safety_metrics"] = {"safety_status": SafetyStatus.CRITICAL.value, "emergency_flag": True}
                return raw_state
            return {"errors": [str(e)], "safety_metrics": {"safety_status": SafetyStatus.CRITICAL.value, "emergency_flag": True}}
