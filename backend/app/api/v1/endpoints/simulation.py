import logging
import uuid
from typing import Any
from fastapi import APIRouter, status

from backend.app.core.dependencies import SimulationRepositoryDep
from backend.app.domain.schemas.simulation import (
    AgentReport,
    DecisionPayload,
    NegotiationTraceItem,
    SimulationRequest,
    SimulationResponse,
)
from backend.app.services.ai_client import ai_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/simulation", tags=["Simulation Engine"])


@router.post("/run", response_model=SimulationResponse, status_code=status.HTTP_200_OK)
async def run_simulation(
    payload: SimulationRequest,
    simulation_repo: SimulationRepositoryDep,
) -> Any:
    """
    Triggers multi-agent AI simulation based on building telemetry data.
    Flow:
    1. Validates incoming telemetry log and stores record in Supabase PostgreSQL.
    2. Dispatches payload to external Multi-Agent AI Service.
    3. Persists decisions, agent proposal logs, and negotiation trace.
    4. Returns final simulation results.
    """
    # Generate unique simulation execution ID
    simulation_id = f"sim_{uuid.uuid4().hex[:12]}"

    # Step 1: Store telemetry in database
    try:
        await simulation_repo.save_telemetry(payload.model_dump())
    except Exception as e:
        await simulation_repo.rollback()
        logger.warning(f"Database telemetry persistence bypassed (DB offline/unreachable): {str(e)}")

    # Step 2: Call AI Multi-Agent Service
    ai_result = await ai_client.run_simulation(payload.model_dump())

    # Extract decision, reports, and negotiation trace from AI output
    status_str = ai_result.get("status", "completed")
    decision_dict = ai_result.get("decision", {})
    agent_reports_raw = ai_result.get("agent_reports", [])
    negotiation_trace_raw = ai_result.get("negotiation_trace", [])

    # Step 3: Persist simulation decisions, logs, and trace in database
    try:
        await simulation_repo.save_simulation_results(
            simulation_id=simulation_id,
            decision_data=decision_dict,
            agent_reports=agent_reports_raw,
            negotiation_trace=negotiation_trace_raw,
        )
    except Exception as e:
        await simulation_repo.rollback()
        logger.warning(f"Database results persistence bypassed (DB offline/unreachable): {str(e)}")

    # Step 4: Format Pydantic response models
    decision_obj = DecisionPayload(
        action=decision_dict.get("action", "Maintain default safe operation"),
        reason=decision_dict.get("reason", "Baseline operation"),
        confidence=float(decision_dict.get("confidence", 0.50)),
    )

    agent_reports_formatted = []
    for rep in agent_reports_raw:
        agent_name = str(rep.get("agent", rep.get("agent_name", "Agent")))
        proposal = str(rep.get("proposal", ""))
        impact = str(rep.get("impact", ""))
        reasoning = str(rep.get("reasoning", ""))
        confidence = float(rep.get("confidence", 0.90))

        agent_reports_formatted.append(
            AgentReport(
                agent=agent_name,
                proposal=proposal,
                impact=impact,
                reasoning=reasoning,
                confidence=confidence,
            )
        )

    negotiation_trace_formatted = []
    for item in negotiation_trace_raw:
        negotiation_trace_formatted.append(
            NegotiationTraceItem(
                from_agent=str(item.get("from_agent", "System")),
                message_type=str(item.get("message_type", "info")),
                content=str(item.get("content", "")),
            )
        )

    return SimulationResponse(
        simulation_id=simulation_id,
        status=status_str,
        decision=decision_obj,
        agent_reports=agent_reports_formatted,
        negotiation_trace=negotiation_trace_formatted,
    )
