import { useNavigate } from 'react-router-dom';
import { MdPerson, MdDirectionsCar, MdAdminPanelSettings, MdArrowForward, MdCheck } from 'react-icons/md';
import { ROLES } from '../data/landingContent';
import { scrollToId } from '../utils/landingScroll';

const ICONS = {
  cliente: MdPerson,
  conductor: MdDirectionsCar,
  admin: MdAdminPanelSettings,
};

export default function Solutions() {
  const navigate = useNavigate();

  const handleCta = (e, role) => {
    e.preventDefault();
    if (role.key === 'admin') navigate('/login');
    else scrollToId('funciones');
  };

  return (
    <section id="usuarios" className="relative bg-primary-dark text-white py-24 sm:py-32 overflow-clip">
      <div
        className="pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-primary/40 blur-[120px]"
        data-speed="-0.3"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
        <div className="max-w-2xl">
          <p className="mc-eyebrow" data-reveal>Una plataforma, tres experiencias</p>
          <h2 data-split className="mt-5 font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]">
            Soluciones a la medida de tu rol.
          </h2>
        </div>

        <div data-stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {ROLES.map((role) => {
            const Icon = ICONS[role.key];
            const featured = role.key === 'conductor';
            return (
              <article
                key={role.key}
                className={`group relative flex flex-col rounded-[1.75rem] p-7 sm:p-9 border transition-[translate,border-color,box-shadow] duration-500 hover:-translate-y-2 ${
                  featured
                    ? 'bg-primary border-white/10 shadow-[0_40px_80px_-40px_rgba(27,118,142,0.8)]'
                    : 'bg-white/[0.04] border-white/10 hover:border-accent/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/10 text-accent">
                    <Icon className="w-6 h-6" aria-hidden />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/55 border border-white/15 rounded-full px-3 py-1">
                    {role.tag}
                  </span>
                </div>
                <h3 className="mt-8 font-display font-normal text-3xl">{role.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{role.description}</p>
                <ul className="mt-7 space-y-2.5 flex-1">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                      <MdCheck className="w-4 h-4 mt-0.5 text-accent shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={role.key === 'admin' ? '/login' : '#funciones'}
                  onClick={(e) => handleCta(e, role)}
                  className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-accent no-underline"
                >
                  {role.cta}
                  <MdArrowForward className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
