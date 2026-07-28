import os
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.report import GenerateReportRequest, ReportResponse
from backend.app.infrastructure.db.models.user import User
from backend.app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    req: GenerateReportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.EXPORT])),
):
    service = ReportService(session=db)
    return await service.generate_report(req, user_id=current_user.id)


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    building_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = ReportService(session=db)
    return await service.list_reports(building_id=building_id, skip=skip, limit=limit)


@router.get("/{report_id}/download")
async def download_report(
    report_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.EXPORT])),
):
    service = ReportService(session=db)
    file_path, title, fmt = await service.get_report_file(
        report_id=report_id, user_id=current_user.id, ip_address=request.client.host if request.client else None
    )

    media_type = "application/pdf"
    if fmt == "csv":
        media_type = "text/csv"
    elif fmt in ("excel", "xlsx"):
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    filename = os.path.basename(file_path)
    return FileResponse(path=file_path, filename=filename, media_type=media_type)


@router.get("/{report_id}/preview", response_class=HTMLResponse)
async def preview_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = ReportService(session=db)
    report = await service.repo.get_by_id(report_id)
    if not report or not report.file_path or not os.path.exists(report.file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found")

    content = ""
    with open(report.file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read(4000)

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Report Preview - {report.title}</title>
        <style>
            body {{ font-family: monospace; background: #0f172a; color: #f8fafc; padding: 20px; }}
            pre {{ background: #1e293b; padding: 15px; border-radius: 8px; font-size: 14px; }}
            h2 {{ color: #38bdf8; }}
        </style>
    </head>
    <body>
        <h2>Voltix Report Preview: {report.title} ({report.format.upper()})</h2>
        <p>Status: {report.status} | Downloads: {report.download_count}</p>
        <pre>{content}</pre>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)
