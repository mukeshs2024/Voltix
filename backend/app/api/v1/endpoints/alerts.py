from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.alert import AlertAssign, AlertCreate, AlertHistoryResponse, AlertResolve, AlertResponse, AlertUpdate
from backend.app.infrastructure.db.models.user import User
from backend.app.services.alert_service import AlertService
from backend.app.services.realtime_service import ws_manager

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertResponse])
async def list_alerts(
    building_id: Optional[UUID] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AlertService(session=db)
    return await service.get_alerts(
        building_id=building_id, severity=severity, status_filter=status, skip=skip, limit=limit
    )


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_in: AlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = AlertService(session=db)
    alert = await service.create_alert(alert_in)
    await ws_manager.broadcast(
        {
            "event": "alert_created",
            "alert_id": str(alert.id),
            "title": alert.title,
            "severity": alert.severity,
        },
        channel="alerts",
    )
    return alert


@router.post("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: UUID,
    resolve_in: AlertResolve,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = AlertService(session=db)
    resolved = await service.resolve_alert(alert_id=alert_id, resolve_in=resolve_in, user_id=current_user.id)
    await ws_manager.broadcast(
        {"event": "alert_resolved", "alert_id": str(alert_id), "resolved_by": current_user.email}, channel="alerts"
    )
    return resolved


@router.post("/{alert_id}/assign", response_model=AlertResponse)
async def assign_alert(
    alert_id: UUID,
    assign_in: AlertAssign,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    service = AlertService(session=db)
    return await service.assign_alert(alert_id=alert_id, assign_in=assign_in, performing_user_id=current_user.id)


@router.get("/{alert_id}/history", response_model=List[AlertHistoryResponse])
async def get_alert_history(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AlertService(session=db)
    return await service.repo.get_history(alert_id)
