import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects } from '../api/projectApi';
import type { Project } from '../types';
import Spinner from '../components/common/Spinner';
import Footer from '../components/layout/Footer';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  useReveal(loading);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        <div className="mb-16 reveal">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Works
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-2">Projects</h1>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>직접 만든 것들</p>
        </div>

        {loading ? (
          <Spinner className="py-20" />
        ) : projects.length === 0 ? (
          <p className="text-center py-20" style={{ color: 'var(--text-faint)' }}>
            아직 등록된 프로젝트가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 reveal-stagger">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group block"
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden rounded-2xl aspect-video mb-5"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {project.thumbnailUrl ? (
                    <>
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 flex items-end p-5 transition-opacity duration-300 ${
                          hovered === project.id ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ background: 'var(--overlay)' }}
                      >
                        <div className="flex gap-2">
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded-full transition-all hover:opacity-85"
                              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'var(--accent-bg)' }}
                    >
                      <span
                        className="text-5xl font-bold"
                        style={{ color: 'var(--accent-text)', opacity: 0.5 }}
                      >
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    {project.period && (
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {project.period}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3 line-clamp-2"
                    style={{ color: 'var(--text-low)' }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 text-xs rounded-full"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {!project.thumbnailUrl && (
                    <div className="flex gap-3 mt-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm transition-colors"
                          style={{ color: 'var(--text-low)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} /> GitHub
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm transition-colors hover:opacity-75"
                          style={{ color: 'var(--accent)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} /> Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
