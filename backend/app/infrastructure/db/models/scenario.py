import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Scenario(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scenarios"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    template_type: Mapped[str] = mapped_column(String(100), nullable=False) # Morning Rush, Conference, Ghost Booking, Fire Drill, Holiday, HVAC Failure
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    config_data: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # JSON config string
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class SimulationRun(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "simulation_runs"

    scenario_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scenarios.id", ondelete="SET NULL"), nullable=True, index=True
    )
    building_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="SET NULL"), nullable=True, index=True
    )
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False) # pending, running, paused, completed, failed, reset
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    metrics_data: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # JSON formatted step metrics
    started_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )


class OptimizationHistory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "optimization_history"

    building_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="SET NULL"), nullable=True, index=True
    )
    simulation_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("simulation_runs.id", ondelete="SET NULL"), nullable=True, index=True
    )
    initial_energy_kwh: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    optimized_energy_kwh: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    energy_saved_pct: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    recommendation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
