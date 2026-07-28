from abc import abstractmethod
from typing import Optional
from uuid import UUID

from backend.app.domain.interfaces.base import IBaseRepository
from backend.app.infrastructure.db.models.user import User


class IUserRepository(IBaseRepository[User, UUID]):
    """
    User repository interface contract.
    """

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_by_supabase_uid(self, supabase_uid: str) -> Optional[User]:
        pass
