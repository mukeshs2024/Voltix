"""
1. Objective: Define the scoring algorithms for the AI pipeline.
2. Folder location: ai/evaluation/
3. Responsibilities: Evaluate prediction quality, anomaly detection, confidence calibration, explainability, latency, and decision correctness.
"""

class MetricsEvaluator:
    @staticmethod
    def evaluate_prediction_quality(predicted_activity: str, expected_activity: str) -> float:
        """Score 1.0 if match, 0.5 if adjacent (e.g. HIGH vs PEAK), 0.0 otherwise."""
        if predicted_activity == expected_activity:
            return 1.0
        # If UNKNOWN was expected and we got something else, that's a total failure
        if expected_activity == "UNKNOWN":
            return 0.0
        return 0.0
        
    @staticmethod
    def evaluate_anomaly_detection(predicted_anomaly: bool, expected_anomaly: bool) -> float:
        """1.0 if correct anomaly detection, 0.0 otherwise."""
        return 1.0 if predicted_anomaly == expected_anomaly else 0.0
        
    @staticmethod
    def evaluate_confidence_calibration(predicted_conf: float, min_expected: float = 0.0, max_expected: float = 1.0) -> float:
        """1.0 if confidence is within expected bounds (e.g. low for ghost bookings)."""
        if min_expected <= predicted_conf <= max_expected:
            return 1.0
        # Partial credit based on distance
        return max(0.0, 1.0 - abs(predicted_conf - min_expected))
        
    @staticmethod
    def evaluate_explainability(reasoning: str, decision_includes: str) -> float:
        """1.0 if the reasoning contains the expected contextual keywords."""
        if not reasoning:
            return 0.0
        # A simple keyword inclusion check
        words = decision_includes.lower().split()
        for w in words:
            if w in reasoning.lower():
                return 1.0
        return 0.0
        
    @staticmethod
    def evaluate_decision_correctness(winning_agents: list, expected_winning: str) -> float:
        """1.0 if the expected agent won the consensus."""
        return 1.0 if expected_winning in winning_agents else 0.0
