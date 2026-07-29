"""
Equipment Health Agent Core Orchestrator Module.
"""

import time
import asyncio
import logging
from typing import Dict, Any, Union

from .schemas import EquipmentInput, EquipmentRecommendation, EquipmentAgentResponse, EquipmentOutput
from .llm import EquipmentLLMInvoker
from .metrics import EquipmentMetrics

logger = logging.getLogger("voltix.ai.agents.equipment")


class EquipmentAgent:
    """
    Production-Ready Equipment Health Agent for Voltix.
    Predicts equipment degradation, remaining useful life (RUL), anomaly detection, and maintenance procedures.
    """

    def __init__(self, llm_client=None, model_name: str = "llama-3.3-70b-versatile"):
        self.llm_invoker = EquipmentLLMInvoker(model_name=model_name)
        self.metrics_collector = EquipmentMetrics()

    async def process_async(self, input_payload: Union[Dict[str, Any], EquipmentInput]) -> EquipmentAgentResponse:
        """
        Main asynchronous execution pipeline for Equipment Health Agent.
        """
        start_time = time.perf_counter()
        logger.info("EquipmentAgent: Input payload received for health evaluation pipeline.")

        # 1. Validation Phase
        try:
            if isinstance(input_payload, dict):
                input_data = EquipmentInput.model_validate(input_payload)
            elif isinstance(input_payload, EquipmentInput):
                input_data = input_payload
            else:
                raise ValueError(f"Invalid input type: {type(input_payload)}")

            logger.info("EquipmentAgent: Input validation passed successfully.")
        except Exception as validation_error:
            logger.error(f"EquipmentAgent: Input validation failed: {validation_error}", exc_info=True)
            elapsed = time.perf_counter() - start_time
            self.metrics_collector.record_execution(
                latency=elapsed,
                success=False,
                fallback=True,
                confidence=0.0
            )
            raise validation_error

        # 2. LLM Invocation / Deterministic Execution Phase
        try:
            recommendation, is_fallback, retries, tokens = await self.llm_invoker.generate_recommendation(input_data)
            elapsed = time.perf_counter() - start_time

            status_str = "fallback" if is_fallback else "success"
            logger.info(f"EquipmentAgent: Pipeline execution finished in {elapsed:.4f}s with status '{status_str}'.")

            # Record Observability Metrics
            self.metrics_collector.record_execution(
                latency=elapsed,
                success=True,
                fallback=is_fallback,
                confidence=recommendation.confidence,
                retries=retries,
                tokens=tokens
            )

            metrics_summary = self.metrics_collector.to_dict()

            response = EquipmentAgentResponse(
                agent="EquipmentAgent",
                status=status_str,
                recommendation=recommendation,
                confidence=recommendation.confidence,
                reasoning=recommendation.reasoning,
                metrics=metrics_summary
            )
            return response

        except Exception as exec_error:
            elapsed = time.perf_counter() - start_time
            logger.error(f"EquipmentAgent: Execution pipeline encountered an unhandled exception: {exec_error}", exc_info=True)
            self.metrics_collector.record_execution(
                latency=elapsed,
                success=False,
                fallback=True,
                confidence=0.0
            )
            raise exec_error

    def process(self, raw_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Synchronous wrapper pipeline for LangGraph & backward compatibility.
        Updates raw_state dictionary with equipment metrics and recommendation payload.
        """
        logger.info("EquipmentAgent: Synchronous process wrapper invoked.")
        try:
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = None

            if loop and loop.is_running():
                import nest_asyncio
                nest_asyncio.apply()
                agent_response = loop.run_until_complete(self.process_async(raw_state))
            else:
                agent_response = asyncio.run(self.process_async(raw_state))

            rec_dict = agent_response.recommendation.model_dump(mode="json")

            raw_state["equipment_metrics"] = rec_dict
            raw_state["equipment_agent_response"] = agent_response.model_dump(mode="json")
            raw_state["status"] = agent_response.status
            return raw_state

        except Exception as e:
            logger.error(f"EquipmentAgent sync wrapper execution failed: {e}", exc_info=True)
            output = EquipmentOutput(
                maintenance_required=True,
                predicted_failure_days=7,
                reasoning=f"Fallback execution due to error: {str(e)}"
            )
            raw_state["equipment_metrics"] = output.model_dump(mode="json")
            raw_state["errors"] = raw_state.get("errors", []) + [f"Equipment Agent error: {str(e)}"]
            return raw_state
