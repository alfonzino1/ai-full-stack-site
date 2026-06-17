from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    title: str
    content: str


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime | None = None
    author_id: int

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    id: int
    title: str
    content: str  # превью, обрезается в роутере
    created_at: datetime
    author_id: int

    model_config = {"from_attributes": True}


class PostsPaginated(BaseModel):
    posts: list[PostListResponse]
    total: int
    page: int
    page_size: int
