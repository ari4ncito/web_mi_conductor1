import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FAQS } from '../data/landingContent';

export default function Faq() {
  // Al abrir/cerrar una pregunta cambia la altura de la página: recalcular posiciones de scroll
  const handleToggle = () => ScrollTrigger.refresh();

  return (
    <section id="faq" className="bg-[#f6f4f0] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <p className="mc-eyebrow" data-reveal>Preguntas frecuentes</p>
          <h2 data-split className="mt-5 font-display font-normal text-primary-dark text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em]">
            Resolvemos tus dudas.
          </h2>

          <div data-stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-[1.5rem] bg-white p-7 border border-primary-dark/5">
              <h3 className="font-display font-normal text-2xl text-primary-dark">Nuestra misión</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Brindar una solución tecnológica que facilite la gestión de servicios de conductor elegido, garantizando
                seguridad, eficiencia y confianza mediante la visualización de ruta y una administración inteligente.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-primary-dark text-white p-7">
              <h3 className="font-display font-normal text-2xl">Nuestra visión</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Ser una plataforma líder en servicios de conductor elegido, reconocida por su innovación, seguridad y una
                experiencia confiable para clientes, conductores y empresas.
              </p>
            </div>
          </div>
        </div>

        <div data-stagger className="lg:col-span-7 border-t border-primary-dark/10">
          {FAQS.map((item) => (
            <details key={item.q} className="mc-faq group border-b border-primary-dark/10" onToggle={handleToggle}>
              <summary className="list-none cursor-pointer flex items-center justify-between gap-6 py-6 sm:py-7">
                <span className="font-display text-lg sm:text-2xl text-primary-dark leading-snug group-hover:text-primary transition-colors">
                  {item.q}
                </span>
                <span className="mc-faq__icon grid place-items-center w-10 h-10 shrink-0 rounded-full border border-primary-dark/15 text-accent text-xl transition-transform duration-300">
                  +
                </span>
              </summary>
              <p className="pb-7 pr-14 text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
