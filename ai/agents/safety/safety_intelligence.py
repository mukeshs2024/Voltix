"""
1. Purpose: Central facade for the Safety Intelligence Engine.
2. Responsibilities: Orchestrate rules, validation, confidence, and explainability modules.
3. Folder location: ai/agents/safety/
"""

from datetime import datetime
import json
import logging
from .safety_schema import SafetyInputState, SafetyOutput
from .safety_rules import SafetyRulesEngine
from .safety_validator import SafetyValidator
from .safety_confidence import SafetyConfidenceEngine
from .safety_explainer import SafetyExplainabilityEngine
from .safety_prompt import SafetyPromptBuilder

logger = logging.getLogger(__name__)

class SafetyIntelligenceFacade:
    def __init__(self, llm_client):
        self.llm_client = llm_client

    def process_state(self, state: SafetyInputState) -> SafetyOutput:
        # 1. Deterministic Rules
        rule_outputs = SafetyRulesEngine.evaluate(state)
        
        # 2. Action Validation
        validation_outputs = SafetyValidator.validate_actions(state, rule_outputs)
        
        # 3. Confidence Calculation
        confidence = SafetyConfidenceEngine.calculate(state, rule_outputs)
        
        # 4. Explainability
        reasoning = SafetyExplainabilityEngine.generate_reasoning(
            state, rule_outputs, validation_outputs, confidence
        )
        
        # LLM integration for deeper validation
        llm_data = {}
        if self.llm_client:
            prompt = SafetyPromptBuilder.build_prompt(state, rule_outputs)
            try:
                response_text = self._call_llm(prompt)
                clean_text = self._extract_text(response_text).replace("```json", "").replace("```", "").strip()
                llm_data = json.loads(clean_text)
                logger.info("Successfully retrieved validation from Groq.")
            except Exception as e:
                logger.warning(f"Groq LLM safety validation failed, falling back to deterministic logs: {e}")
                
        final_reasoning = llm_data.get("reasoning", reasoning)
        final_allowed = llm_data.get("allowed_actions", validation_outputs["allowed_actions"])
        final_blocked = llm_data.get("blocked_actions", validation_outputs["blocked_actions"])
            
        return SafetyOutput(
            safety_status=rule_outputs["safety_status"],
            violations=rule_outputs["violations"],
            risk_level=rule_outputs["risk_level"],
            allowed_actions=final_allowed,
            blocked_actions=final_blocked,
            emergency_flag=rule_outputs["emergency_flag"],
            recommendations=rule_outputs["recommendations"],
            confidence=confidence,
            reasoning=final_reasoning
        )

    def _call_llm(self, prompt: str):
        if hasattr(self.llm_client, "generate"):
            return self.llm_client.generate(system=prompt, user="Proceed.")

        if hasattr(self.llm_client, "invoke"):
            try:
                return self.llm_client.invoke({"system": prompt, "user": "Proceed."})
            except TypeError:
                return self.llm_client.invoke(prompt)

        raise AttributeError("LLM client must expose generate() or invoke()")

    @staticmethod
    def _extract_text(response) -> str:
        if hasattr(response, "content"):
            return response.content
        if isinstance(response, str):
            return response
        return str(response)
