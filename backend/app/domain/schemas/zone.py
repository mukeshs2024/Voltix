from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ZoneBase(BaseModel):
    name: str
    zone_type: str = "HVAC"
    target_temp: Optional[float] = 22.0

class ZoneCreate(ZoneBase):
    floor_id: UUID

class ZoneUpdate(BaseModel):
    name: Optional[str] = None
    zone_type: Optional[str] = None
    target_temp: Optional[float] = None

class ZoneResponse(ZoneBase):
    id: UUID
    floor_id: UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
