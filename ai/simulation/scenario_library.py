"""
1. Objective: Provide realistic building scenarios for automated testing.
2. Folder location: ai/simulation/
3. Responsibilities: Hold definitions for building scenarios mapping input telemetry to expected decisions.
"""
from typing import Dict, Any
from datetime import datetime, timezone

def generate_base_state() -> Dict[str, Any]:
    return {
        "zone": {"zone_id": "HQ_Floor1", "name": "Main Floor", "capacity": 100, "sq_ft": 5000.0},
        "sensors": [],
        "calendar": [],
        "proposed_actions": []
    }

def build_scenario(name: str, occupancy: int, co2: int, has_alarm: bool = False) -> Dict[str, Any]:
    state = generate_base_state()
    now = datetime.now(timezone.utc).isoformat()
    state["sensors"] = [
        {"sensor_id": "pir1", "sensor_type": "PIR", "value": 1 if occupancy > 0 else 0, "timestamp": now, "is_active": True},
        {"sensor_id": "acs1", "sensor_type": "ACS", "value": occupancy, "timestamp": now, "is_active": True},
        {"sensor_id": "co21", "sensor_type": "CO2", "value": co2, "timestamp": now, "is_active": True},
    ]
    if has_alarm:
        state["sensors"].append(
            {"sensor_id": "alm1", "sensor_type": "ALARM", "value": 1, "timestamp": now, "is_active": True}
        )
    return state

SCENARIO_LIBRARY = {
    "EMPTY_BUILDING": build_scenario("Empty", occupancy=0, co2=400),
    "MORNING_RUSH": build_scenario("Morning Rush", occupancy=85, co2=650),
    "CONFERENCE": build_scenario("Conference", occupancy=95, co2=900),
    "FIRE_DRILL": build_scenario("Fire Drill", occupancy=50, co2=500, has_alarm=True),
    "NIGHT_SHIFT": build_scenario("Night Shift", occupancy=5, co2=420)
}
