from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class TelemetryBase(BaseModel):
    building_id: str
    zone_id: str
    temperature: float
    humidity: float
    occupancy_count: int
    power_usage: float
    co2_level: Optional[float] = 400.0

class TelemetryCreate(TelemetryBase):
    sensor_id: Optional[UUID] = None

class TelemetryResponse(TelemetryBase):
    id: UUID
    sensor_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TelemetryFilter(BaseModel):
    building_id: Optional[str] = None
    zone_id: Optional[str] = None
    sensor_id: Optional[UUID] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    limit: int = 100
    skip: int = 0

class AggregatedTelemetry(BaseModel):
    avg_temperature: float
    avg_humidity: float
    total_occupancy: int
    total_power_usage: float
    avg_co2_level: float
    data_points_count: int
