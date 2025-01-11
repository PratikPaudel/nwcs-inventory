from fastapi import APIRouter, HTTPException
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# Initialize Supabase client
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


@router.post("/api/inventory/search")
async def search_inventory(search_request: dict):
    try:
        search_query = search_request.get("query", "").strip()

        if not search_query:
            result = (
                supabase.table("equipment")
                .select(
                    "equipment_id",
                    "asset_tag",
                    "serial_number",
                    "device_name",
                    "status",
                    "form_factor",
                    "updated_at",
                )
                .execute()
            )
            return {"data": result.data}

        # Corrected syntax for 'or' with the right condition format
        result = (
            supabase.table("equipment")
            .select(
                "equipment_id",
                "asset_tag",
                "serial_number",
                "device_name",
                "status",
                "form_factor",
                "updated_at",
            )
            .or_(
                f"asset_tag.ilike.%{search_query}%,serial_number.ilike.%{search_query}%"
            )
            .execute()
        )

        return {"data": result.data}

    except Exception as e:
        print(f"Search error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to search inventory: {str(e)}"
        )
