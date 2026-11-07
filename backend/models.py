from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Staff(Base):
    __tablename__ = "staff"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("staff.id", ondelete="CASCADE"), nullable=False)

    token_hash: Mapped[str] = mapped_column( String(255),unique=True, nullable=False)

    expires_at: Mapped[datetime] = mapped_column( DateTime(timezone=True), nullable=False)

    used_at: Mapped[datetime | None] = mapped_column( DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column( DateTime(timezone=True), server_default=func.now() )