"""
1. Objective: Define exact data schemas for the telemetry simulator.
2. Folder location: ai/simulation/
3. Responsibilities: Ensure output matches the requested nested Enterprise Telemetry format.
"""
from pydantic import BaseModel
from typing import Optional

class OccupancyTelemetry(BaseModel):
    current: int
    capacity: int
    entry_rate: int
    exit_rate: int
    motion_detected: bool

class EnvironmentTelemetry(BaseModel):
    temperature: float
    humidity: float
    co2: int
    light_level: int

class EquipmentTelemetry(BaseModel):
    ahu_status: str
    hvac_power_kw: float
    fan_speed: int

class EnergyTelemetry(BaseModel):
    building_power_kw: float
    grid_price: float

class EnterpriseTelemetry(BaseModel):
    timestamp: str
    zone_id: str
    occupancy: OccupancyTelemetry
    environment: EnvironmentTelemetry
    equipment: EquipmentTelemetry
    energy: EnergyTelemetry
