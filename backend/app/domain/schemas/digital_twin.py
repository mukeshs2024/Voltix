import math
import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class DigitalTwinState(BaseModel):
    """
    Authoritative Digital Twin State Model for Voltix Building Engine.
    Deterministic, smooth-curve telemetry updates.
    """
    timestamp: float = Field(default_factory=time.time)
    outdoor_temperature: float = Field(default=28.5, description="Outdoor ambient temp (°C)")
    indoor_temperature: float = Field(default=22.5, description="Indoor climate temp (°C)")
    occupancy: int = Field(default=150, description="Building occupant headcount")
    solar: float = Field(default=120.0, description="Solar power generation (kW)")
    battery: float = Field(default=75.0, description="Energy Storage System state of charge (%)")
    hvac: float = Field(default=180.0, description="HVAC electrical power consumption (kW)")
    lighting: float = Field(default=45.0, description="Lighting electrical power consumption (kW)")
    grid_import: float = Field(default=225.0, description="Net grid import (kW)")
    building_load: float = Field(default=345.0, description="Total building load (kW)")
    electricity_price: float = Field(default=0.18, description="Electricity price ($/kWh)")


class ScenarioConfig(BaseModel):
    """
    Configuration model for deterministic simulation scenarios.
    """
    scenario_id: str
    scenario_name: str
    description: str
    duration_seconds: int = 3600
    base_occupancy: int = 150
    temp_peak: float = 34.0
    temp_base: float = 24.0
    solar_peak_kw: float = 250.0
    price_peak_dollars: float = 0.35
    price_base_dollars: float = 0.12


class SimulationControlMessage(BaseModel):
    """
    Control command model for REST and WebSocket engine controls.
    """
    action: str = Field(..., description="Action: start | pause | resume | reset | stop")
    scenario_id: Optional[str] = "morning_peak"
    speed_multiplier: float = 1.0
