from fastapi import APIRouter, HTTPException
from ..config.database import supabase

router = APIRouter()


@router.get("/dashboard/devices-by-building")
async def get_devices_by_building():
    try:
        # First get equipment with location_id
        equipment_response = (
            supabase.from_("equipment").select("*, location_id").execute()
        )

        # Get all locations with building info
        locations_response = (
            supabase.from_("locations").select("*, buildings!inner(*)").execute()
        )

        print("Equipment data:", equipment_response.data)  # Debug log
        print("Locations data:", locations_response.data)  # Debug log

        # Create a location lookup dictionary
        location_building_map = {
            loc["location_id"]: loc["buildings"]["building_name"]
            for loc in locations_response.data
            if loc.get("buildings")
        }

        # Count devices per building
        building_counts = {}
        for device in equipment_response.data:
            if device.get("location_id"):
                building_name = location_building_map.get(
                    device["location_id"], "Unassigned"
                )
                building_counts[building_name] = (
                    building_counts.get(building_name, 0) + 1
                )

        # Sort by count for better visualization
        sorted_data = sorted(
            [{"name": k, "value": v} for k, v in building_counts.items()],
            key=lambda x: x["value"],
            reverse=True,
        )

        print("Transformed data:", sorted_data)  # Debug log

        return {"type": "building_distribution", "data": sorted_data}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard/devices-by-manufacturer")
async def get_devices_by_manufacturer():
    try:
        response = supabase.from_("equipment").select("manufacturer").execute()

        manufacturer_counts = {}
        for device in response.data:
            if device.get("manufacturer"):
                manufacturer_counts[device["manufacturer"]] = (
                    manufacturer_counts.get(device["manufacturer"], 0) + 1
                )

        return {
            "type": "manufacturer_distribution",
            "data": [
                {"name": manufacturer, "value": count}
                for manufacturer, count in manufacturer_counts.items()
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard/devices-by-form-factor")
async def get_devices_by_form_factor():
    try:
        response = supabase.from_("equipment").select("form_factor").execute()

        form_factor_counts = {}
        for device in response.data:
            if device.get("form_factor"):
                form_factor_counts[device["form_factor"]] = (
                    form_factor_counts.get(device["form_factor"], 0) + 1
                )

        return {
            "type": "form_factor_distribution",
            "data": [
                {"name": form_factor, "value": count}
                for form_factor, count in form_factor_counts.items()
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
