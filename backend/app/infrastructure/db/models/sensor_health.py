import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class SensorHealth(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sensor_health"

    sensor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sensors.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    health_status: Mapped[str] = mapped_column(String(50), default="healthy", nullable=False) # healthy, warning, critical, offline
    battery_level: Mapped[Optional[float]] = mapped_column(Float, default=100.0, nullable=True)
    signal_strength: Mapped[Optional[float]] = mapped_column(Float, default=95.0, nullable=True)
    last_ping: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
