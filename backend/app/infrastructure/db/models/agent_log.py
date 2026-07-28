from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, UUIDMixin


class AgentLog(Base, UUIDMixin):
    __tablename__ = "agent_logs"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    proposal: Mapped[str] = mapped_column(Text, nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=True)
    impact: Mapped[str] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
