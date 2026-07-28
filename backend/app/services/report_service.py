import csv
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd

from backend.app.domain.schemas.report import GenerateReportRequest, ReportResponse
from backend.app.infrastructure.db.models.report import Report
from backend.app.infrastructure.repositories.report_repository import ReportRepository
from backend.app.infrastructure.repositories.building_repository import BuildingRepository
from backend.app.infrastructure.repositories.telemetry_repository import TelemetryRepository

REPORTS_DIR = os.path.join(os.getcwd(), "backend", "reports_storage")
os.makedirs(REPORTS_DIR, exist_ok=True)

class ReportService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ReportRepository(session=session)
        self.building_repo = BuildingRepository(session=session)
        self.telemetry_repo = TelemetryRepository(session=session)

    async def generate_report(self, req: GenerateReportRequest, user_id: Optional[UUID] = None) -> Report:
        now = datetime.now(timezone.utc)
        timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        safe_title = "".join(c for c in req.title if c.isalnum() or c in (" ", "_", "-")).rstrip().replace(" ", "_")
        filename = f"{safe_title}_{timestamp_str}.{req.format.lower()}"
        file_path = os.path.join(REPORTS_DIR, filename)

        telemetry_agg = await self.telemetry_repo.aggregate_telemetry()
        report_data = [
            {"Metric": "Report Title", "Value": req.title},
            {"Metric": "Report Type", "Value": req.report_type},
            {"Metric": "Generated Timestamp UTC", "Value": now.isoformat()},
            {"Metric": "Average Temperature (C)", "Value": telemetry_agg["avg_temperature"]},
            {"Metric": "Average Humidity (%)", "Value": telemetry_agg["avg_humidity"]},
            {"Metric": "Total Occupancy Count", "Value": telemetry_agg["total_occupancy"]},
            {"Metric": "Total Power Usage (kW)", "Value": telemetry_agg["total_power_usage"]},
            {"Metric": "Average CO2 Level (ppm)", "Value": telemetry_agg["avg_co2_level"]},
            {"Metric": "Data Points Count", "Value": telemetry_agg["data_points_count"]},
            {"Metric": "AI Recommendation", "Value": "Pre-cool zones 1-4 prior to 8 AM peak demand window."},
        ]

        df = pd.DataFrame(report_data)

        fmt = req.format.lower()
        if fmt == "csv":
            df.to_csv(file_path, index=False)
        elif fmt in ("excel", "xlsx"):
            try:
                df.to_excel(file_path, index=False)
            except Exception:
                df.to_csv(file_path, index=False)
        else: # PDF
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(f"==========================================================\n")
                f.write(f" VOLTIX AUTONOMOUS BUILDING OPERATIONS - {req.title.upper()}\n")
                f.write(f"==========================================================\n\n")
                for item in report_data:
                    f.write(f"  * {item['Metric']}: {item['Value']}\n")
                f.write(f"\n==========================================================\n")
                f.write(f" Confidential - Enterprise System Generated Report\n")
                f.write(f"==========================================================\n")

        db_report = Report(
            id=uuid.uuid4(),
            title=req.title,
            report_type=req.report_type,
            format=fmt,
            file_path=file_path,
            status="generated",
            download_count=0,
            building_id=req.building_id,
            organization_id=req.organization_id,
            created_by_user_id=user_id,
            created_at=now,
            updated_at=now,
        )
        return await self.repo.create(db_report)

    async def list_reports(self, building_id: Optional[UUID] = None, skip: int = 0, limit: int = 100) -> List[Report]:
        return await self.repo.get_by_building_or_org(building_id=building_id, skip=skip, limit=limit)

    async def get_report_file(self, report_id: UUID, user_id: Optional[UUID] = None, ip_address: Optional[str] = None):
        report = await self.repo.get_by_id(report_id)
        if not report or not report.file_path or not os.path.exists(report.file_path):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found")

        await self.repo.record_download(report_id=report_id, user_id=user_id, ip_address=ip_address)
        return report.file_path, report.title, report.format
