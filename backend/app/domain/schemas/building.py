from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class BuildingBase(BaseModel):
    name: str
    location: Optional[str] = None
    address: Optional[str] = None
    total_floors: int = 1
    square_feet: float = 10000.0
    health_score: float = 95.0

class BuildingCreate(BuildingBase):
    organization_id: Optional[UUID] = None

class BuildingUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    total_floors: Optional[int] = None
    square_feet: Optional[float] = None
    health_score: Optional[float] = None

class BuildingResponse(BuildingBase):
    id: UUID
    organization_id: Optional[UUID] = None
    health_score: float = 95.0
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BuildingHealthResponse(BaseModel):
    building_id: UUID
    building_name: str
    health_score: float
    status: str
    active_alerts: int
    sensor_health_avg: float
    energy_efficiency_score: float
