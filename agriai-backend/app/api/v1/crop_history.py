from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID

from app.db.engine import get_db
from app.db.models.crop_history import CropHistory
from app.db.models.user import User
from app.schemas.crop_history import CropHistoryCreate, CropHistoryResponse
from app.dependencies import get_current_user
from app.utils.ownership import verify_farm_owner

router = APIRouter(prefix="/farms/{farm_id}/crop-history", tags=["Crop History"])

@router.post("", response_model=CropHistoryResponse, status_code=status.HTTP_201_CREATED)
async def create_crop_history(
    farm_id: UUID,
    history_in: CropHistoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await verify_farm_owner(farm_id, current_user.id, db)
    
    new_history = CropHistory(**history_in.model_dump(), farm_id=farm_id)
    db.add(new_history)
    await db.commit()
    await db.refresh(new_history)
    return new_history

@router.get("", response_model=List[CropHistoryResponse])
async def get_crop_history(
    farm_id: UUID,
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await verify_farm_owner(farm_id, current_user.id, db)

    # Total count
    count_stmt = select(func.count(CropHistory.id)).where(CropHistory.farm_id == farm_id)
    total_count = (await db.execute(count_stmt)).scalar() or 0
    response.headers["X-Total-Count"] = str(total_count)

    stmt = select(CropHistory).where(
        CropHistory.farm_id == farm_id
    ).offset(skip).limit(limit).order_by(CropHistory.sown_at.desc())
    
    result = await db.execute(stmt)
    history = result.scalars().all()
    return history
