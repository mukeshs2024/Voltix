"""
1. Purpose: Core pipeline runner for the Grid Agent.
2. Responsibilities: Ingest state, trigger GridIntelligenceFacade, return recommendations.
3. Folder location: ai/agents/grid/
"""

from typing import Dict, Any
import logging

from .grid_schema import GridInputState
from ai.agents.occupancy.observability import track_execution
from .grid_intelligence import GridIntelligenceFacade

logger = logging.getLogger(__name__)


class GridAgent:
    def __init__(self, llm_client=None):
        self.llm_client = llm_client
        self.intelligence_facade = GridIntelligenceFacade(llm_client)

    @track_execution
    def process(self, raw_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution pipeline integrating the Intelligence Engine.
        """
        logger.info("GridAgent: Starting intelligent process pipeline.")

        try:
            state_model = GridInputState.model_validate(raw_state)

            # Defer complex reasoning to the Intelligence Engine
            grid_output = self.intelligence_facade.process_state(state_model)

            state_model.grid_metrics = grid_output

            logger.info(
                f"Grid pipeline completed. Status: {grid_output.grid_status.value}"
            )

            return state_model.model_dump(mode="json", by_alias=True)

        except Exception as e:
            logger.error(f"Intelligent pipeline failed: {e}")
            from .grid_fallback import GridFallbackEngine

            if not isinstance(raw_state, dict):
                raw_state = {"original_invalid_payload": str(raw_state)}
            return GridFallbackEngine.rescue_state(raw_state, str(e))
