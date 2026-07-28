"""
1. Purpose: Core pipeline runner for the Occupancy Agent.
2. Responsibilities: Ingest SharedState, trigger IntelligenceFacade, return updated state.
3. Folder location: ai/agents/occupancy/
"""

from typing import Dict, Any
import logging

from .occupancy_schema import SharedState
from .observability import track_execution
from .occupancy_intelligence import OccupancyIntelligenceFacade

logger = logging.getLogger(__name__)


class OccupancyAgent:
    def __init__(self, llm_client=None):
        self.llm_client = llm_client
        self.intelligence_facade = OccupancyIntelligenceFacade(llm_client)

    @track_execution
    def process(self, raw_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution pipeline integrating the Intelligence Engine.
        """
        logger.info("OccupancyAgent: Starting intelligent process pipeline.")

        try:
            state_model = SharedState.model_validate(raw_state)

            # Defer complex reasoning to the Intelligence Engine
            occupancy_output = self.intelligence_facade.process_state(state_model)

            state_model.occupancy_metrics = occupancy_output
            logger.info(
                f"Intelligence pipeline completed. Activity: {occupancy_output.activity_level.value}"
            )

            return state_model.model_dump(mode="json", by_alias=True)

        except Exception as e:
            logger.error(f"Intelligent pipeline failed: {e}")
            from .fallback import FallbackEngine

            if not isinstance(raw_state, dict):
                raw_state = {"original_invalid_payload": str(raw_state)}
            return FallbackEngine.rescue_state(raw_state, str(e))
