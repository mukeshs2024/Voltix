from abc import ABC, abstractmethod
from typing import Any, Generic, List, Optional, TypeVar

T = TypeVar("T")
ID = TypeVar("ID")


class IBaseRepository(ABC, Generic[T, ID]):
    """
    Abstract Generic Repository Interface following Clean Architecture.
    Defines strict database interaction contracts.
    """

    @abstractmethod
    async def get_by_id(self, id: ID) -> Optional[T]:
        """Retrieve a single entity by its primary key."""
        pass

    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Retrieve all entities with pagination."""
        pass

    @abstractmethod
    async def create(self, obj_in: Any) -> T:
        """Create and persist a new entity."""
        pass

    @abstractmethod
    async def update(self, id: ID, obj_in: Any) -> Optional[T]:
        """Update an existing entity by ID."""
        pass

    @abstractmethod
    async def delete(self, id: ID) -> bool:
        """Delete an entity by ID."""
        pass
