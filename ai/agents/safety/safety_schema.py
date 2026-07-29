"""
1. Purpose: Strict data contracts for Safety Agent inputs and outputs.
2. Responsibilities: Enforce Pydantic validation across the entire agent lifecycle.
3. Folder location: ai/agents/safety/
"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from .safety_constants import SafetyStatus, RiskLevel


class SafetyInputState(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    occupancy: int = Field(..., ge=0)
    building_capacity: int = Field(..., gt=0)
    zone_temperature: float
    smoke_sensor: bool
    fire_alarm: bool
    co2_level: float = Field(..., ge=0.0)
    emergency_state: bool
    emergency_exit_blocked: bool = False
    hvac_status: str
    equipment_health: str
    grid_status: str
    current_building_recommendations: List[str] = Field(default_factory=list)
    safety_metrics: Optional['SafetyOutput'] = None
    errors: List[str] = Field(default_factory=list)


class SafetyOutput(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    safety_status: SafetyStatus
    violations: List[str] = Field(default_factory=list)
    risk_level: RiskLevel
    allowed_actions: List[str] = Field(default_factory=list)
    blocked_actions: List[str] = Field(default_factory=list)
    emergency_flag: bool
    recommendations: List[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
