"""
1. Objective: Provide automated tests and scenario library for Supervisor.
2. Folder location: ai/decision_engine/
3. Responsibilities: Ensure conflicts, overrides, and tie-breakers work perfectly.
"""
import unittest
from .consensus import ConsensusEngine

class TestSupervisorEngine(unittest.TestCase):
    
    def test_no_conflict(self):
        outputs = {
            "Occupancy": {"activity_level": "LOW", "confidence": 0.9},
            "Thermal": {"hvac_mode": "AUTO", "confidence": 0.9}
        }
        decision = ConsensusEngine.evaluate(outputs)
        self.assertEqual(len(decision.conflicts), 0)
        self.assertIn("Occupancy", decision.winning_agents)
        self.assertIn("Thermal", decision.winning_agents)

    def test_single_conflict(self):
        outputs = {
            "Thermal": {"hvac_mode": "COOL", "confidence": 0.9},
            "Energy": {"shedding_recommended": True, "confidence": 0.9}
        }
        decision = ConsensusEngine.evaluate(outputs)
        self.assertEqual(len(decision.conflicts), 1)
        # Thermal priority = 70, Energy = 50. Thermal should win.
        self.assertIn("Thermal", decision.winning_agents)
        self.assertIn("Energy", decision.overridden_agents)
        
    def test_low_confidence_override(self):
        outputs = {
            "Thermal": {"hvac_mode": "COOL", "confidence": 0.4}, # Priority 70, but low conf
            "Energy": {"shedding_recommended": True, "confidence": 0.95} # Priority 50, but high conf
        }
        decision = ConsensusEngine.evaluate(outputs)
        self.assertEqual(len(decision.conflicts), 1)
        # Energy should override Thermal due to confidence
        self.assertIn("Energy", decision.winning_agents)
        self.assertIn("Thermal", decision.overridden_agents)
        
    def test_missing_agents(self):
        # Should not crash if agents are missing
        outputs = {
            "Occupancy": {"activity_level": "PEAK"}
        }
        decision = ConsensusEngine.evaluate(outputs)
        self.assertEqual(len(decision.conflicts), 0)
        
    def test_scenario_morning_rush(self):
        outputs = {
            "Occupancy": {"activity_level": "PEAK", "confidence": 0.9},
            "Thermal": {"hvac_mode": "COOL", "confidence": 0.8},
            "Grid": {"cost_optimization_strategy": "PEAK_SHAVING", "confidence": 0.9}
        }
        decision = ConsensusEngine.evaluate(outputs)
        self.assertEqual(len(decision.conflicts), 1)
        self.assertEqual(decision.conflicts[0].category, "Energy vs Comfort")
        # Occupancy (80) should override Grid (60)
        self.assertIn("Occupancy", decision.winning_agents)
        self.assertIn("Grid", decision.overridden_agents)
        
if __name__ == '__main__':
    unittest.main()
