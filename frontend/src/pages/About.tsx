import { Github, Mail } from 'lucide-react';

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'] },
  { category: 'Backend', items: ['Java', 'Spring Boot', 'PostgreSQL', 'JPA'] },
  { category: 'DevOps', items: ['Git', 'Vercel', 'Railway', 'Docker'] },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          안녕하세요! 백엔드와 프론트엔드를 모두 다루는 풀스택 개발자입니다.
          Java Spring Boot와 React를 주로 사용하며, 깔끔하고 유지보수하기 좋은 코드를 지향합니다.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">기술 스택</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {skills.map(({ category, items }) => (
            <div key={category} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-700 mb-3">{category}</h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
        <div className="flex flex-col gap-3">
          <a
            href="https://github.com/hemu0-0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Github size={18} />
            github.com/hemu0-0
          </a>
          <a
            href="mailto:ghkahr1890@gmail.com"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Mail size={18} />
            ghkahr1890@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
