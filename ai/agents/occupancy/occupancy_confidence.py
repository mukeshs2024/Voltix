"""
1. Purpose: Confidence Engine for the Occupancy Agent.
2. Responsibilities: Calculate a 0.0-1.0 confidence score based on sensor agreement and telemetry freshness.
3. Folder location: ai/agents/occupancy/
"""
from datetime import datetime, timezone
from typing import List
from .occupancy_schema import SharedState, OccupancyAnomaly
from .occupancy_constants import SensorType

class OccupancyConfidenceEngine:
    @staticmethod
    def calculate(state: SharedState, current_occupancy: int, anomalies: List[OccupancyAnomaly]) -> float:
        """
        Computes confidence score based on Sensor agreement, missing values,
        telemetry freshness, and existing anomalies.
        """
        if not state.sensors:
            return 0.1

        confidence = 0.5
        now = datetime.now(timezone.utc)
        
        sensor_types = {s.sensor_type for s in state.sensors if s.is_active}
        
        # 1. Sensor quality
        if SensorType.TOF in sensor_types or SensorType.ACS in sensor_types:
            confidence += 0.3
        elif SensorType.PIR in sensor_types and SensorType.CO2 in sensor_types:
            confidence += 0.2
            
        # 2. Telemetry freshness (decay if data is older than 5 minutes)
        fresh_sensors = [s for s in state.sensors if (now - s.timestamp).total_seconds() < 300]
        if not fresh_sensors:
            confidence -= 0.3
            
        # 3. Penalize for anomalies (disagreement drops confidence)
        if any(a.type == "SENSOR_DISAGREEMENT" or a.type == "UNACCOUNTED_MOTION" for a in anomalies):
            confidence -= 0.2
            
        # Bound the confidence between 0.0 and 1.0
        return max(0.0, min(round(confidence, 2), 1.0))
