export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PostListItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_id: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  author_id: number;
}

export interface PostsPaginated {
  posts: PostListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  post_id: number;
}

export interface PostFormData {
  title: string;
  content: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface CommentFormData {
  content: string;
}
