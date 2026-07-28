"""
Thermal Agent Package
"""

from pydantic import BaseModel, Field

from .thermal_agent import ThermalAgent as ThermalStateAgent
from .thermal_schema import ThermalState, ThermalOutput


class ThermalAdjustment(BaseModel):
	zone_id: str
	target_temperature: float
	hvac_mode: str = Field(description="Heating, Cooling, Fan, or Off")
	energy_impact_kwh: float
	reasoning: str
	override_allowed: bool


class ThermalAgent:
	def __init__(self):
		self.llm = None

	async def process(self, state):
		return ThermalAdjustment(
			zone_id="Zone-A",
			target_temperature=22.5,
			hvac_mode="Cooling",
			energy_impact_kwh=1.2,
			reasoning="Fallback mock.",
			override_allowed=True,
		)


__all__ = ["ThermalAgent", "ThermalStateAgent", "ThermalState", "ThermalOutput", "ThermalAdjustment"]
