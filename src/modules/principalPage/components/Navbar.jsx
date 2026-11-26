import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { NAV_LINKS } from '../data/landingContent';
import { scrollToId } from '../utils/landingScroll';

function DashboardIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

/**
 * variant="landing": fija, transparente sobre el hero y sólida al hacer scroll; se oculta al bajar.
 * variant="solid": barra sólida y sticky (páginas legales).
 */
export default function Navbar({ variant = 'solid' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLanding = variant === 'landing';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => (typeof window !== 'undefined' ? window.scrollY > 40 : false));
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isLanding) return undefined;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  const goToSection = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/' && scrollToId(id)) return;
    navigate(`/#${id}`);
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const solidBg = !isLanding || scrolled || mobileMenuOpen;
  const headerClass = [
    isLanding ? 'fixed inset-x-0 top-0' : 'sticky top-0',
    'z-50 w-full text-white transition-[transform,background-color,box-shadow] duration-500 ease-out',
    solidBg ? 'bg-primary-dark/90 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]' : 'bg-transparent',
    isLanding && hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0',
  ].join(' ');

  return (
    <header className={headerClass}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 md:px-10 h-[65px] sm:h-[73px]">
        <Link to="/" className="group inline-flex items-center gap-2.5 no-underline text-white" aria-label="Mi Conductor, inicio">
          <span className="relative grid place-items-center w-9 h-9 rounded-full border border-white/25 bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.2" className="text-accent" stroke="#FB9833" />
              <path d="M3.5 10.5h6.3M14.2 10.5h6.3M12 14.2V21" />
            </svg>
          </span>
          <span className="font-display text-xl tracking-tight">
            Mi Conductor<span className="text-accent">.</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`/#${link.id}`}
                onClick={goToSection(link.id)}
                className="relative text-white/75 hover:text-white transition-colors no-underline after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 bg-accent hover:bg-white hover:text-primary-dark transition-colors text-primary-dark text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full no-underline"
            >
              <DashboardIcon />
              <span>Panel administrativo</span>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden sm:inline text-sm font-medium text-white/80 hover:text-white transition-colors no-underline"
              >
                Regístrate
              </Link>
              <button
                type="button"
                onClick={handleLogin}
                className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-white transition-colors text-primary-dark text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer border-none"
              >
                Iniciar sesión
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center p-0 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="relative block w-4 h-3" aria-hidden>
              <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${mobileMenuOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 sm:px-8 pb-6 pt-2 flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={goToSection(link.id)}
              className="font-display text-2xl text-white/90 hover:text-accent py-2.5 border-b border-white/10 no-underline transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-5 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary-dark bg-accent rounded-full no-underline"
              >
                <DashboardIcon size={16} />
                Ir al panel administrativo
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full py-3 text-sm font-semibold text-primary-dark bg-accent rounded-full cursor-pointer border-none"
                >
                  Iniciar sesión
                </button>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-medium text-white border border-white/20 rounded-full no-underline"
                >
                  ¿No tienes cuenta? Regístrate
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
