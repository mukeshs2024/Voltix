import pytest
from ai.agents.safety.safety_agent import SafetyAgent

@pytest.fixture
def valid_safety_payload():
    return {
        "occupancy": 50,
        "building_capacity": 100,
        "zone_temperature": 22.0,
        "smoke_sensor": False,
        "fire_alarm": False,
        "co2_level": 400.0,
        "emergency_state": False,
        "hvac_status": "ON",
        "equipment_health": "GOOD",
        "grid_status": "NORMAL",
        "current_building_recommendations": ["Increase cooling", "Turn on lights"]
    }

def test_safety_agent_process_safe(valid_safety_payload):
    agent = SafetyAgent()
    output = agent.process(valid_safety_payload)
    
    assert output is not None
    assert output["safety_status"] == "SAFE"
    assert output["emergency_flag"] is False
    assert "Increase cooling" in output["allowed_actions"]

def test_safety_agent_fire_alarm(valid_safety_payload):
    valid_safety_payload["fire_alarm"] = True
    
    agent = SafetyAgent()
    output = agent.process(valid_safety_payload)
    
    assert output["safety_status"] == "CRITICAL"
    assert output["emergency_flag"] is True
    assert "Increase cooling" in output["blocked_actions"]

def test_safety_agent_co2_warning(valid_safety_payload):
    valid_safety_payload["co2_level"] = 1500.0
    
    agent = SafetyAgent()
    output = agent.process(valid_safety_payload)
    
    assert output["safety_metrics"]["safety_status"] == "WARNING"
    assert output["safety_metrics"]["emergency_flag"] is False

def test_safety_agent_emergency_exit_blocked(valid_safety_payload):
    valid_safety_payload["emergency_exit_blocked"] = True
    
    agent = SafetyAgent()
    output = agent.process(valid_safety_payload)
    
    assert output["safety_metrics"]["safety_status"] == "CRITICAL"
    assert output["safety_metrics"]["emergency_flag"] is True

def test_invalid_schema_fallback():
    agent = SafetyAgent()
    invalid_payload = {"missing_fields": True}
    output = agent.process(invalid_payload)
    
    # Should catch schema error and return fallback
    assert "errors" in output
    assert output["safety_metrics"]["safety_status"] == "CRITICAL"
    assert output["safety_metrics"]["emergency_flag"] is True

class MockLLMClient:
    def invoke(self, kwargs):
        # mock groq response for safety_intelligence
        return '{"reasoning": "LLM validated safety.", "allowed_actions": ["Increase cooling", "Turn on lights"], "blocked_actions": ["Start heater"]}'

def test_safety_agent_with_llm(valid_safety_payload):
    mock_llm = MockLLMClient()
    agent = SafetyAgent(llm_client=mock_llm)
    output = agent.process(valid_safety_payload)
    
    assert output is not None
    assert output["safety_metrics"]["reasoning"] == "LLM validated safety."
    assert "Increase cooling" in output["safety_metrics"]["allowed_actions"]
    assert "Start heater" in output["safety_metrics"]["blocked_actions"]
