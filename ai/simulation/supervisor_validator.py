"""
1. Objective: Validate the Supervisor tie-breaking and conflict logic.
2. Folder location: ai/simulation/
3. Responsibilities: Run specific agent-conflict scenarios ensuring priorities are respected.
"""
import unittest
from ai.decision_engine.consensus import ConsensusEngine

class TestSupervisorValidator(unittest.TestCase):
    def test_scenario_a_comfort_wins(self):
        """
        Occupancy: Increase cooling (Priority 80)
        Thermal: Increase cooling (Priority 70)
        Energy: Reduce cooling (Priority 50)
        Expected: Occupancy + Thermal win.
        """
        agent_outputs = {
            "Occupancy": {"activity_level": "HIGH", "confidence": 0.9},
            "Thermal": {"hvac_mode": "COOL", "confidence": 0.9},
            "Energy": {"shedding_recommended": True, "confidence": 0.9}
        }
        decision = ConsensusEngine.evaluate(agent_outputs)
        self.assertIn("Occupancy", decision.winning_agents)
        self.assertIn("Thermal", decision.winning_agents)
        self.assertIn("Energy", decision.overridden_agents)
        self.assertTrue(any(c.category == "HVAC Demand" for c in decision.conflicts))

    def test_scenario_b_safety_wins(self):
        """
        Safety: Evacuate (Priority 100)
        Occupancy: Continue operation (Priority 80)
        Expected: Safety wins.
        """
        agent_outputs = {
            "Safety": {"emergency_protocol_active": True, "confidence": 0.99},
            "Occupancy": {"activity_level": "MODERATE", "confidence": 0.9}
        }
        decision = ConsensusEngine.evaluate(agent_outputs)
        self.assertIn("Safety", decision.winning_agents)
        # Occupancy isn't necessarily in a strict detected conflict based on our current conflict_detector, 
        # but Safety should dominate the final decision string.
        self.assertEqual(decision.building_status, "CRITICAL")
        self.assertEqual(decision.decision, "Trigger Emergency Protocols.")

    def test_scenario_c_grid_override(self):
        """
        Grid: Save energy (Priority 60)
        Occupancy: High density, confidence 0.98 (Priority 80)
        Expected: Comfort wins.
        """
        agent_outputs = {
            "Grid": {"cost_optimization_strategy": "PEAK_SHAVING", "confidence": 0.9},
            "Occupancy": {"activity_level": "PEAK", "confidence": 0.98}
        }
        decision = ConsensusEngine.evaluate(agent_outputs)
        self.assertIn("Occupancy", decision.winning_agents)
        self.assertIn("Grid", decision.overridden_agents)

if __name__ == '__main__':
    unittest.main()
