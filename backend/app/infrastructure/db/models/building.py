from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Building(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "buildings"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
