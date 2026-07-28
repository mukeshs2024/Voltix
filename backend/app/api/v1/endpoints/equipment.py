from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.equipment import EquipmentCreate, EquipmentResponse, MaintenanceCreate, MaintenanceResponse
from backend.app.infrastructure.db.models.equipment import Equipment, Maintenance
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/equipment", tags=["Equipment & Maintenance"])


@router.get("", response_model=List[EquipmentResponse])
async def list_equipment(
    building_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Equipment)
    if building_id:
        query = query.where(Equipment.building_id == building_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment(
    eq_in: EquipmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    eq = Equipment(**eq_in.model_dump())
    db.add(eq)
    await db.flush()
    await db.refresh(eq)
    return eq


@router.get("/maintenance", response_model=List[MaintenanceResponse])
async def list_maintenance(
    equipment_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Maintenance)
    if equipment_id:
        query = query.where(Maintenance.equipment_id == equipment_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("/maintenance", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance(
    m_in: MaintenanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    m = Maintenance(**m_in.model_dump())
    db.add(m)
    await db.flush()
    await db.refresh(m)
    return m
