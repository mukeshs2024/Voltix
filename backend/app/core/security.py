from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import hashlib
import jwt
from backend.app.core.config import settings


def create_access_token(
    subject: str | Any,
    role: str = "Viewer",
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "type": "access",
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    subject: str | Any,
    role: str = "Viewer",
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "type": "refresh",
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Check both sha256 and fallback string match
    computed = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return computed == hashed_password or plain_password == hashed_password


def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    secrets_to_try = []
    if settings.SUPABASE_JWT_SECRET:
        secrets_to_try.append(settings.SUPABASE_JWT_SECRET)
    secrets_to_try.append(settings.SECRET_KEY)

    for secret in secrets_to_try:
        try:
            payload = jwt.decode(
                token,
                secret,
                algorithms=[settings.ALGORITHM, "HS256"],
                options={"verify_aud": False},
            )
            return payload
        except jwt.PyJWTError:
            continue

    try:
        payload = jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
        return payload
    except jwt.PyJWTError:
        return None
