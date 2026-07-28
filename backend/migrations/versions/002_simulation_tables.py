"""Simulation tables migration

Revision ID: 002_simulation_tables
Revises: 001_initial_users
Create Date: 2026-07-28 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "002_simulation_tables"
down_revision: Union[str, None] = "001_initial_users"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. buildings table
    op.create_table(
        "buildings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_buildings_name"), "buildings", ["name"], unique=False)

    # 2. telemetry table
    op.create_table(
        "telemetry",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("building_id", sa.String(length=100), nullable=False),
        sa.Column("zone_id", sa.String(length=100), nullable=False),
        sa.Column("temperature", sa.Float(), nullable=False),
        sa.Column("humidity", sa.Float(), nullable=False),
        sa.Column("occupancy_count", sa.Integer(), nullable=False),
        sa.Column("power_usage", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_telemetry_building_id"), "telemetry", ["building_id"], unique=False)
    op.create_index(op.f("ix_telemetry_zone_id"), "telemetry", ["zone_id"], unique=False)

    # 3. agent_decisions table
    op.create_table(
        "agent_decisions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("simulation_id", sa.String(length=100), nullable=False),
        sa.Column("final_action", sa.Text(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_agent_decisions_simulation_id"), "agent_decisions", ["simulation_id"], unique=False)

    # 4. agent_logs table
    op.create_table(
        "agent_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("simulation_id", sa.String(length=100), nullable=False),
        sa.Column("agent_name", sa.String(length=100), nullable=False),
        sa.Column("proposal", sa.Text(), nullable=False),
        sa.Column("reasoning", sa.Text(), nullable=True),
        sa.Column("impact", sa.Text(), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_agent_logs_simulation_id"), "agent_logs", ["simulation_id"], unique=False)

    # 5. negotiations table
    op.create_table(
        "negotiations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("simulation_id", sa.String(length=100), nullable=False),
        sa.Column("from_agent", sa.String(length=100), nullable=False),
        sa.Column("message_type", sa.String(length=100), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_negotiations_simulation_id"), "negotiations", ["simulation_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_negotiations_simulation_id"), table_name="negotiations")
    op.drop_table("negotiations")
    op.drop_index(op.f("ix_agent_logs_simulation_id"), table_name="agent_logs")
    op.drop_table("agent_logs")
    op.drop_index(op.f("ix_agent_decisions_simulation_id"), table_name="agent_decisions")
    op.drop_table("agent_decisions")
    op.drop_index(op.f("ix_telemetry_zone_id"), table_name="telemetry")
    op.drop_index(op.f("ix_telemetry_building_id"), table_name="telemetry")
    op.drop_table("telemetry")
    op.drop_index(op.f("ix_buildings_name"), table_name="buildings")
    op.drop_table("buildings")
