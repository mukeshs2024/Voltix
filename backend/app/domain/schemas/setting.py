from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class SettingBase(BaseModel):
    key: str
    value: str
    category: str = "system"
    description: Optional[str] = None

class SettingCreate(SettingBase):
    organization_id: Optional[UUID] = None

class SettingUpdate(BaseModel):
    value: str
    category: Optional[str] = None
    description: Optional[str] = None

class SettingResponse(SettingBase):
    id: UUID
    organization_id: Optional[UUID] = None
    updated_by_user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class APIKeyCreate(BaseModel):
    name: str
    scopes: Optional[str] = None
    expires_in_days: Optional[int] = 30

class APIKeyResponse(BaseModel):
    id: UUID
    name: str
    key_hash: str
    api_key_secret: Optional[str] = None # Returned only once upon creation
    scopes: Optional[str] = None
    expires_at: Optional[datetime] = None
    is_revoked: bool
    last_used_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
