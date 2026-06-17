from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, posts, comments

# Создаём таблицы при старте (в продакшене лучше через Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog CMS API",
    description="REST API для блога/CMS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(comments.router, prefix="/api", tags=["comments"])


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Blog CMS API is running"}
