from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ScenarioBase(BaseModel):
    name: str
    template_type: str # Morning Rush, Conference, Ghost Booking, Fire Drill, Holiday, HVAC Failure
    description: Optional[str] = None
    config_data: Optional[str] = None
    is_active: bool = True

class ScenarioCreate(ScenarioBase):
    pass

class ScenarioResponse(ScenarioBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RunScenarioRequest(BaseModel):
    scenario_id: Optional[UUID] = None
    template_type: Optional[str] = None
    building_id: Optional[UUID] = None
    duration_minutes: int = 30

class SimulationRunResponse(BaseModel):
    id: UUID
    scenario_id: Optional[UUID] = None
    building_id: Optional[UUID] = None
    status: str
    progress: float
    metrics_data: Optional[str] = None
    started_by_user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OptimizationHistoryResponse(BaseModel):
    id: UUID
    building_id: Optional[UUID] = None
    simulation_run_id: Optional[UUID] = None
    initial_energy_kwh: float
    optimized_energy_kwh: float
    energy_saved_pct: float
    recommendation: Optional[str] = None
    applied_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
