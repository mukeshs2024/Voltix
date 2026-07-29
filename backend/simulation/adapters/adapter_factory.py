from backend.simulation.adapters.safety_adapter import SafetyAdapter
from backend.simulation.adapters.grid_adapter import GridAdapter
from backend.simulation.adapters.equipment_adapter import EquipmentAdapter
from backend.simulation.adapters.hvac_adapter import HVACAdapter
from backend.simulation.adapters.occupancy_adapter import OccupancyAdapter
from backend.simulation.adapters.carbon_adapter import CarbonAdapter
from backend.simulation.adapters.security_adapter import SecurityAdapter
from backend.simulation.adapters.lighting_adapter import LightingAdapter
from backend.simulation.adapters.water_adapter import WaterAdapter
from backend.simulation.adapters.energy_adapter import EnergyAdapter

class AdapterFactory:
    @staticmethod
    def get_adapter(agent_id: str):
        adapters = {
            "safety": SafetyAdapter(),
            "grid": GridAdapter(),
            "equipment": EquipmentAdapter(),
            "hvac": HVACAdapter(),
            "occupancy": OccupancyAdapter(),
            "carbon": CarbonAdapter(),
            "security": SecurityAdapter(),
            "lighting": LightingAdapter(),
            "water": WaterAdapter(),
            "energy": EnergyAdapter(),
        }
        return adapters.get(agent_id)
