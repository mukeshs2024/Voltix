import pytest
from datetime import datetime, timezone
from ai.agents.grid.grid_agent import GridAgent
from ai.agents.grid.grid_schema import GridInputState

@pytest.fixture
def valid_grid_payload():
    return {
        "current_building_load_kw": 150.0,
        "current_grid_price": 0.03,
        "demand_response_event": False,
        "weather_forecast": "SUNNY",
        "outdoor_temperature": 25.0,
        "solar_generation_kw": 200.0,
        "battery_soc": 50.0,
        "grid_carbon_intensity": 100.0,
        "historical_price_trend": "STABLE",
        "historical_load_trend": "STABLE",
        "current_time": datetime.now(timezone.utc).isoformat(),
        "peak_pricing_schedule": "14:00-18:00"
    }

def test_grid_agent_process(valid_grid_payload):
    agent = GridAgent()
    output = agent.process(valid_grid_payload)
    
    assert output is not None
    assert output["pricing_tier"] == "OFF_PEAK"
    assert output["battery_strategy"] == "CHARGE"
    assert output["grid_status"] == "NORMAL"
    assert "predictions" in output

def test_grid_agent_demand_response(valid_grid_payload):
    valid_grid_payload["demand_response_event"] = True
    valid_grid_payload["current_grid_price"] = 0.20
    
    agent = GridAgent()
    output = agent.process(valid_grid_payload)
    
    assert output["grid_status"] == "CRITICAL"
    assert output["battery_strategy"] == "DISCHARGE"

def test_invalid_schema_fallback():
    agent = GridAgent()
    invalid_payload = {"missing_fields": True}
    output = agent.process(invalid_payload)
    
    # Should catch schema error and return fallback
    assert "errors" in output
    assert output["grid_metrics"]["grid_status"] == "CRITICAL" # Updated per grid_fallback.py

class MockLLMClient:
    def invoke(self, kwargs):
        # mock groq response for grid_intelligence and grid_prediction
        system = kwargs.get("system", "")
        if "expert grid forecaster" in system:
            return '{"next_hour_price": 0.04, "next_hour_carbon": 90.0}'
        else:
            return '{"reasoning": "LLM reasoning here.", "recommendations": ["LLM rec"], "recommended_loads": ["HVAC Zone 1"], "delayable_loads": ["EV Charger"], "critical_loads": ["Server Room"]}'

def test_grid_agent_with_llm(valid_grid_payload):
    mock_llm = MockLLMClient()
    agent = GridAgent(llm_client=mock_llm)
    output = agent.process(valid_grid_payload)
    
    assert output is not None
    assert output["grid_metrics"]["predictions"]["next_hour_price"] == 0.04
    assert output["grid_metrics"]["reasoning"] == "LLM reasoning here."
    assert "LLM rec" in output["grid_metrics"]["recommendations"]
    assert "HVAC Zone 1" in output["grid_metrics"]["recommended_loads"]
    assert "EV Charger" in output["grid_metrics"]["delayable_loads"]
    assert "Server Room" in output["grid_metrics"]["critical_loads"]

