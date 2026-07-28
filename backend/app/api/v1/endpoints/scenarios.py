from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.scenario import RunScenarioRequest, ScenarioResponse, SimulationRunResponse
from backend.app.infrastructure.db.models.user import User
from backend.app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])


@router.get("/templates", response_model=List[ScenarioResponse])
async def list_scenario_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = ScenarioService(session=db)
    return await service.list_scenarios()


@router.get("", response_model=List[ScenarioResponse])
async def list_scenarios(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = ScenarioService(session=db)
    return await service.list_scenarios()


@router.post("/execute", response_model=SimulationRunResponse, status_code=status.HTTP_201_CREATED)
async def execute_scenario(
    req: RunScenarioRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.SIMULATION])),
):
    service = ScenarioService(session=db)
    return await service.run_scenario(req, user_id=current_user.id)
