from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.infrastructure.db.models.audit_log import AuditLog
from backend.app.infrastructure.repositories.audit_repository import AuditRepository

class AuditService:
    def __init__(self, session: AsyncSession):
        self.repo = AuditRepository(session=session)

    async def log_event(
        self,
        user_id: Optional[UUID],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        return await self.repo.log_action(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
        )

    async def get_logs(self, user_id: Optional[UUID] = None, action: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        return await self.repo.query_logs(user_id=user_id, action=action, skip=skip, limit=limit)
