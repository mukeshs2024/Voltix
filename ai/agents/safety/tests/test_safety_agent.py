"""
1. Purpose: Unit tests for the Safety Agent.
2. Responsibilities: Test rules, validator, schema, fallback, and LLM failure paths.
"""

import pytest

from ai.agents.safety.safety_agent import SafetyAgent
from ai.agents.safety.safety_schema import SafetyState, BuildingRecommendation
from ai.agents.safety.safety_rules import SafetyRulesEngine
from ai.agents.safety.safety_validator import SafetyValidator
from ai.agents.safety.safety_confidence import SafetyConfidenceEngine
from ai.agents.safety.safety_constants import SafetyStatus, RiskLevel, ViolationType
from ai.agents.safety.fallback import SafetyFallbackEngine


def _base_state(**overrides):
    defaults = {
        "occupancy": 50,
        "building_capacity": 100,
        "zone_temperature_c": 22.0,
        "smoke_detected": False,
        "fire_alarm": False,
        "co2_level_ppm": 450.0,
        "emergency_state": False,
        "emergency_exit_blocked": False,
        "equipment_health": "HEALTHY",
        "grid_status": "NORMAL",
        "current_building_recommendations": [],
    }
    defaults.update(overrides)
    return SafetyState(**defaults)


class MockLLM:
    def __init__(self, response=None, fail=False):
        self.response = response or '{"blocked_actions": ["Reduce ventilation for energy savings"], "reasoning": "unsafe"}'
        self.fail = fail

    def generate(self, system, user):
        if self.fail:
            raise RuntimeError("Groq unavailable")
        return self.response


class MockLLMInvalidJSON(MockLLM):
    def generate(self, system, user):
        return "not json"


def test_fire_alarm_rule():
    state = _base_state(fire_alarm=True)
    violations, recs, allowed, blocked = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.FIRE_ALARM for v in violations)
    assert SafetyRulesEngine.determine_safety_status(violations) == SafetyStatus.CRITICAL
    assert SafetyRulesEngine.is_emergency(violations, state) is True
    assert len(blocked) > 0


def test_smoke_rule():
    state = _base_state(smoke_detected=True)
    violations, _, _, _ = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.SMOKE_DETECTED for v in violations)


def test_legacy_active_alarms():
    state = _base_state(active_alarms=["FIRE_ZONE_1"])
    violations, _, _, blocked = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.FIRE_ALARM for v in violations)


def test_overcrowding_rule():
    state = _base_state(occupancy=110, building_capacity=100)
    violations, recs, _, _ = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.OVERCROWDING for v in violations)


def test_co2_elevated_rule():
    state = _base_state(co2_level_ppm=1200.0)
    violations, recs, _, blocked = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.CO2_ELEVATED for v in violations)
    assert any("ventilation" in r.lower() for r in recs)


def test_emergency_exit_blocked():
    state = _base_state(emergency_exit_blocked=True)
    violations, _, _, _ = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.EMERGENCY_EXIT_BLOCKED for v in violations)
    assert SafetyRulesEngine.determine_risk_level(violations) == RiskLevel.EXTREME


def test_emergency_mode():
    state = _base_state(emergency_state=True)
    violations, _, allowed, blocked = SafetyRulesEngine.evaluate(state)
    assert any(v.type == ViolationType.EMERGENCY_MODE for v in violations)
    assert len(blocked) > 0


def test_validator_blocks_unsafe_recommendation():
    state = _base_state(
        co2_level_ppm=1100.0,
        current_building_recommendations=[
            BuildingRecommendation(
                agent="energy",
                action="Reduce ventilation for energy savings",
            )
        ],
    )
    violations, _, _, _ = SafetyRulesEngine.evaluate(state)
    validator = SafetyValidator(llm_client=None)
    blocked, allowed, llm_used = validator.validate_recommendations(
        state, violations, SafetyStatus.WARNING
    )
    assert "Reduce ventilation for energy savings" in blocked


def test_validator_llm_failure_fallback():
    state = _base_state(
        current_building_recommendations=[
            BuildingRecommendation(agent="energy", action="Load shedding")
        ]
    )
    violations, _, _, _ = SafetyRulesEngine.evaluate(state)
    validator = SafetyValidator(llm_client=MockLLM(fail=True))
    blocked, allowed, llm_used = validator.validate_recommendations(
        state, violations, SafetyStatus.SAFE
    )
    assert llm_used is False


def test_confidence_on_emergency():
    state = _base_state(fire_alarm=True)
    violations, _, _, _ = SafetyRulesEngine.evaluate(state)
    confidence = SafetyConfidenceEngine.calculate(state, violations, llm_used=False)
    assert confidence >= 0.85


def test_full_pipeline_safe():
    agent = SafetyAgent(llm_client=MockLLM())
    result = agent.process(
        {
            "occupancy": 40,
            "building_capacity": 100,
            "co2_level_ppm": 450.0,
            "active_alarms": [],
            "occupancy_critical": False,
        }
    )
    metrics = result["safety_metrics"]
    assert metrics["safety_status"] == SafetyStatus.SAFE.value
    assert metrics["emergency_flag"] is False
    assert metrics["confidence"] > 0


def test_full_pipeline_fire_emergency():
    agent = SafetyAgent()
    result = agent.process({"fire_alarm": True, "occupancy": 10, "building_capacity": 100})
    metrics = result["safety_metrics"]
    assert metrics["safety_status"] == SafetyStatus.CRITICAL.value
    assert metrics["emergency_flag"] is True
    assert metrics["emergency_protocol_active"] is True
    assert len(metrics["blocked_actions"]) > 0


def test_fallback_on_corrupt_data():
    agent = SafetyAgent()
    result = agent.process({"building_capacity": -1})
    assert "errors" in result
    assert "safety_metrics" in result


def test_fallback_engine_direct():
    state = _base_state()
    output = SafetyFallbackEngine.execute_rules(state)
    assert output.safety_status == SafetyStatus.SAFE
    assert "[FALLBACK TRIGGERED]" in output.reasoning
