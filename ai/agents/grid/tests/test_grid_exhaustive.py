import pytest
from datetime import datetime, timezone

from ..grid_agent import GridAgent
from ..grid_schema import GridInputState
from ..grid_constants import GridStatus, PricingTier, BatteryStrategy

@pytest.fixture
def valid_grid_payload():
    return {
        "current_building_load_kw": 250.0,
        "current_grid_price": 0.05,
        "demand_response_event": False,
        "weather_forecast": "sunny",
        "outdoor_temperature": 25.0,
        "solar_generation_kw": 50.0,
        "battery_soc": 80.0,
        "grid_carbon_intensity": 120.0,
        "historical_price_trend": "stable",
        "historical_load_trend": "stable",
        "current_time": datetime.now(timezone.utc).isoformat(),
        "peak_pricing_schedule": "OFF_PEAK"
    }

class MockSuccessLLM:
    def invoke(self, kwargs):
        return '{"reasoning": "LLM reasoning.", "recommendations": ["Do X"], "recommended_loads": ["L1"], "delayable_loads": ["L2"], "critical_loads": ["L3"], "next_hour_price": 0.04, "next_hour_carbon": 90.0}'

class MockFailureLLM:
    def invoke(self, kwargs):
        raise TimeoutError("Groq API Timeout")

class MockBadJsonLLM:
    def invoke(self, kwargs):
        return "This is not JSON at all."

def test_normal_case_cheap_price(valid_grid_payload):
    agent = GridAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_grid_payload)
    metrics = output["grid_metrics"]
    
    assert "grid_status" in metrics
    assert "pricing_tier" in metrics
    assert "battery_strategy" in metrics

def test_edge_case_peak_price(valid_grid_payload):
    valid_grid_payload["current_grid_price"] = 0.50
    valid_grid_payload["peak_pricing_schedule"] = "ON_PEAK"
    agent = GridAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_grid_payload)
    metrics = output["grid_metrics"]
    
    assert "grid_status" in metrics
    assert "pricing_tier" in metrics
    assert "battery_strategy" in metrics

def test_invalid_inputs_schema_failure():
    agent = GridAgent(llm_client=MockSuccessLLM())
    output = agent.process({"invalid": "data"})
    
    assert "errors" in output
    assert output["grid_metrics"]["grid_status"] == GridStatus.CRITICAL.value
    assert len(output["errors"]) > 0

def test_missing_telemetry_drops_confidence(valid_grid_payload):
    valid_grid_payload.pop("historical_load_trend") 
    agent = GridAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_grid_payload)
    
    metrics = output["grid_metrics"]
    assert metrics["grid_status"] == GridStatus.CRITICAL.value

def test_groq_failure_triggers_fallback(valid_grid_payload):
    agent = GridAgent(llm_client=MockFailureLLM())
    output = agent.process(valid_grid_payload)
    
    metrics = output["grid_metrics"]
    assert "pricing_tier" in metrics

def test_groq_bad_json_handling(valid_grid_payload):
    agent = GridAgent(llm_client=MockBadJsonLLM())
    output = agent.process(valid_grid_payload)
    metrics = output["grid_metrics"]
    
    assert type(metrics["recommended_loads"]) is list

def test_output_json_structure(valid_grid_payload):
    agent = GridAgent(llm_client=MockSuccessLLM())
    output = agent.process(valid_grid_payload)
    
    assert "grid_metrics" in output
    assert "current_grid_price" in output
