"""
1. Objective: Merge compatible recommendations into a single action plan.
2. Folder location: ai/decision_engine/
3. Responsibilities: Unify non-conflicting actions.
"""

class DecisionMerger:
    @staticmethod
    def merge(winning_agents: list, proposed_actions: list) -> list:
        """
        Extracts and merges all recommendations from the winning agents.
        """
        final_recommendations = []
        for action in proposed_actions:
            for agent_name, metrics in action.items():
                if agent_name in winning_agents:
                    recs = metrics.get("recommendations", [])
                    if isinstance(recs, list):
                        final_recommendations.extend(recs)
                    elif isinstance(recs, str):
                        final_recommendations.append(recs)
                        
        # Deduplicate while preserving order
        seen = set()
        return [x for x in final_recommendations if not (x in seen or seen.add(x))]
