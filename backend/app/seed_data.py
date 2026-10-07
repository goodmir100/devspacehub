"""Демонстрационные проекты и наполнение ими базы.

Используется при старте приложения (в том числе на Vercel) и в скрипте seed.py.
"""

from sqlalchemy import select

from .database import Base, SessionLocal, engine
from .models import Project

SAMPLE_PROJECTS: list[dict] = [
    {
        "title": "DevSpaceHub",
        "description": "Интерактивная платформа-портфолио с динамической витриной проектов и панелью администратора.",
        "technologies": ["React", "TypeScript", "FastAPI", "Tailwind CSS"],
        "github_link": "https://github.com/",
        "demo_link": None,
        "featured": True,
    },
    {
        "title": "TaskFlow API",
        "description": "REST API для управления задачами с аутентификацией, ролями и уведомлениями.",
        "technologies": ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL"],
        "github_link": "https://github.com/",
        "featured": False,
    },
    {
        "title": "Realtime Chat",
        "description": "Чат в реальном времени на WebSocket с комнатами, историей и индикатором набора текста.",
        "technologies": ["React", "WebSocket", "Node.js", "Redis"],
        "github_link": "https://github.com/",
        "featured": False,
    },
    {
        "title": "Analytics Dashboard",
        "description": "Панель аналитики с интерактивными графиками и экспортом отчётов.",
        "technologies": ["React", "TypeScript", "Tailwind CSS", "Recharts"],
        "github_link": "https://github.com/",
        "featured": True,
    },
]


def seed_if_empty() -> int:
    """Создаёт таблицы и добавляет демо-проекты, если база пуста.

    Возвращает количество добавленных проектов (0, если данные уже есть).
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Project).limit(1)) is not None:
            return 0
        db.add_all(Project(**data) for data in SAMPLE_PROJECTS)
        db.commit()
        return len(SAMPLE_PROJECTS)
    finally:
        db.close()
