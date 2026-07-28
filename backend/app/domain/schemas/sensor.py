from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class SensorBase(BaseModel):
    sensor_type: str
    unit: str
    current_value: float = 0.0
    min_threshold: Optional[float] = None
    max_threshold: Optional[float] = None

class SensorCreate(SensorBase):
    device_id: UUID

class SensorUpdate(BaseModel):
    sensor_type: Optional[str] = None
    unit: Optional[str] = None
    current_value: Optional[float] = None
    min_threshold: Optional[float] = None
    max_threshold: Optional[float] = None

class SensorResponse(SensorBase):
    id: UUID
    device_id: UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SensorHealthResponse(BaseModel):
    id: UUID
    sensor_id: UUID
    health_status: str
    battery_level: Optional[float] = 100.0
    signal_strength: Optional[float] = 95.0
    last_ping: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
