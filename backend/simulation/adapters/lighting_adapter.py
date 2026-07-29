from datetime import datetime, timezone
from backend.app.domain.schemas.simulation import (
    LightingAgentResponse,
    SimulationOperatorInput,
    AgentWorkflowStep,
    AgentDeveloperMetadata
)
from backend.app.services.ai_client import ai_client

class LightingAdapter:
    async def process(self, payload: SimulationOperatorInput) -> LightingAgentResponse:
        ai_result = await ai_client.run_simulation({
            "building_id": payload.building_id,
            "zone_id": payload.scenario_id,
            "agent_id": payload.agent_id,
            "scenario_name": payload.scenario_name,
            "telemetry": payload.telemetry,
            "building_data": payload.building_data,
            "overrides": payload.overrides,
        })

        workflow = [
            AgentWorkflowStep(label="Sensor Collection", detail="Inputs normalized", state="done"),
            AgentWorkflowStep(label="Analysis", detail="Core analysis completed", state="done"),
            AgentWorkflowStep(label="Prediction", detail="Future state estimated", state="active"),
            AgentWorkflowStep(label="Decision", detail="Decisions formulated", state="pending"),
            AgentWorkflowStep(label="Action", detail="Actions dispatched", state="pending"),
        ]

        metadata = AgentDeveloperMetadata(
            agent_name="Lighting Agent",
            source="backend.simulation.adapters.lighting_adapter",
            raw_ai_response=ai_result,
            normalized_at=datetime.now(timezone.utc),
        )

        return LightingAgentResponse(
            agent_id=payload.agent_id,
            input=payload,
            workflow=workflow,
            developer_metadata=metadata,
            **ai_result.get("mapped_data", {})
        )
