from datetime import datetime
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.telemetry import AggregatedTelemetry, TelemetryCreate, TelemetryFilter, TelemetryResponse
from backend.app.infrastructure.db.models.user import User
from backend.app.services.realtime_service import ws_manager
from backend.app.services.telemetry_service import TelemetryService

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


@router.post("/ingest", response_model=TelemetryResponse, status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(
    telemetry_in: TelemetryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = TelemetryService(session=db)
    telemetry = await service.ingest_telemetry(telemetry_in)
    
    await ws_manager.broadcast(
        {
            "event": "telemetry_ingested",
            "building_id": telemetry.building_id,
            "zone_id": telemetry.zone_id,
            "temperature": telemetry.temperature,
            "power_usage": telemetry.power_usage,
            "occupancy_count": telemetry.occupancy_count,
        },
        channel="telemetry",
    )
    return telemetry


@router.get("/query", response_model=List[TelemetryResponse])
async def query_telemetry(
    building_id: Optional[str] = None,
    zone_id: Optional[str] = None,
    sensor_id: Optional[UUID] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = TelemetryService(session=db)
    filter_params = TelemetryFilter(
        building_id=building_id,
        zone_id=zone_id,
        sensor_id=sensor_id,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
        skip=skip,
    )
    return await service.query_telemetry(filter_params)


@router.get("/aggregate", response_model=AggregatedTelemetry)
async def aggregate_telemetry(
    building_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = TelemetryService(session=db)
    return await service.aggregate(building_id=building_id)
