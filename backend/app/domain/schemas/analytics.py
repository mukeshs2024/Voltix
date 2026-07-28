from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

class DashboardOverview(BaseModel):
    total_buildings: int
    active_devices: int
    open_alerts: int
    overall_health_score: float
    total_energy_kwh: float
    avg_occupancy: float
    ai_optimization_savings_pct: float

class BuildingComparisonItem(BaseModel):
    building_id: UUID
    building_name: str
    energy_kwh: float
    avg_temperature: float
    occupancy_count: int
    health_score: float

class BuildingComparisonResponse(BaseModel):
    buildings: List[BuildingComparisonItem]
    timeframe: str

class EnergyAnalytics(BaseModel):
    total_power_usage_kw: float
    peak_demand_kw: float
    estimated_cost_usd: float
    projected_savings_usd: float
    hourly_trend: List[float]

class OccupancyAnalytics(BaseModel):
    current_occupancy: int
    peak_occupancy: int
    avg_zone_occupancy: float
    high_occupancy_zones: List[str]
