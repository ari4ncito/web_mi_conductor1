import { Link } from 'react-router-dom';
import { MdArrowOutward } from 'react-icons/md';
import Photo from './Photo';
import { IMG } from '../data/landingContent';

export default function Cta() {
  return (
    <section className="bg-[#f6f4f0] px-3 sm:px-5 pb-3 sm:pb-5">
      <div className="mc-parallax rounded-[2rem] sm:rounded-[2.5rem] min-h-[80svh] flex items-center justify-center text-center text-white">
        <Photo id={IMG.city} alt="" className="mc-parallax__img" />
        <div className="absolute inset-0 bg-primary-dark/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(1,37,56,0.85)_75%)]" />

        <div className="relative z-10 max-w-4xl px-6 py-24">
          <p className="mc-eyebrow justify-center" data-reveal>Empieza hoy</p>
          <h2 data-split className="mt-6 font-display font-normal text-[clamp(2.6rem,7vw,6rem)] leading-[1] tracking-[-0.02em]">
            La próxima vez, <em className="text-accent">no manejes tú</em>.
          </h2>
          <p data-reveal className="mt-7 mx-auto max-w-xl text-white/75 text-base sm:text-lg leading-relaxed">
            Crea tu cuenta, registra tu vehículo y ten un conductor profesional a un toque de distancia.
          </p>
          <div data-reveal className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              data-magnetic
              className="group inline-flex items-center gap-3 bg-accent text-primary-dark font-semibold pl-8 pr-2 py-2 rounded-full no-underline shadow-[0_25px_60px_-20px_rgba(251,152,51,0.7)]"
            >
              Registrarme ahora
              <span className="grid place-items-center w-11 h-11 rounded-full bg-primary-dark text-accent transition-transform duration-500 group-hover:rotate-45">
                <MdArrowOutward className="w-5 h-5" aria-hidden />
              </span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 rounded-full border border-white/30 hover:bg-white hover:text-primary-dark transition-colors text-white font-medium no-underline"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
