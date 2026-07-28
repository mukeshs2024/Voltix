from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class AIAnalyzeRequest(BaseModel):
    building_id: str
    target_metric: Optional[str] = "energy"
    parameters: Optional[Dict[str, Any]] = None

class AIDecisionResponse(BaseModel):
    id: UUID
    simulation_id: str
    building_id: Optional[UUID] = None
    agent_name: Optional[str] = "SupervisorAgent"
    final_action: str
    confidence: float
    rationale: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AgentStatusResponse(BaseModel):
    agent_name: str
    role: str
    status: str # active, idle, processing, offline
    last_action: Optional[str] = None
    health: float = 100.0

class SupervisorLogResponse(BaseModel):
    id: UUID
    simulation_id: str
    supervisor_name: str
    decision: str
    override_applied: bool
    reasoning: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ConsensusLogResponse(BaseModel):
    id: UUID
    simulation_id: str
    proposal: str
    agreement_score: float
    status: str
    participant_agents: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
