import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, X } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { getProject } from '../api/projectApi';
import type { Project } from '../types';
import Spinner from '../components/common/Spinner';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getProject(Number(id))
      .then(setProject)
      .catch(() => navigate('/projects', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Spinner className="py-40" />;
  if (!project) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> 돌아가기
      </button>

      {/* 메인 이미지 */}
      {project.thumbnailUrl && (
        <div
          className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-8 cursor-zoom-in"
          onClick={() => setLightbox(project.thumbnailUrl!)}
        >
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
              >
                <Github size={14} /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition-colors"
              >
                <ExternalLink size={14} /> Demo
              </a>
            )}
          </div>
        </div>
        {project.period && (
          <p className="text-sm text-gray-400 mb-3">{project.period}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* 설명 */}
      {project.description && (
        <div className="mb-10" data-color-mode="light">
          <MDEditor.Markdown
            source={project.description}
            style={{ background: 'transparent', color: '#374151', fontSize: '0.95rem', lineHeight: '1.8' }}
          />
        </div>
      )}

      {/* 추가 이미지 갤러리 */}
      {(project.imageUrls ?? []).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">스크린샷</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(project.imageUrls ?? []).map((url, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => setLightbox(url)}
              >
                <img src={url} alt={`screenshot-${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="확대 이미지"
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
