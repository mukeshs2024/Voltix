from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: str = "info"
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    user_id: Optional[UUID] = None

class NotificationResponse(NotificationBase):
    id: UUID
    user_id: Optional[UUID] = None
    is_read: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
