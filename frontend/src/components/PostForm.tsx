import { useState } from 'react';
import type { PostFormData } from '../types';

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function PostForm({
  initialData = { title: '', content: '' },
  onSubmit,
  loading = false,
  submitLabel = 'Сохранить',
}: PostFormProps) {
  const [form, setForm] = useState<PostFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Заголовок</label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="Введите заголовок статьи"
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Содержание</label>
        <textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          placeholder="Напишите статью..."
          rows={12}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Сохранение...' : submitLabel}
      </button>
    </form>
  );
}
