"""
1. Purpose: Unit tests for Phase 6 intelligence engines.
2. Responsibilities: Validate all modular engines independently.
3. Folder location: ai/agents/occupancy/tests/
"""
import unittest
from ..occupancy_schema import SharedState
from ..occupancy_scenarios import SCENARIOS
from ..occupancy_rules import OccupancyRulesEngine
from ..occupancy_confidence import OccupancyConfidenceEngine

class MockLLMClient:
    def generate(self, system, user):
        return '{"15_min": 5, "30_min": 6, "60_min": 7}'

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

if __name__ == "__main__":
    unittest.main()
