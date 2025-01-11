from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import date
from ..models.schemas import Assignment, AssignmentCreate
from config.database import supabase

router = APIRouter()


@router.get("/assignments", response_model=List[dict])
async def list_assignments(
    device_user_id: Optional[int] = None,
    department_id: Optional[int] = None,
    status: Optional[str] = None,
):
    """
    Get all assignments with related equipment and user details.
    """
    query = supabase.from_("equipment_assignments").select(
        """
            assignment_id,
            assignment_start_date,
            assignment_purpose,
            equipment:equipment (
                equipment_id,
                asset_tag,
                device_name,
                status,
                manufacturer,
                model
            ),
            device_user:device_users (
                device_user_id,
                first_name,
                last_name,
                email,
                department:departments (
                    department_id,
                    department_name
                )
            )
        """
    )

    if device_user_id:
        query = query.eq("device_user_id", device_user_id)
    if status:
        query = query.eq("equipment.status", status)
    if department_id:
        query = query.eq("device_user.department_id", department_id)

    response = query.execute()

    if response.error:
        raise HTTPException(status_code=400, detail=str(response.error))

    return response.data


@router.post("/assignments", response_model=Assignment)
async def create_assignment(assignment: AssignmentCreate):
    """
    Create a new assignment
    """
    # Check if equipment is available
    equipment = (
        supabase.table("equipment")
        .select("status, location_id")
        .eq("equipment_id", assignment.equipment_id)
        .single()
        .execute()
    )

    if equipment.error or not equipment.data:
        raise HTTPException(status_code=404, detail="Equipment not found")

    if equipment.data["status"] not in ["Available", "In Storage"]:
        raise HTTPException(
            status_code=400,
            detail=f"Equipment is not available (current status: {equipment.data['status']})",
        )

    try:
        # Create assignment
        assignment_response = (
            supabase.table("equipment_assignments")
            .insert(assignment.model_dump())
            .execute()
        )

        # Update equipment status
        equipment_update = (
            supabase.table("equipment")
            .update({"status": "In Use"})
            .eq("equipment_id", assignment.equipment_id)
            .execute()
        )

        # Create history record
        history_record = {
            "equipment_id": assignment.equipment_id,
            "device_user_id": assignment.device_user_id,
            "location_id": equipment.data["location_id"],
            "status": "In Use",
            "assignment_start_date": assignment.assignment_start_date,
            "change_made_by": 1,  # Assuming admin user_id=1, should be from auth
        }

        history_response = (
            supabase.table("equipment_history").insert(history_record).execute()
        )

        return assignment_response.data[0]

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/assignments/{assignment_id}", response_model=Assignment)
async def update_assignment(assignment_id: int, updated_data: dict):
    """
    Update an existing assignment
    """
    response = (
        supabase.table("equipment_assignments")
        .update(updated_data)
        .eq("assignment_id", assignment_id)
        .execute()
    )

    if response.error:
        raise HTTPException(status_code=400, detail=str(response.error))

    if not response.data:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return response.data[0]


@router.delete("/assignments/{assignment_id}")
async def end_assignment(assignment_id: int, new_status: str = "Available"):
    """
    End an assignment
    """
    # Get assignment details before deletion
    assignment = (
        supabase.table("equipment_assignments")
        .select("*")
        .eq("assignment_id", assignment_id)
        .single()
        .execute()
    )

    if assignment.error or not assignment.data:
        raise HTTPException(status_code=404, detail="Assignment not found")

    try:
        # Update equipment status
        equipment_update = (
            supabase.table("equipment")
            .update({"status": new_status})
            .eq("equipment_id", assignment.data["equipment_id"])
            .execute()
        )

        # Create history record
        history_record = {
            "equipment_id": assignment.data["equipment_id"],
            "device_user_id": assignment.data["device_user_id"],
            "status": new_status,
            "assignment_start_date": assignment.data["assignment_start_date"],
            "assignment_end_date": date.today(),
            "change_made_by": 1,  # Assuming admin user_id=1, should be from auth
        }

        history_response = (
            supabase.table("equipment_history").insert(history_record).execute()
        )

        # Delete the assignment
        delete_response = (
            supabase.table("equipment_assignments")
            .delete()
            .eq("assignment_id", assignment_id)
            .execute()
        )

        return {"message": "Assignment ended successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
