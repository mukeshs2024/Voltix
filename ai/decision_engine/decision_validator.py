"""
1. Objective: Validate every agent output with Pydantic.
2. Folder location: ai/decision_engine/
3. Responsibilities: Reject invalid outputs and produce validation reports.
"""
from typing import Dict, Any, Tuple
import json

class DecisionValidator:
    @staticmethod
    def validate_agent_outputs(proposed_actions: list) -> Tuple[list, str]:
        """
        Validates incoming agent outputs.
        For now, simply ensures they are dictionaries and extracts them safely.
        In a full implementation, this would enforce strict per-agent Pydantic schemas.
        """
        valid_actions = []
        rejected = 0
        
        for action in proposed_actions:
            if not isinstance(action, dict):
                rejected += 1
                continue
                
            # Basic structural validation
            for agent_name, metrics in action.items():
                if isinstance(metrics, dict):
                    valid_actions.append(action)
                else:
                    rejected += 1
                    
        status = "SUCCESS" if rejected == 0 else f"WARNING: {rejected} outputs rejected"
        if len(valid_actions) == 0:
            status = "FAILED: All outputs invalid"
            
        return valid_actions, status
