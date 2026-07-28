"""
1. Objective: Provide Decision Health Metrics.
2. Folder location: ai/decision_engine/
3. Responsibilities: Measure execution latency, quality score, confidence.
"""
from .decision_schema import DecisionHealthMetrics

class HealthMetricsCalculator:
    @staticmethod
    def calculate(latency_ms: float, winning_confidence: float, agent_count: int, validation_status: str, conflicts: int) -> DecisionHealthMetrics:
        """
        Calculates the overall health of this decision cycle.
        """
        # Quality drops if there are conflicts or validation warnings
        quality_score = 100.0
        if "WARNING" in validation_status:
            quality_score -= 20.0
        if conflicts > 0:
            quality_score -= (conflicts * 5.0)
            
        quality_score = max(0.0, min(100.0, quality_score))
        
        return DecisionHealthMetrics(
            overall_confidence=winning_confidence,
            decision_quality_score=quality_score,
            participating_agents=agent_count,
            execution_latency_ms=latency_ms,
            validation_status=validation_status
        )
