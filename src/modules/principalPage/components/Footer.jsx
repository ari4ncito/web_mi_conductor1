import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    { label: "Términos y Condiciones de uso del sitio web", to: "/terminos-uso" },
    { label: "Términos y Condiciones del servicio", to: "/terminos-servicio" },
    { label: "Política de Privacidad de datos", to: "/politica-privacidad" },
  ];

  return (
    <footer id="faq" className="bg-primary-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Comunícate con nosotros
          </h3>

          <div className="text-white/90 text-xs sm:text-sm space-y-1.5 mb-6 sm:mb-8">
            <p className="font-semibold text-accent">Empresa: Go Driver</p>
            <p>Cartagena de Indias, Barrio Prado</p>
            <p>Teléfono: 314 543 9798</p>
            <p className="break-all">miconductor2025@gmail.com</p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Mi Conductor</p>

          <ul className="space-y-2.5 sm:space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-xs sm:text-sm text-white/90 hover:text-accent underline underline-offset-2 transition-colors no-underline block md:inline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-6 text-center">
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
