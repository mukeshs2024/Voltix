from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class DeviceBase(BaseModel):
    name: str
    device_type: str = "Thermostat"
    status: str = "active"
    ip_address: Optional[str] = None
    serial_number: Optional[str] = None

class DeviceCreate(DeviceBase):
    zone_id: UUID

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    device_type: Optional[str] = None
    status: Optional[str] = None
    ip_address: Optional[str] = None
    serial_number: Optional[str] = None

class DeviceResponse(DeviceBase):
    id: UUID
    zone_id: UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
