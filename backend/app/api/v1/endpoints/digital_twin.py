from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from backend.app.domain.schemas.digital_twin import DigitalTwinState, ScenarioConfig, SimulationControlMessage
from backend.app.services.digital_twin_engine import (
    simulation_engine,
    digital_twin_store,
    PREDEFINED_SCENARIOS,
)

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin & Simulation Engine"])


@router.get("/state", response_model=DigitalTwinState, status_code=status.HTTP_200_OK)
async def get_digital_twin_state():
    """
    Get current authoritative Digital Twin state.
    """
    return await digital_twin_store.get_state()


@router.get("/scenarios", response_model=List[ScenarioConfig], status_code=status.HTTP_200_OK)
async def list_scenarios():
    """
    List all available deterministic scenarios.
    """
    return list(PREDEFINED_SCENARIOS.values())


@router.post("/control", status_code=status.HTTP_200_OK)
async def control_simulation(command: SimulationControlMessage):
    """
    Control simulation engine: start | pause | resume | reset | stop.
    """
    action = command.action.lower()

    if action == "start":
        await simulation_engine.start(scenario_id=command.scenario_id)
        if command.speed_multiplier:
            simulation_engine.set_speed(command.speed_multiplier)
    elif action == "pause":
        await simulation_engine.pause()
    elif action == "resume":
        await simulation_engine.resume()
    elif action == "reset":
        await simulation_engine.reset()
    elif action == "stop":
        await simulation_engine.stop()
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid control action '{command.action}'. Valid options: start, pause, resume, reset, stop"
        )

    state = await digital_twin_store.get_state()
    return {
        "status": "success",
        "action": action,
        "is_running": simulation_engine.is_running,
        "is_paused": simulation_engine.is_paused,
        "speed_multiplier": simulation_engine.speed_multiplier,
        "active_scenario": simulation_engine.active_scenario.scenario_name,
        "current_state": state.model_dump()
    }
