"""Точка входа для деплоя на Vercel.

Vercel ищет FastAPI-приложение `app` в файлах вида `server.py` в корне проекта,
поэтому этот модуль просто реэкспортирует приложение из backend.
"""

from backend.app.main import app  # noqa: F401
