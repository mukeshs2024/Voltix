"""
Phase 7: Fallback Engine for the Occupancy Agent.
Ensures ultra-reliable, deterministic rule-based occupancy estimation
when the primary LLM pipeline fails (timeout, network error, bad JSON).
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any

from .occupancy_schema import SharedState, OccupancyOutput, OccupancyPredictionModel
from .occupancy_constants import (
    ActivityLevel,
    UtilizationStatus,
    TrendDirection,
    SensorType,
)
from .config import OccupancyConfig

logger = logging.getLogger(__name__)


class FallbackEngine:
    @staticmethod
    def execute_rules(state: SharedState) -> OccupancyOutput:
        """
        Executes a fast, deterministic, rule-based fallback algorithm.
        Returns a perfectly compliant OccupancyOutput schema.
        """
        logger.warning(f"FallbackEngine engaged for zone: {state.zone.zone_id}")

        # Default baseline
        estimated_count = 0

        # We need to analyze available sensors
        active_pir = any(s.is_active for s in state.sensors if s.sensor_type == SensorType.PIR)
        co2_values = [
            s.value
            for s in state.sensors
            if s.sensor_type == SensorType.CO2 and s.is_active
        ]
        hard_counts = [
            s.value
            for s in state.sensors
            if s.sensor_type in (SensorType.ACS, SensorType.TOF) and s.is_active
        ]

        # Rule 1: Access Control (Hard Count) takes absolute precedence
        if hard_counts:
            # Sum up current active hard counts if they exist
            estimated_count = int(sum(hard_counts))
            reasoning = "Fallback Rule 1: Using hard ACS swipe counts."

        # Rule 2: High CO2 indicates Medium/High presence
        elif co2_values and max(co2_values) > OccupancyConfig.CO2_HIGH_PPM:
            # Rough heuristic: if CO2 is high, assume room is half full
            estimated_count = max(1, int(state.zone.capacity * OccupancyConfig.FALLBACK_HIGH_CO2_OCCUPANCY_RATIO))
            reasoning = (
                f"Fallback Rule 2: High CO2 (>{OccupancyConfig.CO2_HIGH_PPM}ppm) detected. Assuming 50% capacity."
            )

        # Rule 3: Motion indicates at least some presence
        elif active_pir:
            # Motion but no high CO2 or ACS count; assume minimal presence
            estimated_count = max(1, int(state.zone.capacity * OccupancyConfig.FALLBACK_MOTION_OCCUPANCY_RATIO))
            reasoning = (
                "Fallback Rule 3: Active PIR motion detected. Assuming 10% capacity."
            )

        else:
            reasoning = "Fallback Rule Default: No active presence triggers detected. Assuming empty."

        # Cap the fallback estimate to capacity to prevent wild rule outputs
        estimated_count = min(estimated_count, state.zone.capacity)

        # Calculate percentage
        percentage = (
            estimated_count / state.zone.capacity if state.zone.capacity > 0 else 0.0
        )

        # Activity Level
        if percentage == 0:
            activity_level = ActivityLevel.EMPTY
        elif percentage <= OccupancyConfig.ACTIVITY_LOW_THRESHOLD:
            activity_level = ActivityLevel.LOW
        elif percentage <= OccupancyConfig.ACTIVITY_MODERATE_THRESHOLD:
            activity_level = ActivityLevel.MODERATE
        elif percentage <= OccupancyConfig.ACTIVITY_HIGH_THRESHOLD:
            activity_level = ActivityLevel.HIGH
        else:
            activity_level = ActivityLevel.PEAK

        # Utilization
        if percentage < OccupancyConfig.UTILIZATION_UNDER_THRESHOLD:
            utilization = UtilizationStatus.UNDERUTILIZED
        elif percentage <= OccupancyConfig.UTILIZATION_OPTIMAL_THRESHOLD:
            utilization = UtilizationStatus.OPTIMAL
        elif percentage <= OccupancyConfig.UTILIZATION_OVER_THRESHOLD:
            utilization = UtilizationStatus.OVERUTILIZED
        else:
            utilization = UtilizationStatus.CRITICAL

        # Note: Confidence is hardcoded to 0.4 because this is a fallback.
        # It signals to downstream agents that this is NOT a high-fidelity AI prediction.

        return OccupancyOutput(
            zone_id=state.zone.zone_id,
            timestamp=datetime.now(timezone.utc),
            current_occupancy=estimated_count,
            capacity=state.zone.capacity,
            occupancy_percentage=round(percentage, 2),
            activity_level=activity_level,
            utilization=utilization,
            trend=TrendDirection.STABLE,
            prediction=OccupancyPredictionModel(
                min_15=estimated_count, min_30=estimated_count, min_60=estimated_count
            ),
            anomalies=[],
            confidence=OccupancyConfig.FALLBACK_CONFIDENCE,
            reasoning=f"[FALLBACK TRIGGERED] {reasoning}",
            recommendations=["Verify network connection to primary LLM."],
        )

    @staticmethod
    def rescue_state(raw_state: Dict[str, Any], exception_msg: str) -> Dict[str, Any]:
        """
        The main entry point for rescuing a failed pipeline.
        Attempts to parse whatever is salvageable from raw_state and applies rules.
        """
        try:
            # Try to build the input state model. If this fails, the payload is completely malformed.
            state = SharedState.model_validate(raw_state)

            # Execute fallback logic
            fallback_output = FallbackEngine.execute_rules(state)

            # Apply to state
            state.occupancy_metrics = fallback_output
            state.errors.append(f"Pipeline failed: {exception_msg}. Fallback engaged.")

            return state.model_dump(mode="json", by_alias=True)

        except Exception as e:
            # Total catastrophic failure (e.g., input payload is completely invalid JSON)
            logger.critical(f"Fallback Engine also failed to parse state: {e}")
            if isinstance(raw_state, dict):
                raw_state["errors"] = [str(e)]
                # Forcefully inject empty metrics so downstream orchestration doesn't crash
                raw_state["occupancy_metrics"] = {
                    "current_occupancy": 0,
                    "occupancy_percentage": 0.0,
                    "activity_level": "EMPTY",
                    "utilization": "UNDERUTILIZED",
                    "trend": "STABLE",
                    "confidence": 0.0,
                    "anomalies": [],
                    "recommendations": ["System error occurred; fallback engaged."],
                }
                return raw_state
            return {"errors": [str(e)], "occupancy_metrics": {"current_occupancy": 0}}
