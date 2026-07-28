import uuid
from typing import Optional
from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Building(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "buildings"

    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    total_floors: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    square_feet: Mapped[float] = mapped_column(Float, default=10000.0, nullable=False)
    health_score: Mapped[float] = mapped_column(Float, default=95.0, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
