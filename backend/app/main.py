from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import (
    equipment,
    assignments,
    locations,
    buildings,
    device_users,
    dashboard,
    reporting,
    inventory,
    users,
)

app = FastAPI(title="Equipment Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routers
app.include_router(equipment.router, tags=["Equipment"])
app.include_router(assignments.router, tags=["Assignments"])
app.include_router(locations.router, tags=["Locations"])
app.include_router(buildings.router, tags=["Buildings"])
app.include_router(device_users.router, tags=["Device Users"])
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(reporting.router, tags=["Reporting"])
app.include_router(inventory.router)
app.include_router(users.router, tags=["Users"])


@app.get("/")
async def root():
    return {"message": "Equipment Management API is running"}
