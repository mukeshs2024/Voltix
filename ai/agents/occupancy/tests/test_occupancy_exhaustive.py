import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from ..occupancy_agent import OccupancyAgent
from ..occupancy_constants import ActivityLevel, UtilizationStatus, TrendDirection

@pytest.fixture
def valid_occupancy_payload():
    return {
        "zone": {
            "zone_id": "Z-100",
            "name": "Main Lobby",
            "capacity": 200,
            "sq_ft": 5000.0
        },
        "sensors": [
            {"sensor_id": "S1", "sensor_type": "TOF", "value": 45.0, "timestamp": datetime.now(timezone.utc).isoformat(), "is_active": True},
            {"sensor_id": "S2", "sensor_type": "PIR", "value": 1.0, "timestamp": datetime.now(timezone.utc).isoformat(), "is_active": True},
            {"sensor_id": "S3", "sensor_type": "WIFI", "value": 40.0, "timestamp": datetime.now(timezone.utc).isoformat(), "is_active": True}
        ],
        "calendar": [
            {"event_id": "E1", "expected_attendees": 50, "start_time": datetime.now(timezone.utc).isoformat(), "end_time": datetime.now(timezone.utc).isoformat()}
        ]
    }

class MockSuccessLLM:
    def invoke(self, kwargs):
        return '{"prediction": {"15_min": 50, "30_min": 45, "60_min": 20}, "anomalies": [], "reasoning": "Standard LLM deduction", "recommendations": []}'

class MockFailureLLM:
    def invoke(self, kwargs):
        raise TimeoutError("LLM Down")

def test_normal_case_valid_sensors(valid_occupancy_payload):
    agent = OccupancyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_occupancy_payload)
    
    metrics = output["occupancy_metrics"]
    assert metrics["current_occupancy"] == 45
    assert metrics["activity_level"] == ActivityLevel.HIGH.value
    assert metrics["utilization"] == UtilizationStatus.OPTIMAL.value
    assert metrics["confidence"] > 0.8
    assert metrics["prediction"]["15_min"] == 50

def test_edge_case_over_capacity(valid_occupancy_payload):
    valid_occupancy_payload["sensors"][0]["value"] = 250.0  # TOF reads 250
    agent = OccupancyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_occupancy_payload)
    
    metrics = output["occupancy_metrics"]
    assert metrics["current_occupancy"] == 250
    assert metrics["utilization"] == UtilizationStatus.OVER_CAPACITY.value

def test_invalid_inputs_schema_failure():
    agent = OccupancyAgent(llm_client=MockSuccessLLM())
    output = agent.process({"invalid": "schema"})
    
    assert "errors" in output
    assert "Fallback engaged" in str(output["errors"])
    assert output["occupancy_metrics"]["current_occupancy"] == 0

def test_missing_telemetry_drops_confidence(valid_occupancy_payload):
    # Remove TOF sensor, forcing fallback to WIFI
    valid_occupancy_payload["sensors"] = [s for s in valid_occupancy_payload["sensors"] if s["sensor_type"] != "TOF"]
    agent = OccupancyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_occupancy_payload)
    
    metrics = output["occupancy_metrics"]
    assert metrics["confidence"] < 0.9

def test_groq_failure_retry_fallback(valid_occupancy_payload):
    agent = OccupancyAgent(llm_client=MockFailureLLM())
    output = agent.process(valid_occupancy_payload)
    
    metrics = output["occupancy_metrics"]
    # Deterministic rules should still populate current occupancy
    assert metrics["current_occupancy"] == 45
    assert "predictions" not in metrics or metrics["prediction"]["15_min"] == 45 # Deterministic fallback

def test_output_json_structure(valid_occupancy_payload):
    agent = OccupancyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_occupancy_payload)
    
    # Must preserve the entire input state
    assert "zone" in output
    assert "sensors" in output
    assert "occupancy_metrics" in output
    assert output["occupancy_metrics"]["reasoning"] == "Standard LLM deduction"
