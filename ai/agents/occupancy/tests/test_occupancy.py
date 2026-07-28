"""
Phase 8: Testing Suite for Occupancy Agent.
Includes unit tests for Intelligence Engine, Fallback Engine, and Core Agent Pipeline.
"""
import unittest
from datetime import datetime, timezone, timedelta
import json

from ..occupancy_schema import (
    SharedState, ZoneTopology, SensorData, SensorType, 
    CalendarEvent, OccupancyClassification
)
from ..intelligence import IntelligenceEngine
from ..fallback import FallbackEngine
from ..occupancy_agent import OccupancyAgent, MockLLMClient


class TestOccupancyIntelligence(unittest.TestCase):
    def setUp(self):
        self.zone = ZoneTopology(zone_id="zone_01", name="Conference Room A", capacity=20, sq_ft=500.0)
        self.now = datetime.now(timezone.utc)

    def test_calculate_utilization(self):
        self.assertEqual(IntelligenceEngine.calculate_utilization(10, 20), 0.5)
        self.assertEqual(IntelligenceEngine.calculate_utilization(0, 20), 0.0)
        self.assertEqual(IntelligenceEngine.calculate_utilization(25, 20), 1.25)
        self.assertEqual(IntelligenceEngine.calculate_utilization(50, 20), 2.0) # Capped at 2.0

    def test_determine_classification(self):
        self.assertEqual(IntelligenceEngine.determine_classification(0.0), OccupancyClassification.EMPTY)
        self.assertEqual(IntelligenceEngine.determine_classification(0.2), OccupancyClassification.LOW)
        self.assertEqual(IntelligenceEngine.determine_classification(0.5), OccupancyClassification.MEDIUM)
        self.assertEqual(IntelligenceEngine.determine_classification(0.9), OccupancyClassification.HIGH)
        self.assertEqual(IntelligenceEngine.determine_classification(1.1), OccupancyClassification.OVERCROWDED)

    def test_ghost_booking_anomaly(self):
        event = CalendarEvent(
            event_id="evt_123", 
            expected_attendees=10, 
            start_time=self.now - timedelta(minutes=20), 
            end_time=self.now + timedelta(minutes=40)
        )
        anomalies = IntelligenceEngine.detect_anomalies(
            estimated_count=0, zone=self.zone, sensors=[], calendar=[event]
        )
        self.assertEqual(len(anomalies), 1)
        self.assertEqual(anomalies[0].anomaly_type, "GHOST_BOOKING")

    def test_overcrowding_anomaly(self):
        anomalies = IntelligenceEngine.detect_anomalies(
            estimated_count=25, zone=self.zone, sensors=[], calendar=[]
        )
        self.assertEqual(len(anomalies), 1)
        self.assertEqual(anomalies[0].anomaly_type, "OVERCROWDING")


class TestFallbackEngine(unittest.TestCase):
    def setUp(self):
        self.now = datetime.now(timezone.utc)
        self.zone = ZoneTopology(zone_id="zone_01", name="Room B", capacity=50, sq_ft=1000.0)
        self.base_state = SharedState(zone=self.zone, sensors=[])

    def test_fallback_acs_precedence(self):
        self.base_state.sensors = [
            SensorData(sensor_id="acs_1", sensor_type=SensorType.ACS, value=15, timestamp=self.now)
        ]
        output = FallbackEngine.execute_rules(self.base_state)
        self.assertEqual(output.estimated_count, 15)
        self.assertEqual(output.classification, OccupancyClassification.MEDIUM)
        self.assertEqual(output.confidence_score, 0.4)

    def test_fallback_co2_heuristic(self):
        self.base_state.sensors = [
            SensorData(sensor_id="co2_1", sensor_type=SensorType.CO2, value=900, timestamp=self.now)
        ]
        output = FallbackEngine.execute_rules(self.base_state)
        self.assertEqual(output.estimated_count, 25) # 50% capacity heuristic

    def test_fallback_rescue_state(self):
        raw_malformed = {
            "zone": {"zone_id": "z1", "name": "Z1", "capacity": 10, "sq_ft": 100.0},
            "sensors": [{"sensor_id": "p1", "sensor_type": "PIR", "value": 1, "timestamp": self.now.isoformat()}]
        }
        rescued = FallbackEngine.rescue_state(raw_malformed, "Simulated Timeout")
        self.assertIn("occupancy_metrics", rescued)
        self.assertEqual(rescued["occupancy_metrics"]["estimated_count"], 1) # 10% capacity heuristic


class TestCoreAgentPipeline(unittest.TestCase):
    def test_full_pipeline_success(self):
        agent = OccupancyAgent(llm_client=MockLLMClient())
        raw_state = {
            "zone": {"zone_id": "zone_123", "name": "Main Hall", "capacity": 100, "sq_ft": 2000.0},
            "sensors": [],
            "calendar": []
        }
        output_state = agent.process(raw_state)
        self.assertIn("occupancy_metrics", output_state)
        # Mock client returns classification LOW and count 5
        self.assertEqual(output_state["occupancy_metrics"]["classification"], "LOW")
        self.assertEqual(output_state["occupancy_metrics"]["estimated_count"], 5)
        self.assertFalse("errors" in output_state or len(output_state.get("errors", [])) > 0)

if __name__ == "__main__":
    unittest.main()
