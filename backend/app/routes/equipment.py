from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.schemas import Equipment, EquipmentCreate
from ..config.database import supabase
import logging

router = APIRouter()


@router.get("/equipment")
async def get_equipment():
    try:
        response = (
            supabase.from_("equipment")
            .select(
                """
                *,
                equipment_assignments (
                    device_users (
                        first_name,
                        last_name
                    )
                ),
                locations (
                    buildings (
                        building_name
                    ),
                    floor_number,
                    room_number
                )
            """
            )
            .execute()
        )

        # Transform the data to include the latest assignment and location
        equipment_list = []
        for item in response.data:
            # Get current assignment if exists
            current_assignment = None
            if item.get("equipment_assignments"):
                # Get the most recent assignment
                current_assignment = sorted(
                    item["equipment_assignments"],
                    key=lambda x: x.get("assignment_start_date", ""),
                    reverse=True,
                )[0]

            # Format the data
            equipment_data = {
                "equipment_id": item.get("equipment_id"),
                "asset_tag": item.get("asset_tag"),
                "device_name": item.get("device_name"),
                "manufacturer": item.get("manufacturer"),
                "model": item.get("model"),
                "form_factor": item.get("form_factor"),
                "status": item.get("status"),
                "assigned_to": (
                    current_assignment.get("device_users")
                    if current_assignment
                    else None
                ),
                "location": (
                    {
                        "building_name": item.get("locations", {})
                        .get("buildings", {})
                        .get("building_name"),
                        "floor_number": item.get("locations", {}).get("floor_number"),
                        "room_number": item.get("locations", {}).get("room_number"),
                    }
                    if item.get("locations")
                    else None
                ),
            }
            equipment_list.append(equipment_data)

        return equipment_list

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/equipment/{equipment_id}", response_model=dict)
async def get_equipment_detail(equipment_id: int):
    """
    Get detailed equipment information including location, assignment history, and current status.
    """
    response = (
        supabase.from_("equipment")
        .select(
            """
            *,
            location:locations (
                location_id,
                floor_number,
                room_number,
                building:buildings (
                    building_name,
                    building_short_name
                )
            ),
            current_assignment:equipment_assignments (
                assignment_id,
                assignment_start_date,
                assignment_purpose,
                device_user:device_users (
                    first_name,
                    last_name,
                    email,
                    department:departments (
                        department_name
                    )
                )
            ),
            history:equipment_history (
                history_id,
                status,
                location_id,
                device_user_id,
                assignment_start_date,
                assignment_end_date,
                change_date
            )
        """
        )
        .eq("equipment_id", equipment_id)
        .single()
        .execute()
    )

    if response.error:
        raise HTTPException(status_code=404, detail="Equipment not found")

    return response.data


@router.post("/equipment", response_model=Equipment)
async def create_equipment(equipment: EquipmentCreate):
    """
    Create new equipment
    """
    response = supabase.table("equipment").insert(equipment.model_dump()).execute()

    if response.error:
        raise HTTPException(status_code=400, detail=str(response.error))

    return response.data[0]


@router.put("/equipment/{equipment_id}", response_model=Equipment)
async def update_equipment(equipment_id: int, equipment: dict):
    """
    Update equipment details
    """
    response = (
        supabase.table("equipment")
        .update(equipment)
        .eq("equipment_id", equipment_id)
        .execute()
    )

    if response.error:
        raise HTTPException(status_code=400, detail=str(response.error))

    return response.data[0]
