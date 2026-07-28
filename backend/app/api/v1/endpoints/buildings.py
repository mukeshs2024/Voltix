from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.building import BuildingCreate, BuildingHealthResponse, BuildingResponse, BuildingUpdate
from backend.app.infrastructure.db.models.user import User
from backend.app.services.building_service import BuildingService

router = APIRouter(prefix="/buildings", tags=["Buildings"])


@router.get("", response_model=List[BuildingResponse])
async def list_buildings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = BuildingService(session=db)
    return await service.get_buildings(skip=skip, limit=limit, search=search)


@router.post("", response_model=BuildingResponse, status_code=status.HTTP_201_CREATED)
async def create_building(
    building_in: BuildingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = BuildingService(session=db)
    return await service.create_building(building_in)


@router.get("/{building_id}", response_model=BuildingResponse)
async def get_building(
    building_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = BuildingService(session=db)
    return await service.get_building(building_id)


@router.put("/{building_id}", response_model=BuildingResponse)
async def update_building(
    building_id: UUID,
    building_in: BuildingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = BuildingService(session=db)
    return await service.update_building(building_id, building_in)


@router.delete("/{building_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_building(
    building_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.DELETE])),
):
    service = BuildingService(session=db)
    await service.delete_building(building_id)
    return None


@router.get("/{building_id}/health", response_model=BuildingHealthResponse)
async def get_building_health(
    building_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = BuildingService(session=db)
    return await service.get_building_health(building_id)
