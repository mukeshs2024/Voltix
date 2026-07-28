from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.domain.schemas.alert import AlertAssign, AlertCreate, AlertResolve, AlertResponse, AlertUpdate
from backend.app.infrastructure.db.models.alert import Alert
from backend.app.infrastructure.repositories.alert_repository import AlertRepository

class AlertService:
    def __init__(self, session: AsyncSession):
        self.repo = AlertRepository(session=session)

    async def get_alerts(
        self,
        building_id: Optional[UUID] = None,
        severity: Optional[str] = None,
        status_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Alert]:
        return await self.repo.get_filtered(
            building_id=building_id, severity=severity, status=status_filter, skip=skip, limit=limit
        )

    async def create_alert(self, alert_in: AlertCreate) -> Alert:
        alert = await self.repo.create(alert_in)
        await self.repo.add_history(alert_id=alert.id, action="created", notes=f"Alert triggered: {alert.title}")
        return alert

    async def resolve_alert(self, alert_id: UUID, resolve_in: AlertResolve, user_id: Optional[UUID] = None) -> Alert:
        alert = await self.repo.get_by_id(alert_id)
        if not alert:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

        alert.status = "resolved"
        alert.resolved_at = datetime.now(timezone.utc)
        updated_alert = await self.repo.update(alert_id, {"status": "resolved", "resolved_at": alert.resolved_at})
        await self.repo.add_history(alert_id=alert_id, action="resolved", performed_by_user_id=user_id, notes=resolve_in.notes)
        return updated_alert

    async def assign_alert(self, alert_id: UUID, assign_in: AlertAssign, performing_user_id: Optional[UUID] = None) -> Alert:
        alert = await self.repo.get_by_id(alert_id)
        if not alert:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

        updated_alert = await self.repo.update(alert_id, {"assigned_to_user_id": assign_in.user_id, "status": "acknowledged"})
        await self.repo.add_history(
            alert_id=alert_id,
            action="assigned",
            performed_by_user_id=performing_user_id,
            notes=f"Assigned to user {assign_in.user_id}. {assign_in.notes or ''}",
        )
        return updated_alert
