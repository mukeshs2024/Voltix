from datetime import datetime, timezone
import random
from backend.app.domain.schemas.simulation import (
    SafetyAgentResponse,
    SimulationOperatorInput,
    AgentWorkflowStep,
    AgentDeveloperMetadata,
    AIDecisionBlock,
    RecommendationCard,
    TimelineEvent
)
from backend.app.services.ai_client import ai_client

class SafetyAdapter:
    async def process(self, payload: SimulationOperatorInput) -> SafetyAgentResponse:
        ai_result = await ai_client.run_simulation({
            "building_id": payload.building_id,
            "zone_id": payload.scenario_id,
            "agent_id": payload.agent_id,
            "scenario_name": payload.scenario_name,
            "telemetry": payload.telemetry,
        })
        is_critical = payload.scenario_id == "fire-alarm"
        now_str = datetime.now().strftime("%H:%M")

        workflow = [
            AgentWorkflowStep(label="Sensors", detail="Data aligned", state="done"),
            AgentWorkflowStep(label="Hazard Detection", detail="Hazards identified", state="done"),
            AgentWorkflowStep(label="Risk Assessment", detail="Exposure calculated", state="active"),
            AgentWorkflowStep(label="Emergency Decision", detail="Evacuation prepared", state="pending"),
            AgentWorkflowStep(label="Response", detail="Action dispatched", state="pending"),
        ]

        metadata = AgentDeveloperMetadata(
            agent_name="Safety Agent",
            source="backend.simulation.adapters.safety_adapter",
            raw_ai_response={"raw": "test"},
            mapped_dto={"status": "mapped"},
            execution_time_ms=142,
            token_usage=850,
            normalized_at=datetime.now(timezone.utc),
        )

        decision = AIDecisionBlock(
            summary="Initiate Zone 4 Evacuation" if is_critical else "Maintain normal patrol",
            priority="CRITICAL" if is_critical else "LOW",
            severity="HIGH" if is_critical else "LOW",
            expected_impact="Clear affected zone within 3 minutes" if is_critical else "None",
            reason="Smoke concentration exceeded 40% threshold" if is_critical else "All sensors normal",
            business_impact="Occupant safety prioritized over operations" if is_critical else "Normal operations"
        )

        recommendations = [
            RecommendationCard(title="Evacuate Area", description="Clear Zone 4 immediately", urgency="High"),
            RecommendationCard(title="Dispatch Security", description="Send team to investigate", urgency="High")
        ] if is_critical else [
            RecommendationCard(title="Inspect Zone 4", description="Routine check on sensors", urgency="Low")
        ]

        timeline = [
            TimelineEvent(time="09:01", message="Received telemetry", is_active=False),
            TimelineEvent(time="09:02", message="Detected smoke anomaly" if is_critical else "Baseline normal", is_active=False),
            TimelineEvent(time=now_str, message="Generated emergency recommendation" if is_critical else "Awaiting events", is_active=True),
        ]

        sensors = [
            {"name": "Smoke", "value": "45%" if is_critical else "2%", "status": "critical" if is_critical else "normal"},
            {"name": "Fire", "value": "Detected" if is_critical else "Clear", "status": "critical" if is_critical else "normal"},
            {"name": "Gas", "value": "0ppm", "status": "normal"},
            {"name": "Water Leak", "value": "Dry", "status": "normal"}
        ]

        analytics = {
            "Risk Trend": "Escalating" if is_critical else "Stable",
            "Incident Trend": "High" if is_critical else "Low",
            "False Alarm Rate": "1.2%",
            "Emergency Readiness": "98%"
        }

        return SafetyAgentResponse(
            agent_id=payload.agent_id,
            agent_name="Safety Agent",
            purpose="Monitoring building safety",
            status="Running",
            last_execution=now_str,
            scenario_id=payload.scenario_id,
            scenario_name=payload.scenario_name,
            execution_mode="Rule Engine + AI",
            health_percentage=100,
            input=payload,
            workflow=workflow,
            decision=decision,
            recommendations=recommendations,
            timeline=timeline,
            developer_metadata=metadata,
            sensors=sensors,
            analytics=analytics,
            hazards=[{"name": "Smoke", "zone": "Zone 4"}] if is_critical else [],
            logs=["Smoke detector triggered"] if is_critical else []
        )
