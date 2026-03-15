import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/hemu0-0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="mailto:ghkahr1890@gmail.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>
        <p className="text-xs text-gray-400">© 2025. hemu0-0 All rights reserved.</p>
      </div>
    </footer>
  );
}
