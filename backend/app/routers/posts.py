from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostsPaginated
from app.services.post import create_post, get_post_by_id, get_posts_paginated, update_post, delete_post
from app.services.cache import get_cached_post, set_cached_post, get_cached_posts, set_cached_posts, invalidate_post
from app.dependencies import get_current_user

router = APIRouter()


@router.get("", response_model=PostsPaginated)
def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Проверяем кэш
    cached = get_cached_posts(page, page_size)
    if cached:
        return cached

    posts, total = get_posts_paginated(db, page=page, page_size=page_size)

    # Формируем превью контента (первые 200 символов)
    post_list = []
    for post in posts:
        preview = {
            "id": post.id,
            "title": post.title,
            "content": post.content[:200] + "..." if len(post.content) > 200 else post.content,
            "created_at": post.created_at.isoformat(),
            "author_id": post.author_id,
        }
        post_list.append(preview)

    result = {
        "posts": post_list,
        "total": total,
        "page": page,
        "page_size": page_size,
    }

    # Сохраняем в кэш
    set_cached_posts(page, page_size, result)

    return result


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    # Проверяем кэш
    cached = get_cached_post(post_id)
    if cached:
        return cached

    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Сохраняем в кэш
    post_data = {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "created_at": post.created_at.isoformat(),
        "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        "author_id": post.author_id,
    }
    set_cached_post(post_id, post_data)

    return post


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_new_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_post(db, post_data, author_id=current_user.id)


@router.put("/{post_id}", response_model=PostResponse)
def update_existing_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")

    return update_post(db, post, post_data)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    delete_post(db, post)
