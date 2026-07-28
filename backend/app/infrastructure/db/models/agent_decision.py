from sqlalchemy import Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class AgentDecision(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "agent_decisions"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    final_action: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
