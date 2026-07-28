"""
1. Objective: Deliberately break things to ensure the system recovers gracefully.
2. Folder location: ai/simulation/
3. Responsibilities: Inject faults into payloads before they hit the agent pipeline.
"""
from typing import Dict, Any
import copy

class FailureInjector:
    @staticmethod
    def corrupt_state(state: Dict[str, Any], failure_type: str) -> Any:
        """
        Takes a clean SharedState dict and deliberately corrupts it based on failure_type.
        """
        bad_state = copy.deepcopy(state)
        
        if failure_type == "MISSING_OCCUPANCY_DATA":
            bad_state["sensors"] = [s for s in bad_state["sensors"] if s["sensor_type"] not in ["PIR", "ACS"]]
            
        elif failure_type == "INVALID_TEMPERATURE":
            bad_state["sensors"].append({"sensor_id": "temp1", "sensor_type": "TEMP", "value": "N/A", "timestamp": "now", "is_active": True})
            
        elif failure_type == "CORRUPTED_JSON":
            # Just return a garbage string instead of a dict
            return "GARBAGE_DATA_{'zone': }]"
            
        elif failure_type == "EMPTY_STATE":
            return {}
            
        return bad_state
