from pydantic import BaseModel, Field
from typing import Any, List
from agents.base import BaseAgent
from prompts.energy_prompts import ENERGY_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class LoadShiftProposal(BaseModel):
    equipment_id: str
    shift_start_time: str
    shift_end_time: str
    expected_savings_usd: float

class EnergyOptimization(BaseModel):
    battery_discharge_pct: float
    grid_draw_kw: float
    load_shifts: List[LoadShiftProposal]
    overall_cost_impact: float
    reasoning: str

class EnergyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="EnergyAgent", 
            description="Optimizes overall consumption and storage."
        )

    def get_system_prompt(self) -> str:
        return ENERGY_SYSTEM_PROMPT

    async def process(self, state: Any) -> EnergyOptimization:
        if not self.llm:
            return EnergyOptimization(
                battery_discharge_pct=15.0, grid_draw_kw=50.0, load_shifts=[],
                overall_cost_impact=-5.40, reasoning="Fallback mock."
            )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(EnergyOptimization)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
