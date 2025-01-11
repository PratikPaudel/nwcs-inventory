from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from ..models.schemas import Equipment, EquipmentCreate
from config.database import supabase

router = APIRouter()


@router.get("/equipment", response_model=List[Equipment])
async def get_equipment(
    status: Optional[str] = None,
    location_id: Optional[int] = None,
    search: Optional[str] = None,
):
    query = supabase.table("equipment").select("*")

    if status:
        query = query.eq("status", status)
    if location_id:
        query = query.eq("location_id", location_id)
    if search:
        query = query.or_(
            f"asset_tag.ilike.%{search}%,device_name.ilike.%{search}%,serial_number.ilike.%{search}%"
        )

    response = query.execute()

    if response.error:
        raise HTTPException(status_code=400, detail=str(response.error))

    return response.data


@router.get("/equipment/{equipment_id}", response_model=Equipment)
async def get_equipment_detail(equipment_id: int):
    response = (
        supabase.table("equipment")
        .select("*")
        .eq("equipment_id", equipment_id)
        .single()
        .execute()
    )

    if response.error:
        raise HTTPException(status_code=404, detail="Equipment not found")

    return response.data
