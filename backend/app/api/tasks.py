"""
Task management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum

from app.core.security import get_current_user

router = APIRouter()


class TaskStatus(str, Enum):
    """Valid task statuses"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, Enum):
    """Valid task priorities"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(BaseModel):
    """Task data model"""
    id: int
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class TaskCreate(BaseModel):
    """Model for creating tasks"""
    title: str
    description: str
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    """Model for updating tasks"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None


# In-memory storage for demonstration
tasks_db: List[Task] = []


@router.get("", response_model=List[Task])
@router.get("/", response_model=List[Task])
async def list_tasks(current_user: dict = Depends(get_current_user)):
    """
    List all tasks.
    Requires authentication.
    """
    return tasks_db


@router.post("", response_model=Task)
@router.post("/", response_model=Task)
async def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new task.
    Requires authentication.
    """
    new_task = Task(
        id=len(tasks_db) + 1,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    tasks_db.append(new_task)
    return new_task


@router.get("/{task_id}", response_model=Task)
async def get_task(
    task_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific task by ID.
    Requires authentication.
    """
    for task in tasks_db:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a task.
    Requires authentication.
    """
    for task in tasks_db:
        if task.id == task_id:
            if task_update.title is not None:
                task.title = task_update.title
            if task_update.description is not None:
                task.description = task_update.description
            if task_update.status is not None:
                task.status = task_update.status
            if task_update.priority is not None:
                task.priority = task_update.priority
            if task_update.due_date is not None:
                task.due_date = task_update.due_date
            task.updated_at = datetime.utcnow()
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a task.
    Requires authentication.
    """
    global tasks_db
    original_length = len(tasks_db)
    tasks_db = [task for task in tasks_db if task.id != task_id]
    
    if len(tasks_db) == original_length:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted successfully"}