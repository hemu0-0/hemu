import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, ArrowRight } from 'lucide-react';
import { getProjects } from '../api/projectApi';
import type { Project } from '../types';
import { useReveal } from '../hooks/useReveal';

const allSkills = [
  'React', 'TypeScript', 'Java', 'Spring Boot', 'Python',
  'PostgreSQL', 'JPA', 'Tailwind CSS', 'Vite', 'Docker',
  'Git', 'Vercel', 'Railway', 'Flutter', 'Django', 'Vue.js',
];

function anim(delay: number, dur = 0.65): React.CSSProperties {
  return {
    animation: `fadeUp ${dur}s ease forwards`,
    animationDelay: `${delay}s`,
    opacity: 0,
  };
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  useReveal(projectsLoaded);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoaded(true));
  }, []);

  return (
    <div style={{ background: 'var(--page-bg)' }}>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 560, height: 560,
              top: '10%', left: '-5%',
              background: 'radial-gradient(circle, var(--blob1), transparent 70%)',
              filter: 'blur(48px)',
              animation: 'blob 10s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 420, height: 420,
              bottom: '10%', right: '5%',
              background: 'radial-gradient(circle, var(--blob2), transparent 70%)',
              filter: 'blur(48px)',
              animation: 'blob 13s ease-in-out infinite reverse',
              animationDelay: '3s',
            }}
          />
          {/* subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-5"
            style={{ ...anim(0.1), color: 'var(--text-faint)' }}
          >
            Hello, World!
          </p>

          <h1
            className="font-bold leading-[1.06] mb-6"
            style={{ ...anim(0.25), fontSize: 'clamp(3.2rem, 8vw, 6.5rem)' }}
          >
            저는{' '}
            <span className="gradient-text">Harmony</span>
            <br />
            입니다.
          </h1>

          <p
            className="font-light mb-4"
            style={{
              ...anim(0.4),
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              color: 'var(--text-med)',
            }}
          >
            Full Stack Developer
          </p>

          <p
            className="leading-relaxed max-w-lg mb-12"
            style={{ ...anim(0.55), color: 'var(--text-low)', fontSize: '1rem' }}
          >
            백엔드와 프론트엔드를 모두 다루는 풀스택 개발자입니다.
            <br />
            깔끔하고 유지보수하기 좋은 코드를 지향합니다.
          </p>

          <div className="flex flex-wrap gap-3" style={anim(0.7)}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-85 active:scale-95"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
            >
              프로젝트 보기 <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:ghkahr1890@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-med)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--card-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              연락하기 <Mail size={15} />
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ ...anim(1.4, 0.8) }}
        >
          <span style={{ color: 'var(--text-xfaint)', fontSize: '0.65rem', letterSpacing: '0.25em' }}>
            SCROLL
          </span>
          <div
            className="w-px h-10 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, var(--accent), transparent)',
              animation: 'scrollPulse 2.2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* ─── Skills Ticker ─── */}
      <section
        className="py-14 overflow-hidden"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="flex w-max gap-4"
          style={{ animation: 'ticker 30s linear infinite' }}
        >
          {[...allSkills, ...allSkills].map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-5 py-2 rounded-full text-sm shrink-0 transition-colors"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-low)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Projects Preview ─── */}
      <section className="py-28 max-w-6xl mx-auto px-6">
        <div className="reveal mb-14">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Works
          </span>
          <h2 className="text-4xl font-bold mt-2">프로젝트</h2>
        </div>

        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 reveal-stagger">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                {project.thumbnailUrl ? (
                  <div className="overflow-hidden h-44">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="h-44 flex items-center justify-center"
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
                <div className="p-5">
                  <h3 className="font-semibold mb-1.5">{project.title}</h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-low)' }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs rounded-full"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 reveal">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            모든 프로젝트 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section
        className="py-32"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center reveal">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Contact
          </span>
          <h2
            className="font-bold mt-3 mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            함께 만들어봐요.
          </h2>
          <p
            className="mb-10 max-w-sm mx-auto"
            style={{ color: 'var(--text-low)', fontSize: '1rem' }}
          >
            피드백은 언제나 환영합니다.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <a
              href="mailto:ghkahr1890@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-med)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--card-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Mail size={15} /> ghkahr1890@gmail.com
            </a>
            <a
              href="https://github.com/hemu0-0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-med)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--card-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Github size={15} /> github.com/hemu0-0
            </a>
          </div>
        </div>
        <div
          className="mt-20 pt-8 text-center"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-xfaint)' }}>
            © 2026. hemu0-0 All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
