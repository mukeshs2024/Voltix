"""
1. Purpose: Isolated unit tests for the Occupancy Agent.
2. Responsibilities: Test individual components (Confidence, Rules, Prediction, Validation) without LLM.
"""

import pytest
from datetime import datetime, timezone, timedelta
from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.occupancy.occupancy_schema import (
    SharedState,
    ZoneTopology,
    SensorData,
    CalendarEvent,
)
from ai.agents.occupancy.occupancy_rules import OccupancyRulesEngine
from ai.agents.occupancy.occupancy_confidence import OccupancyConfidenceEngine
from ai.agents.occupancy.occupancy_scenarios import SCENARIOS


def get_base_state():
    now = datetime.now(timezone.utc)
    return SharedState(
        zone=ZoneTopology(zone_id="Z1", name="Lobby", capacity=100, sq_ft=1000),
        sensors=[
            SensorData(sensor_id="s1", sensor_type="PIR", value=1, timestamp=now),
            SensorData(sensor_id="s2", sensor_type="ACS", value=50, timestamp=now),
        ],
        calendar=[],
    )


def test_overcapacity_rule():
    state = get_base_state()
    anomalies = OccupancyRulesEngine.evaluate(state, current_occupancy=120)
    assert len(anomalies) == 1
    assert anomalies[0].type == "OVERCAPACITY"


def test_ghost_booking_rule():
    now = datetime.now(timezone.utc)
    state = get_base_state()
    state.calendar = [
        CalendarEvent(
            event_id="e1",
            start_time=now - timedelta(minutes=20),
            end_time=now + timedelta(minutes=30),
        )
    ]
    anomalies = OccupancyRulesEngine.evaluate(state, current_occupancy=0)
    assert any(a.type == "GHOST_BOOKING" for a in anomalies)


def test_ghost_booking_pipeline_integration():
    class MockLLM:
        def generate(self, system, user):
            return '{"15_min": 0, "30_min": 0, "60_min": 0}'

    agent = OccupancyAgent(llm_client=MockLLM())
    result = agent.process(SCENARIOS["GHOST_BOOKING"].model_dump(mode="json"))

    metrics = result["occupancy_metrics"]
    assert metrics["current_occupancy"] == 0
    assert any(anomaly["type"] == "GHOST_BOOKING" for anomaly in metrics["anomalies"])


def test_confidence_decay_on_stale_data():
    now = datetime.now(timezone.utc)
    state = get_base_state()
    # Stale timestamp (10 minutes ago)
    state.sensors[0].timestamp = now - timedelta(minutes=10)
    state.sensors[1].timestamp = now - timedelta(minutes=10)

    confidence = OccupancyConfidenceEngine.calculate(
        state, current_occupancy=50, anomalies=[]
    )
    # Base = 0.5, ACS = +0.3, PIR+CO2 missing, Stale = -0.3 => 0.5
    assert confidence < 0.8  # Dropped from optimal


def test_schema_validation_fails_on_bad_time():
    now = datetime.now(timezone.utc)
    with pytest.raises(ValueError, match="start_time cannot be after end_time"):
        CalendarEvent(
            event_id="bad", start_time=now + timedelta(minutes=30), end_time=now
        )
