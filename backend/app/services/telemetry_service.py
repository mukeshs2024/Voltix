from datetime import datetime
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.domain.schemas.telemetry import AggregatedTelemetry, TelemetryCreate, TelemetryFilter
from backend.app.infrastructure.db.models.telemetry import Telemetry
from backend.app.infrastructure.repositories.telemetry_repository import TelemetryRepository

class TelemetryService:
    def __init__(self, session: AsyncSession):
        self.repo = TelemetryRepository(session=session)

    async def ingest_telemetry(self, telemetry_in: TelemetryCreate) -> Telemetry:
        return await self.repo.create(telemetry_in)

    async def query_telemetry(self, filter_params: TelemetryFilter) -> List[Telemetry]:
        return await self.repo.query_telemetry(
            building_id=filter_params.building_id,
            zone_id=filter_params.zone_id,
            sensor_id=filter_params.sensor_id,
            start_time=filter_params.start_time,
            end_time=filter_params.end_time,
            limit=filter_params.limit,
            skip=filter_params.skip,
        )

    async def get_latest(self, building_id: str) -> Optional[Telemetry]:
        return await self.repo.get_latest_for_building(building_id=building_id)

    async def aggregate(self, building_id: Optional[str] = None) -> AggregatedTelemetry:
        res = await self.repo.aggregate_telemetry(building_id=building_id)
        return AggregatedTelemetry(**res)
