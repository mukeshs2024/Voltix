"""
1. Purpose: Strict data contracts for Occupancy Agent inputs and outputs.
2. Responsibilities: Enforce Pydantic validation across the entire agent lifecycle.
3. Folder location: ai/agents/occupancy/
"""

from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, model_validator
from .occupancy_constants import (
    ActivityLevel,
    UtilizationStatus,
    TrendDirection,
    AnomalySeverity,
)


class SensorData(BaseModel):
    sensor_id: str
    sensor_type: Literal["PIR", "TOF", "CO2", "ACS", "WIFI", "ALARM"]
    value: float
    timestamp: datetime
    is_active: bool = True


class ZoneTopology(BaseModel):
    zone_id: str
    name: str
    capacity: int = Field(..., gt=0)
    sq_ft: float = Field(..., gt=0)


class CalendarEvent(BaseModel):
    event_id: str
    expected_attendees: int = Field(default=0, ge=0)
    start_time: datetime
    end_time: datetime

    @model_validator(mode="after")
    def check_time_order(self) -> "CalendarEvent":
        if self.start_time > self.end_time:
            raise ValueError("start_time cannot be after end_time")
        return self


class OccupancyAnomaly(BaseModel):
    type: str
    severity: AnomalySeverity
    description: str
    recommendation: str


class OccupancyPredictionModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    min_15: int = Field(..., alias="15_min", ge=0)
    min_30: int = Field(..., alias="30_min", ge=0)
    min_60: int = Field(..., alias="60_min", ge=0)


class OccupancyOutput(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    zone_id: str
    timestamp: datetime
    current_occupancy: int = Field(..., ge=0)
    capacity: int = Field(..., gt=0)
    occupancy_percentage: float = Field(..., ge=0.0)
    activity_level: ActivityLevel
    utilization: UtilizationStatus
    trend: TrendDirection
    prediction: OccupancyPredictionModel
    anomalies: List[OccupancyAnomaly] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    recommendations: List[str] = Field(default_factory=list)


class SharedState(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    zone: ZoneTopology
    sensors: List[SensorData]
    calendar: List[CalendarEvent] = Field(default_factory=list)
    occupancy_metrics: Optional[OccupancyOutput] = None
    errors: List[str] = Field(default_factory=list)
