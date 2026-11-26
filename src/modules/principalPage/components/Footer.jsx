import { Link } from 'react-router-dom';
import { MdLocationOn, MdMail, MdPhone } from 'react-icons/md';

const LEGAL_LINKS = [
  { label: 'Términos y condiciones de uso del sitio web', to: '/terminos-uso' },
  { label: 'Términos y condiciones del servicio', to: '/terminos-servicio' },
  { label: 'Política de privacidad de datos', to: '/politica-privacidad' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 pb-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl sm:text-4xl leading-tight">
            Comunícate <span className="italic text-accent">con nosotros</span>.
          </p>
          <p className="mt-4 text-white/60 text-sm max-w-sm leading-relaxed">
            Estamos para ayudarte a llegar seguro, tú y tu vehículo.
          </p>
        </div>

        <ul className="md:col-span-4 space-y-4 text-sm text-white/80">
          <li className="text-accent text-xs uppercase tracking-[0.25em] font-semibold">Empresa: Go Driver</li>
          <li className="flex items-start gap-3">
            <MdLocationOn className="w-5 h-5 text-accent shrink-0" aria-hidden />
            Cartagena de Indias, Barrio Prado
          </li>
          <li className="flex items-start gap-3">
            <MdPhone className="w-5 h-5 text-accent shrink-0" aria-hidden />
            <a href="tel:+573145439798" className="text-white/80 hover:text-white no-underline">314 543 9798</a>
          </li>
          <li className="flex items-start gap-3 break-all">
            <MdMail className="w-5 h-5 text-accent shrink-0" aria-hidden />
            <a href="mailto:miconductor2025@gmail.com" className="text-white/80 hover:text-white no-underline">
              miconductor2025@gmail.com
            </a>
          </li>
        </ul>

        <ul className="md:col-span-3 space-y-3 text-sm">
          <li className="text-white/45 text-xs uppercase tracking-[0.25em]">Legal</li>
          {LEGAL_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="text-white/80 hover:text-accent transition-colors no-underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10" aria-hidden>
        <p className="font-display leading-[0.85] tracking-[-0.04em] text-[clamp(3.5rem,15vw,13rem)] text-white/[0.06] whitespace-nowrap select-none">
          Mi Conductor
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>Plataforma Mi Conductor · Go Driver · Cartagena de Indias, Colombia</p>
          <p>© {new Date().getFullYear()} Go Driver. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
