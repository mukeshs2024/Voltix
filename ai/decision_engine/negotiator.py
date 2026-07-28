"""
1. Objective: Resolve conflicts between agents using weighted logic.
2. Folder location: ai/decision_engine/
3. Responsibilities: Determine which agent wins a conflict based on priority and confidence.
"""
from typing import Dict, Any, List, Tuple
from .priority_matrix import PriorityMatrix
from .decision_schema import ConflictSchema

class Negotiator:
    @staticmethod
    def resolve(conflicts: List[ConflictSchema], agent_outputs: Dict[str, Any]) -> Tuple[List[str], List[str]]:
        """
        Resolves conflicts by determining winning and overridden agents.
        Returns: (winning_agents, overridden_agents)
        """
        winners = set()
        overridden = set()
        
        for conflict in conflicts:
            contenders = []
            for agent in conflict.agents:
                priority = PriorityMatrix.get_priority(agent)
                # Assume default confidence of 0.8 for stubs if not provided
                confidence = agent_outputs.get(agent, {}).get("confidence", 0.8)
                contenders.append({"name": agent, "priority": priority, "confidence": confidence})
            
            # Sort by priority descending
            contenders.sort(key=lambda x: x["priority"], reverse=True)
            
            if not contenders:
                continue
                
            primary = contenders[0]
            winner = primary["name"]
            
            # Low confidence override logic (Step 4)
            if primary["confidence"] < 0.5:
                for secondary in contenders[1:]:
                    if secondary["confidence"] > 0.9:
                        winner = secondary["name"]
                        break
                        
            winners.add(winner)
            for contender in contenders:
                if contender["name"] != winner:
                    overridden.add(contender["name"])
                    
        return list(winners), list(overridden)
