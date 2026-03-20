import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, X, Calendar, Layers } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { getProject } from '../api/projectApi';
import type { Project } from '../types';
import Spinner from '../components/common/Spinner';
import Footer from '../components/layout/Footer';

function anim(delay: number): React.CSSProperties {
  return {
    animation: 'fadeUp 0.65s ease forwards',
    animationDelay: `${delay}s`,
    opacity: 0,
  };
}

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

  if (loading) {
    return (
      <div style={{ background: 'var(--page-bg)', minHeight: '100vh' }}>
        <Spinner className="py-40" />
      </div>
    );
  }
  if (!project) return null;

  return (
    <div style={{ background: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(320px, 55vh, 520px)' }}
      >
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ animation: 'imgZoom 12s ease-in-out infinite alternate' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
          >
            <span
              className="font-bold select-none"
              style={{ fontSize: '10rem', color: 'rgba(255,255,255,0.15)' }}
            >
              {project.title[0]}
            </span>
          </div>
        )}

        {/* gradient fade to page bg */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, var(--page-bg) 100%)',
          }}
        />

        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <ArrowLeft size={14} /> 돌아가기
        </button>
      </div>

      {/* ── Main content (overlaps hero bottom) ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-16">

        {/* Title block */}
        <div className="mb-10" style={anim(0.05)}>
          {project.period && (
            <div
              className="inline-flex items-center gap-1.5 text-xs mb-3 font-medium"
              style={{ color: 'var(--accent)' }}
            >
              <Calendar size={12} /> {project.period}
            </div>
          )}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1
              className="font-bold leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {project.title}
            </h1>
            <div className="flex gap-2 flex-wrap">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full transition-all hover:opacity-80"
                  style={{
                    background: 'var(--card-bg-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-hi)',
                  }}
                >
                  <Github size={14} /> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all hover:opacity-85"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
                >
                  <ExternalLink size={14} /> Demo
                </a>
              )}
            </div>
          </div>

          {/* tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* divider */}
        <div
          className="mb-12 w-full"
          style={{ height: '1px', background: 'var(--border)' }}
        />

        {/* Description */}
        {project.description && (
          <div className="mb-16 max-w-3xl" data-color-mode="dark" style={anim(0.15)}>
            <div className="flex items-center gap-2 mb-6">
              <Layers size={14} style={{ color: 'var(--accent)' }} />
              <span
                className="text-xs tracking-[0.2em] uppercase font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Overview
              </span>
            </div>
            <div className="prose">
              <MDEditor.Markdown
                source={project.description}
                style={{
                  background: 'transparent',
                  color: 'var(--text-med)',
                  fontSize: '1rem',
                  lineHeight: '1.9',
                }}
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {(project.imageUrls ?? []).length > 0 && (
          <div style={anim(0.25)}>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs tracking-[0.2em] uppercase font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Screenshots
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
              >
                {(project.imageUrls ?? []).length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(project.imageUrls ?? []).map((url, i) => (
                <div
                  key={i}
                  className="group aspect-video rounded-2xl overflow-hidden cursor-zoom-in relative"
                  style={{ border: '1px solid var(--border)' }}
                  onClick={() => setLightbox(url)}
                >
                  <img
                    src={url}
                    alt={`screenshot-${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,0.3)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.75)',
            }}
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>
          <img
            src={lightbox}
            alt="확대 이미지"
            className="max-w-full max-h-[88vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
