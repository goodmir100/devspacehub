import logging

import httpx

from .config import get_settings

logger = logging.getLogger(__name__)


async def send_telegram_notification(text: str) -> bool:
    """Отправляет уведомление в Telegram. Возвращает True при успехе."""
    settings = get_settings()
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        logger.info("Telegram не настроен, уведомление пропущено")
        return False

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
        return True
    except httpx.HTTPError as exc:  # pragma: no cover - внешний сервис
        logger.warning("Не удалось отправить уведомление в Telegram: %s", exc)
        return False
