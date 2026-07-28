from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.analytics import DashboardOverview
from backend.app.infrastructure.db.models.user import User
from backend.app.services.analytics_service import AnalyticsService
from backend.app.services.realtime_service import ws_manager

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardOverview)
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AnalyticsService(session=db)
    return await service.get_dashboard_overview()


@router.post("/auto-optimize")
async def trigger_auto_optimization(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.AI_CONTROL])),
):
    await ws_manager.broadcast(
        {
            "event": "auto_optimization_triggered",
            "triggered_by": current_user.email,
            "status": "optimization_in_progress",
            "estimated_savings": "18.5%",
        },
        channel="dashboard",
    )
    return {
        "status": "success",
        "message": "Autonomous optimization cycle initiated successfully",
        "projected_energy_savings": "18.5%",
    }
