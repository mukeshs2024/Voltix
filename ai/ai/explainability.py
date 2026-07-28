from ai.state import AgentState
from typing import Any, Dict
import json

class ExplainabilityEngine:
    """
    Translates the final LangGraph state into a human-readable audit trace.
    This ensures all AI decisions are transparent and explainable.
    """
    
    def generate_trace(self, final_state: AgentState) -> Dict[str, Any]:
        """
        Parses the state and outputs a structured explanation trace.
        """
        proposals = final_state.get("proposed_actions", [])
        history = final_state.get("negotiation_history", [])
        
        trace = {
            "summary": "AI Decision Cycle Completed.",
            "total_agents_involved": len(proposals),
            "conflicts_detected": len(history),
            "agent_rationales": []
        }
        
        for p in proposals:
            for agent_name, details in p.items():
                reasoning = details.get("reasoning", "No reasoning provided.")
                trace["agent_rationales"].append({
                    "agent": agent_name,
                    "action_summary": details,
                    "rationale": reasoning
                })
                
        if history:
            trace["negotiation_timeline"] = history
            
        return trace
