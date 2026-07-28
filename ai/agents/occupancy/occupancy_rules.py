"""
1. Purpose: Business Rule Engine for the Occupancy Agent.
2. Responsibilities: Deterministically generate anomalies and recommendations based on sensor states and business logic.
3. Folder location: ai/agents/occupancy/
"""

from typing import List
from datetime import datetime, timezone, timedelta
from .occupancy_schema import SharedState, OccupancyAnomaly
from .occupancy_constants import AnomalySeverity, SensorType
from .config import OccupancyConfig


class OccupancyRulesEngine:
    @staticmethod
    def evaluate(state: SharedState, current_occupancy: int) -> List[OccupancyAnomaly]:
        anomalies = []
        now = datetime.now(timezone.utc)
        capacity = state.zone.capacity

        motion_detected = any(
            s.value > 0
            for s in state.sensors
            if s.sensor_type == SensorType.PIR and s.is_active
        )
        co2_values = [
            s.value
            for s in state.sensors
            if s.sensor_type == SensorType.CO2 and s.is_active
        ]

        # Rule: Capacity Exceeded
        if current_occupancy > capacity:
            anomalies.append(
                OccupancyAnomaly(
                    type="OVERCAPACITY",
                    severity=AnomalySeverity.CRITICAL,
                    description=f"Current occupancy ({current_occupancy}) exceeds zone capacity ({capacity}).",
                    recommendation="Dispatch security or safety agent to reduce room density immediately.",
                )
            )

        # Rule: Motion detected with zero occupancy
        if current_occupancy == 0 and motion_detected:
            anomalies.append(
                OccupancyAnomaly(
                    type="UNACCOUNTED_MOTION",
                    severity=AnomalySeverity.MEDIUM,
                    description="Motion detected in zone, but calculated occupancy is 0.",
                    recommendation="Verify accuracy of ACS or ToF sensors; check for tailgating.",
                )
            )

        # Rule: No motion with high occupancy
        if current_occupancy > (capacity * OccupancyConfig.STATIC_CROWD_THRESHOLD) and not motion_detected:
            anomalies.append(
                OccupancyAnomaly(
                    type="STATIC_CROWD",
                    severity=AnomalySeverity.LOW,
                    description="High occupancy calculated, but no motion detected by PIR.",
                    recommendation="Monitor CO2 for verification. Ensure PIR sensors are not obstructed.",
                )
            )

        # Rule: Ghost booking
        for event in state.calendar:
            start_time = (
                event.start_time.replace(tzinfo=timezone.utc)
                if event.start_time.tzinfo is None
                else event.start_time
            )
            end_time = (
                event.end_time.replace(tzinfo=timezone.utc)
                if event.end_time.tzinfo is None
                else event.end_time
            )
            if start_time <= now <= end_time:
                if (now - start_time) > timedelta(
                    minutes=OccupancyConfig.GHOST_MEETING_TIMEOUT_MINS
                ) and current_occupancy == 0:
                    anomalies.append(
                        OccupancyAnomaly(
                            type="GHOST_BOOKING",
                            severity=AnomalySeverity.MEDIUM,
                            description=f"Event {event.event_id} has been active for >{OccupancyConfig.GHOST_MEETING_TIMEOUT_MINS} mins but room is empty.",
                            recommendation="Release the room reservation in the calendar system and turn down HVAC.",
                        )
                    )
                break

        # Rule: Sensor disagreement (High CO2 but low occupancy)
        if (
            current_occupancy <= (capacity * OccupancyConfig.SENSOR_DISAGREEMENT_OCCUPANCY_RATIO)
            and co2_values
            and max(co2_values) > OccupancyConfig.CO2_HIGH_PPM
        ):
            anomalies.append(
                OccupancyAnomaly(
                    type="SENSOR_DISAGREEMENT",
                    severity=AnomalySeverity.MEDIUM,
                    description=f"High CO2 detected (>{OccupancyConfig.CO2_HIGH_PPM}ppm) despite low calculated occupancy.",
                    recommendation="Purge air via HVAC. Inspect CO2 sensor for calibration drift.",
                )
            )

        return anomalies
