from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import assignments, equipment  # Updated import

app = FastAPI(title="Equipment Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assignments.router, tags=["Assignments"])  # Updated router name
app.include_router(equipment.router, tags=["Equipment"])


@app.get("/")
async def root():
    return {"message": "Equipment Management API is running"}
