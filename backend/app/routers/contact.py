from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ContactMessage
from ..schemas import ContactCreate, ContactRead, ContactReadUpdate
from ..security import require_admin
from ..telegram import send_telegram_notification

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
async def create_message(
    payload: ContactCreate, db: Session = Depends(get_db)
) -> ContactMessage:
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)

    text = (
        "<b>Новое сообщение с DevSpaceHub</b>\n"
        f"<b>Имя:</b> {message.name}\n"
        f"<b>Email:</b> {message.email}\n"
        f"<b>Сообщение:</b>\n{message.message}"
    )
    await send_telegram_notification(text)
    return message


@router.get(
    "",
    response_model=list[ContactRead],
    dependencies=[Depends(require_admin)],
)
def list_messages(db: Session = Depends(get_db)) -> list[ContactMessage]:
    return list(
        db.scalars(select(ContactMessage).order_by(ContactMessage.created_at.desc())).all()
    )


@router.patch(
    "/{message_id}",
    response_model=ContactRead,
    dependencies=[Depends(require_admin)],
)
def update_message(
    message_id: int, payload: ContactReadUpdate, db: Session = Depends(get_db)
) -> ContactMessage:
    message = db.get(ContactMessage, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Сообщение не найдено")
    message.is_read = payload.is_read
    db.commit()
    db.refresh(message)
    return message
