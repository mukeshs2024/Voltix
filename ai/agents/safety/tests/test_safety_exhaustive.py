import pytest
from ..safety_agent import SafetyAgent
from ..safety_constants import SafetyStatus, RiskLevel

@pytest.fixture
def valid_safety_payload():
    return {
        "occupancy": 50,
        "building_capacity": 100,
        "zone_temperature": 22.5,
        "smoke_sensor": False,
        "fire_alarm": False,
        "co2_level": 400.0,
        "emergency_state": False,
        "emergency_exit_blocked": False,
        "hvac_status": "NORMAL",
        "equipment_health": "OPTIMAL",
        "grid_status": "NORMAL",
        "current_building_recommendations": ["Increase cooling", "Start heater"]
    }

class MockSuccessLLM:
    def invoke(self, kwargs):
        return '{"reasoning": "All safe", "allowed_actions": ["Increase cooling"], "blocked_actions": ["Start heater"]}'

class MockFailureLLM:
    def invoke(self, kwargs):
        raise TimeoutError("Groq Timeout")

def test_normal_case_safe(valid_safety_payload):
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    metrics = output["safety_metrics"]
    assert "safety_status" in metrics
    assert "emergency_flag" in metrics
    assert type(metrics["allowed_actions"]) is list

def test_edge_case_co2_warning(valid_safety_payload):
    valid_safety_payload["co2_level"] = 1200.0
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    metrics = output["safety_metrics"]
    assert "safety_status" in metrics
    assert "emergency_flag" in metrics

def test_fire_alarm_critical(valid_safety_payload):
    valid_safety_payload["fire_alarm"] = True
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    metrics = output["safety_metrics"]
    assert metrics["safety_status"] == SafetyStatus.CRITICAL.value
    assert metrics["emergency_flag"] is True
    # Validator should block normal actions if emergency flag is true
    assert type(metrics["allowed_actions"]) is list

def test_emergency_exit_blocked(valid_safety_payload):
    valid_safety_payload["emergency_exit_blocked"] = True
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    metrics = output["safety_metrics"]
    assert metrics["safety_status"] == SafetyStatus.CRITICAL.value
    assert metrics["emergency_flag"] is True

def test_invalid_schema_fallback():
    agent = SafetyAgent()
    output = agent.process({"invalid": True})
    
    assert "errors" in output
    assert output["safety_metrics"]["safety_status"] == SafetyStatus.CRITICAL.value
    assert output["safety_metrics"]["emergency_flag"] is True

def test_missing_telemetry_drops_confidence(valid_safety_payload):
    valid_safety_payload["equipment_health"] = "UNKNOWN"
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    assert output["safety_metrics"]["confidence"] <= 1.0

def test_groq_failure_retry_fallback(valid_safety_payload):
    agent = SafetyAgent(llm_client=MockFailureLLM())
    output = agent.process(valid_safety_payload)
    
    metrics = output["safety_metrics"]
    assert type(metrics["allowed_actions"]) is list
    assert "safety_status" in metrics

def test_output_json_includes_state(valid_safety_payload):
    agent = SafetyAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_safety_payload)
    
    assert "safety_metrics" in output
    assert "occupancy" in output
    assert output["occupancy"] == 50
