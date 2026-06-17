import { Link } from 'react-router-dom';
import type { PostListItem } from '../types';

interface PostCardProps {
  post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.id}`} className="post-card-link">
        <h2 className="post-card-title">{post.title}</h2>
      </Link>
      <p className="post-card-content">{post.content}</p>
      <div className="post-card-meta">
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString('ru-RU')}
        </time>
      </div>
    </article>
  );
}
