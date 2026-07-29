import logging
import uuid
from typing import Any, Dict, List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import SimulationRepositoryDep
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.scenario import RunScenarioRequest, SimulationRunResponse
from backend.app.domain.schemas.simulation import (
    AgentDeveloperMetadata,
    AgentSimulationResponseUnion,
    AgentReport,
    DecisionPayload,
    NegotiationTraceItem,
    AgentWorkflowStep,
    SimulationOperatorInput,
    SimulationRequest,
    SimulationResponse,
    DigitalTwinRunRequest,
)
from backend.app.infrastructure.db.models.user import User
from backend.app.services.ai_client import ai_client
from backend.app.services.scenario_service import ScenarioService
from backend.app.services.live_simulator import live_simulator
from backend.app.services.session_store import session_store
from pydantic import BaseModel
import asyncio
from backend.simulation.adapters.adapter_factory import AdapterFactory
from fastapi import HTTPException

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/simulation", tags=["Simulation Engine"])

class SimulationControlRequest(BaseModel):
    mode: str
    speed: int = 1


@router.post("/agent/run", response_model=AgentSimulationResponseUnion, status_code=status.HTTP_200_OK)
async def run_agent_simulation(
    payload: SimulationOperatorInput,
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    adapter = AdapterFactory.get_adapter(payload.agent_id)
    if not adapter:
        raise HTTPException(status_code=400, detail="Unknown agent_id")
    
    return await adapter.process(payload)


@router.post("/digital-twin/run")
async def run_digital_twin_session(
    payload: DigitalTwinRunRequest,
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    agent_ids = ["equipment", "safety", "grid", "hvac", "occupancy", "carbon", "security", "lighting", "water", "energy"]
    agent_results = {}
    
    async def run_agent(agent_id):
        try:
            adapter = AdapterFactory.get_adapter(agent_id)
            if not adapter:
                return agent_id, None
            
            agent_payload = SimulationOperatorInput(
                scenario_id=payload.scenario_id,
                scenario_name=payload.scenario_name,
                building_id=payload.building_id,
                agent_id=agent_id,
                building_data=payload.telemetry,
                telemetry=payload.telemetry,
                overrides={"source": "digital-twin"}
            )
            result = await adapter.process(agent_payload)
            return agent_id, result
        except Exception as e:
            logger.error(f"Agent {agent_id} failed: {e}")
            return agent_id, None

    tasks = [run_agent(a_id) for a_id in agent_ids]
    results = await asyncio.gather(*tasks)
    
    for a_id, res in results:
        if res:
            agent_results[a_id] = res
            
    session_id = session_store.create_session(payload.scenario_id, payload.telemetry, agent_results)
    
    return {"session_id": session_id}


@router.get("/session/{session_id}")
async def get_digital_twin_session(
    session_id: str,
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/session/{session_id}/{agent_id}")
async def get_digital_twin_agent_result(
    session_id: str,
    agent_id: str,
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    result = session_store.get_agent_result(session_id, agent_id)
    if not result:
        raise HTTPException(status_code=404, detail="Agent result not found in session")
    return result



@router.post("/run", response_model=SimulationResponse, status_code=status.HTTP_200_OK)
async def run_simulation(
    payload: SimulationRequest,
    simulation_repo: SimulationRepositoryDep,
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
) -> Any:
    """
    Triggers multi-agent AI simulation based on building telemetry data.
    """
    simulation_id = f"sim_{uuid.uuid4().hex[:12]}"

    try:
        await simulation_repo.save_telemetry(payload.model_dump())
    except Exception as e:
        await simulation_repo.rollback()
        logger.warning(f"Database telemetry persistence bypassed: {str(e)}")

    ai_result = await ai_client.run_simulation(payload.model_dump())

    status_str = ai_result.get("status", "completed")
    decision_dict = ai_result.get("decision", {})
    agent_reports_raw = ai_result.get("agent_reports", [])
    negotiation_trace_raw = ai_result.get("negotiation_trace", [])

    try:
        await simulation_repo.save_simulation_results(
            simulation_id=simulation_id,
            decision_data=decision_dict,
            agent_reports=agent_reports_raw,
            negotiation_trace=negotiation_trace_raw,
        )
    except Exception as e:
        await simulation_repo.rollback()
        logger.warning(f"Database results persistence bypassed: {str(e)}")

    decision_obj = DecisionPayload(
        action=decision_dict.get("action", "Maintain default safe operation"),
        reason=decision_dict.get("reason", "Baseline operation"),
        confidence=float(decision_dict.get("confidence", 0.50)),
    )

    agent_reports_formatted = []
    for rep in agent_reports_raw:
        agent_reports_formatted.append(
            AgentReport(
                agent=str(rep.get("agent", rep.get("agent_name", "Agent"))),
                proposal=str(rep.get("proposal", "")),
                impact=str(rep.get("impact", "")),
                reasoning=str(rep.get("reasoning", "")),
                confidence=float(rep.get("confidence", 0.90)),
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


@router.post("/{run_id}/pause", response_model=SimulationRunResponse)
async def pause_simulation(
    run_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    service = ScenarioService(session=db)
    return await service.pause_simulation(run_id)


@router.post("/{run_id}/resume", response_model=SimulationRunResponse)
async def resume_simulation(
    run_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    service = ScenarioService(session=db)
    return await service.resume_simulation(run_id)


@router.post("/{run_id}/reset", response_model=SimulationRunResponse)
async def reset_simulation(
    run_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    service = ScenarioService(session=db)
    return await service.reset_simulation(run_id)


@router.get("/history", response_model=List[SimulationRunResponse])
async def get_simulation_history(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = ScenarioService(session=db)
    return await service.get_history(limit=limit)

@router.post("/control")
async def control_live_simulation(
    payload: SimulationControlRequest,
):
    if not live_simulator.loop:
        live_simulator.set_loop(asyncio.get_running_loop())
    
    return live_simulator.set_mode(mode=payload.mode, speed=payload.speed)
