from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.db.models.farm import Farm

async def verify_farm_owner(farm_id: UUID, user_id: UUID, session: AsyncSession) -> Farm:
    """
    Verify that a farm exists, is not deleted, and belongs to the specified user.
    Raises HTTPException if verification fails.
    Returns the Farm object.
    """
    result = await session.execute(
        select(Farm).where(Farm.id == farm_id, Farm.is_deleted == False)
    )
    farm = result.scalar_one_or_none()

    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    if str(farm.user_id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this farm"
        )
        
    return farm
