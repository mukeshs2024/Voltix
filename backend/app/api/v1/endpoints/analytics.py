from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.analytics import BuildingComparisonResponse, EnergyAnalytics, OccupancyAnalytics
from backend.app.infrastructure.db.models.user import User
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/compare", response_model=BuildingComparisonResponse)
async def compare_buildings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AnalyticsService(session=db)
    return await service.get_building_comparison()


@router.get("/energy", response_model=EnergyAnalytics)
async def get_energy_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AnalyticsService(session=db)
    return await service.get_energy_analytics()


@router.get("/occupancy", response_model=OccupancyAnalytics)
async def get_occupancy_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    service = AnalyticsService(session=db)
    return await service.get_occupancy_analytics()
