import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-5">
        <Link 
          to="/" 
          className="text-xl font-bold text-primary-dark">
          Mi Conductor
        </Link>
 
        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <li>
            <a href="#sobre-mi-conductor" onClick={scrollTo('sobre-mi-conductor')} className="hover:text-primary transition-colors">
              ¿Qué es?
            </a>
          </li>
          <li>
            <a href="#servicios" onClick={scrollTo('servicios')} className="hover:text-primary transition-colors">
              Servicios
            </a>
          </li>
          <li>
            <a href="#usuarios" onClick={scrollTo('usuarios')} className="hover:text-primary transition-colors">
              Usuarios
            </a>
          </li>
          <li>
            <a href="#funciones" onClick={scrollTo('funciones')} className="hover:text-primary transition-colors">
              Funciones
            </a>
          </li>
          <li>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-primary transition-colors">
              FAQ
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="hidden sm:inline text-sm font-semibold text-slate-700 hover:text-primary transition-colors no-underline"
          >
            Regístrate
          </Link>
          <button
            type="button"
            onClick={handleLogin}
            className="bg-accent hover:bg-accent/90 transition-colors text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-pointer shadow-sm"
          >
            Iniciar sesión
          </button>

          {/* Botón hamburguesa móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center p-0 cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menú desplegable para móvil y tablet */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-lg animate-fadeIn">
          <a
            href="#sobre-mi-conductor"
            onClick={scrollTo('sobre-mi-conductor')}
            className="text-sm font-medium text-slate-700 py-1 hover:text-primary transition-colors"
          >
            ¿Qué es?
          </a>
          <a
            href="#servicios"
            onClick={scrollTo('servicios')}
            className="text-sm font-medium text-slate-700 py-1 hover:text-primary transition-colors"
          >
            Servicios
          </a>
          <a
            href="#usuarios"
            onClick={scrollTo('usuarios')}
            className="text-sm font-medium text-slate-700 py-1 hover:text-primary transition-colors"
          >
            Usuarios
          </a>
          <a
            href="#funciones"
            onClick={scrollTo('funciones')}
            className="text-sm font-medium text-slate-700 py-1 hover:text-primary transition-colors"
          >
            Funciones
          </a>
          <a
            href="#faq"
            onClick={scrollTo('faq')}
            className="text-sm font-medium text-slate-700 py-1 hover:text-primary transition-colors"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Iniciar sesión
            </button>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors no-underline"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
