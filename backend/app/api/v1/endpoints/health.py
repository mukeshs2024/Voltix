from datetime import datetime, timezone
from fastapi import APIRouter, status
from sqlalchemy import text
from backend.app.core.dependencies import DatabaseDep, RedisDep

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(db: DatabaseDep):
    """
    Health check endpoint validating system status and PostgreSQL connectivity.
    """
    db_status = "healthy"
    db_version = None

    try:
        res = await db.execute(text("SELECT version();"))
        db_version = res.scalar()
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "database": db_status,
            "supabase_postgres_version": db_version,
        },
    }

