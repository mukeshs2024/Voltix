"""
1. Objective: Provide predefined building scenarios mapped to ground truth expectations.
2. Folder location: ai/evaluation/
3. Responsibilities: Hold datasets mapping simulated AI state inputs to expected outputs.
"""
from typing import Dict, Any, List
from datetime import datetime, timezone

def generate_base_state() -> Dict[str, Any]:
    return {
        "zone": {"zone_id": "HQ_Floor1", "name": "Main Floor", "capacity": 100, "sq_ft": 5000.0},
        "sensors": [],
        "calendar": [],
        "proposed_actions": []
    }

def build_scenario(name: str, occupancy: int, co2: int, has_alarm: bool = False, motion: bool = True) -> Dict[str, Any]:
    state = generate_base_state()
    now = datetime.now(timezone.utc).isoformat()
    state["sensors"] = [
        {"sensor_id": "pir1", "sensor_type": "PIR", "value": 1 if motion else 0, "timestamp": now, "is_active": True},
        {"sensor_id": "acs1", "sensor_type": "ACS", "value": occupancy, "timestamp": now, "is_active": True},
        {"sensor_id": "co21", "sensor_type": "CO2", "value": co2, "timestamp": now, "is_active": True},
    ]
    if has_alarm:
        state["sensors"].append(
            {"sensor_id": "alm1", "sensor_type": "ALARM", "value": 1, "timestamp": now, "is_active": True}
        )
    return state

EVALUATION_DATASET = [
    {
        "scenario_name": "Standard Empty",
        "input_state": build_scenario("Empty", occupancy=0, co2=400, motion=False),
        "ground_truth": {
            "expected_activity": "EMPTY",
            "expect_anomaly": False,
            "min_confidence": 0.9,
            "max_confidence": 1.0,
            "winning_agent": "Occupancy",
            "decision_includes": "baseline"
        }
    },
    {
        "scenario_name": "Morning Rush",
        "input_state": build_scenario("Morning Rush", occupancy=85, co2=650, motion=True),
        "ground_truth": {
            "expected_activity": "HIGH",
            "expect_anomaly": False,
            "min_confidence": 0.8,
            "max_confidence": 1.0,
            "winning_agent": "Occupancy",
            "decision_includes": "monitor"
        }
    },
    {
        "scenario_name": "Ghost Booking (Mismatch)",
        "input_state": build_scenario("Ghost Booking", occupancy=0, co2=900, motion=True),
        "ground_truth": {
            "expected_activity": "UNKNOWN", 
            "expect_anomaly": True,
            "min_confidence": 0.0,
            "max_confidence": 0.8, # Should have lower confidence due to conflicting sensors
            "winning_agent": "Occupancy",
            "decision_includes": "conflict"
        }
    },
    {
        "scenario_name": "Fire Drill",
        "input_state": build_scenario("Fire Drill", occupancy=50, co2=500, has_alarm=True, motion=True),
        "ground_truth": {
            "expected_activity": "MODERATE",
            "expect_anomaly": False,
            "min_confidence": 0.9,
            "max_confidence": 1.0,
            "winning_agent": "Safety",
            "decision_includes": "Emergency"
        }
    }
]
