import uuid
from typing import Optional
from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Zone(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "zones"

    floor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("floors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    zone_type: Mapped[str] = mapped_column(String(100), default="HVAC", nullable=False)
    target_temp: Mapped[Optional[float]] = mapped_column(Float, default=22.0, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
