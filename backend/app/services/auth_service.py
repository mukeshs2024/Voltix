from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.security import create_access_token, create_refresh_token, get_password_hash, verify_password, decode_token
from backend.app.domain.schemas.auth import LoginRequest, TokenResponse
from backend.app.infrastructure.db.models.user import User
from backend.app.infrastructure.repositories.user import UserRepository

class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session=session)

    async def authenticate_user(self, login_data: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(login_data.email)
        if not user or not user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        access_token = create_access_token(subject=user.email, role=user.role)
        refresh_token = create_refresh_token(subject=user.email, role=user.role)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    async def refresh_token(self, refresh_token_str: str) -> TokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        user_email = payload.get("sub")
        role = payload.get("role", "Viewer")
        user = await self.user_repo.get_by_email(user_email)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User inactive or missing",
            )

        new_access = create_access_token(subject=user.email, role=role)
        new_refresh = create_refresh_token(subject=user.email, role=role)
        return TokenResponse(access_token=new_access, refresh_token=new_refresh)
