from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
from app.services.cache import set_cached_post, invalidate_post


def create_post(db: Session, post_data: PostCreate, author_id: int) -> Post:
    post = Post(**post_data.model_dump(), author_id=author_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_post_by_id(db: Session, post_id: int) -> Post | None:
    return db.query(Post).filter(Post.id == post_id).first()


def get_posts_paginated(
    db: Session, page: int = 1, page_size: int = 10
) -> tuple[list[Post], int]:
    offset = (page - 1) * page_size
    total = db.query(Post).count()
    posts = (
        db.query(Post)
        .order_by(desc(Post.created_at))
        .offset(offset)
        .limit(page_size)
        .all()
    )
    return posts, total


def update_post(db: Session, post: Post, post_data: PostUpdate) -> Post:
    update_data = post_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    invalidate_post(post.id)
    return post


def delete_post(db: Session, post: Post) -> None:
    invalidate_post(post.id)
    db.delete(post)
    db.commit()
