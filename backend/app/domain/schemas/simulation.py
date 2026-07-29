from datetime import datetime
from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field

# --- Shared Base Components ---
AgentIdType = Literal[
    "equipment", "safety", "grid", "hvac", "occupancy", 
    "carbon", "security", "lighting", "water", "energy"
]

class SimulationOperatorInput(BaseModel):
    scenario_id: str = Field(..., examples=["morning-rush"])
    scenario_name: str = Field(..., examples=["Morning Rush"])
    building_id: str = Field(..., examples=["BLD001"])
    agent_id: AgentIdType
    building_data: Dict[str, Any] = Field(default_factory=dict)
    telemetry: Dict[str, Any] = Field(default_factory=dict)
    overrides: Dict[str, Any] = Field(default_factory=dict)

class AgentWorkflowStep(BaseModel):
    label: str
    detail: str
    state: Literal["done", "active", "pending"]

class AgentDeveloperMetadata(BaseModel):
    agent_name: str
    source: str
    raw_ai_response: Dict[str, Any]
    mapped_dto: Dict[str, Any]
    execution_time_ms: int
    token_usage: int
    normalized_at: datetime

class AIDecisionBlock(BaseModel):
    summary: str
    priority: str
    severity: str
    expected_impact: str
    reason: str
    business_impact: str

class RecommendationCard(BaseModel):
    title: str
    description: str
    urgency: str

class TimelineEvent(BaseModel):
    time: str
    message: str
    is_active: bool

# --- Base Agent Response ---
class BaseAgentResponse(BaseModel):
    agent_id: AgentIdType
    agent_name: str
    purpose: str
    status: str
    last_execution: str
    scenario_id: str
    scenario_name: str
    execution_mode: str
    health_percentage: int
    
    input: SimulationOperatorInput
    workflow: List[AgentWorkflowStep]
    decision: AIDecisionBlock
    recommendations: List[RecommendationCard]
    timeline: List[TimelineEvent]
    developer_metadata: AgentDeveloperMetadata
    logs: List[str] = Field(default_factory=list)

# --- Specific Agent DTOs ---

class EquipmentAgentResponse(BaseAgentResponse):
    sensors: List[Dict[str, Any]] = Field(default_factory=list)
    analytics: Dict[str, Any] = Field(default_factory=dict)

class SafetyAgentResponse(BaseAgentResponse):
    sensors: List[Dict[str, Any]] = Field(default_factory=list)
    analytics: Dict[str, Any] = Field(default_factory=dict)
    hazards: List[Dict[str, Any]] = Field(default_factory=list)

class GridAgentResponse(BaseAgentResponse):
    sensors: List[Dict[str, Any]] = Field(default_factory=list)
    analytics: Dict[str, Any] = Field(default_factory=dict)

# Fallbacks for the rest (can be expanded later)
class HVACAgentResponse(BaseAgentResponse): pass
class OccupancyAgentResponse(BaseAgentResponse): pass
class CarbonAgentResponse(BaseAgentResponse): pass
class SecurityAgentResponse(BaseAgentResponse): pass
class LightingAgentResponse(BaseAgentResponse): pass
class WaterAgentResponse(BaseAgentResponse): pass
class EnergyAgentResponse(BaseAgentResponse): pass

AgentSimulationResponseUnion = Union[
    EquipmentAgentResponse,
    SafetyAgentResponse,
    GridAgentResponse,
    HVACAgentResponse,
    OccupancyAgentResponse,
    CarbonAgentResponse,
    SecurityAgentResponse,
    LightingAgentResponse,
    WaterAgentResponse,
    EnergyAgentResponse
]

# --- Existing Payload Models (for backward compatibility if needed) ---
class OccupancyPayload(BaseModel):
    people_count: int = Field(..., example=50)
    schedule: str = Field("meeting", example="meeting")

class ThermalPayload(BaseModel):
    temperature: float = Field(..., example=25.0)
    humidity: float = Field(..., example=60.0)

class EnergyPayload(BaseModel):
    price: str = Field("peak", example="peak")
    power_usage: float = Field(..., example=450.0)

class EquipmentPayload(BaseModel):
    chiller_health: float = Field(0.8, example=0.8)

class GridPayload(BaseModel):
    weather: str = Field("hot", example="hot")
    demand_response: bool = Field(True, example=True)

class SimulationRequest(BaseModel):
    building_id: str = Field(..., example="BLD001")
    zone_id: str = Field(..., example="zone_a")
    occupancy: OccupancyPayload
    thermal: ThermalPayload
    energy: EnergyPayload
    equipment: EquipmentPayload
    grid: GridPayload

# --- Existing Simulation DTOs ---

class DecisionPayload(BaseModel):
    action: str = Field(..., example="Adjust HVAC setpoint to 24°C and enable precooling")
    reason: str = Field(..., example="Optimizing thermal comfort against peak electricity pricing")
    confidence: float = Field(0.92, example=0.92)

class ImpactPayload(BaseModel):
    energy: str = "neutral"
    comfort: str = "neutral"
    cost: str = "neutral"
    risk: str = "low"

class AgentReport(BaseModel):
    agent: str = Field(..., example="OccupancyAgent")
    proposal: str = Field(..., example="Reduce HVAC in unused zone")
    impact: str = Field("energy: save 20%", example="energy: save 20%")
    reasoning: Optional[str] = None
    confidence: Optional[float] = 0.90

class NegotiationTraceItem(BaseModel):
    from_agent: str
    message_type: str
    content: str

class SimulationResponse(BaseModel):
    simulation_id: str
    status: str = "completed"
    decision: DecisionPayload
    agent_reports: List[AgentReport]
    negotiation_trace: List[NegotiationTraceItem] = Field(default_factory=list)
