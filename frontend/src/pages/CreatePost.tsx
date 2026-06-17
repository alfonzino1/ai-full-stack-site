import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import PostForm from '../components/PostForm';
import type { PostFormData } from '../types';

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    try {
      await postsApi.create(data);
      navigate('/');
    } catch {
      alert('Ошибка при создании статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-form">
      <h1>Новая статья</h1>
      <PostForm onSubmit={handleSubmit} loading={loading} submitLabel="Опубликовать" />
    </div>
  );
}
