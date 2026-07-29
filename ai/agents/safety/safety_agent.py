"""
1. Purpose: Core pipeline runner for the Safety Agent.
2. Responsibilities: Ingest state, trigger SafetyIntelligenceFacade, return validation.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any
import logging

from .safety_schema import SafetyInputState
from ai.agents.occupancy.observability import track_execution
from .safety_intelligence import SafetyIntelligenceFacade

logger = logging.getLogger(__name__)


class SafetyAgent:
    def __init__(self, llm_client=None):
        self.llm_client = llm_client
        self.intelligence_facade = SafetyIntelligenceFacade(llm_client)

    @track_execution
    def process(self, raw_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution pipeline integrating the Intelligence Engine.
        """
        logger.info("SafetyAgent: Starting intelligent validation pipeline.")

        try:
            state_model = SafetyInputState.model_validate(raw_state)

            # Defer complex reasoning to the Intelligence Engine
            safety_output = self.intelligence_facade.process_state(state_model)

            state_model.safety_metrics = safety_output

            logger.info(
                f"Safety pipeline completed. Status: {safety_output.safety_status.value}"
            )

            return state_model.model_dump(mode="json", by_alias=True)

        except Exception as e:
            logger.error(f"Intelligent pipeline failed: {e}")
            from .safety_fallback import SafetyFallbackEngine

            if not isinstance(raw_state, dict):
                raw_state = {"original_invalid_payload": str(raw_state)}
            return SafetyFallbackEngine.rescue_state(raw_state, str(e))
