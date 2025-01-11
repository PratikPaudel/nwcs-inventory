from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..config.database import supabase

router = APIRouter()


@router.get("/device-users", response_model=List[dict])
async def get_device_users(
    department_id: Optional[int] = None,
    employment_type_id: Optional[int] = None,
    search: Optional[str] = None,
):
    try:
        query = supabase.from_("device_users").select(
            """
                *,
                department:departments (
                    department_id,
                    department_name,
                    department_short_name
                ),
                employment_type:employment_types (
                    employment_type_id,
                    employment_type_name
                )
            """
        )

        if department_id:
            query = query.eq("department_id", department_id)
        if employment_type_id:
            query = query.eq("employment_type_id", employment_type_id)
        if search:
            query = query.or_(
                f"first_name.ilike.%{search}%,"
                f"last_name.ilike.%{search}%,"
                f"email.ilike.%{search}%"
            )

        response = query.execute()
        return response.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/device-users/{device_user_id}", response_model=dict)
async def get_device_user(device_user_id: int):
    try:
        response = (
            supabase.from_("device_users")
            .select(
                """
                *,
                department:departments (
                    department_id,
                    department_name,
                    department_short_name
                ),
                employment_type:employment_types (
                    employment_type_id,
                    employment_type_name
                ),
                assignments:equipment_assignments (
                    assignment_id,
                    equipment:equipment (
                        equipment_id,
                        asset_tag,
                        device_name,
                        status
                    )
                )
            """
            )
            .eq("device_user_id", device_user_id)
            .single()
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(status_code=404, detail="Device user not found")
