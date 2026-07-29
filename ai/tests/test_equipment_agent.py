"""
Comprehensive pytest module for Equipment Health Agent.
Tests success, invalid input validation, anomaly detection, RUL physics, fallback rules, and metrics.
"""

import pytest
import asyncio
from typing import Dict, Any

from agents.equipment.equipment_agent import EquipmentAgent
from agents.equipment.schemas import EquipmentInput, EquipmentRecommendation, EquipmentAgentResponse
from agents.equipment.tools import run_deterministic_fallback, detect_vibration_anomaly, calculate_rul_physics


@pytest.fixture
def critical_equipment_payload() -> Dict[str, Any]:
    return {
        "equipment_id": "HVAC-Chiller-AHU-04",
        "equipment_type": "HVAC",
        "runtime_hours": 14500.0,
        "motor_current": 48.2,
        "temperature": 92.5,
        "vibration": 7.8,
        "wear_level": 0.85,
        "error_codes": ["E-402 High Temp Alarm", "E-108 Vibration Spike"],
        "maintenance_history": ["Bearing lubed 2025-02-10"]
    }


def test_equipment_input_validation(critical_equipment_payload):
    """Test Pydantic v2 input model parsing and validation."""
    model = EquipmentInput.model_validate(critical_equipment_payload)
    assert model.equipment_id == "HVAC-Chiller-AHU-04"
    assert model.vibration == 7.8
    assert model.wear_level == 0.85


def test_equipment_input_invalid_types():
    """Test invalid input payload handling."""
    with pytest.raises(ValueError):
        EquipmentInput.model_validate({"wear_level": "INVALID_FLOAT"})


def test_equipment_vibration_anomaly():
    """Test vibration anomaly severity classifier."""
    assert detect_vibration_anomaly(8.0) == "CRITICAL_VIBRATION_SEVERITY"
    assert detect_vibration_anomaly(5.0) == "HIGH_VIBRATION_WARNING"
    assert detect_vibration_anomaly(1.2) == "NORMAL_VIBRATION"


def test_equipment_rul_physics():
    """Test degradation physics RUL calculation."""
    rul_normal = calculate_rul_physics(5000.0, 0.2, 60.0, 1.5)
    rul_severe = calculate_rul_physics(14500.0, 0.85, 92.5, 7.8)

    assert rul_normal > rul_severe
    assert rul_severe >= 0.0


def test_equipment_deterministic_fallback(critical_equipment_payload):
    """Test deterministic rule engine fallback evaluation."""
    input_model = EquipmentInput.model_validate(critical_equipment_payload)
    rec = run_deterministic_fallback(input_model)

    assert isinstance(rec, EquipmentRecommendation)
    assert rec.urgency == "critical"
    assert rec.failure_probability >= 0.7
    assert "IMMEDIATE SHUTDOWN" in rec.maintenance_recommendation
    assert 0.0 <= rec.confidence <= 1.0


@pytest.mark.asyncio
async def test_equipment_agent_process_async_success(critical_equipment_payload):
    """Test asynchronous pipeline execution of EquipmentAgent."""
    agent = EquipmentAgent()
    response = await agent.process_async(critical_equipment_payload)

    assert isinstance(response, EquipmentAgentResponse)
    assert response.agent == "EquipmentAgent"
    assert response.status in ("success", "fallback")
    assert response.recommendation.health_score >= 0.0
    assert response.metrics["total_invocations"] >= 1
    assert response.metrics["success_rate_pct"] == 100.0


def test_equipment_agent_process_sync(critical_equipment_payload):
    """Test backward-compatible synchronous process method."""
    agent = EquipmentAgent()
    state = agent.process(critical_equipment_payload.copy())

    assert "equipment_metrics" in state
    assert "equipment_agent_response" in state
    assert state["status"] in ("success", "fallback")
    assert state["equipment_metrics"]["confidence"] > 0.0


@pytest.mark.asyncio
async def test_equipment_agent_metrics_tracking(critical_equipment_payload):
    """Test observability metrics counter tracking."""
    agent = EquipmentAgent()
    await agent.process_async(critical_equipment_payload)
    await agent.process_async(critical_equipment_payload)

    metrics = agent.metrics_collector.to_dict()
    assert metrics["total_invocations"] == 2
    assert metrics["successful_invocations"] == 2
    assert metrics["failed_invocations"] == 0
