import axios from 'axios';
import type {
  User,
  Token,
  Post,
  PostsPaginated,
  Comment,
  PostFormData,
  LoginFormData,
  RegisterFormData,
  CommentFormData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем JWT-токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Auth ===

export const authApi = {
  register: (data: RegisterFormData) =>
    api.post<User>('/auth/register', data),

  login: (data: LoginFormData) =>
    api.post<Token>('/auth/login', data),

  getMe: () =>
    api.get<User>('/auth/me'),
};

// === Posts ===

export const postsApi = {
  getList: (page = 1, pageSize = 10) =>
    api.get<PostsPaginated>('/posts', { params: { page, page_size: pageSize } }),

  getById: (id: number) =>
    api.get<Post>(`/posts/${id}`),

  create: (data: PostFormData) =>
    api.post<Post>('/posts', data),

  update: (id: number, data: Partial<PostFormData>) =>
    api.put<Post>(`/posts/${id}`, data),

  delete: (id: number) =>
    api.delete(`/posts/${id}`),
};

// === Comments ===

export const commentsApi = {
  getByPost: (postId: number) =>
    api.get<Comment[]>(`/posts/${postId}/comments`),

  create: (postId: number, data: CommentFormData) =>
    api.post<Comment>(`/posts/${postId}/comments`, data),

  delete: (commentId: number) =>
    api.delete(`/comments/${commentId}`),
};

export default api;
