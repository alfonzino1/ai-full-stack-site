from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    author_id: int
    post_id: int

    model_config = {"from_attributes": True}
