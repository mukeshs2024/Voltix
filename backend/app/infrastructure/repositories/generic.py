from typing import Any, Generic, List, Optional, Type, TypeVar
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.domain.interfaces.base import IBaseRepository
from backend.app.infrastructure.db.base import Base

T = TypeVar("T", bound=Base)
ID = TypeVar("ID")


class SQLAlchemyGenericRepository(IBaseRepository[T, ID], Generic[T, ID]):
    """
    Generic Async SQLAlchemy Repository implementing standard CRUD operations.
    """

    def __init__(self, model: Type[T], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id: ID) -> Optional[T]:
        result = await self.session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        result = await self.session.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, obj_in: Any) -> T:
        if isinstance(obj_in, dict):
            db_obj = self.model(**obj_in)
        elif hasattr(obj_in, "model_dump"):
            db_obj = self.model(**obj_in.model_dump())
        else:
            db_obj = obj_in

        self.session.add(db_obj)
        await self.session.flush()
        await self.session.refresh(db_obj)
        return db_obj

    async def update(self, id: ID, obj_in: Any) -> Optional[T]:
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return None

        update_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        self.session.add(db_obj)
        await self.session.flush()
        await self.session.refresh(db_obj)
        return db_obj

    async def delete(self, id: ID) -> bool:
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return False

        await self.session.delete(db_obj)
        await self.session.flush()
        return True
