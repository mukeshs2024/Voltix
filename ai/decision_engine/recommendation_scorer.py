"""
1. Objective: Score each recommendation based on confidence, severity, and business rules.
2. Folder location: ai/decision_engine/
3. Responsibilities: Assign weight to recommendations.
"""

class RecommendationScorer:
    @staticmethod
    def score_actions(proposed_actions: list) -> dict:
        """
        Returns a dictionary mapping Agent Name -> Score (0.0 to 10.0)
        """
        scores = {}
        for action in proposed_actions:
            for agent_name, metrics in action.items():
                score = 5.0 # Base score
                
                confidence = metrics.get("confidence_score", metrics.get("confidence", 0.5))
                score += (confidence * 2.0)
                
                # Check for critical anomalies
                if metrics.get("anomalies_detected", False) or metrics.get("critical", False):
                    score += 3.0
                    
                # Specific agent biases based on PriorityMatrix could be applied here
                if agent_name == "SafetyAgent":
                    if metrics.get("anomalies_detected", False):
                        score = 10.0 # Max out safety
                        
                scores[agent_name] = min(10.0, score)
                
        return scores
