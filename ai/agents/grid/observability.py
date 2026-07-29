"""
1. Purpose: Observability and Metrics for the Grid Agent.
2. Responsibilities: Track execution latency, fallback usage, and standardized logging.
3. Folder location: ai/agents/grid/
"""

import time
import logging
from functools import wraps
from typing import Callable, Any

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("Voltix.GridAgent")


class GridAgentMetrics:
    total_invocations: int = 0
    successful_invocations: int = 0
    fallback_invocations: int = 0
    total_execution_time_ms: float = 0.0
    total_tokens_used: int = 0
    llm_failures: int = 0

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
    def record_llm_failure(cls):
        cls.llm_failures += 1

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
            "llm_failures": cls.llm_failures,
        }


def track_execution(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start_time = time.perf_counter()
        try:
            result = func(*args, **kwargs)
            exec_time_ms = (time.perf_counter() - start_time) * 1000

            if isinstance(result, dict) and result.get("errors"):
                GridAgentMetrics.record_fallback(exec_time_ms)
                logger.warning(
                    f"Grid pipeline finished with fallback/errors in {exec_time_ms:.2f}ms."
                )
            else:
                GridAgentMetrics.record_success(exec_time_ms)
                logger.info(
                    f"Grid pipeline completed successfully in {exec_time_ms:.2f}ms."
                )
            return result
        except Exception as exc:
            exec_time_ms = (time.perf_counter() - start_time) * 1000
            GridAgentMetrics.record_fallback(exec_time_ms)
            logger.error(
                f"Grid pipeline suffered unhandled crash in {exec_time_ms:.2f}ms. Error: {exc}",
                exc_info=True,
            )
            raise exc

    return wrapper
