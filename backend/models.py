from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, unique=True, index=True)
    breed = Column(String, index=True)

class Viewed(Base):
    __tablename__ = "viewed"

    id = Column(Integer, primary_key=True, index=True)
    breed = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
