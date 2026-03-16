import { useEffect, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects } from '../api/projectApi';
import type { Project } from '../types';
import Spinner from '../components/common/Spinner';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Projects</h1>
        <p className="text-gray-400 text-sm">직접 만든 것들</p>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-center py-20">아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group cursor-default"
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 이미지 영역 */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-video mb-4">
                {project.thumbnailUrl ? (
                  <>
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* 호버 오버레이 */}
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-end p-5 transition-opacity duration-300 ${
                        hovered === project.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={12} /> GitHub
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded-full hover:bg-indigo-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={12} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* 이미지 없을 때 플레이스홀더 */
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-5xl font-bold">{project.title[0]}</span>
                  </div>
                )}
              </div>

              {/* 텍스트 영역 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                  {project.period && (
                    <span className="text-xs text-gray-400">{project.period}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {/* 이미지 없을 때 링크를 아래에 표시 */}
                {!project.thumbnailUrl && (
                  <div className="flex gap-3 mt-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
                      >
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
