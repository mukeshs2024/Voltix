"""
1. Purpose: Unit tests for the Grid Agent.
2. Responsibilities: Test rules, confidence, schema, fallback, and LLM failure paths.
"""

import json
import pytest

from ai.agents.grid.grid_agent import GridAgent
from ai.agents.grid.grid_schema import GridState, GridTelemetry
from ai.agents.grid.grid_rules import GridRulesEngine
from ai.agents.grid.grid_confidence import GridConfidenceEngine
from ai.agents.grid.grid_prediction import GridPredictionEngine
from ai.agents.grid.grid_constants import (
    PricingTier,
    BatteryStrategy,
    CarbonLevel,
    GridStatus,
)
from ai.agents.grid.fallback import GridFallbackEngine


def _base_telemetry(**overrides):
    defaults = {
        "current_building_load_kw": 200.0,
        "current_grid_price": 0.08,
        "demand_response_event": False,
        "solar_generation_kw": 0.0,
        "battery_soc": 50.0,
        "grid_carbon_intensity": 250.0,
        "grid_unstable": False,
    }
    defaults.update(overrides)
    return GridTelemetry(**defaults)


class MockLLM:
    def __init__(self, response=None, fail=False):
        self.response = response or (
            '{"15_min": 210, "30_min": 220, "60_min": 230, '
            '"predicted_price_tier": "MID_PEAK", "predicted_load_kw": 230}'
        )
        self.fail = fail
        self.calls = 0

    def generate(self, system, user):
        self.calls += 1
        if self.fail:
            raise RuntimeError("Groq unavailable")
        return self.response


class MockLLMInvalidJSON(MockLLM):
    def generate(self, system, user):
        self.calls += 1
        return "not valid json {{{"


def test_off_peak_charge_rule():
    telemetry = _base_telemetry(current_grid_price=0.08, battery_soc=60.0)
    tier = GridRulesEngine.determine_pricing_tier(telemetry)
    assert tier == PricingTier.OFF_PEAK

    outcomes, recs, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "OFF_PEAK_CHARGE" and o.triggered for o in outcomes)
    assert any("Charge battery" in r for r in recs)


def test_solar_excess_rule():
    telemetry = _base_telemetry(
        current_building_load_kw=100.0,
        solar_generation_kw=150.0,
    )
    outcomes, _, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "SOLAR_EXCESS" and o.triggered for o in outcomes)
    strategy = GridRulesEngine.determine_battery_strategy(
        telemetry, PricingTier.MID_PEAK, CarbonLevel.LOW
    )
    assert strategy == BatteryStrategy.CHARGE


def test_demand_response_rule():
    telemetry = _base_telemetry(demand_response_event=True, battery_soc=80.0)
    outcomes, recs, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "DEMAND_RESPONSE" and o.triggered for o in outcomes)
    strategy = GridRulesEngine.determine_battery_strategy(
        telemetry, PricingTier.ON_PEAK, CarbonLevel.MEDIUM
    )
    assert strategy == BatteryStrategy.DISCHARGE


def test_high_carbon_rule():
    telemetry = _base_telemetry(grid_carbon_intensity=600.0)
    carbon = GridRulesEngine.determine_carbon_level(telemetry)
    assert carbon == CarbonLevel.HIGH
    outcomes, recs, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "HIGH_CARBON" and o.triggered for o in outcomes)


def test_peak_discharge_rule():
    telemetry = _base_telemetry(current_grid_price=0.25, battery_soc=85.0)
    tier = GridRulesEngine.determine_pricing_tier(telemetry)
    assert tier == PricingTier.ON_PEAK
    outcomes, _, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "PEAK_DISCHARGE" and o.triggered for o in outcomes)


def test_grid_unstable_rule():
    telemetry = _base_telemetry(grid_unstable=True)
    outcomes, _, _, _ = GridRulesEngine.evaluate(telemetry)
    assert any(o.rule_id == "GRID_UNSTABLE" and o.triggered for o in outcomes)
    status = GridRulesEngine.determine_grid_status(
        telemetry, PricingTier.MID_PEAK, outcomes
    )
    assert status == GridStatus.CRITICAL


def test_confidence_calculation():
    telemetry = _base_telemetry()
    outcomes, _, _, _ = GridRulesEngine.evaluate(telemetry)
    confidence = GridConfidenceEngine.calculate(telemetry, outcomes, llm_used=True)
    assert 0.0 <= confidence <= 1.0
    assert confidence > 0.5


def test_schema_validation_legacy_price_field():
    state = GridState.model_validate(
        {"current_price_kwh": 0.15, "demand_response_event": False}
    )
    assert state.current_grid_price == 0.15


def test_prediction_fallback_on_groq_failure():
    engine = GridPredictionEngine(llm_client=MockLLM(fail=True))
    telemetry = _base_telemetry()
    prediction, llm_used = engine.predict(telemetry, PricingTier.MID_PEAK)
    assert llm_used is False
    assert prediction.min_15 >= 0


def test_prediction_invalid_json_fallback():
    engine = GridPredictionEngine(llm_client=MockLLMInvalidJSON())
    telemetry = _base_telemetry()
    prediction, llm_used = engine.predict(telemetry, PricingTier.MID_PEAK)
    assert llm_used is False
    assert prediction.min_60 == telemetry.current_building_load_kw


def test_full_pipeline_with_mock_llm():
    agent = GridAgent(llm_client=MockLLM())
    result = agent.process(
        {
            "current_price_kwh": 0.12,
            "current_building_load_kw": 250.0,
            "battery_soc": 45.0,
            "demand_response_event": False,
            "solar_generation_kw": 80.0,
            "grid_carbon_intensity": 280.0,
        }
    )
    metrics = result["grid_metrics"]
    assert metrics["pricing_tier"] in [t.value for t in PricingTier]
    assert metrics["battery_strategy"] in [s.value for s in BatteryStrategy]
    assert metrics["confidence"] > 0
    assert "reasoning" in metrics
    assert "predictions" in metrics


def test_fallback_on_corrupt_data():
    agent = GridAgent()
    result = agent.process({"invalid": True})
    assert "errors" in result
    assert "grid_metrics" in result


def test_fallback_engine_direct():
    state = GridState.model_validate(
        {"current_price_kwh": 0.09, "battery_soc": 55.0, "current_building_load_kw": 100.0}
    )
    output = GridFallbackEngine.execute_rules(state)
    assert output.pricing_tier == PricingTier.OFF_PEAK
    assert "[FALLBACK TRIGGERED]" in output.reasoning
