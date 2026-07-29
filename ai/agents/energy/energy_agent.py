"""
Energy Agent Core Orchestrator Module.
"""

import time
import asyncio
import logging
from typing import Dict, Any, Union

from .schemas import EnergyInput, EnergyRecommendation, EnergyAgentResponse, EnergyOutput
from .llm import EnergyLLMInvoker
from .metrics import EnergyMetrics

logger = logging.getLogger("voltix.ai.agents.energy")


class EnergyAgent:
    """
    Production-Ready Energy Agent for Voltix.
    Optimizes commercial building energy consumption, peak demand shaving, battery dispatch, and solar utilization.
    """

    def __init__(self, llm_client=None, model_name: str = "llama-3.3-70b-versatile"):
        self.llm_invoker = EnergyLLMInvoker(model_name=model_name)
        self.metrics_collector = EnergyMetrics()

    async def process_async(self, input_payload: Union[Dict[str, Any], EnergyInput]) -> EnergyAgentResponse:
        """
        Main asynchronous execution pipeline for Energy Agent.
        """
        start_time = time.perf_counter()
        logger.info("EnergyAgent: Input payload received for optimization pipeline.")

        # 1. Validation Phase
        try:
            if isinstance(input_payload, dict):
                input_data = EnergyInput.model_validate(input_payload)
            elif isinstance(input_payload, EnergyInput):
                input_data = input_payload
            else:
                raise ValueError(f"Invalid input type: {type(input_payload)}")
            
            logger.info("EnergyAgent: Input validation passed successfully.")
        except Exception as validation_error:
            logger.error(f"EnergyAgent: Input validation failed: {validation_error}", exc_info=True)
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
            logger.info(f"EnergyAgent: Pipeline execution finished in {elapsed:.4f}s with status '{status_str}'.")

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

            response = EnergyAgentResponse(
                agent="EnergyAgent",
                status=status_str,
                recommendation=recommendation,
                confidence=recommendation.confidence,
                reasoning=recommendation.reasoning,
                metrics=metrics_summary
            )
            return response

        except Exception as exec_error:
            elapsed = time.perf_counter() - start_time
            logger.error(f"EnergyAgent: Execution pipeline encountered an unhandled exception: {exec_error}", exc_info=True)
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
        Updates raw_state dictionary with energy metrics and recommendation payload.
        """
        logger.info("EnergyAgent: Synchronous process wrapper invoked.")
        try:
            # Check if running within active asyncio loop
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = None

            if loop and loop.is_running():
                # Avoid deadlock if event loop is already running
                import nest_asyncio
                nest_asyncio.apply()
                agent_response = loop.run_until_complete(self.process_async(raw_state))
            else:
                agent_response = asyncio.run(self.process_async(raw_state))

            rec_dict = agent_response.recommendation.model_dump(mode="json")
            
            # Populate legacy and new fields in raw_state
            raw_state["energy_metrics"] = rec_dict
            raw_state["energy_agent_response"] = agent_response.model_dump(mode="json")
            raw_state["status"] = agent_response.status
            return raw_state

        except Exception as e:
            logger.error(f"EnergyAgent sync wrapper execution failed: {e}", exc_info=True)
            # Ensure safe fallback state mutation
            output = EnergyOutput(
                shedding_recommended=True if raw_state.get("hvac_consumption", 0.0) > raw_state.get("peak_demand", 100.0) else False,
                target_kw_reduction=20.0,
                reasoning=f"Fallback execution due to error: {str(e)}"
            )
            raw_state["energy_metrics"] = output.model_dump(mode="json")
            raw_state["errors"] = raw_state.get("errors", []) + [f"Energy Agent error: {str(e)}"]
            return raw_state
