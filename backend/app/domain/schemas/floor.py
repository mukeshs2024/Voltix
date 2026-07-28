from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class FloorBase(BaseModel):
    floor_number: int
    name: str
    square_feet: Optional[float] = 2500.0

class FloorCreate(FloorBase):
    building_id: UUID

class FloorUpdate(BaseModel):
    floor_number: Optional[int] = None
    name: Optional[str] = None
    square_feet: Optional[float] = None

class FloorResponse(FloorBase):
    id: UUID
    building_id: UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
