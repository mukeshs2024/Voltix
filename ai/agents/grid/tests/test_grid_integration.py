"""
1. Purpose: Integration tests for the Grid Agent pipeline.
2. Responsibilities: End-to-end execution with legacy payloads and observability.
"""

from ai.agents.grid.grid_agent import GridAgent
from ai.agents.grid.observability import GridAgentMetrics
from ai.agents.grid.grid_constants import BatteryStrategy, GridStatus


class MockLLM:
    def generate(self, system, user):
        return (
            '{"15_min": 180, "30_min": 175, "60_min": 170, '
            '"predicted_price_tier": "OFF_PEAK", "predicted_load_kw": 170}'
        )


def test_legacy_check_all_agents_payload():
    agent = GridAgent(llm_client=MockLLM())
    result = agent.process(
        {"current_price_kwh": 0.15, "demand_response_event": False}
    )
    assert "grid_metrics" in result
    metrics = result["grid_metrics"]
    assert metrics["cost_optimization_strategy"]
    assert metrics["grid_status"] in [s.value for s in GridStatus]


def test_dr_event_integration():
    agent = GridAgent(llm_client=MockLLM())
    result = agent.process(
        {
            "current_price_kwh": 0.20,
            "current_building_load_kw": 300.0,
            "demand_response_event": True,
            "battery_soc": 75.0,
        }
    )
    metrics = result["grid_metrics"]
    assert metrics["grid_status"] in ("WARNING", "CRITICAL")
    assert any(
        o["rule_id"] == "DEMAND_RESPONSE"
        for o in metrics.get("rule_outcomes", [])
        if o.get("triggered")
    )


def test_metrics_recorded():
    before = GridAgentMetrics.total_invocations
    agent = GridAgent()
    agent.process({"current_price_kwh": 0.11, "current_building_load_kw": 50.0})
    assert GridAgentMetrics.total_invocations == before + 1
