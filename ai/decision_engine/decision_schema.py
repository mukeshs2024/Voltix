"""
1. Objective: Provide strict Pydantic schemas for the final orchestration output.
2. Folder location: ai/decision_engine/
3. Responsibilities: Enforce the structure of the Orchestrator's final JSON output.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ConflictSchema(BaseModel):
    category: str = Field(..., description="The category of the conflict (e.g. HVAC, Energy vs Comfort)")
    agents: List[str] = Field(..., description="List of agents involved in the conflict")

class TraceStep(BaseModel):
    step_name: str
    action: str
    timestamp: str

class DecisionHealthMetrics(BaseModel):
    overall_confidence: float
    decision_quality_score: float
    participating_agents: int
    execution_latency_ms: float
    validation_status: str

class DecisionPackage(BaseModel):
    building_status: str = Field(default="NORMAL", description="Overall status of the building")
    decision: str = Field(..., description="The unified decision statement")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Overall confidence of the decision")
    winning_agents: List[str] = Field(default_factory=list, description="Agents whose recommendations were accepted")
    overridden_agents: List[str] = Field(default_factory=list, description="Agents whose recommendations were rejected")
    conflicts: List[ConflictSchema] = Field(default_factory=list, description="List of detected conflicts")
    recommendations: List[str] = Field(default_factory=list, description="Actionable recommendations")
    reasoning: str = Field(..., description="Explainability trace")
    trace: List[TraceStep] = Field(default_factory=list)
    health_metrics: Optional[DecisionHealthMetrics] = None

# For backwards compatibility with older scripts
DecisionSchema = DecisionPackage
