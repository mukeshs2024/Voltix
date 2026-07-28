import uuid
from typing import Optional
from sqlalchemy import Boolean, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class AgentDecision(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "agent_decisions"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    building_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="SET NULL"), nullable=True, index=True
    )
    agent_name: Mapped[Optional[str]] = mapped_column(String(100), default="SupervisorAgent", nullable=True)
    final_action: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class SupervisorLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "supervisor_logs"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    supervisor_name: Mapped[str] = mapped_column(String(100), default="ChiefSupervisor", nullable=False)
    decision: Mapped[str] = mapped_column(Text, nullable=False)
    override_applied: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reasoning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class ConsensusLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "consensus_logs"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    proposal: Mapped[str] = mapped_column(Text, nullable=False)
    agreement_score: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="approved", nullable=False) # approved, rejected, negotiated
    participant_agents: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # JSON list of agents
