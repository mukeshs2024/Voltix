"""
1. Purpose: End-to-end integration tests for the Occupancy Agent.
2. Responsibilities: Ensure the entire pipeline (state ingestion -> validation -> intelligence -> JSON output) runs flawlessly.
"""

import pytest
from datetime import datetime, timezone
from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.occupancy.occupancy_constants import ActivityLevel


class MockLLM:
    def invoke(self, *args, **kwargs):
        # Stub the LLM for predictability in tests
        pass


def test_full_pipeline_execution():
    agent = OccupancyAgent(llm_client=MockLLM())
    now = datetime.now(timezone.utc).isoformat()

    raw_payload = {
        "zone": {
            "zone_id": "Lobby",
            "name": "Main Lobby",
            "capacity": 200,
            "sq_ft": 5000.0,
        },
        "sensors": [
            {
                "sensor_id": "ACS-1",
                "sensor_type": "ACS",
                "value": 150.0,
                "timestamp": now,
                "is_active": True,
            },
            {
                "sensor_id": "PIR-1",
                "sensor_type": "PIR",
                "value": 1.0,
                "timestamp": now,
                "is_active": True,
            },
        ],
        "calendar": [],
    }

    result = agent.process(raw_payload)

    assert isinstance(result, dict)
    assert "occupancy_metrics" in result
    metrics = result["occupancy_metrics"]

    assert metrics["current_occupancy"] == 150
    assert metrics["occupancy_percentage"] == 0.75
    assert metrics["activity_level"] == ActivityLevel.MODERATE.value
    assert metrics["confidence"] > 0.6  # ACS gives high confidence


def test_pipeline_fallback_on_corrupt_data():
    agent = OccupancyAgent()

    # Missing required capacity field
    raw_payload = {
        "zone": {"zone_id": "Lobby", "name": "Main Lobby", "sq_ft": 5000.0},
        "sensors": [],
    }

    result = agent.process(raw_payload)

    assert isinstance(result, dict)
    assert "errors" in result
    assert "occupancy_metrics" in result
    # Fallback returns empty metrics
    assert result["occupancy_metrics"]["current_occupancy"] == 0
