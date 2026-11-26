import { Link } from 'react-router-dom';
import logoMiConductor from '../../../assets/logo-mi-conductor.png';

export default function Footer() {
  const links = [
    { label: "Términos y Condiciones de uso del sitio web", to: "/terminos-uso" },
    { label: "Términos y Condiciones del servicio", to: "/terminos-servicio" },
    { label: "Política de Privacidad de datos", to: "/politica-privacidad" },
  ];

  return (
    <footer id="faq" className="bg-primary-dark border-t-2 border-accent/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-12 sm:pt-14 pb-10 sm:pb-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center md:items-start">
        {/* Columna izquierda: Contacto */}
        <div className="text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
            Comunícate con nosotros
          </h3>

          <div className="text-white/85 text-xs sm:text-sm space-y-2.5">
            <p className="font-semibold text-accent text-sm sm:text-base">Empresa: Go Driver</p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent/90" aria-hidden="true">•</span>
              <span>Cartagena de Indias, Barrio Prado</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent/90" aria-hidden="true">•</span>
              <span>Teléfono: 314 543 9798</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 break-all">
              <span className="text-accent/90" aria-hidden="true">•</span>
              <span>miconductor2025@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Columna central: Logo principal */}
        <div className="flex flex-col items-center justify-center">
          <Link
            to="/"
            aria-label="Mi Conductor"
            className="inline-flex items-center justify-center group no-underline"
          >
            <span className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-accent shadow-[0_12px_28px_rgba(0,0,0,0.45),0_0_24px_rgba(255,165,61,0.25)] shrink-0 bg-primary-dark transition-transform duration-200 group-hover:scale-105">
              <img
                src={logoMiConductor}
                alt="Mi Conductor"
                className="w-full h-full object-cover scale-[1.07] block"
              />
            </span>
          </Link>
        </div>

        {/* Columna derecha: Legal */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
            Información legal
          </h3>

          <ul className="space-y-2.5 sm:space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-xs sm:text-sm text-white/85 hover:text-accent hover:underline underline-offset-4 transition-colors block md:inline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 bg-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-5 text-center">
          <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed">
            Plataforma Mi Conductor · Go Driver · Cartagena de Indias, Colombia
          </p>
          <p className="text-[10px] sm:text-[11px] text-white/50 mt-1.5">
            © 2026 Go Driver. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
