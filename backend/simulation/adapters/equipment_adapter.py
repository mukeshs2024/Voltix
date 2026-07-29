from datetime import datetime, timezone
from backend.app.domain.schemas.simulation import (
    EquipmentAgentResponse,
    SimulationOperatorInput,
    AgentWorkflowStep,
    AgentDeveloperMetadata,
    AIDecisionBlock,
    RecommendationCard,
    TimelineEvent
)
from backend.app.services.ai_client import ai_client

class EquipmentAdapter:
    async def process(self, payload: SimulationOperatorInput) -> EquipmentAgentResponse:
        ai_result = await ai_client.run_simulation({
            "building_id": payload.building_id,
            "zone_id": payload.scenario_id,
            "agent_id": payload.agent_id,
            "scenario_name": payload.scenario_name,
            "telemetry": payload.telemetry,
        })
        is_critical = payload.scenario_id == "equipment-failure"
        now_str = datetime.now().strftime("%H:%M")

        workflow = [
            AgentWorkflowStep(label="Sensors", detail="Data aligned", state="done"),
            AgentWorkflowStep(label="Health Diagnostics", detail="Health checked", state="done"),
            AgentWorkflowStep(label="Fault Detection", detail="Faults classified", state="active"),
            AgentWorkflowStep(label="Failure Prediction", detail="RUL estimated", state="pending"),
            AgentWorkflowStep(label="Maintenance Decision", detail="Action dispatched", state="pending"),
        ]

        metadata = AgentDeveloperMetadata(
            agent_name="Equipment Agent",
            source="backend.simulation.adapters.equipment_adapter",
            raw_ai_response={"raw": "test"},
            mapped_dto={"status": "mapped"},
            execution_time_ms=210,
            token_usage=1100,
            normalized_at=datetime.now(timezone.utc),
        )

        decision = AIDecisionBlock(
            summary="Schedule immediate bearing replacement" if is_critical else "Maintain operation",
            priority="HIGH" if is_critical else "LOW",
            severity="CRITICAL" if is_critical else "NORMAL",
            expected_impact="Prevent catastrophic motor failure" if is_critical else "None",
            reason="Vibration signatures match failure curve" if is_critical else "Vibration normal",
            business_impact="$15k estimated savings from avoiding downtime" if is_critical else "Normal operations"
        )

        recommendations = [
            RecommendationCard(title="Replace Bearing", description="Target AHU-4", urgency="High"),
            RecommendationCard(title="Schedule Shutdown", description="Coordinate with facility", urgency="High")
        ] if is_critical else [
            RecommendationCard(title="Lubricate Motor", description="Routine maintenance", urgency="Low")
        ]

        timeline = [
            TimelineEvent(time="08:45", message="Received telemetry", is_active=False),
            TimelineEvent(time="08:50", message="Detected vibration anomaly" if is_critical else "Baseline normal", is_active=False),
            TimelineEvent(time=now_str, message="Generated maintenance decision", is_active=True),
        ]

        sensors = [
            {"name": "Bearing Temp", "value": "85°C" if is_critical else "45°C", "status": "critical" if is_critical else "normal"},
            {"name": "Motor Current", "value": "42A" if is_critical else "20A", "status": "critical" if is_critical else "normal"},
            {"name": "Runtime", "value": "12,400h", "status": "normal"},
            {"name": "Vibration", "value": "12mm/s" if is_critical else "2mm/s", "status": "critical" if is_critical else "normal"}
        ]

        analytics = {
            "Failure Probability": "72%" if is_critical else "5%",
            "Remaining Useful Life": "2 Days" if is_critical else "180 Days",
            "Health Trend": "Degrading rapidly" if is_critical else "Stable",
            "Maintenance Cost": "$450"
        }

        return EquipmentAgentResponse(
            agent_id=payload.agent_id,
            agent_name="Equipment Agent",
            purpose="Monitoring HVAC equipment health",
            status="Running",
            last_execution=now_str,
            scenario_id=payload.scenario_id,
            scenario_name=payload.scenario_name,
            execution_mode="Rule Engine + AI",
            health_percentage=40 if is_critical else 96,
            input=payload,
            workflow=workflow,
            decision=decision,
            recommendations=recommendations,
            timeline=timeline,
            developer_metadata=metadata,
            sensors=sensors,
            analytics=analytics,
            logs=["Vibration exceeded"] if is_critical else []
        )
