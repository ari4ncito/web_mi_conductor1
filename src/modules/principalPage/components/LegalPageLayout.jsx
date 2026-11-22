import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LEGAL_NAV_ITEMS = [
  { path: '/terminos-uso', label: 'Términos y Condiciones de uso del sitio web' },
  { path: '/terminos-servicio', label: 'Términos y Condiciones del servicio' },
  { path: '/politica-privacidad', label: 'Política de Privacidad de datos' },
];

export default function LegalPageLayout({ title, subtitle, lastUpdated, children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      {/* Hero Header Legal */}
      <section className="bg-primary-dark text-white border-b border-primary/20 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] sm:text-xs font-semibold text-accent mb-3 sm:mb-4 tracking-wide">
            <span>⚖️ MARCO LEGAL E INFORMATIVO · GO DRIVER</span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mb-4">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-400 pt-2 border-t border-white/10">
            <span>Última actualización: <strong>{lastUpdated || 'Noviembre de 2026'}</strong></span>
            <span className="hidden sm:inline">·</span>
            <span>Jurisdicción: <strong>República de Colombia</strong></span>
            <span className="hidden sm:inline">·</span>
            <span className="text-accent font-medium">Borrador formal sujeto a revisión jurídica</span>
          </div>
        </div>
      </section>

      {/* Subnavegador de documentos legales */}
      <nav aria-label="Navegación legal" className="bg-white border-b border-slate-200 sticky top-[65px] sm:top-[73px] z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <ul className="flex items-center gap-2 sm:gap-4 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap m-0 p-0 list-none">
            {LEGAL_NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="shrink-0">
                  <Link
                    to={item.path}
                    className={`py-1.5 px-3 rounded-lg font-medium transition-colors no-underline inline-block text-xs sm:text-sm ${
                      isActive
                        ? 'bg-primary-dark text-white font-semibold'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 border border-slate-200 shadow-sm leading-relaxed text-slate-700 text-xs sm:text-sm md:text-base">
          {children}

          {/* Enlaces de pie de documento */}
          <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark no-underline"
            >
              ← Regresar a la página principal
            </Link>
            <p className="m-0 text-center sm:text-right">
              Plataforma Mi Conductor · Titular: Go Driver
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
