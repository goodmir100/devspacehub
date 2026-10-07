from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Project
from ..schemas import ProjectCreate, ProjectRead
from ..security import require_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def list_projects(
    technology: str | None = Query(default=None, description="Фильтр по одной технологии"),
    search: str | None = Query(default=None, description="Поиск по названию и описанию"),
    featured: bool | None = Query(default=None, description="Только избранные проекты"),
    db: Session = Depends(get_db),
) -> list[Project]:
    stmt = select(Project).order_by(Project.created_at.desc())
    if featured is not None:
        stmt = stmt.where(Project.featured == featured)

    projects = list(db.scalars(stmt).all())

    # Фильтрация по JSON-полю technologies выполняется на уровне Python,
    # что сохраняет совместимость со SQLite без специфичных запросов.
    if technology:
        tech = technology.strip().lower()
        projects = [
            project
            for project in projects
            if any(item.lower() == tech for item in project.technologies)
        ]

    if search:
        query = search.strip().lower()
        projects = [
            project
            for project in projects
            if query in project.title.lower() or query in project.description.lower()
        ]

    return projects


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)) -> Project:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Проект не найден")
    return project


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> Project:
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Проект не найден")
    db.delete(project)
    db.commit()
