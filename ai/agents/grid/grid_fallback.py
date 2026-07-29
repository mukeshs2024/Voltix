"""
Fallback Engine for the Grid Agent.
Ensures ultra-reliable, deterministic rule-based grid strategy estimation
when the primary pipeline or LLM fails.
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any

from .grid_schema import GridInputState, GridOutput, GridPredictionModel
from .grid_constants import PricingTier, BatteryStrategy, CarbonLevel, GridStatus
from .grid_rules import GridRulesEngine

logger = logging.getLogger(__name__)

class GridFallbackEngine:
    @staticmethod
    def execute_rules(state: GridInputState) -> GridOutput:
        """
        Executes deterministic rules fallback.
        """
        logger.warning(f"GridFallbackEngine engaged.")

        # Default baseline
        rule_outputs = GridRulesEngine.evaluate(state)

        return GridOutput(
            timestamp=datetime.now(timezone.utc),
            pricing_tier=rule_outputs["pricing_tier"],
            battery_strategy=rule_outputs["battery_strategy"],
            recommended_loads=[],
            delayable_loads=[],
            critical_loads=[],
            carbon_level=rule_outputs["carbon_level"],
            grid_status=rule_outputs["grid_status"],
            confidence=0.4,  # Lower confidence for fallback
            reasoning="[FALLBACK TRIGGERED] Deterministic grid strategy applied due to pipeline failure.",
            recommendations=rule_outputs["recommendations"],
            predictions=GridPredictionModel(
                next_hour_price=state.current_grid_price,
                next_hour_carbon=state.grid_carbon_intensity
            )
        )

    @staticmethod
    def rescue_state(raw_state: Dict[str, Any], exception_msg: str) -> Dict[str, Any]:
        """
        The main entry point for rescuing a failed pipeline.
        """
        try:
            state = GridInputState.model_validate(raw_state)
            fallback_output = GridFallbackEngine.execute_rules(state)
            
            state.grid_metrics = fallback_output
            state.errors.append(f"Pipeline failed: {exception_msg}. Fallback engaged.")
            return state.model_dump(mode="json", by_alias=True)

        except Exception as e:
            logger.critical(f"Fallback Engine also failed to parse state: {e}")
            if isinstance(raw_state, dict):
                if "errors" not in raw_state:
                    raw_state["errors"] = []
                raw_state["errors"].append(str(e))
                # Fallback dictionary if model validation completely failed
                raw_state["grid_metrics"] = {"grid_status": GridStatus.CRITICAL.value}
                return raw_state
            return {"errors": [str(e)], "grid_metrics": {"grid_status": GridStatus.CRITICAL.value}}
