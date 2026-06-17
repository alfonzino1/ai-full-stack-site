import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import CommentList from '../components/CommentList';
import type { Post, Comment } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      postsApi.getById(Number(id)),
      fetch(`/api/posts/${id}/comments`).then((r) => r.json()),
    ])
      .then(([postRes, commentsData]) => {
        setPost(postRes.data);
        setComments(commentsData);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!post || !confirm('Удалить статью?')) return;
    try {
      await postsApi.delete(post.id);
      navigate('/');
    } catch {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!post) return <p className="error-msg">Статья не найдена</p>;

  const isAuthor = isAuthenticated && user?.id === post.author_id;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <div className="post-meta">
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString('ru-RU')}
        </time>
        {post.updated_at && (
          <span className="updated">
            (обновлено: {new Date(post.updated_at).toLocaleDateString('ru-RU')})
          </span>
        )}
      </div>
      <div className="post-content">{post.content}</div>

      {isAuthor && (
        <div className="post-actions">
          <Link to={`/posts/${post.id}/edit`} className="btn">
            Редактировать
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      )}

      <CommentList postId={post.id} initialComments={comments} />
    </div>
  );
}
