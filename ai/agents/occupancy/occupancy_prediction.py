"""
1. Purpose: Prediction engine for 15, 30, and 60-minute occupancy horizons.
2. Responsibilities: Interface with Groq LLM to infer predictions based on current state and trends.
3. Folder location: ai/agents/occupancy/
"""
import json
from .occupancy_schema import SharedState, OccupancyPredictionModel
from .occupancy_constants import TrendDirection

class OccupancyPredictionEngine:
    def __init__(self, llm_client):
        self.llm_client = llm_client

    def predict(self, state: SharedState, current_occupancy: int, trend: TrendDirection) -> OccupancyPredictionModel:
        """
        Uses the LLM client to forecast future occupancy. 
        Predictions must never exceed capacity.
        """
        system_prompt = (
            "You are an expert occupancy forecaster. Given the current occupancy, trend, and capacity, "
            "predict the occupancy in 15, 30, and 60 minutes. Predictions must be integers and MUST NEVER "
            "exceed the provided capacity. "
            "Output ONLY valid JSON matching this schema: "
            "{\"15_min\": int, \"30_min\": int, \"60_min\": int}"
        )
        
        user_prompt = (
            f"Capacity: {state.zone.capacity}\n"
            f"Current Occupancy: {current_occupancy}\n"
            f"Current Trend: {trend.value}\n"
            f"Calendar Events: {len(state.calendar)}\n"
        )

        try:
            response_text = self.llm_client.generate(system=system_prompt, user=user_prompt)
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            return OccupancyPredictionModel(
                min_15=min(data.get("15_min", current_occupancy), state.zone.capacity),
                min_30=min(data.get("30_min", current_occupancy), state.zone.capacity),
                min_60=min(data.get("60_min", current_occupancy), state.zone.capacity)
            )
        except Exception:
            return self._fallback_prediction(current_occupancy, state.zone.capacity, trend)

    def _fallback_prediction(self, current_occupancy: int, capacity: int, trend: TrendDirection) -> OccupancyPredictionModel:
        if trend == TrendDirection.INCREASING:
            return OccupancyPredictionModel(
                min_15=min(current_occupancy + 1, capacity),
                min_30=min(current_occupancy + 2, capacity),
                min_60=min(current_occupancy + 3, capacity)
            )
        elif trend == TrendDirection.DECREASING:
            return OccupancyPredictionModel(
                min_15=max(current_occupancy - 1, 0),
                min_30=max(current_occupancy - 2, 0),
                min_60=max(current_occupancy - 3, 0)
            )
        return OccupancyPredictionModel(
            min_15=current_occupancy,
            min_30=current_occupancy,
            min_60=current_occupancy
        )
