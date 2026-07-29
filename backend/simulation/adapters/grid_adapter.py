from datetime import datetime, timezone
from backend.app.domain.schemas.simulation import (
    GridAgentResponse,
    SimulationOperatorInput,
    AgentWorkflowStep,
    AgentDeveloperMetadata,
    AIDecisionBlock,
    RecommendationCard,
    TimelineEvent
)
from backend.app.services.ai_client import ai_client

class GridAdapter:
    async def process(self, payload: SimulationOperatorInput) -> GridAgentResponse:
        ai_result = await ai_client.run_simulation({
            "building_id": payload.building_id,
            "zone_id": payload.scenario_id,
            "agent_id": payload.agent_id,
            "scenario_name": payload.scenario_name,
            "telemetry": payload.telemetry,
        })
        is_critical = payload.scenario_id == "peak-pricing" or payload.scenario_id == "grid-emergency"
        now_str = datetime.now().strftime("%H:%M")

        workflow = [
            AgentWorkflowStep(label="Energy Collection", detail="Data aligned", state="done"),
            AgentWorkflowStep(label="Demand Forecast", detail="Forecast complete", state="done"),
            AgentWorkflowStep(label="Optimization", detail="Comparing options", state="active"),
            AgentWorkflowStep(label="Battery Dispatch", detail="Dispatch planned", state="pending"),
            AgentWorkflowStep(label="Grid Control", detail="Action dispatched", state="pending"),
        ]

        metadata = AgentDeveloperMetadata(
            agent_name="Grid Agent",
            source="backend.simulation.adapters.grid_adapter",
            raw_ai_response={"raw": "test"},
            mapped_dto={"status": "mapped"},
            execution_time_ms=185,
            token_usage=920,
            normalized_at=datetime.now(timezone.utc),
        )

        decision = AIDecisionBlock(
            summary="Dispatch battery storage and shift HVAC load" if is_critical else "Maintain standard grid draw",
            priority="HIGH" if is_critical else "LOW",
            severity="MEDIUM" if is_critical else "NORMAL",
            expected_impact="Reduce peak demand by 500kW" if is_critical else "None",
            reason="Peak pricing tier ($0.48/kWh) active" if is_critical else "Standard pricing",
            business_impact="$420 savings for current 2hr window" if is_critical else "Normal operations"
        )

        recommendations = [
            RecommendationCard(title="Charge Battery", description="Pre-charge before 15:00", urgency="High"),
            RecommendationCard(title="Demand Response", description="Activate Tier 1 reduction", urgency="High")
        ] if is_critical else [
            RecommendationCard(title="Maintain Profile", description="Continue baseline", urgency="Low")
        ]

        timeline = [
            TimelineEvent(time="13:00", message="Received grid pricing signal", is_active=False),
            TimelineEvent(time="13:15", message="Detected peak transition" if is_critical else "Pricing stable", is_active=False),
            TimelineEvent(time=now_str, message="Generated dispatch optimization", is_active=True),
        ]

        sensors = [
            {"name": "Battery SOC", "value": "85%", "status": "normal"},
            {"name": "Solar Output", "value": "120kW", "status": "normal"},
            {"name": "Demand", "value": "2.8MW" if is_critical else "1.2MW", "status": "critical" if is_critical else "normal"},
            {"name": "Grid Price", "value": "$0.48" if is_critical else "$0.12", "status": "critical" if is_critical else "normal"}
        ]

        analytics = {
            "Load Forecast": "2.9MW Peak" if is_critical else "1.4MW Peak",
            "Battery Usage": "Discharging (500kW)" if is_critical else "Standby",
            "Cost Reduction": "$420 Active" if is_critical else "$0",
            "Peak Demand": "Active Window" if is_critical else "Off-Peak"
        }

        return GridAgentResponse(
            agent_id=payload.agent_id,
            agent_name="Grid Agent",
            purpose="Energy optimization and response",
            status="Running",
            last_execution=now_str,
            scenario_id=payload.scenario_id,
            scenario_name=payload.scenario_name,
            execution_mode="Economic Optimization",
            health_percentage=98,
            input=payload,
            workflow=workflow,
            decision=decision,
            recommendations=recommendations,
            timeline=timeline,
            developer_metadata=metadata,
            sensors=sensors,
            analytics=analytics,
            logs=["Peak pricing detected"] if is_critical else []
        )
