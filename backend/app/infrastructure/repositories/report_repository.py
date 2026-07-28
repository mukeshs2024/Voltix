from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.infrastructure.db.models.report import Report, ReportDownload
from backend.app.infrastructure.repositories.generic import SQLAlchemyGenericRepository, _in_memory_store

class ReportRepository(SQLAlchemyGenericRepository[Report, UUID]):
    def __init__(self, session: AsyncSession):
        super().__init__(model=Report, session=session)

    async def get_by_building_or_org(
        self, building_id: Optional[UUID] = None, organization_id: Optional[UUID] = None, skip: int = 0, limit: int = 100
    ) -> List[Report]:
        try:
            query = select(Report)
            if building_id:
                query = query.where(Report.building_id == building_id)
            if organization_id:
                query = query.where(Report.organization_id == organization_id)
            query = query.order_by(desc(Report.created_at)).offset(skip).limit(limit)
            result = await self.session.execute(query)
            return list(result.scalars().all())
        except Exception:
            reports = list(_in_memory_store.get(self.table_name, {}).values())
            if building_id:
                reports = [r for r in reports if getattr(r, "building_id", None) == building_id]
            if organization_id:
                reports = [r for r in reports if getattr(r, "organization_id", None) == organization_id]
            return reports[skip : skip + limit]

    async def record_download(self, report_id: UUID, user_id: Optional[UUID] = None, ip_address: Optional[str] = None) -> ReportDownload:
        now = datetime.now(timezone.utc)
        report = await self.get_by_id(report_id)
        if report:
            report.download_count += 1

        download = ReportDownload(
            id=UUID(int=len(_in_memory_store.get("report_downloads", {})) + 1),
            report_id=report_id,
            downloaded_by_user_id=user_id,
            ip_address=ip_address,
            downloaded_at=now,
            created_at=now,
            updated_at=now,
        )
        try:
            self.session.add(download)
            await self.session.flush()
            await self.session.refresh(download)
        except Exception:
            pass

        if "report_downloads" not in _in_memory_store:
            _in_memory_store["report_downloads"] = {}
        _in_memory_store["report_downloads"][str(download.id)] = download
        return download
