from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class EquipmentBase(BaseModel):
    name: str
    model_number: Optional[str] = None
    manufacturer: Optional[str] = None
    installation_date: Optional[datetime] = None
    status: str = "operational"

class EquipmentCreate(EquipmentBase):
    building_id: UUID

class EquipmentResponse(EquipmentBase):
    id: UUID
    building_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MaintenanceBase(BaseModel):
    title: str
    description: Optional[str] = None
    maintenance_type: str = "preventive"
    scheduled_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    technician: Optional[str] = None
    cost: Optional[float] = 0.0
    status: str = "scheduled"

class MaintenanceCreate(MaintenanceBase):
    equipment_id: UUID

class MaintenanceResponse(MaintenanceBase):
    id: UUID
    equipment_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
