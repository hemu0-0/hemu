import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/guestbook', label: 'Guestbook' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: 'var(--header-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
            }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg tracking-tight"
          style={{ color: 'var(--text-hi)' }}
        >
          hemu<span className="gradient-text">.dev</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="ml-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all nav-link"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
