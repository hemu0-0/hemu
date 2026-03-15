import { useEffect, useState } from 'react';
import { getPosts } from '../api/postApi';
import type { Post } from '../types';
import PostCard from '../components/blog/PostCard';
import TagBadge from '../components/blog/TagBadge';
import Spinner from '../components/common/Spinner';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts({ tag: selectedTag || undefined, page, size: 9 })
      .then((data) => {
        setPosts(data.content);
        setTotalPages(data.totalPages);
        const tags = Array.from(new Set(data.content.flatMap((p) => p.tags)));
        if (page === 0) setAllTags((prev) => Array.from(new Set([...prev, ...tags])));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [selectedTag, page]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setPage(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <TagBadge
            tag="전체"
            active={!selectedTag}
            onClick={() => handleTagClick('')}
          />
          {allTags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={selectedTag === tag}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <Spinner className="py-20" />
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">게시된 글이 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
