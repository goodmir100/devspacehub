import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models  # noqa: F401  # регистрация ORM-моделей
from .config import get_settings
from .routers import analytics, contact, projects
from .seed_data import seed_if_empty

logging.basicConfig(level=logging.INFO)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаём таблицы и наполняем базу демо-проектами при первом старте.
    seed_if_empty()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="API платформы-портфолио DevSpaceHub",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(analytics.router)
app.include_router(contact.router)

# Собранный фронтенд (React/Vite) раздаётся как статика. На Vercel каталог сборки
# лежит в корне проекта, локально путь вычисляется относительно этого файла.
for _frontend_dir in (
    Path("frontend/dist"),
    Path(__file__).resolve().parents[2] / "frontend" / "dist",
):
    if _frontend_dir.is_dir():
        app.frontend("/", directory=_frontend_dir)
        break


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
