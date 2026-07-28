"""
Phase 9: Observability and Metrics for the Occupancy Agent.
Implements telemetry tracking, execution time monitoring, and standardized logging
to ensure enterprise-grade visibility into the agent's performance.
"""

import time
import logging
from functools import wraps
from typing import Callable, Any

# Configure standard logger
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("Voltix.OccupancyAgent")


class AgentMetrics:
    """In-memory metrics store for tracking agent performance."""

    total_invocations: int = 0
    successful_invocations: int = 0
    fallback_invocations: int = 0
    total_execution_time_ms: float = 0.0
    total_tokens_used: int = 0  # To be populated by LLM client

    @classmethod
    def record_success(cls, exec_time_ms: float, tokens: int = 0):
        cls.total_invocations += 1
        cls.successful_invocations += 1
        cls.total_execution_time_ms += exec_time_ms
        cls.total_tokens_used += tokens

    @classmethod
    def record_fallback(cls, exec_time_ms: float):
        cls.total_invocations += 1
        cls.fallback_invocations += 1
        cls.total_execution_time_ms += exec_time_ms

    @classmethod
    def get_summary(cls) -> dict:
        avg_time = (
            (cls.total_execution_time_ms / cls.total_invocations)
            if cls.total_invocations
            else 0.0
        )
        return {
            "total_invocations": cls.total_invocations,
            "successful": cls.successful_invocations,
            "fallbacks": cls.fallback_invocations,
            "average_latency_ms": round(avg_time, 2),
            "total_tokens": cls.total_tokens_used,
        }


def track_execution(func: Callable) -> Callable:
    """
    Decorator to track execution time, handle retries, and log metrics
    for the main process pipeline.
    """

    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start_time = time.perf_counter()

        try:
            # Execute the actual pipeline
            result = func(*args, **kwargs)

            exec_time_ms = (time.perf_counter() - start_time) * 1000

            # Check if fallback was triggered by inspecting the result
            if isinstance(result, dict) and "errors" in result and result["errors"]:
                AgentMetrics.record_fallback(exec_time_ms)
                logger.warning(
                    f"Pipeline finished with fallback/errors in {exec_time_ms:.2f}ms."
                )
            else:
                AgentMetrics.record_success(exec_time_ms)
                logger.info(f"Pipeline completed successfully in {exec_time_ms:.2f}ms.")

            return result

        except Exception as e:
            exec_time_ms = (time.perf_counter() - start_time) * 1000
            AgentMetrics.record_fallback(exec_time_ms)
            logger.error(
                f"Pipeline suffered unhandled crash in {exec_time_ms:.2f}ms. Error: {e}",
                exc_info=True,
            )
            raise e

    return wrapper
