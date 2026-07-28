"""
Phase 6: Occupancy Intelligence Engine.
Contains pure domain logic, heuristic calculations, and anomaly detection algorithms
that augment the LLM's reasoning or run prior to LLM invocation.
"""

from typing import List, Dict, Tuple
from datetime import datetime, timedelta, timezone
from .occupancy_schema import (
    SensorData, SensorType, ZoneTopology, CalendarEvent, 
    OccupancyClassification, OccupancyAnomaly, AnomalySeverity
)

class IntelligenceEngine:
    @staticmethod
    def calculate_utilization(estimated_count: int, capacity: int) -> float:
        """Calculates utilization percentage safely."""
        if capacity <= 0:
            return 0.0
        return min(round(estimated_count / capacity, 2), 2.0) # Cap at 200% for sanity

    @staticmethod
    def determine_classification(utilization: float) -> OccupancyClassification:
        """Maps utilization percentage to a strict categorical classification."""
        if utilization == 0:
            return OccupancyClassification.EMPTY
        elif 0.0 < utilization <= 0.25:
            return OccupancyClassification.LOW
        elif 0.25 < utilization <= 0.75:
            return OccupancyClassification.MEDIUM
        elif 0.75 < utilization <= 1.0:
            return OccupancyClassification.HIGH
        else:
            return OccupancyClassification.OVERCROWDED

    @staticmethod
    def detect_anomalies(
        estimated_count: int, 
        zone: ZoneTopology, 
        sensors: List[SensorData], 
        calendar: List[CalendarEvent]
    ) -> List[OccupancyAnomaly]:
        """Runs business rules to detect common facility anomalies."""
        anomalies = []
        now = datetime.now(timezone.utc)

        # 1. Overcrowding Anomaly
        if estimated_count > zone.capacity:
            anomalies.append(
                OccupancyAnomaly(
                    anomaly_type="OVERCROWDING",
                    severity=AnomalySeverity.CRITICAL,
                    description=f"Estimated count ({estimated_count}) exceeds safe capacity ({zone.capacity})."
                )
            )

        # 2. Ghost Booking Anomaly
        active_meeting = False
        for event in calendar:
            # Simple check if meeting is currently happening
            if event.start_time <= now <= event.end_time:
                active_meeting = True
                # If meeting has been active for > 15 mins but room is empty
                time_into_meeting = now - event.start_time
                if time_into_meeting > timedelta(minutes=15) and estimated_count == 0:
                    anomalies.append(
                        OccupancyAnomaly(
                            anomaly_type="GHOST_BOOKING",
                            severity=AnomalySeverity.MEDIUM,
                            description=f"Scheduled meeting '{event.event_id}' has no physical attendees after 15 minutes."
                        )
                    )
                break
        
        # 3. Sensor Drift / Lingering CO2
        co2_sensors = [s for s in sensors if s.sensor_type == SensorType.CO2]
        pir_sensors = [s for s in sensors if s.sensor_type == SensorType.PIR]
        
        if co2_sensors and pir_sensors:
            high_co2 = any(s.value > 800 for s in co2_sensors)
            no_motion = all(not s.is_active for s in pir_sensors)
            
            if high_co2 and no_motion and estimated_count == 0:
                anomalies.append(
                    OccupancyAnomaly(
                        anomaly_type="LINGERING_CO2_OR_DRIFT",
                        severity=AnomalySeverity.LOW,
                        description="CO2 levels are high but no motion detected. HVAC may need purging or sensor is drifting."
                    )
                )

        return anomalies

    @staticmethod
    def calculate_confidence(
        sensors: List[SensorData], 
        has_hard_sensors: bool = False
    ) -> float:
        """
        Calculates a baseline confidence score based on sensor availability and health.
        Hard sensors (ToF, ACS) yield higher confidence than Soft sensors (PIR, CO2).
        """
        if not sensors:
            return 0.0
            
        active_sensors = [s for s in sensors if s.is_active]
        if not active_sensors:
            return 0.3 # Low confidence if all sensors are inactive/dead
            
        base_confidence = 0.5
        
        # Boost confidence based on sensor types present
        sensor_types = {s.sensor_type for s in active_sensors}
        
        if SensorType.TOF in sensor_types or SensorType.ACS in sensor_types:
            has_hard_sensors = True
            base_confidence += 0.3  # Highly accurate counting sensors
            
        if SensorType.CO2 in sensor_types:
            base_confidence += 0.1
            
        if SensorType.PIR in sensor_types:
            base_confidence += 0.05
            
        return min(round(base_confidence, 2), 1.0)
