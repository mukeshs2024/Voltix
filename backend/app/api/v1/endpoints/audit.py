from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.audit import AuditLogResponse
from backend.app.infrastructure.db.models.user import User
from backend.app.services.audit_service import AuditService

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])


@router.get("", response_model=List[AuditLogResponse])
async def list_audit_logs(
    user_id: Optional[UUID] = None,
    action: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AuditService(session=db)
    return await service.get_logs(user_id=user_id, action=action, skip=skip, limit=limit)
