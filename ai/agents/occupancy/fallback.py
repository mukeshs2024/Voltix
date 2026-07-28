"""
Phase 7: Fallback Engine for the Occupancy Agent.
Ensures ultra-reliable, deterministic rule-based occupancy estimation 
when the primary LLM pipeline fails (timeout, network error, bad JSON).
"""
import logging
from datetime import datetime, timezone
from typing import Dict, Any

from .occupancy_schema import (
    SharedState, OccupancyOutput, OccupancyPredictionModel
)
from .occupancy_constants import ActivityLevel, UtilizationStatus, TrendDirection, SensorType

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
        co2_values = [s.value for s in state.sensors if s.sensor_type == SensorType.CO2 and s.is_active]
        acs_counts = [s.value for s in state.sensors if s.sensor_type == SensorType.ACS and s.is_active]
        
        # Rule 1: Access Control (Hard Count) takes absolute precedence
        if acs_counts:
            # Sum up current active ACS tallies if they exist
            estimated_count = int(sum(acs_counts))
            reasoning = "Fallback Rule 1: Using hard ACS swipe counts."
            
        # Rule 2: High CO2 indicates Medium/High presence
        elif co2_values and max(co2_values) > 800:
            # Rough heuristic: if CO2 is high, assume room is half full
            estimated_count = max(1, int(state.zone.capacity * 0.5))
            reasoning = "Fallback Rule 2: High CO2 (>800ppm) detected. Assuming 50% capacity."
            
        # Rule 3: Motion indicates at least some presence
        elif active_pir:
            # Motion but no high CO2 or ACS count; assume minimal presence
            estimated_count = max(1, int(state.zone.capacity * 0.1))
            reasoning = "Fallback Rule 3: Active PIR motion detected. Assuming 10% capacity."
            
        else:
            reasoning = "Fallback Rule Default: No active presence triggers detected. Assuming empty."
            
        # Cap the fallback estimate to capacity to prevent wild rule outputs
        estimated_count = min(estimated_count, state.zone.capacity)
        
        # Calculate percentage
        percentage = estimated_count / state.zone.capacity if state.zone.capacity > 0 else 0.0

        # Activity Level
        if percentage == 0: activity_level = ActivityLevel.EMPTY
        elif percentage <= 0.25: activity_level = ActivityLevel.LOW
        elif percentage <= 0.75: activity_level = ActivityLevel.MODERATE
        elif percentage <= 1.0: activity_level = ActivityLevel.HIGH
        else: activity_level = ActivityLevel.PEAK
        
        # Utilization
        if percentage < 0.4: utilization = UtilizationStatus.UNDERUTILIZED
        elif percentage <= 0.8: utilization = UtilizationStatus.OPTIMAL
        elif percentage <= 1.0: utilization = UtilizationStatus.OVERUTILIZED
        else: utilization = UtilizationStatus.CRITICAL
        
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
            prediction=OccupancyPredictionModel(min_15=estimated_count, min_30=estimated_count, min_60=estimated_count),
            anomalies=[],
            confidence=0.4, 
            reasoning=f"[FALLBACK TRIGGERED] {reasoning}",
            recommendations=["Verify network connection to primary LLM."]
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
            raw_state["errors"] = raw_state.get("errors", []) + [exception_msg, f"Fallback failed: {e}"]
            return raw_state
