from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..config.database import supabase

router = APIRouter()


@router.get("/locations", response_model=List[dict])
async def get_locations(
    building_id: Optional[int] = None, floor_number: Optional[int] = None
):
    try:
        query = supabase.from_("locations").select(
            """
                *,
                building:buildings (
                    building_id,
                    building_name,
                    building_short_name
                )
            """
        )

        if building_id:
            query = query.eq("building_id", building_id)
        if floor_number:
            query = query.eq("floor_number", floor_number)

        response = query.execute()
        return response.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/locations/{location_id}", response_model=dict)
async def get_location(location_id: int):
    try:
        response = (
            supabase.from_("locations")
            .select(
                """
                *,
                building:buildings (
                    building_id,
                    building_name,
                    building_short_name
                )
            """
            )
            .eq("location_id", location_id)
            .single()
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(status_code=404, detail="Location not found")
