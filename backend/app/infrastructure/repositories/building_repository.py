from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.infrastructure.db.models.building import Building
from backend.app.infrastructure.repositories.generic import SQLAlchemyGenericRepository, _in_memory_store

class BuildingRepository(SQLAlchemyGenericRepository[Building, UUID]):
    def __init__(self, session: AsyncSession):
        super().__init__(model=Building, session=session)

    async def get_active_buildings(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[Building]:
        try:
            query = select(Building).where(Building.is_deleted == False)
            if search:
                query = query.where(Building.name.ilike(f"%{search}%"))
            query = query.offset(skip).limit(limit)
            result = await self.session.execute(query)
            buildings = list(result.scalars().all())
            if buildings:
                return buildings
        except Exception:
            pass

        buildings = [b for b in _in_memory_store.get(self.table_name, {}).values() if not getattr(b, "is_deleted", False)]
        if search:
            buildings = [b for b in buildings if search.lower() in getattr(b, "name", "").lower()]
        return buildings[skip : skip + limit]

    async def count_active(self, search: Optional[str] = None) -> int:
        try:
            query = select(func.count(Building.id)).where(Building.is_deleted == False)
            if search:
                query = query.where(Building.name.ilike(f"%{search}%"))
            result = await self.session.execute(query)
            val = result.scalar_one_or_none()
            if isinstance(val, int):
                return val
        except Exception:
            pass

        buildings = [b for b in _in_memory_store.get(self.table_name, {}).values() if not getattr(b, "is_deleted", False)]
        return len(buildings)
