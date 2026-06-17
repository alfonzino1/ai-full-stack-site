import { useState } from 'react';
import { commentsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Comment } from '../types';

interface CommentListProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentList({ postId, initialComments }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { data } = await commentsApi.create(postId, { content });
      setComments([...comments, data]);
      setContent('');
    } catch {
      alert('Ошибка при добавлении комментария');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Удалить комментарий?')) return;
    try {
      await commentsApi.delete(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      alert('Ошибка при удалении комментария');
    }
  };

  return (
    <div className="comments">
      <h3>Комментарии ({comments.length})</h3>

      <div className="comments-list">
        {comments.length === 0 && (
          <p className="no-comments">Пока нет комментариев</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>Пользователь #{comment.author_id}</strong>
              <time dateTime={comment.created_at}>
                {new Date(comment.created_at).toLocaleString('ru-RU')}
              </time>
            </div>
            <p className="comment-content">{comment.content}</p>
            {isAuthenticated && user?.id === comment.author_id && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(comment.id)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

      {isAuthenticated && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Написать комментарий..."
            rows={3}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Комментировать'}
          </button>
        </form>
      )}

      {!isAuthenticated && (
        <p className="auth-hint">
          <a href="/login">Войдите</a>, чтобы оставить комментарий
        </p>
      )}
    </div>
  );
}
