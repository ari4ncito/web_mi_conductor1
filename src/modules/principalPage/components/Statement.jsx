import Photo from './Photo';
import { IMG } from '../data/landingContent';

export default function Statement() {
  return (
    <section className="mc-parallax relative min-h-[90svh] flex items-center bg-primary-dark text-white" aria-labelledby="mc-statement-title">
      <Photo id={IMG.driving} alt="Vehículo avanzando por una vía al caer la tarde" className="mc-parallax__img" />
      <div className="absolute inset-0 bg-primary-dark/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-transparent to-primary-dark" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-28">
        <p id="mc-statement-title" className="mc-eyebrow">Si tomas, no manejes</p>
        <p data-scrub-words className="mt-8 font-display text-[clamp(2rem,5.2vw,4.6rem)] leading-[1.12] tracking-[-0.015em]">
          Esa noche merece terminar bien. Pide un conductor profesional y llega a casa en tu propio carro:
          sin riesgos, sin multas y sin preocupaciones.
        </p>
      </div>
    </section>
  );
}
