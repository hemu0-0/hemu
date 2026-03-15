import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import { getPost } from '../api/postApi';
import type { PostDetail } from '../types';
import TagBadge from '../components/blog/TagBadge';
import Spinner from '../components/common/Spinner';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(Number(id))
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="py-40" />;
  if (error || !post)
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 mb-4">글을 찾을 수 없습니다.</p>
        <Link to="/blog" className="text-indigo-600 hover:underline">
          목록으로
        </Link>
      </div>
    );

  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={14} /> 목록으로
      </Link>

      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {date}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.views}
            </span>
          </div>
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isBlock = !!match;
                return isBlock ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
