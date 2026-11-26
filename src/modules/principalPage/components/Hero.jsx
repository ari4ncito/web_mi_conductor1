import { Link } from 'react-router-dom';
import { MdArrowOutward, MdCheckCircle, MdStar } from 'react-icons/md';
import Photo from './Photo';
import { IMG, unsplash } from '../data/landingContent';
import { scrollToId } from '../utils/landingScroll';

export default function Hero() {
  return (
    <section id="inicio" className="mc-hero relative min-h-[100svh] flex items-center overflow-clip bg-primary-dark text-white">
      <div className="mc-hero__media absolute inset-0 overflow-hidden will-change-transform">
        <Photo
          id={IMG.hero}
          alt="Conductor profesional manejando un vehículo al atardecer"
          eager
          className="h-full w-full object-cover object-[60%_center]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/55 to-primary-dark/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/45 to-transparent" />

      <div className="mc-hero__content relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 pb-16 sm:pb-20 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <div className="lg:col-span-8">
          <p className="mc-hero__fade inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Servicio de conductor elegido
          </p>

          <h1 className="mc-hero__title mt-4 font-display font-normal text-[clamp(2.3rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.02em]">
            Tú disfruta la noche.
            <br />
            Nosotros te llevamos <em className="text-accent">a casa</em>.
          </h1>

          <p className="mc-hero__fade mt-4 sm:mt-5 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
            ¿Tomaste, estás cansado o tu carro quedó en otro lugar? Un conductor profesional maneja{' '}
            <span className="text-white">tu propio vehículo</span> hasta tu destino, con la ruta visible en todo momento.
          </p>

          <div className="mc-hero__fade mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/register"
              data-magnetic
              className="group inline-flex items-center justify-center gap-3 bg-accent text-primary-dark font-semibold text-sm sm:text-base pl-7 pr-2 py-2 rounded-full no-underline shadow-[0_20px_50px_-15px_rgba(251,152,51,0.6)]"
            >
              Solicita tu conductor
              <span className="grid place-items-center w-10 h-10 rounded-full bg-primary-dark text-accent transition-transform duration-500 group-hover:rotate-45">
                <MdArrowOutward className="w-5 h-5" />
              </span>
            </Link>
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('como-funciona');
              }}
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white hover:bg-white/10 transition-colors text-white text-sm sm:text-base font-medium px-7 py-3.5 rounded-full no-underline backdrop-blur-sm"
            >
              Cómo funciona
            </a>
          </div>

          <ul className="mc-hero__fade mt-6 flex flex-wrap gap-x-7 gap-y-2.5 text-xs sm:text-sm text-white/70">
            {['Conductores verificados', 'Inspección fotográfica', 'Ruta en vivo'].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <MdCheckCircle className="w-4 h-4 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tarjeta flotante: representación de la app durante un servicio */}
        <div className="hidden lg:block lg:col-span-4" data-speed="-0.25">
          <div className="mc-hero__card rounded-[1.75rem] border border-white/15 bg-white/10 backdrop-blur-2xl p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/60">Servicio en curso</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                En ruta
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={unsplash(IMG.driverAvatar, 160)}
                alt=""
                className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                loading="eager"
              />
              <div>
                <p className="font-semibold text-sm">Conductor asignado</p>
                <p className="text-xs text-white/60 inline-flex items-center gap-1">
                  <MdStar className="w-3.5 h-3.5 text-accent" aria-hidden /> Verificado · Licencia al día
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-primary-dark/60 p-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white/70" />
                  <span className="w-px flex-1 my-1 border-l border-dashed border-white/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/45">Recogida</p>
                    <p className="text-sm">Bocagrande, Cartagena</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/45">Destino</p>
                    <p className="text-sm">Tu casa · en tu carro</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-white/70">
                <MdCheckCircle className="w-4 h-4 text-accent" aria-hidden /> Vehículo inspeccionado
              </span>
              <span className="font-display text-lg text-accent">ETA 12 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-white/50">
        Desliza
        <span className="relative h-7 w-px bg-white/15 overflow-hidden">
          <span className="mc-scroll-cue absolute inset-0 bg-accent" />
        </span>
      </div>
    </section>
  );
}
