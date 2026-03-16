import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getPosts } from '../api/postApi';
import { getProjects } from '../api/projectApi';
import type { Post, Project } from '../types';
import PostCard from '../components/blog/PostCard';
import Spinner from '../components/common/Spinner';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPosts({ size: 3 }).catch(() => ({ content: [] })),
      getProjects().catch(() => []),
    ]).then(([postsRes, projectsRes]) => {
      setPosts(postsRes.content);
      setProjects(Array.isArray(projectsRes) ? projectsRes.slice(0, 3) : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          안녕하세요, <span className="text-indigo-600">hemu</span>입니다.
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          개발 경험과 프로젝트를 기록하는 공간입니다.
        </p>
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">최근 글</h2>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            더보기 <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Spinner className="py-12" />
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-center py-12">아직 게시된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">프로젝트</h2>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            더보기 <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Spinner className="py-12" />
        ) : projects.length === 0 ? (
          <p className="text-gray-400 text-center py-12">아직 등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
              >
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
