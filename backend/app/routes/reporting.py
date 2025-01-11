from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Supabase client
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


@router.post("/api/reports/generate")
async def generate_report(report_request: dict):
    try:
        print("Received filters:", report_request.get("filters", {}))  # Debug print

        filters = report_request.get("filters", {})
        query = supabase.table("equipment").select(
            "equipment_id", "device_name", "status", "form_factor", "updated_at"
        )

        # Apply filters
        if filters.get("type"):
            query = query.eq("form_factor", filters["type"])
        if filters.get("status"):
            query = query.eq("status", filters["status"])

        result = query.execute()
        print("Query result:", result.data)  # Debug print

        if not result.data:
            print("No data found in the equipment table")  # Debug print
            return {"status": "success", "data": []}

        return {"status": "success", "data": result.data}

    except Exception as e:
        print(f"Debug - Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
