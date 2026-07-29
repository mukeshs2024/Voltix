"""
1. Purpose: Prediction engine for Grid Agent.
2. Responsibilities: Generate predictions for price and carbon.
3. Folder location: ai/agents/grid/
"""

from typing import Dict, Any
import json
import logging
from .grid_schema import GridInputState, GridPredictionModel
from .grid_constants import PricingTier

logger = logging.getLogger(__name__)

class GridPredictionEngine:
    def __init__(self, llm_client=None):
        self.llm_client = llm_client

    def predict(self, state: GridInputState) -> GridPredictionModel:
        """
        Uses the LLM client to forecast future grid metrics.
        """
        system_prompt = (
            "You are an expert grid forecaster. Given the current grid price and carbon intensity, "
            "predict the next hour price and carbon intensity. "
            "Output ONLY valid JSON matching this schema: "
            '{"next_hour_price": float, "next_hour_carbon": float}'
        )

        user_prompt = (
            f"Current Grid Price: {state.current_grid_price}\n"
            f"Current Carbon Intensity: {state.grid_carbon_intensity}\n"
            f"Historical Price Trend: {state.historical_price_trend}\n"
            f"Historical Load Trend: {state.historical_load_trend}\n"
            f"Demand Response Event: {state.demand_response_event}\n"
            f"Weather Forecast: {state.weather_forecast}\n"
        )

        try:
            response_text = self._call_llm(system_prompt, user_prompt)
            clean_text = self._extract_text(response_text).replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)

            return GridPredictionModel(
                next_hour_price=float(data.get("next_hour_price", state.current_grid_price * 1.05)),
                next_hour_carbon=float(data.get("next_hour_carbon", state.grid_carbon_intensity * 0.95))
            )
        except Exception as e:
            logger.warning(f"Prediction LLM failed, using fallback: {e}")
            return self._fallback_prediction(state)

    def _call_llm(self, system_prompt: str, user_prompt: str):
        if self.llm_client is None:
            raise RuntimeError("LLM client is not configured")

        if hasattr(self.llm_client, "generate"):
            return self.llm_client.generate(system=system_prompt, user=user_prompt)

        if hasattr(self.llm_client, "invoke"):
            try:
                return self.llm_client.invoke({"system": system_prompt, "user": user_prompt})
            except TypeError:
                return self.llm_client.invoke(user_prompt)

        raise AttributeError("LLM client must expose generate() or invoke()")

    @staticmethod
    def _extract_text(response) -> str:
        if hasattr(response, "content"):
            return response.content
        if isinstance(response, str):
            return response
        return str(response)

    def _fallback_prediction(self, state: GridInputState) -> GridPredictionModel:
        # Fallback deterministic logic if LLM is unavailable
        return GridPredictionModel(
            next_hour_price=state.current_grid_price * 1.05,
            next_hour_carbon=state.grid_carbon_intensity * 0.95
        )
