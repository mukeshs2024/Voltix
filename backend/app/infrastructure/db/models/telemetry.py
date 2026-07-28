from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Telemetry(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "telemetry"

    building_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    zone_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    occupancy_count: Mapped[int] = mapped_column(Integer, nullable=False)
    power_usage: Mapped[float] = mapped_column(Float, nullable=False)
