from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID

from app.db.engine import get_db
from app.db.models.soil_report import SoilReport
from app.db.models.user import User
from app.schemas.soil import SoilReportCreate, SoilReportResponse
from app.dependencies import get_current_user
from app.utils.ownership import verify_farm_owner

router = APIRouter(prefix="/farms/{farm_id}/soil-reports", tags=["Soil Reports"])

@router.post("", response_model=SoilReportResponse, status_code=status.HTTP_201_CREATED)
async def create_soil_report(
    farm_id: UUID,
    report_in: SoilReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await verify_farm_owner(farm_id, current_user.id, db)
    
    new_report = SoilReport(**report_in.model_dump(), farm_id=farm_id)
    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)
    return new_report

@router.get("", response_model=List[SoilReportResponse])
async def get_soil_reports(
    farm_id: UUID,
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await verify_farm_owner(farm_id, current_user.id, db)

    # Total count
    count_stmt = select(func.count(SoilReport.id)).where(SoilReport.farm_id == farm_id)
    total_count = (await db.execute(count_stmt)).scalar() or 0
    response.headers["X-Total-Count"] = str(total_count)

    stmt = select(SoilReport).where(
        SoilReport.farm_id == farm_id
    ).offset(skip).limit(limit).order_by(SoilReport.reported_at.desc())
    
    result = await db.execute(stmt)
    reports = result.scalars().all()
    return reports

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_soil_report(
    farm_id: UUID,
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await verify_farm_owner(farm_id, current_user.id, db)
    
    result = await db.execute(
        select(SoilReport).where(SoilReport.id == report_id, SoilReport.farm_id == farm_id)
    )
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Soil report not found"
        )
        
    await db.delete(report)
    await db.commit()
    return None
