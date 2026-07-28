from pydantic import BaseModel, Field
from typing import List

class EquipmentState(BaseModel):
    equipment_id: str = Field(..., description="ID of the equipment")
    runtime_hours: int = Field(..., description="Total hours run")
    active_faults: List[str] = Field(default_factory=list)

class EquipmentOutput(BaseModel):
    maintenance_required: bool = Field(..., description="Flag for maintenance")
    predicted_failure_days: int = Field(..., description="Estimated days until failure")
    reasoning: str = Field(..., description="Explanation of equipment decision")
