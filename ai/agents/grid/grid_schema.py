"""
1. Purpose: Strict data contracts for Grid Agent inputs and outputs.
2. Responsibilities: Enforce Pydantic validation across the entire agent lifecycle.
3. Folder location: ai/agents/grid/
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from .grid_constants import (
    PricingTier,
    BatteryStrategy,
    CarbonLevel,
    GridStatus,
)


class GridPredictionModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    next_hour_price: float = Field(..., ge=0.0)
    next_hour_carbon: float = Field(..., ge=0.0)


class GridOutput(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    timestamp: datetime
    pricing_tier: PricingTier
    battery_strategy: BatteryStrategy
    recommended_loads: List[str] = Field(default_factory=list)
    delayable_loads: List[str] = Field(default_factory=list)
    critical_loads: List[str] = Field(default_factory=list)
    carbon_level: CarbonLevel
    grid_status: GridStatus
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    recommendations: List[str] = Field(default_factory=list)
    predictions: GridPredictionModel


class GridInputState(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    current_building_load_kw: float
    current_grid_price: float
    demand_response_event: bool
    weather_forecast: str
    outdoor_temperature: float
    solar_generation_kw: float
    battery_soc: float = Field(..., ge=0.0, le=100.0)
    grid_carbon_intensity: float
    historical_price_trend: str
    historical_load_trend: str
    current_time: datetime
    peak_pricing_schedule: str
    grid_metrics: Optional['GridOutput'] = None
    errors: List[str] = Field(default_factory=list)
