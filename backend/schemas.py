from pydantic import BaseModel
from datetime import datetime

class LikeBase(BaseModel):
    image_url: str
    breed: str

class LikeCreate(LikeBase):
    pass

class Like(LikeBase):
    id: int

    class Config:
        from_attributes = True

class LikeDelete(BaseModel):
    image_url: str

class ViewedBase(BaseModel):
    breed: str

class ViewedCreate(ViewedBase):
    pass

class Viewed(ViewedBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
