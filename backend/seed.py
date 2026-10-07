"""Наполняет базу демонстрационными проектами.

Запуск: python seed.py
"""

from app.database import Base, SessionLocal, engine
from app.models import Project

SAMPLE_PROJECTS = [
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


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Project).count() > 0:
            print("База уже содержит проекты — сидирование пропущено.")
            return
        db.add_all(Project(**data) for data in SAMPLE_PROJECTS)
        db.commit()
        print(f"Добавлено {len(SAMPLE_PROJECTS)} демонстрационных проектов.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
