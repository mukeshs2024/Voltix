import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv

# Ensure environment variables are loaded (for Groq API key)
load_dotenv()

from ai.agents.grid.grid_agent import GridAgent
from ai.agents.safety.safety_agent import SafetyAgent

def run_agents():
    print("=========================================")
    print("Running Grid Agent manually...")
    print("=========================================")
    
    grid_payload = {
        "current_building_load_kw": 250.0,
        "current_grid_price": 0.05,
        "demand_response_event": False,
        "weather_forecast": "sunny",
        "outdoor_temperature": 25.0,
        "solar_generation_kw": 50.0,
        "battery_soc": 80.0,
        "grid_carbon_intensity": 120.0,
        "historical_price_trend": "stable",
        "historical_load_trend": "stable",
        "current_time": datetime.now(timezone.utc).isoformat(),
        "peak_pricing_schedule": "OFF_PEAK"
    }

    grid_agent = GridAgent()
    grid_result = grid_agent.process(grid_payload)
    print(json.dumps(grid_result.get("grid_metrics", {}), indent=2))
    
    print("\n=========================================")
    print("Running Safety Agent manually...")
    print("=========================================")
    
    safety_payload = {
        "occupancy": 50,
        "building_capacity": 100,
        "zone_temperature": 22.5,
        "smoke_sensor": False,
        "fire_alarm": False,
        "co2_level": 400.0,
        "emergency_state": False,
        "emergency_exit_blocked": False,
        "hvac_status": "NORMAL",
        "equipment_health": "OPTIMAL",
        "grid_status": grid_result.get("grid_metrics", {}).get("grid_status", "NORMAL"),
        "current_building_recommendations": grid_result.get("grid_metrics", {}).get("recommendations", [])
    }

    safety_agent = SafetyAgent()
    safety_result = safety_agent.process(safety_payload)
    print(json.dumps(safety_result.get("safety_metrics", {}), indent=2))

if __name__ == "__main__":
    run_agents()
