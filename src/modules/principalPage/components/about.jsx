import { MdCheck } from 'react-icons/md';
import Photo from './Photo';
import { IMG, STATS, WHEN_TO_USE } from '../data/landingContent';

export default function About() {
  return (
    <section id="sobre-mi-conductor" className="relative bg-white py-24 sm:py-32 overflow-clip">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
        {/* Composición de imágenes */}
        <div className="lg:col-span-6 relative pb-16 sm:pb-20">
          <div data-reveal-img className="mc-parallax aspect-[4/5] sm:aspect-[5/6] w-[88%] rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(1,37,56,0.55)]">
            <Photo
              id={IMG.party}
              alt="Amigos brindando juntos durante una celebración"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="mc-parallax__img"
            />
          </div>
          <div
            data-speed="-0.35"
            className="absolute right-0 bottom-0 w-[48%] aspect-square rounded-[1.5rem] overflow-hidden border-[6px] sm:border-8 border-white shadow-2xl"
          >
            <Photo id={IMG.whiskey} alt="Bebida servida en la barra de un bar" sizes="(min-width: 1024px) 22vw, 45vw" className="h-full w-full object-cover" />
          </div>
          <div
            data-speed="0.2"
            className="absolute left-4 sm:left-8 bottom-6 sm:bottom-10 rounded-2xl bg-primary-dark text-white px-5 py-4 shadow-xl max-w-[220px]"
          >
            <p className="font-display text-2xl leading-none text-accent">Si tomas,</p>
            <p className="font-display text-2xl leading-tight">no manejes.</p>
          </div>
        </div>

        {/* Texto */}
        <div className="lg:col-span-6 lg:pl-6">
          <p className="mc-eyebrow" data-reveal>¿Qué es Mi Conductor?</p>
          <h2 data-split className="mt-5 font-display font-normal text-primary-dark text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-[-0.02em]">
            Tu vehículo, en las mejores manos.
          </h2>
          <p data-reveal className="mt-6 text-slate-600 leading-relaxed">
            La empresa <strong className="text-primary-dark">GoDriver</strong> ofrece servicios de conducción segura y
            profesional a través de <strong className="text-primary-dark">Mi Conductor</strong>: un conductor capacitado
            traslada tu automóvil a tu destino cuando tú no puedes o no debes manejar.
          </p>

          <ul data-stagger className="mt-8 space-y-3.5">
            {WHEN_TO_USE.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-accent/15 text-accent">
                  <MdCheck className="w-4 h-4" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-slate-200 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="font-display text-4xl sm:text-5xl text-primary-dark tabular-nums">
                    <span data-count={stat.value}>{stat.value}</span>
                    <span className="text-accent">{stat.suffix}</span>
                  </span>
                  <span className="mt-2 block text-[11px] sm:text-xs uppercase tracking-[0.12em] text-slate-500 leading-snug">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
