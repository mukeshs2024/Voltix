from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    ai,
    alerts,
    analytics,
    audit,
    auth,
    buildings,
    dashboard,
    devices,
    digital_twin,
    equipment,
    floors,
    health,
    notifications,
    organizations,
    reports,
    scenarios,
    sensors,
    settings,
    simulation,
    telemetry,
    users,
    websockets,
    zones,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(digital_twin.router)
api_router.include_router(auth.router)

api_router.include_router(users.router)
api_router.include_router(organizations.router)
api_router.include_router(buildings.router)
api_router.include_router(floors.router)
api_router.include_router(zones.router)
api_router.include_router(devices.router)
api_router.include_router(sensors.router)
api_router.include_router(telemetry.router)
api_router.include_router(analytics.router)
api_router.include_router(dashboard.router)
api_router.include_router(alerts.router)
api_router.include_router(reports.router)
api_router.include_router(scenarios.router)
api_router.include_router(simulation.router)
api_router.include_router(ai.router)
api_router.include_router(equipment.router)
api_router.include_router(notifications.router)
api_router.include_router(settings.router)
api_router.include_router(audit.router)
api_router.include_router(websockets.router)
