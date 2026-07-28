from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class AlertBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str = "medium" # critical, high, medium, low
    source_agent: Optional[str] = "HVAC_Agent"

class AlertCreate(AlertBase):
    building_id: Optional[UUID] = None
    sensor_id: Optional[UUID] = None
    assigned_to_user_id: Optional[UUID] = None

class AlertUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None # open, acknowledged, resolved
    assigned_to_user_id: Optional[UUID] = None

class AlertResolve(BaseModel):
    notes: Optional[str] = None

class AlertAssign(BaseModel):
    user_id: UUID
    notes: Optional[str] = None

class AlertResponse(AlertBase):
    id: UUID
    building_id: Optional[UUID] = None
    sensor_id: Optional[UUID] = None
    status: str
    assigned_to_user_id: Optional[UUID] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AlertHistoryResponse(BaseModel):
    id: UUID
    alert_id: UUID
    action: str
    performed_by_user_id: Optional[UUID] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
