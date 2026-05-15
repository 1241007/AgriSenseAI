from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from typing import List
from uuid import UUID

from app.db.engine import get_db
from app.db.models.farm import Farm
from app.db.models.user import User
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.dependencies import get_current_user
from app.utils.ownership import verify_farm_owner

router = APIRouter(prefix="/farms", tags=["Farms"])

@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
async def create_farm(
    farm_in: FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_farm = Farm(**farm_in.model_dump(), user_id=current_user.id)
    db.add(new_farm)
    await db.commit()
    await db.refresh(new_farm)
    return new_farm

@router.get("", response_model=List[FarmResponse])
async def get_farms(
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total count
    count_stmt = select(func.count(Farm.id)).where(
        Farm.user_id == current_user.id,
        Farm.is_deleted == False
    )
    total_count = (await db.execute(count_stmt)).scalar() or 0
    response.headers["X-Total-Count"] = str(total_count)

    stmt = select(Farm).where(
        Farm.user_id == current_user.id,
        Farm.is_deleted == False
    ).offset(skip).limit(limit).order_by(Farm.created_at.desc())
    
    result = await db.execute(stmt)
    farms = result.scalars().all()
    return farms

@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(
    farm_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = await verify_farm_owner(farm_id, current_user.id, db)
    return farm

@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(
    farm_id: UUID,
    farm_in: FarmUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = await verify_farm_owner(farm_id, current_user.id, db)
    
    update_data = farm_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(farm, key, value)
        
    await db.commit()
    await db.refresh(farm)
    return farm

@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_farm(
    farm_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = await verify_farm_owner(farm_id, current_user.id, db)
    farm.is_deleted = True
    await db.commit()
    return None
