from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.infrastructure.db.models.audit_log import AuditLog
from backend.app.infrastructure.repositories.generic import SQLAlchemyGenericRepository, _in_memory_store

class AuditRepository(SQLAlchemyGenericRepository[AuditLog, UUID]):
    def __init__(self, session: AsyncSession):
        super().__init__(model=AuditLog, session=session)

    async def log_action(
        self,
        user_id: Optional[UUID],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        now = datetime.now(timezone.utc)
        audit = AuditLog(
            id=UUID(int=len(_in_memory_store.get(self.table_name, {})) + 1),
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            created_at=now,
            updated_at=now,
        )
        try:
            self.session.add(audit)
            await self.session.flush()
            await self.session.refresh(audit)
        except Exception:
            pass

        _in_memory_store[self.table_name][str(audit.id)] = audit
        return audit

    async def query_logs(self, user_id: Optional[UUID] = None, action: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        try:
            query = select(AuditLog)
            if user_id:
                query = query.where(AuditLog.user_id == user_id)
            if action:
                query = query.where(AuditLog.action == action)
            query = query.order_by(desc(AuditLog.created_at)).offset(skip).limit(limit)
            result = await self.session.execute(query)
            return list(result.scalars().all())
        except Exception:
            logs = list(_in_memory_store.get(self.table_name, {}).values())
            if user_id:
                logs = [l for l in logs if getattr(l, "user_id", None) == user_id]
            if action:
                logs = [l for l in logs if getattr(l, "action", None) == action]
            return logs[skip : skip + limit]
