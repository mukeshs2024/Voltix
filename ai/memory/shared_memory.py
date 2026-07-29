import asyncio
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class AgentRecommendation(BaseModel):
    """
    Standardized contract returned by every specialized AI Agent.
    """
    agent_name: str = Field(..., description="OccupancyAgent | ThermalAgent | EnergyAgent | EquipmentAgent | GridAgent")
    status: str = Field(default="OPTIMAL", description="OPTIMAL | WARNING | CRITICAL | SHIFT_DEMAND")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    reasoning: str = Field(..., description="Explainable rationale with specific metrics cited")
    recommendation: str = Field(..., description="Actionable recommendation proposal")
    priority: int = Field(default=5, ge=1, le=10, description="Priority rank (1=Lowest, 10=Emergency)")
    expected_impact: Dict[str, Any] = Field(
        default_factory=dict,
        description="Expected impact metrics: energy_kw_delta, cost_dollar_delta, comfort_impact_pct"
    )


class OptimizationPlan(BaseModel):
    """
    Unified Optimization Plan output produced by Consensus Engine.
    """
    plan_id: str
    timestamp: float
    building_status: str
    optimization_actions: List[str]
    expected_savings: Dict[str, Any]
    comfort_impact: str
    confidence: float
    reasoning_summary: str
    winning_agents: List[str]
    overridden_agents: List[str]
    conflicts_resolved: List[Dict[str, Any]]
    explainability: Dict[str, Any]


class SharedMemoryStore:
    """
    Thread-safe shared memory store for storing Digital Twin history,
    agent recommendation traces, and optimization plan decisions.
    """
    def __init__(self, max_history: int = 100):
        self.max_history = max_history
        self._digital_twin_history: List[Dict[str, Any]] = []
        self._recommendations_history: List[Dict[str, AgentRecommendation]] = []
        self._optimization_history: List[OptimizationPlan] = []
        self._lock = asyncio.Lock()

    async def store_twin_state(self, twin_state: Dict[str, Any]):
        async with self._lock:
            self._digital_twin_history.append(twin_state)
            if len(self._digital_twin_history) > self.max_history:
                self._digital_twin_history.pop(0)

    async def store_agent_recommendations(self, recommendations: Dict[str, AgentRecommendation]):
        async with self._lock:
            self._recommendations_history.append(recommendations)
            if len(self._recommendations_history) > self.max_history:
                self._recommendations_history.pop(0)

    async def store_optimization_plan(self, plan: OptimizationPlan):
        async with self._lock:
            self._optimization_history.append(plan)
            if len(self._optimization_history) > self.max_history:
                self._optimization_history.pop(0)

    async def get_latest_plan(self) -> Optional[OptimizationPlan]:
        async with self._lock:
            return self._optimization_history[-1] if self._optimization_history else None


# Shared singleton memory instance
shared_memory = SharedMemoryStore()
