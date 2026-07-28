from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.domain.interfaces.user_repository import IUserRepository
from backend.app.infrastructure.db.models.user import User
from backend.app.infrastructure.repositories.generic import SQLAlchemyGenericRepository


class UserRepository(SQLAlchemyGenericRepository[User, UUID], IUserRepository):
    """
    SQLAlchemy implementation of User repository.
    """

    def __init__(self, session: AsyncSession):
        super().__init__(model=User, session=session)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()

    async def get_by_supabase_uid(self, supabase_uid: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(User.supabase_uid == supabase_uid)
        )
        return result.scalars().first()
