from pydantic import BaseModel, Field
from typing import Any
from agents.base import BaseAgent
from prompts.occupancy_prompts import OCCUPANCY_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class OccupancyInsight(BaseModel):
    zone_id: str
    current_occupancy: int
    predicted_occupancy_1h: int
    activity_level: str = Field(description="Low, Medium, or High")
    anomalies_detected: bool
    reasoning: str

class OccupancyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="OccupancyAgent", 
            description="Analyzes building usage and human presence."
        )

    def get_system_prompt(self) -> str:
        return OCCUPANCY_SYSTEM_PROMPT

    async def process(self, state: Any) -> OccupancyInsight:
        if not self.llm:
            return OccupancyInsight(
                zone_id="Zone-A", current_occupancy=42, predicted_occupancy_1h=45,
                activity_level="Medium", anomalies_detected=False, reasoning="Fallback mock."
            )
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(OccupancyInsight)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
