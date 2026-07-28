from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


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
