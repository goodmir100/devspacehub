from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AnalyticsEvent, ContactMessage, Project
from ..schemas import (
    AnalyticsEventCreate,
    AnalyticsEventRead,
    AnalyticsSummary,
    DailyPoint,
    ProjectStats,
)
from ..security import require_admin

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post(
    "",
    response_model=AnalyticsEventRead,
    status_code=status.HTTP_201_CREATED,
)
def track_event(
    payload: AnalyticsEventCreate, db: Session = Depends(get_db)
) -> AnalyticsEvent:
    event = AnalyticsEvent(project_id=payload.project_id, event_type=payload.event_type)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get(
    "/summary",
    response_model=AnalyticsSummary,
    dependencies=[Depends(require_admin)],
)
def get_summary(days: int = 14, db: Session = Depends(get_db)) -> AnalyticsSummary:
    total_views = db.scalar(
        select(func.count()).select_from(AnalyticsEvent).where(AnalyticsEvent.event_type == "view")
    ) or 0
    total_clicks = db.scalar(
        select(func.count()).select_from(AnalyticsEvent).where(AnalyticsEvent.event_type == "click")
    ) or 0
    total_projects = db.scalar(select(func.count()).select_from(Project)) or 0
    total_messages = db.scalar(select(func.count()).select_from(ContactMessage)) or 0
    unread_messages = db.scalar(
        select(func.count()).select_from(ContactMessage).where(ContactMessage.is_read.is_(False))
    ) or 0

    projects = list(db.scalars(select(Project).order_by(Project.created_at.desc())).all())
    per_project: list[ProjectStats] = []
    for project in projects:
        views = db.scalar(
            select(func.count())
            .select_from(AnalyticsEvent)
            .where(
                AnalyticsEvent.project_id == project.id,
                AnalyticsEvent.event_type == "view",
            )
        ) or 0
        clicks = db.scalar(
            select(func.count())
            .select_from(AnalyticsEvent)
            .where(
                AnalyticsEvent.project_id == project.id,
                AnalyticsEvent.event_type == "click",
            )
        ) or 0
        per_project.append(
            ProjectStats(
                project_id=project.id, title=project.title, views=views, clicks=clicks
            )
        )

    # Дневная агрегация за последние `days` дней.
    since = datetime.now(timezone.utc) - timedelta(days=days)
    events = list(
        db.scalars(select(AnalyticsEvent).where(AnalyticsEvent.created_at >= since)).all()
    )
    buckets: dict[date, dict[str, int]] = {}
    for offset in range(days + 1):
        day = (datetime.now(timezone.utc) - timedelta(days=offset)).date()
        buckets[day] = {"views": 0, "clicks": 0}
    for event in events:
        day = event.created_at.date()
        if day in buckets:
            buckets[day][event.event_type] = buckets[day].get(event.event_type, 0) + 1

    daily = [
        DailyPoint(day=day, views=counts["views"], clicks=counts["clicks"])
        for day, counts in sorted(buckets.items())
    ]

    return AnalyticsSummary(
        total_views=total_views,
        total_clicks=total_clicks,
        total_projects=total_projects,
        total_messages=total_messages,
        unread_messages=unread_messages,
        per_project=per_project,
        daily=daily,
    )
