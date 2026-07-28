from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.rbac import PermissionEnum, require_permissions
from backend.app.domain.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from backend.app.infrastructure.db.models.organization import Organization
from backend.app.infrastructure.db.models.user import User

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.get("", response_model=List[OrganizationResponse])
async def list_organizations(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Organization).where(Organization.is_deleted == False).offset(skip).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    org = Organization(**org_in.model_dump())
    db.add(org)
    await db.flush()
    await db.refresh(org)
    return org


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.READ])),
):
    query = select(Organization).where(Organization.id == org_id, Organization.is_deleted == False)
    res = await db.execute(query)
    org = res.scalars().first()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    org_in: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permissions([PermissionEnum.WRITE])),
):
    query = select(Organization).where(Organization.id == org_id, Organization.is_deleted == False)
    res = await db.execute(query)
    org = res.scalars().first()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    
    for k, v in org_in.model_dump(exclude_unset=True).items():
        setattr(org, k, v)
    db.add(org)
    await db.flush()
    await db.refresh(org)
    return org
