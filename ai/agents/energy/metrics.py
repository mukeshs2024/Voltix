"""
Observability and Telemetry Metrics Collector for Energy Agent.
"""

import time
from typing import Dict, Any
from dataclasses import dataclass, field


@dataclass
class EnergyMetrics:
    total_invocations: int = 0
    successful_invocations: int = 0
    failed_invocations: int = 0
    fallback_count: int = 0
    total_retries: int = 0
    total_latency_seconds: float = 0.0
    total_confidence_sum: float = 0.0
    total_tokens_consumed: int = 0

    def record_execution(
        self,
        latency: float,
        success: bool,
        fallback: bool = False,
        confidence: float = 1.0,
        retries: int = 0,
        tokens: int = 0
    ):
        self.total_invocations += 1
        self.total_latency_seconds += latency
        self.total_confidence_sum += confidence
        self.total_retries += retries
        self.total_tokens_consumed += tokens

        if fallback:
            self.fallback_count += 1
        
        if success:
            self.successful_invocations += 1
        else:
            self.failed_invocations += 1

    def to_dict(self) -> Dict[str, Any]:
        avg_latency = (
            self.total_latency_seconds / self.total_invocations
            if self.total_invocations > 0
            else 0.0
        )
        avg_confidence = (
            self.total_confidence_sum / self.total_invocations
            if self.total_invocations > 0
            else 0.0
        )
        success_rate = (
            (self.successful_invocations / self.total_invocations) * 100.0
            if self.total_invocations > 0
            else 0.0
        )

        return {
            "total_invocations": self.total_invocations,
            "successful_invocations": self.successful_invocations,
            "failed_invocations": self.failed_invocations,
            "fallback_count": self.fallback_count,
            "total_retries": self.total_retries,
            "success_rate_pct": round(success_rate, 2),
            "average_latency_seconds": round(avg_latency, 4),
            "average_confidence": round(avg_confidence, 4),
            "total_tokens_consumed": self.total_tokens_consumed
        }
