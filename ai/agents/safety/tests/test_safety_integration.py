"""
1. Purpose: Integration tests for the Safety Agent pipeline.
2. Responsibilities: End-to-end execution with legacy payloads and observability.
"""

from ai.agents.safety.safety_agent import SafetyAgent
from ai.agents.safety.observability import SafetyAgentMetrics
from ai.agents.safety.safety_constants import SafetyStatus


class MockLLM:
    def generate(self, system, user):
        if "blocked_actions" in user:
            return '{"blocked_actions": [], "reasoning": "ok"}'
        return '{"insight": "All clear"}'


def test_legacy_check_all_agents_payload():
    agent = SafetyAgent(llm_client=MockLLM())
    result = agent.process({"active_alarms": [], "occupancy_critical": False})
    assert "safety_metrics" in result
    metrics = result["safety_metrics"]
    assert metrics["safety_status"] == SafetyStatus.SAFE.value
    assert "emergency_protocol_active" in metrics


def test_recommendation_blocking_integration():
    agent = SafetyAgent(llm_client=MockLLM())
    result = agent.process(
        {
            "occupancy": 90,
            "building_capacity": 100,
            "co2_level_ppm": 1300.0,
            "current_building_recommendations": [
                {"agent": "energy", "action": "Reduce ventilation for energy savings"},
                {"agent": "grid", "action": "Load shedding"},
            ],
        }
    )
    metrics = result["safety_metrics"]
    assert metrics["safety_status"] in (
        SafetyStatus.WARNING.value,
        SafetyStatus.CRITICAL.value,
    )
    assert "Reduce ventilation for energy savings" in metrics["blocked_actions"]


def test_metrics_recorded():
    before = SafetyAgentMetrics.total_invocations
    agent = SafetyAgent()
    agent.process({"active_alarms": [], "occupancy_critical": False})
    assert SafetyAgentMetrics.total_invocations == before + 1
