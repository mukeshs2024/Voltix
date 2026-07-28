"""
1. Purpose: Unit tests for Phase 6 intelligence engines.
2. Responsibilities: Validate all modular engines independently.
3. Folder location: ai/agents/occupancy/tests/
"""

import unittest
from ..occupancy_scenarios import SCENARIOS
from ..occupancy_rules import OccupancyRulesEngine
from ..occupancy_confidence import OccupancyConfidenceEngine
from ..occupancy_prediction import OccupancyPredictionEngine
from ..occupancy_intelligence import OccupancyIntelligenceFacade
from ..occupancy_constants import TrendDirection


class MockLLMClient:
    def generate(self, system, user):
        return '{"15_min": 5, "30_min": 6, "60_min": 7}'


class InvokeOnlyLLMClient:
    def invoke(self, payload):
        return '{"15_min": 8, "30_min": 9, "60_min": 10}'


class TestOccupancyIntelligence(unittest.TestCase):
    def test_ghost_booking_rule(self):
        state = SCENARIOS["GHOST_BOOKING"]
        anomalies = OccupancyRulesEngine.evaluate(state, 0)
        self.assertTrue(any(a.type == "GHOST_BOOKING" for a in anomalies))

    def test_morning_rush_confidence(self):
        state = SCENARIOS["MORNING_RUSH"]
        # Fast telemetry + ACS + PIR should yield high confidence
        confidence = OccupancyConfidenceEngine.calculate(state, 45, [])
        self.assertGreater(confidence, 0.7)

    def test_empty_office_rules(self):
        state = SCENARIOS["EMPTY_OFFICE"]
        anomalies = OccupancyRulesEngine.evaluate(state, 0)
        self.assertEqual(len(anomalies), 0)

    def test_prediction_engine_supports_invoke_only_clients(self):
        state = SCENARIOS["MORNING_RUSH"]
        engine = OccupancyPredictionEngine(InvokeOnlyLLMClient())
        prediction = engine.predict(state, 45, TrendDirection.STABLE)
        self.assertEqual(prediction.min_15, 8)

    def test_motion_only_scenario_uses_minimum_presence(self):
        facade = OccupancyIntelligenceFacade(MockLLMClient())
        result = facade.process_state(SCENARIOS["MOTION_ONLY"])
        self.assertEqual(result.current_occupancy, 1)
        self.assertEqual(result.activity_level.value, "LOW")


if __name__ == "__main__":
    unittest.main()
