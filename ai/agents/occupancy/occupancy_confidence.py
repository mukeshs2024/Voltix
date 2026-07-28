"""
1. Purpose: Confidence Engine for the Occupancy Agent.
2. Responsibilities: Calculate a 0.0-1.0 confidence score based on sensor agreement and telemetry freshness.
3. Folder location: ai/agents/occupancy/
"""

from datetime import datetime, timezone
from typing import List
from .occupancy_schema import SharedState, OccupancyAnomaly
from .occupancy_constants import SensorType
from .config import OccupancyConfig


class OccupancyConfidenceEngine:
    @staticmethod
    def calculate(
        state: SharedState, current_occupancy: int, anomalies: List[OccupancyAnomaly]
    ) -> float:
        """
        Computes confidence score based on Sensor agreement, missing values,
        telemetry freshness, and existing anomalies.
        """
        if not state.sensors:
            return OccupancyConfig.CONFIDENCE_NO_SENSOR

        confidence = OccupancyConfig.CONFIDENCE_BASE
        now = datetime.now(timezone.utc)

        sensor_types = {s.sensor_type for s in state.sensors if s.is_active}

        # 1. Sensor quality
        if SensorType.TOF in sensor_types or SensorType.ACS in sensor_types:
            confidence += OccupancyConfig.CONFIDENCE_HARD_SENSOR_BONUS
        else:
            if SensorType.CO2 in sensor_types:
                confidence += OccupancyConfig.CONFIDENCE_CO2_BONUS
            if SensorType.PIR in sensor_types:
                confidence += OccupancyConfig.CONFIDENCE_PIR_BONUS

        fresh_sensors = []
        for s in state.sensors:
            sensor_time = (
                s.timestamp.replace(tzinfo=timezone.utc)
                if s.timestamp.tzinfo is None
                else s.timestamp
            )
            if (now - sensor_time).total_seconds() < OccupancyConfig.SENSOR_FRESHNESS_WINDOW_SECS:
                fresh_sensors.append(s)

        if not fresh_sensors:
            confidence -= OccupancyConfig.CONFIDENCE_STALE_PENALTY

        # 3. Penalize for anomalies (disagreement drops confidence)
        if any(
            a.type == "SENSOR_DISAGREEMENT" or a.type == "UNACCOUNTED_MOTION"
            for a in anomalies
        ):
            confidence -= OccupancyConfig.CONFIDENCE_DISAGREEMENT_PENALTY

        # Bound the confidence between 0.0 and 1.0
        return max(0.0, min(round(confidence, 2), 1.0))
