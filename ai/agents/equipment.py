from pydantic import BaseModel, Field
from typing import Any, List
from agents.base import BaseAgent
from prompts.equipment_prompts import EQUIPMENT_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class MaintenanceSchedule(BaseModel):
    action_required: str
    urgency: str = Field(description="Low, Medium, High, or Critical")
    estimated_downtime_hours: float

class EquipmentHealthStatus(BaseModel):
    equipment_id: str
    health_score: float = Field(ge=0.0, le=100.0)
    anomalies_detected: List[str]
    maintenance_proposed: List[MaintenanceSchedule]
    reasoning: str

class EquipmentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="EquipmentAgent", 
            description="Monitors asset health and schedules predictive maintenance."
        )

    def get_system_prompt(self) -> str:
        return EQUIPMENT_SYSTEM_PROMPT

    async def process(self, state: Any) -> EquipmentHealthStatus:
        if not self.llm:
            return EquipmentHealthStatus(
                equipment_id="HVAC-Unit-1", health_score=85.5, anomalies_detected=[],
                maintenance_proposed=[], reasoning="Fallback mock."
            )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(EquipmentHealthStatus)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
