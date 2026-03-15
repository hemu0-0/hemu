import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { getPosts, deletePost } from '../../api/postApi';
import { getProjects, deleteProject } from '../../api/projectApi';
import type { Post, Project } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getPosts({ size: 100 }).catch(() => ({ content: [] })),
      getProjects().catch(() => []),
    ]).then(([postsRes, projectsRes]) => {
      setPosts(postsRes.content);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleDeletePost = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deletePost(id);
    loadData();
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteProject(id);
    loadData();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={14} /> 로그아웃
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : (
        <>
          {/* Posts */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">블로그 글 ({posts.length})</h2>
              <Link to="/admin/posts/new">
                <Button size="sm">
                  <Plus size={14} /> 새 글 작성
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">제목</th>
                    <th className="text-left px-4 py-3 font-medium">발행</th>
                    <th className="text-left px-4 py-3 font-medium">날짜</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">
                        게시글이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{post.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            (post as unknown as { isPublished: boolean }).isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {(post as unknown as { isPublished: boolean }).isPublished ? '발행' : '비공개'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link to={`/admin/posts/${post.id}/edit`}>
                              <button className="text-gray-400 hover:text-indigo-600">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">프로젝트 ({projects.length})</h2>
              <Link to="/admin/projects/new">
                <Button size="sm">
                  <Plus size={14} /> 새 프로젝트
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">제목</th>
                    <th className="text-left px-4 py-3 font-medium">기간</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-400">
                        프로젝트가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{project.title}</td>
                        <td className="px-4 py-3 text-gray-500">{project.period || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link to={`/admin/projects/${project.id}/edit`}>
                              <button className="text-gray-400 hover:text-indigo-600">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
