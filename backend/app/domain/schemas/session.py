from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from backend.app.domain.schemas.simulation import AgentSimulationResponseUnion

class SimulationSessionDTO(BaseModel):
    session_id: str
    scenario_id: str
    scenario_name: str
    building_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    building_state: Dict[str, Any]
    agent_results: Dict[str, AgentSimulationResponseUnion]
    global_status: str = "completed"

class SimulationSessionListResponse(BaseModel):
    sessions: List[SimulationSessionDTO]
