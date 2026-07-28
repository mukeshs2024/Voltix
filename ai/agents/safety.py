from pydantic import BaseModel, Field
from typing import Any, List
from agents.base import BaseAgent
from prompts.safety_prompts import SAFETY_SYSTEM_PROMPT
from langchain_core.prompts import ChatPromptTemplate
import json

class SafetyOverride(BaseModel):
    is_safe: bool
    violations: List[str]
    override_actions: List[str]
    reasoning: str

class SafetyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SafetyAgent", 
            description="Evaluates proposed actions against hard safety constraints."
        )

    def get_system_prompt(self) -> str:
        return SAFETY_SYSTEM_PROMPT

    async def process(self, state: Any) -> SafetyOverride:
        if not self.llm:
            return SafetyOverride(
                is_safe=True, violations=[], override_actions=[], reasoning="Fallback mock."
            )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self.get_system_prompt()),
            ("human", "Current Twin State: {twin_state}")
        ])
        
        chain = prompt | self.llm.with_structured_output(SafetyOverride)
        twin_state_json = state.get("twin_state").model_dump_json() if hasattr(state.get("twin_state"), "model_dump_json") else json.dumps(state.get("twin_state", {}))
        
        return await chain.ainvoke({"twin_state": twin_state_json})
