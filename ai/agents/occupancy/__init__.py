"""
Occupancy Agent Package
"""

from pydantic import BaseModel, Field

from .occupancy_agent import OccupancyAgent as OccupancyStateAgent
from .occupancy_schema import SharedState, OccupancyOutput


class OccupancyInsight(BaseModel):
	zone_id: str
	current_occupancy: int
	predicted_occupancy_1h: int
	activity_level: str = Field(description="Low, Medium, or High")
	anomalies_detected: bool
	reasoning: str


class OccupancyAgent:
	def __init__(self):
		self.llm = None

	async def process(self, state):
		if not self.llm:
			return OccupancyInsight(
				zone_id="Zone-A",
				current_occupancy=42,
				predicted_occupancy_1h=45,
				activity_level="Medium",
				anomalies_detected=False,
				reasoning="Fallback mock.",
			)

		return OccupancyInsight(
			zone_id="Zone-A",
			current_occupancy=42,
			predicted_occupancy_1h=45,
			activity_level="Medium",
			anomalies_detected=False,
			reasoning="Fallback mock.",
		)


__all__ = ["OccupancyAgent", "OccupancyStateAgent", "SharedState", "OccupancyOutput", "OccupancyInsight"]
