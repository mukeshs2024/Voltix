from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.domain.schemas.building import BuildingCreate, BuildingHealthResponse, BuildingResponse, BuildingUpdate
from backend.app.infrastructure.db.models.building import Building
from backend.app.infrastructure.repositories.building_repository import BuildingRepository

class BuildingService:
    def __init__(self, session: AsyncSession):
        self.repo = BuildingRepository(session=session)

    async def get_buildings(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[Building]:
        return await self.repo.get_active_buildings(skip=skip, limit=limit, search=search)

    async def get_building(self, building_id: UUID) -> Building:
        building = await self.repo.get_by_id(building_id)
        if not building or building.is_deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        return building

    async def create_building(self, building_in: BuildingCreate) -> Building:
        return await self.repo.create(building_in)

    async def update_building(self, building_id: UUID, building_in: BuildingUpdate) -> Building:
        building = await self.get_building(building_id)
        return await self.repo.update(building_id, building_in)

    async def delete_building(self, building_id: UUID) -> bool:
        building = await self.get_building(building_id)
        building.is_deleted = True
        await self.repo.update(building_id, {"is_deleted": True})
        return True

    async def get_building_health(self, building_id: UUID) -> BuildingHealthResponse:
        building = await self.get_building(building_id)
        score = building.health_score
        status_str = "Optimal" if score >= 90 else ("Warning" if score >= 75 else "Critical")
        return BuildingHealthResponse(
            building_id=building.id,
            building_name=building.name,
            health_score=score,
            status=status_str,
            active_alerts=2 if score < 90 else 0,
            sensor_health_avg=98.5,
            energy_efficiency_score=92.0,
        )
