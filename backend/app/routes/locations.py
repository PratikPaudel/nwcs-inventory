from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from ..config.database import supabase
import logging

router = APIRouter()


@router.get("/locations")
async def get_locations():
    try:
        print("Attempting to fetch locations...")
        # First get locations with building_id
        locations_response = supabase.from_("locations").select("*").execute()

        # Then get all buildings
        buildings_response = supabase.from_("buildings").select("*").execute()

        print("Raw locations data:", locations_response.data)
        print("Raw buildings data:", buildings_response.data)

        # Create a buildings lookup dictionary
        buildings_lookup = {
            building["building_id"]: {
                "building_name": building["building_name"],
                "building_short_name": building["building_short_name"],
            }
            for building in buildings_response.data
        }

        # Transform the response to match the frontend's expected structure
        transformed_data = []
        for location in locations_response.data:
            building_data = buildings_lookup.get(location["building_id"], {})
            location_data = {
                "location_id": location["location_id"],
                "room_number": location["room_number"],
                "floor_number": location["floor_number"],
                "building": {
                    "building_name": building_data.get(
                        "building_name", "Unknown Building"
                    ),
                    "building_short_name": building_data.get(
                        "building_short_name", "UNK"
                    ),
                },
            }
            transformed_data.append(location_data)

        print("Transformed data:", transformed_data)
        return transformed_data

    except Exception as e:
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        print(f"Full error object: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/locations/{location_id}", response_model=dict)
async def get_location(location_id: int):
    try:
        response = (
            supabase.from_("locations")
            .select(
                """
                *,
                building:buildings (
                    building_id,
                    building_name,
                    building_short_name
                )
            """
            )
            .eq("location_id", location_id)
            .single()
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(status_code=404, detail="Location not found")
