from pydantic import BaseModel, Field
from typing import Any
from agents.base import BaseAgent
from prompts.grid_prompts import GRID_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class GridConstraint(BaseModel):
    active_dr_event: bool
    max_allowable_draw_kw: float
    current_pricing_tier: str = Field(description="Off-Peak, Mid-Peak, or On-Peak")
    recommendation: str
    reasoning: str

class GridAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="GridAgent", 
            description="Interfaces with external grid signals and dynamic pricing."
        )

    def get_system_prompt(self) -> str:
        return GRID_SYSTEM_PROMPT

    async def process(self, state: Any) -> GridConstraint:
        if not self.llm:
            return GridConstraint(
                active_dr_event=False, max_allowable_draw_kw=200.0, current_pricing_tier="Mid-Peak",
                recommendation="Fallback mock.", reasoning="Fallback mock."
            )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(GridConstraint)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
