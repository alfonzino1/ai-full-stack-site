import json
from app.redis_client import redis_client

# TTL по умолчанию для кэша — 5 минут
DEFAULT_TTL = 300


def get_cached_posts(page: int, page_size: int) -> dict | None:
    key = f"posts:page:{page}:size:{page_size}"
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None


def set_cached_posts(page: int, page_size: int, data: dict, ttl: int = DEFAULT_TTL) -> None:
    key = f"posts:page:{page}:size:{page_size}"
    redis_client.setex(key, ttl, json.dumps(data, default=str))


def get_cached_post(post_id: int) -> dict | None:
    key = f"post:{post_id}"
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None


def set_cached_post(post_id: int, data: dict, ttl: int = DEFAULT_TTL) -> None:
    key = f"post:{post_id}"
    redis_client.setex(key, ttl, json.dumps(data, default=str))


def invalidate_post(post_id: int) -> None:
    """Удалить кэш конкретного поста и список страниц (при обновлении)."""
    redis_client.delete(f"post:{post_id}")
    # Удаляем кэш всех страниц (в рамках простого подхода)
    keys = redis_client.keys("posts:page:*")
    if keys:
        redis_client.delete(*keys)
