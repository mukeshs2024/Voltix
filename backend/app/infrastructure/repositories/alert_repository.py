from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.infrastructure.db.models.alert import Alert, AlertHistory
from backend.app.infrastructure.repositories.generic import SQLAlchemyGenericRepository, _in_memory_store

class AlertRepository(SQLAlchemyGenericRepository[Alert, UUID]):
    def __init__(self, session: AsyncSession):
        super().__init__(model=Alert, session=session)

    async def get_filtered(
        self,
        building_id: Optional[UUID] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Alert]:
        try:
            query = select(Alert)
            if building_id:
                query = query.where(Alert.building_id == building_id)
            if severity:
                query = query.where(Alert.severity == severity)
            if status:
                query = query.where(Alert.status == status)
            query = query.order_by(desc(Alert.created_at)).offset(skip).limit(limit)
            result = await self.session.execute(query)
            return list(result.scalars().all())
        except Exception:
            alerts = list(_in_memory_store.get(self.table_name, {}).values())
            if building_id:
                alerts = [a for a in alerts if getattr(a, "building_id", None) == building_id]
            if severity:
                alerts = [a for a in alerts if getattr(a, "severity", None) == severity]
            if status:
                alerts = [a for a in alerts if getattr(a, "status", None) == status]
            return alerts[skip : skip + limit]

    async def add_history(self, alert_id: UUID, action: str, performed_by_user_id: Optional[UUID] = None, notes: Optional[str] = None) -> AlertHistory:
        now = datetime.now(timezone.utc)
        history = AlertHistory(
            id=UUID(int=len(_in_memory_store.get("alert_history", {})) + 1),
            alert_id=alert_id,
            action=action,
            performed_by_user_id=performed_by_user_id,
            notes=notes,
            created_at=now,
            updated_at=now,
        )
        try:
            self.session.add(history)
            await self.session.flush()
            await self.session.refresh(history)
        except Exception:
            pass

        if "alert_history" not in _in_memory_store:
            _in_memory_store["alert_history"] = {}
        _in_memory_store["alert_history"][str(history.id)] = history
        return history

    async def get_history(self, alert_id: UUID) -> List[AlertHistory]:
        try:
            query = select(AlertHistory).where(AlertHistory.alert_id == alert_id).order_by(desc(AlertHistory.created_at))
            result = await self.session.execute(query)
            return list(result.scalars().all())
        except Exception:
            histories = [h for h in _in_memory_store.get("alert_history", {}).values() if getattr(h, "alert_id", None) == alert_id]
            return histories
