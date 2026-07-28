import json
from datetime import datetime, timezone
from agents.occupancy.occupancy_agent import OccupancyAgent
from agents.occupancy.observability import AgentMetrics

# Initialize the agent (uses the MockLLMClient by default)
agent = OccupancyAgent()

# Scenario A: The Ghost Booking
print("--- SCENARIO A: The Ghost Booking ---")
ghost_booking_state = {
  "zone": {"zone_id": "conf_01", "name": "Boardroom", "capacity": 12, "sq_ft": 400.0},
  "sensors": [
    {"sensor_id": "pir_1", "sensor_type": "PIR", "value": 0, "is_active": True, "timestamp": datetime.now(timezone.utc).isoformat()},
    {"sensor_id": "co2_1", "sensor_type": "CO2", "value": 410, "is_active": True, "timestamp": datetime.now(timezone.utc).isoformat()}
  ],
  "calendar": [
    {"event_id": "meet_99", "expected_attendees": 10, "start_time": "2026-07-28T15:30:00Z", "end_time": "2026-07-28T16:30:00Z"}
  ]
}

result = agent.process(ghost_booking_state)
if "occupancy_metrics" in result:
    print(json.dumps(result["occupancy_metrics"], indent=2))
if "errors" in result and result["errors"]:
    print("ERRORS:", result["errors"])

print("\n--- Metrics Summary ---")
print(json.dumps(AgentMetrics.get_summary(), indent=2))
