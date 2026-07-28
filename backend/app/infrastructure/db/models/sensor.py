import uuid
from typing import Optional
from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Sensor(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sensors"

    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("devices.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sensor_type: Mapped[str] = mapped_column(String(100), nullable=False) # temperature, humidity, occupancy, co2, power
    unit: Mapped[str] = mapped_column(String(50), nullable=False) # C, %, count, ppm, kW
    current_value: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    min_threshold: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    max_threshold: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
