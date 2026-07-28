import json
from datetime import datetime, timezone
from agents.occupancy.occupancy_agent import OccupancyAgent
from agents.thermal.thermal_agent import ThermalAgent
from agents.energy.energy_agent import EnergyAgent
from agents.equipment.equipment_agent import EquipmentAgent
from agents.grid.grid_agent import GridAgent
from agents.safety.safety_agent import SafetyAgent

def test_all_agents():
    print("Testing Occupancy Agent...")
    occupancy_agent = OccupancyAgent()
    occupancy_state = {
        "zone": {"zone_id": "test_zone", "name": "Test Zone", "capacity": 50, "sq_ft": 1000.0},
        "sensors": [
            {"sensor_id": "pir_1", "sensor_type": "PIR", "value": 1.0, "timestamp": datetime.now(timezone.utc).isoformat()}
        ],
        "calendar": []
    }
    occ_result = occupancy_agent.process(occupancy_state)
    print("Occupancy Agent Output:", occ_result.get("occupancy_metrics", "FAILED"))

    print("\nTesting Thermal Agent...")
    thermal_agent = ThermalAgent()
    thermal_state = {"current_temperature": 75.0, "current_setpoint": 70.0, "hvac_mode": "COOL"}
    thm_result = thermal_agent.process(thermal_state)
    print("Thermal Agent Output:", thm_result.get("thermal_metrics", "FAILED"))

    print("\nTesting Energy Agent...")
    energy_agent = EnergyAgent()
    energy_state = {"current_kw": 150.0, "peak_limit_kw": 200.0}
    eng_result = energy_agent.process(energy_state)
    print("Energy Agent Output:", eng_result.get("energy_metrics", "FAILED"))

    print("\nTesting Equipment Agent...")
    equipment_agent = EquipmentAgent()
    equipment_state = {"equipment_id": "AHU_1", "runtime_hours": 5000, "active_faults": []}
    eqp_result = equipment_agent.process(equipment_state)
    print("Equipment Agent Output:", eqp_result.get("equipment_metrics", "FAILED"))

    print("\nTesting Grid Agent...")
    grid_agent = GridAgent()
    grid_state = {"current_price_kwh": 0.15, "demand_response_event": False}
    grd_result = grid_agent.process(grid_state)
    print("Grid Agent Output:", grd_result.get("grid_metrics", "FAILED"))

    print("\nTesting Safety Agent...")
    safety_agent = SafetyAgent()
    safety_state = {"active_alarms": [], "occupancy_critical": False}
    sft_result = safety_agent.process(safety_state)
    print("Safety Agent Output:", sft_result.get("safety_metrics", "FAILED"))

if __name__ == "__main__":
    test_all_agents()
