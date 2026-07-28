from datetime import datetime, timezone
from fastapi import APIRouter, status
from sqlalchemy import text
from backend.app.core.dependencies import DatabaseDep, RedisDep

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(db: DatabaseDep, redis: RedisDep):
    """
    Health check endpoint validating system status, PostgreSQL, and Redis connectivity.
    """
    db_status = "healthy"
    redis_status = "healthy"

    try:
        res = await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    try:
        await redis.ping()
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    is_healthy = not ("unhealthy" in db_status or "unhealthy" in redis_status)

    return {
        "status": "ok" if is_healthy else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "database": db_status,
            "redis": redis_status,
        },
    }
