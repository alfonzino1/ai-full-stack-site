import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import PostForm from '../components/PostForm';
import type { Post, PostFormData } from '../types';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    postsApi
      .getById(Number(id))
      .then(({ data }) => setPost(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data: PostFormData) => {
    if (!post) return;
    setSubmitting(true);
    try {
      await postsApi.update(post.id, data);
      navigate(`/posts/${post.id}`);
    } catch {
      alert('Ошибка при обновлении статьи');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!post) return <p className="error-msg">Статья не найдена</p>;

  return (
    <div className="page-form">
      <h1>Редактирование статьи</h1>
      <PostForm
        initialData={{ title: post.title, content: post.content }}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel="Сохранить изменения"
      />
    </div>
  );
}
