import { useState, useEffect } from 'react';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import type { PostListItem } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    postsApi
      .getList(page, pageSize)
      .then(({ data }) => {
        setPosts(data.posts);
        setTotal(data.total);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="home">
      <h1>Статьи</h1>

      {loading && <p className="loading">Загрузка...</p>}

      {!loading && posts.length === 0 && (
        <p className="empty">Статей пока нет. Станьте первым автором!</p>
      )}

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Назад
          </button>
          <span className="pagination-info">
            Страница {page} из {totalPages}
          </span>
          <button
            className="btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}
