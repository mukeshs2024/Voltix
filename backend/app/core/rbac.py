from enum import Enum
from typing import List
from fastapi import HTTPException, status, Depends
from backend.app.core.dependencies import get_current_user
from backend.app.infrastructure.db.models.user import User

class RoleEnum(str, Enum):
    ADMIN = "Admin"
    FACILITY_MANAGER = "Facility Manager"
    OPERATOR = "Operator"
    VIEWER = "Viewer"

class PermissionEnum(str, Enum):
    READ = "Read"
    WRITE = "Write"
    DELETE = "Delete"
    EXPORT = "Export"
    SIMULATION = "Simulation"
    AI_CONTROL = "AI Control"

# Defined permissions for each role
ROLE_PERMISSIONS_MATRIX = {
    RoleEnum.ADMIN: [
        PermissionEnum.READ,
        PermissionEnum.WRITE,
        PermissionEnum.DELETE,
        PermissionEnum.EXPORT,
        PermissionEnum.SIMULATION,
        PermissionEnum.AI_CONTROL,
    ],
    RoleEnum.FACILITY_MANAGER: [
        PermissionEnum.READ,
        PermissionEnum.WRITE,
        PermissionEnum.EXPORT,
        PermissionEnum.SIMULATION,
        PermissionEnum.AI_CONTROL,
    ],
    RoleEnum.OPERATOR: [
        PermissionEnum.READ,
        PermissionEnum.WRITE,
        PermissionEnum.EXPORT,
        PermissionEnum.SIMULATION,
    ],
    RoleEnum.VIEWER: [
        PermissionEnum.READ,
        PermissionEnum.EXPORT,
    ],
}

def has_permission(user_role: str, required_permission: PermissionEnum) -> bool:
    normalized_role = user_role.title() if user_role else RoleEnum.VIEWER
    if normalized_role not in ROLE_PERMISSIONS_MATRIX:
        if normalized_role.lower() in ("admin", "superuser"):
            normalized_role = RoleEnum.ADMIN
        else:
            normalized_role = RoleEnum.VIEWER

    allowed_permissions = ROLE_PERMISSIONS_MATRIX.get(normalized_role, [])
    return required_permission in allowed_permissions


def require_permissions(required_permissions: List[PermissionEnum]):
    async def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = getattr(current_user, "role", RoleEnum.VIEWER)
        for perm in required_permissions:
            if not has_permission(user_role, perm):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role '{user_role}' lacks required permission: '{perm}'",
                )
        return current_user

    return permission_checker
