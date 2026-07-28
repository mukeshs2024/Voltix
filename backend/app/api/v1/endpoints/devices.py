from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.device import DeviceCreate, DeviceResponse, DeviceUpdate
from backend.app.infrastructure.db.models.device import Device
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/devices", tags=["Devices"])


@router.get("", response_model=List[DeviceResponse])
async def list_devices(
    zone_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Device).where(Device.is_deleted == False)
    if zone_id:
        query = query.where(Device.zone_id == zone_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def create_device(
    device_in: DeviceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    device = Device(**device_in.model_dump())
    db.add(device)
    await db.flush()
    await db.refresh(device)
    return device
