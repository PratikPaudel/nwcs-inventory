from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..config.database import supabase

router = APIRouter()


@router.get("/buildings", response_model=List[dict])
async def get_buildings():
    try:
        response = supabase.from_("buildings").select("*").execute()
        return response.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/buildings/{building_id}", response_model=dict)
async def get_building(building_id: int):
    try:
        response = (
            supabase.from_("buildings")
            .select(
                """
                *,
                locations (
                    location_id,
                    floor_number,
                    room_number,
                    description
                )
            """
            )
            .eq("building_id", building_id)
            .single()
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(status_code=404, detail="Building not found")
