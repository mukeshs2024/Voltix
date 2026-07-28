from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.sensor import SensorCreate, SensorHealthResponse, SensorResponse, SensorUpdate
from backend.app.infrastructure.db.models.sensor import Sensor
from backend.app.infrastructure.db.models.sensor_health import SensorHealth
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/sensors", tags=["Sensors"])


@router.get("", response_model=List[SensorResponse])
async def list_sensors(
    device_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Sensor).where(Sensor.is_deleted == False)
    if device_id:
        query = query.where(Sensor.device_id == device_id)
    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=SensorResponse, status_code=status.HTTP_201_CREATED)
async def create_sensor(
    sensor_in: SensorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    sensor = Sensor(**sensor_in.model_dump())
    db.add(sensor)
    await db.flush()
    await db.refresh(sensor)

    sh = SensorHealth(sensor_id=sensor.id, health_status="healthy", battery_level=100.0, signal_strength=95.0)
    db.add(sh)
    await db.flush()

    return sensor


@router.get("/health", response_model=List[SensorHealthResponse])
async def list_sensor_health(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(SensorHealth).offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())
