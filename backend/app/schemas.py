from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Проекты
# ---------------------------------------------------------------------------
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=10)
    technologies: list[str] = Field(default_factory=list)
    github_link: str | None = Field(default=None, max_length=500)
    demo_link: str | None = Field(default=None, max_length=500)
    image_url: str | None = Field(default=None, max_length=500)
    featured: bool = False


class ProjectCreate(ProjectBase):
    @field_validator("technologies")
    @classmethod
    def normalize_technologies(cls, value: list[str]) -> list[str]:
        """Убирает пробелы и дубликаты (без учёта регистра)."""
        result: list[str] = []
        seen: set[str] = set()
        for tech in value:
            cleaned = tech.strip()
            key = cleaned.lower()
            if cleaned and key not in seen:
                seen.add(key)
                result.append(cleaned)
        return result


class ProjectRead(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ---------------------------------------------------------------------------
# Аналитика
# ---------------------------------------------------------------------------
class AnalyticsEventCreate(BaseModel):
    project_id: int | None = None
    event_type: Literal["view", "click"]


class AnalyticsEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int | None
    event_type: str
    created_at: datetime


class ProjectStats(BaseModel):
    project_id: int
    title: str
    views: int
    clicks: int


class DailyPoint(BaseModel):
    day: date
    views: int
    clicks: int


class AnalyticsSummary(BaseModel):
    total_views: int
    total_clicks: int
    total_projects: int
    total_messages: int
    unread_messages: int
    per_project: list[ProjectStats]
    daily: list[DailyPoint]


# ---------------------------------------------------------------------------
# Обратная связь
# ---------------------------------------------------------------------------
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=5, max_length=4000)


class ContactRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    message: str
    is_read: bool
    created_at: datetime


class ContactReadUpdate(BaseModel):
    is_read: bool
