import uuid
from typing import Optional
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Telemetry(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "telemetry"

    building_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    zone_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    sensor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sensors.id", ondelete="SET NULL"), nullable=True, index=True
    )
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    occupancy_count: Mapped[int] = mapped_column(Integer, nullable=False)
    power_usage: Mapped[float] = mapped_column(Float, nullable=False)
    co2_level: Mapped[Optional[float]] = mapped_column(Float, default=400.0, nullable=True)
