from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import UserRepositoryDep
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.user import UserResponse, UserUpdate
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
async def list_users(
    user_repo: UserRepositoryDep,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    return await user_repo.get_all(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: UUID,
    user_repo: UserRepositoryDep,
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    user_repo: UserRepositoryDep,
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    user = await user_repo.update(user_id, user_in)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    user_repo: UserRepositoryDep,
    current_user: User = Depends(require_permissions([PermissionEnum.DELETE])),
):
    success = await user_repo.delete(user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return None
