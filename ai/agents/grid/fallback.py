"""
1. Purpose: Fallback Engine for the Grid Agent.
2. Responsibilities: Deterministic grid reasoning when the primary pipeline or LLM fails.
3. Folder location: ai/agents/grid/
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any

from .grid_schema import GridState, GridOutput, GridPredictionModel
from .grid_constants import GridConfig
from .grid_rules import GridRulesEngine
from .grid_confidence import GridConfidenceEngine

logger = logging.getLogger(__name__)


class GridFallbackEngine:
    @staticmethod
    def execute_rules(state: GridState) -> GridOutput:
        logger.warning("GridFallbackEngine engaged.")
        telemetry = state.to_telemetry()

        pricing_tier = GridRulesEngine.determine_pricing_tier(telemetry)
        carbon_level = GridRulesEngine.determine_carbon_level(telemetry)
        rule_outcomes, recommendations, delayable, critical = GridRulesEngine.evaluate(
            telemetry
        )
        battery_strategy = GridRulesEngine.determine_battery_strategy(
            telemetry, pricing_tier, carbon_level
        )
        grid_status = GridRulesEngine.determine_grid_status(
            telemetry, pricing_tier, rule_outcomes
        )
        confidence = GridConfidenceEngine.calculate(telemetry, rule_outcomes, llm_used=False)
        load = telemetry.current_building_load_kw

        prediction = GridPredictionModel(
            min_15=load,
            min_30=load,
            min_60=load,
            predicted_price_tier=pricing_tier,
            predicted_load_kw=load,
        )

        reasoning = (
            f"[FALLBACK TRIGGERED] Pricing={pricing_tier.value}, "
            f"Battery={battery_strategy.value}, Grid={grid_status.value}. "
            f"Deterministic rules applied without LLM augmentation."
        )

        return GridOutput(
            pricing_tier=pricing_tier,
            battery_strategy=battery_strategy,
            recommended_loads=recommendations[:3],
            delayable_loads=delayable,
            critical_loads=critical,
            carbon_level=carbon_level,
            grid_status=grid_status,
            confidence=GridConfig.FALLBACK_CONFIDENCE,
            reasoning=reasoning,
            recommendations=recommendations,
            predictions=prediction,
            rule_outcomes=rule_outcomes,
            timestamp=datetime.now(timezone.utc),
            cost_optimization_strategy=GridRulesEngine.cost_optimization_strategy(
                pricing_tier, battery_strategy, grid_status
            ),
        )

    @staticmethod
    def rescue_state(raw_state: Dict[str, Any], exception_msg: str) -> Dict[str, Any]:
        try:
            state = GridState.model_validate(raw_state)
            fallback_output = GridFallbackEngine.execute_rules(state)
            state.grid_metrics = fallback_output
            state.errors.append(f"Pipeline failed: {exception_msg}. Fallback engaged.")
            return state.model_dump(mode="json", by_alias=True)
        except Exception as exc:
            logger.critical(f"Grid Fallback Engine also failed: {exc}")
            if isinstance(raw_state, dict):
                raw_state["errors"] = raw_state.get("errors", []) + [str(exc)]
                raw_state["grid_metrics"] = {
                    "pricing_tier": "MID_PEAK",
                    "battery_strategy": "hold",
                    "grid_status": "WARNING",
                    "carbon_level": "MEDIUM",
                    "confidence": 0.0,
                    "reasoning": "[CATASTROPHIC FALLBACK] Unable to parse grid state.",
                    "recommendations": ["Verify grid telemetry payload."],
                    "predictions": {"15_min": 0.0, "30_min": 0.0, "60_min": 0.0},
                }
                return raw_state
            return {"errors": [str(exc)], "grid_metrics": {"confidence": 0.0}}
