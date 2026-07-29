"""
1. Purpose: Central facade for the Grid Intelligence Engine.
2. Responsibilities: Orchestrate rules, prediction, confidence, and explainability modules.
3. Folder location: ai/agents/grid/
"""

from datetime import datetime, timezone
import json
import logging
from .grid_schema import GridInputState, GridOutput
from .grid_rules import GridRulesEngine
from .grid_prediction import GridPredictionEngine
from .grid_confidence import GridConfidenceEngine
from .grid_explainer import GridExplainabilityEngine
from .grid_prompt import GridPromptBuilder

logger = logging.getLogger(__name__)

class GridIntelligenceFacade:
    def __init__(self, llm_client):
        self.llm_client = llm_client
        self.prediction_engine = GridPredictionEngine(llm_client)

    def process_state(self, state: GridInputState) -> GridOutput:
        # 1. Deterministic Rules
        rule_outputs = GridRulesEngine.evaluate(state)
        
        # 2. Confidence Calculation
        confidence = GridConfidenceEngine.calculate(state, rule_outputs)
        
        # 3. Explainability
        reasoning = GridExplainabilityEngine.generate_reasoning(state, rule_outputs, confidence)
        
        # 4. Predictions
        prediction = self.prediction_engine.predict(state)
        
        # LLM integration for reasoning and recommendations
        llm_data = {}
        if self.llm_client:
            prompt = GridPromptBuilder.build_prompt(state, rule_outputs)
            try:
                response_text = self._call_llm(prompt)
                clean_text = self._extract_text(response_text).replace("```json", "").replace("```", "").strip()
                llm_data = json.loads(clean_text)
                logger.info("Successfully retrieved reasoning from Groq.")
            except Exception as e:
                logger.warning(f"Groq LLM reasoning failed, falling back to deterministic logs: {e}")

        final_reasoning = llm_data.get("reasoning", reasoning)
        final_recommendations = rule_outputs["recommendations"]
        if "recommendations" in llm_data and isinstance(llm_data["recommendations"], list):
            final_recommendations.extend(llm_data["recommendations"])
        
        return GridOutput(
            timestamp=datetime.now(timezone.utc),
            pricing_tier=rule_outputs["pricing_tier"],
            battery_strategy=rule_outputs["battery_strategy"],
            recommended_loads=llm_data.get("recommended_loads", []),
            delayable_loads=llm_data.get("delayable_loads", []),
            critical_loads=llm_data.get("critical_loads", []),
            carbon_level=rule_outputs["carbon_level"],
            grid_status=rule_outputs["grid_status"],
            confidence=confidence,
            reasoning=final_reasoning,
            recommendations=list(set(final_recommendations)), # deduplicate
            predictions=prediction
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
