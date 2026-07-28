"""
1. Objective: Define the fixed, configurable priorities for the multi-agent system.
2. Folder location: ai/decision_engine/
3. Responsibilities: Provide priority lookup for the Negotiator. Never hardcoded in the supervisor loop.
"""

# Fixed Priorities based on Step 3
AGENT_PRIORITIES = {
    "Safety": 100,
    "Equipment": 90,
    "Occupancy": 80,
    "Thermal": 70,
    "Grid": 60,
    "Energy": 50
}

class PriorityMatrix:
    @staticmethod
    def get_priority(agent_name: str) -> int:
        """
        Fetches the priority score for an agent.
        Defaults to 0 if the agent is unknown.
        """
        # Strip 'Agent' suffix if present for lookup
        clean_name = agent_name.replace("Agent", "")
        return AGENT_PRIORITIES.get(clean_name, 0)
