"""
1. Purpose: Scenario Library for testing the Occupancy Agent.
2. Responsibilities: Provide reusable telemetry snapshots (Ghost Booking, Morning Rush, etc.).
3. Folder location: ai/agents/occupancy/
"""
from datetime import datetime, timezone, timedelta
from .occupancy_schema import SharedState, ZoneTopology, SensorData, CalendarEvent
from .occupancy_constants import SensorType

now = datetime.now(timezone.utc)
default_zone = ZoneTopology(zone_id="z_01", name="Main Office", capacity=100, sq_ft=5000.0)

SCENARIOS = {
    "EMPTY_OFFICE": SharedState(
        zone=default_zone,
        sensors=[
            SensorData(sensor_id="s1", sensor_type=SensorType.PIR, value=0, timestamp=now),
            SensorData(sensor_id="s2", sensor_type=SensorType.CO2, value=400, timestamp=now)
        ],
        calendar=[]
    ),
    "MORNING_RUSH": SharedState(
        zone=default_zone,
        sensors=[
            SensorData(sensor_id="s1", sensor_type=SensorType.ACS, value=45, timestamp=now),
            SensorData(sensor_id="s2", sensor_type=SensorType.PIR, value=1, timestamp=now)
        ],
        calendar=[]
    ),
    "GHOST_BOOKING": SharedState(
        zone=ZoneTopology(zone_id="conf_1", name="Boardroom", capacity=10, sq_ft=300.0),
        sensors=[
            SensorData(sensor_id="s1", sensor_type=SensorType.PIR, value=0, timestamp=now),
            SensorData(sensor_id="s2", sensor_type=SensorType.CO2, value=410, timestamp=now)
        ],
        calendar=[
            CalendarEvent(
                event_id="evt_1", 
                expected_attendees=10, 
                start_time=now - timedelta(minutes=20), 
                end_time=now + timedelta(minutes=40)
            )
        ]
    )
}
