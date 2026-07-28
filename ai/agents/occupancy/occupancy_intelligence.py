"""
1. Purpose: Central facade for the Occupancy Intelligence Engine.
2. Responsibilities: Orchestrate rules, prediction, confidence, and explainability modules.
3. Folder location: ai/agents/occupancy/
"""

from datetime import datetime, timezone
from .occupancy_schema import SharedState, OccupancyOutput
from .occupancy_constants import (
    ActivityLevel,
    UtilizationStatus,
    TrendDirection,
    SensorType,
)
from .occupancy_rules import OccupancyRulesEngine
from .occupancy_prediction import OccupancyPredictionEngine
from .occupancy_confidence import OccupancyConfidenceEngine
from .occupancy_explainer import OccupancyExplainabilityEngine
from .config import OccupancyConfig


class OccupancyIntelligenceFacade:
    def __init__(self, llm_client):
        self.prediction_engine = OccupancyPredictionEngine(llm_client)

    def process_state(self, state: SharedState) -> OccupancyOutput:
        current_occupancy = self._calculate_base_occupancy(state)

        percentage = 0.0
        if state.zone.capacity > 0:
            percentage = current_occupancy / state.zone.capacity

        activity = self._determine_activity(percentage, state)
        utilization = self._determine_utilization(percentage)
        trend = self._determine_trend(state, current_occupancy)

        anomalies = OccupancyRulesEngine.evaluate(state, current_occupancy)
        recommendations = [a.recommendation for a in anomalies]

        confidence = OccupancyConfidenceEngine.calculate(
            state, current_occupancy, anomalies
        )
        prediction = self.prediction_engine.predict(state, current_occupancy, trend)

        reasoning = OccupancyExplainabilityEngine.generate_reasoning(
            state, current_occupancy, percentage, activity, trend, confidence, anomalies
        )

        return OccupancyOutput(
            zone_id=state.zone.zone_id,
            timestamp=datetime.now(timezone.utc),
            current_occupancy=current_occupancy,
            capacity=state.zone.capacity,
            occupancy_percentage=round(percentage, 2),
            activity_level=activity,
            utilization=utilization,
            trend=trend,
            prediction=prediction,
            anomalies=anomalies,
            confidence=confidence,
            reasoning=reasoning,
            recommendations=recommendations,
        )

    def _calculate_base_occupancy(self, state: SharedState) -> int:
        hard_sensors = [
            s
            for s in state.sensors
            if s.sensor_type in (SensorType.ACS, SensorType.TOF)
        ]
        if hard_sensors:
            return int(sum(s.value for s in hard_sensors))

        motion_detected = any(
            s.value > 0
            for s in state.sensors
            if s.sensor_type == SensorType.PIR and s.is_active
        )
        if motion_detected:
            return 1

        return 0

    def _determine_activity(
        self, percentage: float, state: SharedState
    ) -> ActivityLevel:
        motion_detected = any(
            s.value > 0
            for s in state.sensors
            if s.sensor_type == SensorType.PIR and s.is_active
        )
        if percentage == 0 and not motion_detected:
            return ActivityLevel.EMPTY
        elif percentage <= OccupancyConfig.ACTIVITY_LOW_THRESHOLD:
            return ActivityLevel.LOW
        elif percentage <= OccupancyConfig.ACTIVITY_MODERATE_THRESHOLD:
            return ActivityLevel.MODERATE
        elif percentage <= OccupancyConfig.ACTIVITY_HIGH_THRESHOLD:
            return ActivityLevel.HIGH
        else:
            return ActivityLevel.PEAK

    def _determine_utilization(self, percentage: float) -> UtilizationStatus:
        if percentage < OccupancyConfig.UTILIZATION_UNDER_THRESHOLD:
            return UtilizationStatus.UNDERUTILIZED
        elif percentage <= OccupancyConfig.UTILIZATION_OPTIMAL_THRESHOLD:
            return UtilizationStatus.OPTIMAL
        elif percentage <= OccupancyConfig.UTILIZATION_OVER_THRESHOLD:
            return UtilizationStatus.OVERUTILIZED
        else:
            return UtilizationStatus.CRITICAL

    def _determine_trend(
        self, state: SharedState, current_occupancy: int
    ) -> TrendDirection:
        if current_occupancy > (
            state.zone.capacity * OccupancyConfig.TREND_INCREASING_THRESHOLD
        ):
            return TrendDirection.INCREASING
        elif current_occupancy == 0:
            return TrendDirection.DECREASING
        return TrendDirection.STABLE
