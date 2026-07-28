"""
1. Objective: The Master Orchestrator for the AI Decision layer.
2. Folder location: ai/decision_engine/
3. Responsibilities: Pipeline management of validation, scoring, conflict detection, resolution, merging.
"""
import time
from .decision_schema import DecisionPackage, ConflictSchema
from .decision_validator import DecisionValidator
from .recommendation_scorer import RecommendationScorer
from .conflict_detector import ConflictDetector
from .decision_merger import DecisionMerger
from .decision_trace import DecisionTrace
from .health_metrics import HealthMetricsCalculator
from .priority_matrix import PriorityMatrix
from .negotiator import Negotiator
from .explainability import ExplainabilityEngine

class Orchestrator:
    def __init__(self):
        self.conflict_detector = ConflictDetector()
        self.explainability = ExplainabilityEngine()
        
    def process(self, state: dict) -> DecisionPackage:
        start_time = time.time()
        trace = DecisionTrace()
        trace.add_step("ORCHESTRATOR_START", "Initialized decision pipeline")
        
        proposed_actions = state.get("proposed_actions", [])
        
        # 1. Validation
        valid_actions, val_status = DecisionValidator.validate_agent_outputs(proposed_actions)
        trace.add_step("VALIDATION", f"Validation completed: {val_status}")
        
        # 2. Scoring
        scores = RecommendationScorer.score_actions(valid_actions)
        trace.add_step("SCORING", f"Assigned scores to {len(scores)} agents")
        
        # 3. Convert valid_actions list back to the dictionary structure Negotiator/ConflictDetector expects
        agent_outputs_dict = {}
        for action in valid_actions:
            for k, v in action.items():
                agent_outputs_dict[k] = v
                
        # 4. Conflict Detection
        conflicts = self.conflict_detector.detect(agent_outputs_dict)
        trace.add_step("CONFLICT_DETECTION", f"Detected {len(conflicts)} conflicts")
        
        # 5. Priority Resolution via Negotiator
                
        winning_agents, overridden_agents = Negotiator.resolve(conflicts, agent_outputs_dict)
        
        # Add unchallenged agents
        for agent_name in agent_outputs_dict.keys():
            if agent_name not in winning_agents and agent_name not in overridden_agents:
                winning_agents.append(agent_name)
        
        # Pull winning confidence
        winning_confidence = 0.0
        if winning_agents:
            top_agent = winning_agents[0]
            for a in valid_actions:
                if top_agent in a:
                    winning_confidence = a[top_agent].get("confidence_score", 0.5)
                    break
        
        trace.add_step("CONSENSUS_RESOLUTION", f"Resolved conflicts. Winners: {winning_agents}")
        
        # 5. Decision Merging
        final_recs = DecisionMerger.merge(winning_agents, valid_actions)
        trace.add_step("DECISION_MERGE", f"Merged {len(final_recs)} recommendations")
        
        # Build decision string early for the explainer
        decision_str = "Monitor Building"
        
        # 6. Explainability
        reasoning = self.explainability.explain(
            decision=decision_str,
            winning_agents=winning_agents,
            overridden_agents=overridden_agents,
            conflicts=conflicts,
            agent_outputs=agent_outputs_dict
        )
        trace.add_step("EXPLAINABILITY", "Generated explanation")
        
        # 7. Final Output & Health Metrics
        latency = (time.time() - start_time) * 1000
        health = HealthMetricsCalculator.calculate(
            latency_ms=latency,
            winning_confidence=winning_confidence,
            agent_count=len(valid_actions),
            validation_status=val_status,
            conflicts=len(conflicts)
        )
        
        conflict_schemas = [ConflictSchema(category=c["category"], agents=c["agents"]) for c in conflicts]
        
        if "Emergency" in reasoning:
            decision_str = "Trigger Emergency Protocols"
        elif "HVAC" in reasoning:
            decision_str = "Adjust HVAC Operations"
            
        pkg = DecisionPackage(
            building_status="EMERGENCY" if "Emergency" in decision_str else "NORMAL",
            decision=decision_str,
            confidence=winning_confidence,
            winning_agents=winning_agents,
            overridden_agents=overridden_agents,
            conflicts=conflict_schemas,
            recommendations=final_recs,
            reasoning=reasoning,
            trace=trace.get_trace(),
            health_metrics=health
        )
        
        return pkg
