import { Link } from 'react-router-dom';
import { Eye, Calendar } from 'lucide-react';
import type { Post } from '../../types';
import TagBadge from './TagBadge';

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${post.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-44 object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.summary}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
