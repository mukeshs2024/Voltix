import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Equipment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "equipment"

    building_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    model_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    manufacturer: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    installation_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="operational", nullable=False) # operational, maintenance_required, fault


class Maintenance(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "maintenance_records"

    equipment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("equipment.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    maintenance_type: Mapped[str] = mapped_column(String(50), default="preventive", nullable=False) # preventive, corrective, emergency
    scheduled_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    technician: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    cost: Mapped[Optional[float]] = mapped_column(Float, default=0.0, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="scheduled", nullable=False) # scheduled, in_progress, completed
