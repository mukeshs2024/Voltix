"""
1. Objective: Core engine for multi-agent coordination.
2. Folder location: ai/decision_engine/
3. Responsibilities: Orchestrate conflict detection, negotiation, recommendation, and explanation.
"""
from typing import Dict, Any
from .decision_schema import DecisionSchema
from .conflict_detector import ConflictDetector
from .negotiator import Negotiator
from .recommendation_builder import RecommendationBuilder
from .explainability import ExplainabilityEngine

class ConsensusEngine:
    @staticmethod
    def evaluate(agent_outputs: Dict[str, Any]) -> DecisionSchema:
        """
        Takes raw dictionaries from all agents and produces the final DecisionSchema.
        """
        # 1. Conflict Detection
        conflicts = ConflictDetector.detect(agent_outputs)
        
        # 2. Negotiation
        winning_agents, overridden_agents = Negotiator.resolve(conflicts, agent_outputs)
        
        # Add unchallenged agents to winning_agents
        for agent_name in agent_outputs.keys():
            if agent_name not in winning_agents and agent_name not in overridden_agents:
                winning_agents.append(agent_name)
            
        # 3. Base Decision String
        if "Safety" in winning_agents:
            decision_text = "Trigger Emergency Protocols."
        elif "Thermal" in winning_agents:
            decision_text = "Increase cooling by 10%."
        elif "Occupancy" in winning_agents:
            decision_text = "Maintain operations; monitor occupancy."
        else:
            decision_text = "Maintain baseline operations."
            
        # 4. Recommendation Builder
        recommendations = RecommendationBuilder.build(winning_agents, overridden_agents, agent_outputs)
        
        # 5. Calculate overall confidence
        conf_scores = [agent_outputs.get(a, {}).get("confidence", 0.9) for a in winning_agents]
        confidence = sum(conf_scores) / len(conf_scores) if conf_scores else 0.9
        
        # 6. Explainability
        reasoning = ExplainabilityEngine.explain(
            decision=decision_text,
            winning_agents=winning_agents,
            overridden_agents=overridden_agents,
            conflicts=conflicts,
            agent_outputs=agent_outputs
        )
        
        return DecisionSchema(
            building_status="NORMAL" if "Safety" not in winning_agents else "CRITICAL",
            decision=decision_text,
            confidence=round(confidence, 2),
            winning_agents=winning_agents,
            overridden_agents=overridden_agents,
            conflicts=conflicts,
            recommendations=recommendations,
            reasoning=reasoning
        )
