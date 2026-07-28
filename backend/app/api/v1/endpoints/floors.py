from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.floor import FloorCreate, FloorResponse, FloorUpdate
from backend.app.infrastructure.db.models.floor import Floor
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/floors", tags=["Floors"])


@router.get("", response_model=List[FloorResponse])
async def list_floors(
    building_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Floor).where(Floor.is_deleted == False)
    if building_id:
        query = query.where(Floor.building_id == building_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=FloorResponse, status_code=status.HTTP_201_CREATED)
async def create_floor(
    floor_in: FloorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    floor = Floor(**floor_in.model_dump())
    db.add(floor)
    await db.flush()
    await db.refresh(floor)
    return floor


@router.get("/{floor_id}", response_model=FloorResponse)
async def get_floor(
    floor_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Floor).where(Floor.id == floor_id, Floor.is_deleted == False)
    res = await db.execute(query)
    floor = res.scalars().first()
    if not floor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found")
    return floor
