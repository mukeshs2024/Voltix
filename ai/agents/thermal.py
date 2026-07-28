from pydantic import BaseModel, Field
from typing import Any
from agents.base import BaseAgent
from prompts.thermal_prompts import THERMAL_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class ThermalAdjustment(BaseModel):
    zone_id: str
    target_temperature: float
    hvac_mode: str = Field(description="Heating, Cooling, Fan, or Off")
    energy_impact_kwh: float
    reasoning: str
    override_allowed: bool

class ThermalAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ThermalAgent", 
            description="Manages HVAC optimization and temperature zones."
        )

    def get_system_prompt(self) -> str:
        return THERMAL_SYSTEM_PROMPT

    async def process(self, state: Any) -> ThermalAdjustment:
        if not self.llm:
            return ThermalAdjustment(
                zone_id="Zone-A", target_temperature=22.5, hvac_mode="Cooling",
                energy_impact_kwh=1.2, reasoning="Fallback mock.", override_allowed=True
            )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(ThermalAdjustment)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
