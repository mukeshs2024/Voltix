"""
1. Purpose: Central facade for the Occupancy Intelligence Engine.
2. Responsibilities: Orchestrate rules, prediction, confidence, and explainability modules.
3. Folder location: ai/agents/occupancy/
"""
from datetime import datetime, timezone
from .occupancy_schema import SharedState, OccupancyOutput
from .occupancy_constants import ActivityLevel, UtilizationStatus, TrendDirection, SensorType
from .occupancy_rules import OccupancyRulesEngine
from .occupancy_prediction import OccupancyPredictionEngine
from .occupancy_confidence import OccupancyConfidenceEngine
from .occupancy_explainer import OccupancyExplainabilityEngine

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
        
        confidence = OccupancyConfidenceEngine.calculate(state, current_occupancy, anomalies)
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
            recommendations=recommendations
        )

    def _calculate_base_occupancy(self, state: SharedState) -> int:
        acs_sensors = [s for s in state.sensors if s.sensor_type == SensorType.ACS]
        if acs_sensors:
            return int(sum(s.value for s in acs_sensors))
        return 0

    def _determine_activity(self, percentage: float, state: SharedState) -> ActivityLevel:
        motion_detected = any(s.value > 0 for s in state.sensors if s.sensor_type == SensorType.PIR and s.is_active)
        if percentage == 0 and not motion_detected:
            return ActivityLevel.EMPTY
        elif percentage <= 0.25:
            return ActivityLevel.LOW
        elif percentage <= 0.75:
            return ActivityLevel.MODERATE
        elif percentage <= 1.0:
            return ActivityLevel.HIGH
        else:
            return ActivityLevel.PEAK

    def _determine_utilization(self, percentage: float) -> UtilizationStatus:
        if percentage < 0.4:
            return UtilizationStatus.UNDERUTILIZED
        elif percentage <= 0.8:
            return UtilizationStatus.OPTIMAL
        elif percentage <= 1.0:
            return UtilizationStatus.OVERUTILIZED
        else:
            return UtilizationStatus.CRITICAL

    def _determine_trend(self, state: SharedState, current_occupancy: int) -> TrendDirection:
        if current_occupancy > (state.zone.capacity * 0.5):
            return TrendDirection.INCREASING
        elif current_occupancy == 0:
            return TrendDirection.DECREASING
        return TrendDirection.STABLE
