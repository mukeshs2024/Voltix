from pydantic import BaseModel, Field
from typing import List

class SafetyState(BaseModel):
    active_alarms: List[str] = Field(default_factory=list)
    occupancy_critical: bool = Field(default=False)

class SafetyOutput(BaseModel):
    emergency_protocol_active: bool = Field(..., description="Trigger for building evacuation/lockdown")
    reasoning: str = Field(..., description="Explanation of safety decision")
