from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import engine, get_db
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dog Gallery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://delicate-manatee-bf8f2a.netlify.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "https://dog-gallery-app-black.vercel.app", # Allow all for development ease
    "https://6a058a15ecd8815e66a52d2a--delicate-manatee-bf8f2a.netlify.app",
    "https://delicate-manatee-bf8f2a.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/like", response_model=schemas.Like)
def create_like(like: schemas.LikeCreate, db: Session = Depends(get_db)):
    return crud.create_like(db=db, like=like)

@app.delete("/like")
def delete_like(like: schemas.LikeDelete, db: Session = Depends(get_db)):
    deleted_like = crud.delete_like(db=db, image_url=like.image_url)
    if not deleted_like:
        raise HTTPException(status_code=404, detail="Like not found")
    return {"message": "Like removed successfully"}

@app.get("/likes", response_model=list[schemas.Like])
def read_likes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    likes = crud.get_likes(db, skip=skip, limit=limit)
    return likes

@app.get("/most-liked")
def read_most_liked(limit: int = 10, db: Session = Depends(get_db)):
    most_liked = crud.get_most_liked_breeds(db, limit=limit)
    return [{"breed": item.breed, "total_likes": item.total} for item in most_liked]

@app.post("/viewed", response_model=schemas.Viewed)
def create_viewed(viewed: schemas.ViewedCreate, db: Session = Depends(get_db)):
    return crud.create_recently_viewed(db=db, viewed=viewed)

@app.get("/viewed", response_model=list[schemas.Viewed])
def read_viewed(db: Session = Depends(get_db)):
    return crud.get_recently_viewed(db, limit=5)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
