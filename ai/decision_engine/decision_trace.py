"""
1. Objective: Record the full reasoning path.
2. Folder location: ai/decision_engine/
3. Responsibilities: Maintain chronological trace of validation, scoring, conflict resolution.
"""
from typing import List
from datetime import datetime, timezone
from .decision_schema import TraceStep

class DecisionTrace:
    def __init__(self):
        self.steps = []
        
    def add_step(self, step_name: str, action: str):
        now = datetime.now(timezone.utc).isoformat()
        self.steps.append(TraceStep(step_name=step_name, action=action, timestamp=now))
        
    def get_trace(self) -> List[TraceStep]:
        return self.steps
