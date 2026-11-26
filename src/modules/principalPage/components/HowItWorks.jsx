import Photo from './Photo';
import { IMG, STEPS } from '../data/landingContent';

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative bg-[#f6f4f0] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 grid lg:grid-cols-12 gap-14 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          <p className="mc-eyebrow" data-reveal>Cómo funciona</p>
          <h2 data-split className="mt-5 font-display font-normal text-primary-dark text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em]">
            De la solicitud a la entrega, en cuatro pasos.
          </h2>
          <p data-reveal className="mt-6 text-slate-600 leading-relaxed max-w-md">
            Todo el proceso queda registrado en la plataforma: quién conduce, por dónde va y en qué estado llega tu vehículo.
          </p>
          <div data-reveal-img className="mc-parallax mt-10 hidden lg:block aspect-[4/3] rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(1,37,56,0.5)]">
            <Photo id={IMG.phone} alt="Teléfono inteligente con aplicaciones en pantalla" sizes="40vw" className="mc-parallax__img" />
          </div>
        </div>

        <ol className="mc-steps lg:col-span-7 relative list-none m-0 p-0 space-y-6 sm:space-y-8">
          <span className="absolute left-[27px] top-4 bottom-4 w-px bg-primary-dark/10" aria-hidden />
          <span className="mc-steps__fill absolute left-[27px] top-4 bottom-4 w-px bg-accent origin-top" aria-hidden />
          {STEPS.map((step, i) => (
            <li key={step.title} data-reveal className="relative pl-20 sm:pl-24">
              <span className="absolute left-0 top-0 grid place-items-center w-14 h-14 rounded-full bg-white border border-primary-dark/10 font-display text-xl text-primary-dark shadow-sm">
                {i + 1}
              </span>
              <div className="rounded-[1.5rem] bg-white p-7 sm:p-9 border border-primary-dark/5 shadow-[0_20px_50px_-35px_rgba(1,37,56,0.45)] transition-transform duration-500 hover:-translate-y-1">
                <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Paso 0{i + 1}</p>
                <h3 className="mt-3 font-display font-normal text-2xl sm:text-3xl text-primary-dark">{step.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
