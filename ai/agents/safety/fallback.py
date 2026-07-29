"""
1. Purpose: Fallback Engine for the Safety Agent.
2. Responsibilities: Deterministic safety validation when the primary pipeline or LLM fails.
3. Folder location: ai/agents/safety/
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any

from .safety_schema import SafetyState, SafetyOutput
from .safety_constants import SafetyConfig, SafetyStatus, RiskLevel
from .safety_rules import SafetyRulesEngine
from .safety_confidence import SafetyConfidenceEngine
from .safety_validator import SafetyValidator

logger = logging.getLogger(__name__)


class SafetyFallbackEngine:
    @staticmethod
    def execute_rules(state: SafetyState) -> SafetyOutput:
        logger.warning("SafetyFallbackEngine engaged.")

        violations, recommendations, rule_allowed, rule_blocked = SafetyRulesEngine.evaluate(
            state
        )
        safety_status = SafetyRulesEngine.determine_safety_status(violations)
        risk_level = SafetyRulesEngine.determine_risk_level(violations)
        emergency_flag = SafetyRulesEngine.is_emergency(violations, state)

        validator = SafetyValidator(llm_client=None)
        blocked, allowed, _ = validator.validate_recommendations(
            state, violations, safety_status
        )
        blocked = sorted(set(blocked + rule_blocked))
        allowed = sorted(set(allowed + rule_allowed))

        confidence = SafetyConfidenceEngine.calculate(state, violations, llm_used=False)

        reasoning = (
            f"[FALLBACK TRIGGERED] Safety={safety_status.value}, "
            f"Risk={risk_level.value}, Emergency={emergency_flag}. "
            f"Deterministic safety rules applied without LLM augmentation."
        )

        validation_status = "FAILED" if emergency_flag else "PASSED"

        return SafetyOutput(
            safety_status=safety_status,
            violations=violations,
            risk_level=risk_level,
            allowed_actions=allowed,
            blocked_actions=blocked,
            emergency_flag=emergency_flag,
            recommendations=recommendations,
            confidence=SafetyConfig.FALLBACK_CONFIDENCE if not emergency_flag else 0.90,
            reasoning=reasoning,
            timestamp=datetime.now(timezone.utc),
            emergency_protocol_active=emergency_flag,
            validation_status=validation_status,
        )

    @staticmethod
    def rescue_state(raw_state: Dict[str, Any], exception_msg: str) -> Dict[str, Any]:
        try:
            state = SafetyState.model_validate(raw_state)
            fallback_output = SafetyFallbackEngine.execute_rules(state)
            state.safety_metrics = fallback_output
            state.errors.append(f"Pipeline failed: {exception_msg}. Fallback engaged.")
            return state.model_dump(mode="json")
        except Exception as exc:
            logger.critical(f"Safety Fallback Engine also failed: {exc}")
            if isinstance(raw_state, dict):
                raw_state["errors"] = raw_state.get("errors", []) + [str(exc)]
                raw_state["safety_metrics"] = {
                    "safety_status": "CRITICAL",
                    "risk_level": "EXTREME",
                    "emergency_flag": True,
                    "emergency_protocol_active": True,
                    "confidence": 0.0,
                    "reasoning": "[CATASTROPHIC FALLBACK] Unable to parse safety state.",
                    "recommendations": ["Manual safety inspection required."],
                    "blocked_actions": list(SafetyConfig.BLOCKED_OPTIMIZATION_ACTIONS),
                    "allowed_actions": list(SafetyConfig.EMERGENCY_ACTIONS),
                    "validation_status": "FAILED",
                }
                return raw_state
            return {"errors": [str(exc)], "safety_metrics": {"confidence": 0.0}}
