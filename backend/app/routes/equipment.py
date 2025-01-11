from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.schemas import Equipment, EquipmentCreate
from ..config.database import supabase
import logging

router = APIRouter()


@router.get("/equipment", response_model=List[dict])
async def get_equipment(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    location_id: Optional[int] = None,
    search: Optional[str] = None,
    manufacturer: Optional[str] = None,
    model: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
):
    """
    Get equipment with filtering, pagination, and sorting.
    """
    try:
        print("\nProcessing equipment request...")

        # Calculate range for pagination
        start = (page - 1) * page_size
        end = start + page_size - 1
        print(f"Pagination: start={start}, end={end}")

        # Build the select query with foreign key relationships
        select_query = """
            *,
            location:locations (
                location_id,
                floor_number,
                room_number,
                building:buildings (
                    building_name,
                    building_short_name
                )
            )
        """

        query = supabase.from_("equipment").select(select_query)

        # Apply filters
        if status:
            query = query.eq("status", status)
        if location_id:
            query = query.eq("location_id", location_id)
        if manufacturer:
            query = query.ilike("manufacturer", f"%{manufacturer}%")
        if model:
            query = query.ilike("model", f"%{model}%")

        # Apply search if provided
        if search:
            query = query.or_(
                f"asset_tag.ilike.%{search}%,"
                f"device_name.ilike.%{search}%,"
                f"serial_number.ilike.%{search}%"
            )

        # Apply sorting
        if sort_by and sort_order:
            query = query.order(sort_by, desc=(sort_order.lower() == "desc"))

        # Apply pagination
        query = query.range(start, end)

        print("Executing query...")
        response = query.execute()
        print(f"Query response: {response.data if response else 'No response'}")

        return response.data

    except Exception as e:
        print(f"Error in get_equipment: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


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
