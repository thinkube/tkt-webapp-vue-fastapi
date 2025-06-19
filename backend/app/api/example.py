"""
Example API endpoints
This is a placeholder to demonstrate the API structure
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.core.auth import get_current_user

router = APIRouter(prefix="/api/example", tags=["example"])


class ExampleItem(BaseModel):
    """Example data model"""
    id: int
    title: str
    description: str
    created_at: datetime
    updated_at: datetime


class ExampleCreate(BaseModel):
    """Model for creating example items"""
    title: str
    description: str


class ExampleUpdate(BaseModel):
    """Model for updating example items"""
    title: str | None = None
    description: str | None = None


# In-memory storage for demonstration
items_db: List[ExampleItem] = []


@router.get("/items", response_model=List[ExampleItem])
async def list_items(current_user: dict = Depends(get_current_user)):
    """
    List all example items.
    Requires authentication.
    """
    return items_db


@router.post("/items", response_model=ExampleItem)
async def create_item(
    item: ExampleCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new example item.
    Requires authentication.
    """
    new_item = ExampleItem(
        id=len(items_db) + 1,
        title=item.title,
        description=item.description,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    items_db.append(new_item)
    return new_item


@router.get("/items/{item_id}", response_model=ExampleItem)
async def get_item(
    item_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific example item by ID.
    Requires authentication.
    """
    for item in items_db:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@router.put("/items/{item_id}", response_model=ExampleItem)
async def update_item(
    item_id: int,
    item_update: ExampleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an example item.
    Requires authentication.
    """
    for item in items_db:
        if item.id == item_id:
            if item_update.title is not None:
                item.title = item_update.title
            if item_update.description is not None:
                item.description = item_update.description
            item.updated_at = datetime.utcnow()
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@router.delete("/items/{item_id}")
async def delete_item(
    item_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an example item.
    Requires authentication.
    """
    global items_db
    items_db = [item for item in items_db if item.id != item_id]
    return {"message": "Item deleted successfully"}