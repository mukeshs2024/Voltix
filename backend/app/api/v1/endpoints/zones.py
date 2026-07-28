from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.zone import ZoneCreate, ZoneResponse, ZoneUpdate
from backend.app.infrastructure.db.models.user import User
from backend.app.infrastructure.db.models.zone import Zone

router = APIRouter(prefix="/zones", tags=["Zones"])


@router.get("", response_model=List[ZoneResponse])
async def list_zones(
    floor_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Zone).where(Zone.is_deleted == False)
    if floor_id:
        query = query.where(Zone.floor_id == floor_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=ZoneResponse, status_code=status.HTTP_201_CREATED)
async def create_zone(
    zone_in: ZoneCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    zone = Zone(**zone_in.model_dump())
    db.add(zone)
    await db.flush()
    await db.refresh(zone)
    return zone


@router.get("/{zone_id}", response_model=ZoneResponse)
async def get_zone(
    zone_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Zone).where(Zone.id == zone_id, Zone.is_deleted == False)
    res = await db.execute(query)
    zone = res.scalars().first()
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Zone not found")
    return zone
