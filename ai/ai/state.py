from typing import TypedDict, Annotated, Sequence, Any, Optional
from pydantic import BaseModel, Field
import operator

class DigitalTwinState(BaseModel):
    """
    Representation of the current state of the building/grid from the digital twin.
    """
    occupancy_metrics: dict[str, Any] = Field(default_factory=dict)
    thermal_metrics: dict[str, Any] = Field(default_factory=dict)
    energy_metrics: dict[str, Any] = Field(default_factory=dict)
    equipment_status: dict[str, Any] = Field(default_factory=dict)
    grid_signals: dict[str, Any] = Field(default_factory=dict)

class AgentState(TypedDict):
    """
    The shared state for the LangGraph orchestrator.
    """
    messages: Annotated[Sequence[Any], operator.add]
    twin_state: DigitalTwinState
    active_agent: Optional[str]
    negotiation_history: list[dict[str, Any]]
    consensus_reached: bool
    proposed_actions: list[dict[str, Any]]
