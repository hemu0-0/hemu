import { useEffect, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects } from '../api/projectApi';
import type { Project } from '../types';
import TagBadge from '../components/blog/TagBadge';
import Spinner from '../components/common/Spinner';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>

      {loading ? (
        <Spinner className="py-20" />
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-center py-20">아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {project.thumbnailUrl && (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                  {project.period && (
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{project.period}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Github size={14} /> GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
