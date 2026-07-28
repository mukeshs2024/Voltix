from typing import Any, Dict, List
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.infrastructure.db.models.agent_decision import AgentDecision
from backend.app.infrastructure.db.models.agent_log import AgentLog
from backend.app.infrastructure.db.models.negotiation import Negotiation
from backend.app.infrastructure.db.models.telemetry import Telemetry


class SimulationRepository:
    """
    Repository for persisting simulation telemetry logs, agent decisions, logs, and negotiation traces in Supabase PostgreSQL.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def rollback(self) -> None:
        try:
            await self.session.rollback()
        except Exception:
            pass

    async def save_telemetry(self, telemetry_data: Dict[str, Any]) -> Telemetry:
        occupancy = telemetry_data.get("occupancy", {})
        thermal = telemetry_data.get("thermal", {})
        energy = telemetry_data.get("energy", {})

        telemetry_record = Telemetry(
            building_id=telemetry_data.get("building_id", "BLD001"),
            zone_id=telemetry_data.get("zone_id", "zone_a"),
            temperature=float(thermal.get("temperature", 24.0)),
            humidity=float(thermal.get("humidity", 50.0)),
            occupancy_count=int(occupancy.get("people_count", 0)),
            power_usage=float(energy.get("power_usage", 0.0)),
        )
        self.session.add(telemetry_record)
        await self.session.flush()
        return telemetry_record

    async def save_simulation_results(
        self,
        simulation_id: str,
        decision_data: Dict[str, Any],
        agent_reports: List[Dict[str, Any]],
        negotiation_trace: List[Dict[str, Any]],
    ) -> None:
        # 1. Save Final Agent Decision
        decision_record = AgentDecision(
            simulation_id=simulation_id,
            final_action=str(decision_data.get("action", "")),
            confidence=float(decision_data.get("confidence", 0.0)),
        )
        self.session.add(decision_record)

        # 2. Save Agent Log Reports
        for report in agent_reports:
            agent_log = AgentLog(
                simulation_id=simulation_id,
                agent_name=str(report.get("agent", report.get("agent_name", "Agent"))),
                proposal=str(report.get("proposal", "")),
                reasoning=str(report.get("reasoning", "")),
                impact=str(report.get("impact", "")),
            )
            self.session.add(agent_log)

        # 3. Save Negotiation Trace Items
        for trace in negotiation_trace:
            negotiation = Negotiation(
                simulation_id=simulation_id,
                from_agent=str(trace.get("from_agent", "Agent")),
                message_type=str(trace.get("message_type", "info")),
                content=str(trace.get("content", "")),
            )
            self.session.add(negotiation)

        await self.session.flush()
