from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.notification import NotificationCreate, NotificationResponse
from backend.app.infrastructure.db.models.notification import Notification
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Notification).where(
        (Notification.user_id == current_user.id) | (Notification.user_id == None)
    ).order_by(desc(Notification.created_at)).offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Notification).where(Notification.id == notification_id)
    res = await db.execute(query)
    notif = res.scalars().first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notif.is_read = True
    db.add(notif)
    await db.flush()
    await db.refresh(notif)
    return notif
