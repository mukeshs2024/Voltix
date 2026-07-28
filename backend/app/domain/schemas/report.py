from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class GenerateReportRequest(BaseModel):
    title: str
    report_type: str = "energy" # energy, occupancy, alert_summary, ai_optimization, audit
    format: str = "pdf" # pdf, csv, excel
    building_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None

class ReportResponse(BaseModel):
    id: UUID
    organization_id: Optional[UUID] = None
    building_id: Optional[UUID] = None
    title: str
    report_type: str
    format: str
    file_path: Optional[str] = None
    status: str
    download_count: int
    created_by_user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReportDownloadResponse(BaseModel):
    report_id: UUID
    download_url: str
    filename: str
    format: str
