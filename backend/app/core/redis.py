from typing import AsyncGenerator, Optional
import redis.asyncio as aioredis
from backend.app.core.config import settings
from backend.app.core.logging import logger

redis_client: Optional[aioredis.Redis] = None


async def init_redis() -> None:
    global redis_client
    try:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
        await redis_client.ping()
        logger.info("Connected to Redis successfully.")
    except Exception as e:
        logger.warning(f"Failed to connect to Redis: {e}")


async def close_redis() -> None:
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("Redis connection closed.")


async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    """
    Dependency generator for Redis connection.
    """
    if redis_client is None:
        raise RuntimeError("Redis client is not initialized.")
    yield redis_client
