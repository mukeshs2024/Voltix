import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.domain.interfaces.base import IBaseRepository
from backend.app.infrastructure.db.base import Base

T = TypeVar("T", bound=Base)
ID = TypeVar("ID")

_in_memory_store: Dict[str, Dict[Any, Any]] = {}

class SQLAlchemyGenericRepository(IBaseRepository[T, ID], Generic[T, ID]):
    """
    Generic Async SQLAlchemy Repository with in-memory fallback when DB is offline.
    """

    def __init__(self, model: Type[T], session: AsyncSession):
        self.model = model
        self.session = session
        self.table_name = getattr(model, "__tablename__", str(model))
        if self.table_name not in _in_memory_store:
            _in_memory_store[self.table_name] = {}

    async def get_by_id(self, id: ID) -> Optional[T]:
        try:
            result = await self.session.execute(
                select(self.model).where(self.model.id == id)
            )
            return result.scalars().first()
        except Exception:
            return _in_memory_store[self.table_name].get(str(id))

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        try:
            result = await self.session.execute(
                select(self.model).offset(skip).limit(limit)
            )
            return list(result.scalars().all())
        except Exception:
            items = list(_in_memory_store[self.table_name].values())
            return items[skip : skip + limit]

    async def create(self, obj_in: Any) -> T:
        now = datetime.now(timezone.utc)
        data = obj_in if isinstance(obj_in, dict) else (obj_in.model_dump() if hasattr(obj_in, "model_dump") else {})

        if isinstance(obj_in, dict) or hasattr(obj_in, "model_dump"):
            if "id" not in data or not data["id"]:
                data["id"] = uuid.uuid4()
            data.setdefault("created_at", now)
            data.setdefault("updated_at", now)
            data.setdefault("is_superuser", False)
            data.setdefault("is_active", True)
            data.setdefault("is_deleted", False)

            valid_kwargs = {k: v for k, v in data.items() if hasattr(self.model, k)}
            db_obj = self.model(**valid_kwargs)
        else:
            db_obj = obj_in

        if not getattr(db_obj, "id", None):
            setattr(db_obj, "id", uuid.uuid4())
        if not getattr(db_obj, "created_at", None):
            setattr(db_obj, "created_at", now)
        if not getattr(db_obj, "updated_at", None):
            setattr(db_obj, "updated_at", now)
        if hasattr(db_obj, "is_superuser") and getattr(db_obj, "is_superuser", None) is None:
            setattr(db_obj, "is_superuser", False)
        if hasattr(db_obj, "is_active") and getattr(db_obj, "is_active", None) is None:
            setattr(db_obj, "is_active", True)
        if hasattr(db_obj, "status") and getattr(db_obj, "status", None) is None:
            setattr(db_obj, "status", "open" if self.table_name == "alerts" else "generated")
        if hasattr(db_obj, "is_deleted") and getattr(db_obj, "is_deleted", None) is None:
            setattr(db_obj, "is_deleted", False)
        if hasattr(db_obj, "download_count") and getattr(db_obj, "download_count", None) is None:
            setattr(db_obj, "download_count", 0)

        try:
            self.session.add(db_obj)
            await self.session.flush()
            await self.session.refresh(db_obj)
        except Exception:
            pass

        _in_memory_store[self.table_name][str(getattr(db_obj, "id"))] = db_obj
        return db_obj

    async def update(self, id: ID, obj_in: Any) -> Optional[T]:
        now = datetime.now(timezone.utc)
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return None

        update_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        update_data["updated_at"] = now
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        try:
            self.session.add(db_obj)
            await self.session.flush()
            await self.session.refresh(db_obj)
        except Exception:
            pass

        _in_memory_store[self.table_name][str(id)] = db_obj
        return db_obj

    async def delete(self, id: ID) -> bool:
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return False

        try:
            await self.session.delete(db_obj)
            await self.session.flush()
        except Exception:
            pass

        _in_memory_store[self.table_name].pop(str(id), None)
        return True
