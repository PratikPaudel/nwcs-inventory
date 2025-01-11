from fastapi import APIRouter, HTTPException
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


@router.get("/api/users/search")
async def search_users(query: str = ""):
    try:
        # First get users
        result = supabase.table("device_users").select(
            "device_user_id",
            "first_name",
            "last_name",
            "email",
            "departments(department_name)",
            "equipment_assignments!left(*)",
        )

        if query:
            result = result.or_(
                f"first_name.ilike.%{query}%,"
                f"last_name.ilike.%{query}%,"
                f"email.ilike.%{query}%"
            )

        result = result.execute()

        # Format the response and calculate device count
        users = []
        for user in result.data:
            device_count = len(
                [a for a in user["equipment_assignments"] if a is not None]
            )
            users.append(
                {
                    "user_id": user["device_user_id"],
                    "first_name": user["first_name"],
                    "last_name": user["last_name"],
                    "email": user["email"],
                    "department": user["departments"]["department_name"],
                    "device_count": device_count,
                }
            )

        return {"data": users}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/users/add")
async def add_user(user: dict):
    try:
        # First, get department_id from department name
        dept_result = (
            supabase.table("departments")
            .select("department_id")
            .eq("department_name", user["department"])
            .execute()
        )

        if not dept_result.data:
            raise HTTPException(status_code=400, detail="Invalid department")

        department_id = dept_result.data[0]["department_id"]

        # Insert new user
        result = (
            supabase.table("device_users")
            .insert(
                {
                    "first_name": user["first_name"],
                    "last_name": user["last_name"],
                    "email": user["email"],
                    "department_id": department_id,
                    "employment_type_id": 1,  # Default employment type, adjust as needed
                }
            )
            .execute()
        )

        return {"status": "success", "data": result.data[0]}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
