import { Github, Mail } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import Footer from '../components/layout/Footer';

const skills = [
  {
    category: 'Frontend',
    accentVar: 'var(--accent)',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vue.js'],
  },
  {
    category: 'Backend',
    accentVar: 'var(--accent2)',
    items: ['Java', 'Spring Boot', 'Python', 'Django', 'PostgreSQL', 'JPA'],
  },
  {
    category: 'DevOps / Tools',
    accentVar: '#34d399',
    items: ['Git', 'Docker', 'Vercel', 'Railway'],
  },
  {
    category: 'Mobile',
    accentVar: '#fbbf24',
    items: ['Flutter'],
  },
];

export default function About() {
  useReveal();

  return (
    <div style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-20 reveal">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            About
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            저는 이런 사람이에요
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-med)' }}
          >
            백엔드와 프론트엔드를 모두 다루는 풀스택 개발자입니다.
            Django와 Vue.js로 시작하여, 현재는 Java Spring Boot와 React를 주력으로 사용하며
            깔끔하고 유지보수하기 좋은 코드를 지향합니다.
            Flutter를 사용한 모바일 앱 개발 경험도 있으며, 새로운 기술을 배우는 것을 즐깁니다.
          </p>
        </div>

        {/* Skills */}
        <section className="mb-20">
          <div className="reveal mb-8">
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'var(--accent)' }}
            >
              Skills
            </span>
            <h2 className="text-2xl font-bold mt-2">기술 스택</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-stagger">
            {skills.map(({ category, accentVar, items }) => (
              <div
                key={category}
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: accentVar }}
                >
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full text-sm"
                      style={{
                        background: 'var(--card-bg-2)',
                        color: accentVar,
                        border: '1px solid var(--border)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="reveal">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Contact
          </span>
          <h2 className="text-2xl font-bold mt-2 mb-8">연락하기</h2>
          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/hemu0-0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group w-fit transition-all"
              style={{ color: 'var(--text-low)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-hi)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-low)')}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                style={{
                  background: 'var(--card-bg-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <Github size={18} />
              </div>
              <span>github.com/hemu0-0</span>
            </a>
            <a
              href="mailto:ghkahr1890@gmail.com"
              className="inline-flex items-center gap-3 group w-fit transition-all"
              style={{ color: 'var(--text-low)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-hi)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-low)')}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                style={{
                  background: 'var(--card-bg-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <Mail size={18} />
              </div>
              <span>ghkahr1890@gmail.com</span>
            </a>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
