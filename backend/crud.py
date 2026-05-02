from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from datetime import datetime

def get_likes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Like).offset(skip).limit(limit).all()

def create_like(db: Session, like: schemas.LikeCreate):
    # Check if already liked
    existing_like = db.query(models.Like).filter(models.Like.image_url == like.image_url).first()
    if existing_like:
        return existing_like
    db_like = models.Like(image_url=like.image_url, breed=like.breed)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

def delete_like(db: Session, image_url: str):
    db_like = db.query(models.Like).filter(models.Like.image_url == image_url).first()
    if db_like:
        db.delete(db_like)
        db.commit()
    return db_like

def get_most_liked_breeds(db: Session, limit: int = 10):
    return db.query(models.Like.breed, func.count(models.Like.id).label('total')) \
             .group_by(models.Like.breed) \
             .order_by(func.count(models.Like.id).desc()) \
             .limit(limit).all()

def get_recently_viewed(db: Session, limit: int = 5):
    return db.query(models.Viewed).order_by(models.Viewed.timestamp.desc()).limit(limit).all()

def create_recently_viewed(db: Session, viewed: schemas.ViewedCreate):
    # Check if already exists, then update timestamp
    db_viewed = db.query(models.Viewed).filter(models.Viewed.breed == viewed.breed).first()
    if db_viewed:
        db_viewed.timestamp = datetime.utcnow()
    else:
        db_viewed = models.Viewed(breed=viewed.breed)
        db.add(db_viewed)
        
    db.commit()
    db.refresh(db_viewed)
    
    # Enforce max 5 limit globally
    all_viewed = db.query(models.Viewed).order_by(models.Viewed.timestamp.desc()).all()
    if len(all_viewed) > 5:
        for item in all_viewed[5:]:
            db.delete(item)
        db.commit()
        
    return db_viewed
