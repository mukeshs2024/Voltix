from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.core.dependencies import CurrentUserDep, UserRepositoryDep
from backend.app.core.security import create_access_token, decode_token, get_password_hash, verify_password
from backend.app.domain.schemas.user import (
    SupabaseTokenAuth,
    Token,
    UserCreate,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    user_repo: UserRepositoryDep,
) -> Any:
    """
    Register a new user in Voltix backend database.
    """
    existing_user = await user_repo.get_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    user_dict = user_in.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))

    new_user = await user_repo.create(user_dict)
    return new_user


@router.post("/login", response_model=Token)
async def login(
    user_repo: UserRepositoryDep,
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = await user_repo.get_by_email(form_data.username)
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )

    access_token = create_access_token(subject=str(user.id), role=user.role)
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: CurrentUserDep,
) -> Any:
    """
    Get current authenticated user profile details.
    """
    return current_user


@router.post("/verify-supabase", response_model=UserResponse)
async def verify_supabase_token(
    payload: SupabaseTokenAuth,
    user_repo: UserRepositoryDep,
) -> Any:
    """
    Verify Supabase JWT token, provision/sync local DB user, and return profile.
    """
    decoded = decode_token(payload.supabase_token)
    if not decoded or "sub" not in decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase Auth token",
        )

    supabase_uid = decoded["sub"]
    email = decoded.get("email", f"{supabase_uid}@supabase.local")
    user_metadata = decoded.get("user_metadata", {})
    full_name = user_metadata.get("full_name") or decoded.get("name")

    user = await user_repo.get_by_supabase_uid(supabase_uid)
    if not user:
        user = await user_repo.get_by_email(email)
        if user:
            # Link existing user with supabase_uid
            user = await user_repo.update(user.id, {"supabase_uid": supabase_uid})
        else:
            # Provision new user from Supabase token info
            user = await user_repo.create({
                "email": email,
                "supabase_uid": supabase_uid,
                "full_name": full_name,
                "role": decoded.get("role", "user"),
                "is_active": True,
            })

    return user
