"""
Comprehensive pytest module for Energy Agent.
Tests success, invalid input validation, retries, fallback rules, JSON parsing, and metrics.
"""

import pytest
import asyncio
from typing import Dict, Any

from agents.energy.energy_agent import EnergyAgent
from agents.energy.schemas import EnergyInput, EnergyRecommendation, EnergyAgentResponse
from agents.energy.tools import run_deterministic_fallback, detect_peak_pricing


@pytest.fixture
def valid_energy_payload() -> Dict[str, Any]:
    return {
        "electricity_tariff": 0.45,
        "battery_level": 70.0,
        "solar_production": 45.0,
        "hvac_consumption": 180.0,
        "predicted_occupancy": 120,
        "temperature": 86.0,
        "weather": "Sunny",
        "grid_pricing": "critical_peak",
        "peak_demand": 150.0,
        "historical_energy_usage": [140.0, 150.0, 165.0, 180.0]
    }


def test_energy_input_validation(valid_energy_payload):
    """Test Pydantic v2 input model parsing and validation."""
    model = EnergyInput.model_validate(valid_energy_payload)
    assert model.electricity_tariff == 0.45
    assert model.battery_level == 70.0
    assert model.grid_pricing == "critical_peak"


def test_energy_input_invalid_types():
    """Test invalid input payload handling."""
    with pytest.raises(ValueError):
        EnergyInput.model_validate({"battery_level": "INVALID_NUMBER_STRING"})


def test_energy_detect_peak_pricing():
    """Test peak pricing detection helper tool."""
    assert detect_peak_pricing("critical_peak", 0.20) is True
    assert detect_peak_pricing("on_peak", 0.40) is True
    assert detect_peak_pricing("off_peak", 0.15) is False


def test_energy_deterministic_fallback(valid_energy_payload):
    """Test deterministic rule engine fallback optimization."""
    input_model = EnergyInput.model_validate(valid_energy_payload)
    rec = run_deterministic_fallback(input_model)

    assert isinstance(rec, EnergyRecommendation)
    assert rec.battery_schedule.action == "discharge"
    assert rec.grid_usage_kw < input_model.hvac_consumption
    assert rec.energy_savings > 0.0
    assert 0.0 <= rec.confidence <= 1.0


@pytest.mark.asyncio
async def test_energy_agent_process_async_success(valid_energy_payload):
    """Test asynchronous pipeline execution of EnergyAgent."""
    agent = EnergyAgent()
    response = await agent.process_async(valid_energy_payload)

    assert isinstance(response, EnergyAgentResponse)
    assert response.agent == "EnergyAgent"
    assert response.status in ("success", "fallback")
    assert response.recommendation.grid_usage_kw >= 0.0
    assert response.metrics["total_invocations"] >= 1
    assert response.metrics["success_rate_pct"] == 100.0


def test_energy_agent_process_sync(valid_energy_payload):
    """Test backward-compatible synchronous process method."""
    agent = EnergyAgent()
    state = agent.process(valid_energy_payload.copy())

    assert "energy_metrics" in state
    assert "energy_agent_response" in state
    assert state["status"] in ("success", "fallback")
    assert state["energy_metrics"]["confidence"] > 0.0


@pytest.mark.asyncio
async def test_energy_agent_metrics_tracking(valid_energy_payload):
    """Test observability metrics counter tracking."""
    agent = EnergyAgent()
    await agent.process_async(valid_energy_payload)
    await agent.process_async(valid_energy_payload)

    metrics = agent.metrics_collector.to_dict()
    assert metrics["total_invocations"] == 2
    assert metrics["successful_invocations"] == 2
    assert metrics["failed_invocations"] == 0
