import secrets
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.core.security import get_password_hash
from backend.app.domain.schemas.setting import APIKeyCreate, APIKeyResponse, SettingCreate, SettingResponse, SettingUpdate
from backend.app.infrastructure.db.models.api_key import APIKey
from backend.app.infrastructure.db.models.setting import Setting
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings & API Keys"])


@router.get("", response_model=List[SettingResponse])
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Setting)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=SettingResponse)
async def upsert_setting(
    setting_in: SettingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    query = select(Setting).where(Setting.key == setting_in.key)
    res = await db.execute(query)
    setting = res.scalars().first()

    if setting:
        setting.value = setting_in.value
        setting.category = setting_in.category
        setting.description = setting_in.description
        setting.updated_by_user_id = current_user.id
    else:
        setting = Setting(
            key=setting_in.key,
            value=setting_in.value,
            category=setting_in.category,
            description=setting_in.description,
            organization_id=setting_in.organization_id,
            updated_by_user_id=current_user.id,
        )
        db.add(setting)

    await db.flush()
    await db.refresh(setting)
    return setting


@router.post("/apikeys", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    req: APIKeyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    raw_key = f"vltx_{secrets.token_urlsafe(32)}"
    key_hash = get_password_hash(raw_key)

    api_key_obj = APIKey(
        user_id=current_user.id,
        name=req.name,
        key_hash=key_hash,
        scopes=req.scopes or "read,write",
    )
    db.add(api_key_obj)
    await db.flush()
    await db.refresh(api_key_obj)

    res = APIKeyResponse.model_validate(api_key_obj)
    res.api_key_secret = raw_key
    return res


@router.get("/apikeys", response_model=List[APIKeyResponse])
async def list_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(APIKey).where(APIKey.user_id == current_user.id, APIKey.is_revoked == False)
    res = await db.execute(query)
    return list(res.scalars().all())
