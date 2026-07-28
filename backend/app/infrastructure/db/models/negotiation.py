from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.infrastructure.db.base import Base, TimestampMixin, UUIDMixin


class Negotiation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "negotiations"

    simulation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    from_agent: Mapped[str] = mapped_column(String(100), nullable=False)
    message_type: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
