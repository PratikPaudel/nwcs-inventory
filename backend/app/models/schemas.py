from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID


class UserBase(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    user_id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EquipmentBase(BaseModel):
    asset_tag: str
    serial_number: Optional[str] = None
    device_name: str
    status: str
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    form_factor: Optional[str] = None
    ram: Optional[str] = None
    storage_capacity: Optional[str] = None
    storage_type: Optional[str] = None
    operating_system: Optional[str] = None
    notes: Optional[str] = None


class EquipmentCreate(EquipmentBase):
    location_id: Optional[int] = None


class Equipment(EquipmentBase):
    equipment_id: int
    location_id: Optional[int]
    warranty_start_date: Optional[date]
    warranty_end_date: Optional[date]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssignmentBase(BaseModel):
    equipment_id: int
    device_user_id: int
    assignment_purpose: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    assignment_start_date: date


class Assignment(AssignmentBase):
    assignment_id: int
    assignment_start_date: date
    created_at: datetime

    class Config:
        from_attributes = True


class LocationBase(BaseModel):
    building_id: int
    floor_number: int
    room_number: str
    description: Optional[str] = None


class Location(LocationBase):
    location_id: int

    class Config:
        from_attributes = True
