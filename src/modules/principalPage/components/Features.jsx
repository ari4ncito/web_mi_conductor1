import {
  MdAltRoute,
  MdBolt,
  MdDirectionsCar,
  MdSecurity,
  MdSettings,
  MdVerifiedUser,
} from 'react-icons/md';
import Photo from './Photo';
import { CHARACTERISTICS, IMG, WHY_US } from '../data/landingContent';

const ICONS = {
  car: MdDirectionsCar,
  route: MdAltRoute,
  security: MdSecurity,
  settings: MdSettings,
  bolt: MdBolt,
  verified: MdVerifiedUser,
};

export default function Features() {
  return (
    <section id="funciones" className="relative bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mc-eyebrow" data-reveal>¿Por qué Mi Conductor?</p>
            <h2 data-split className="mt-5 font-display font-normal text-primary-dark text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]">
              Seguridad en cada kilómetro.
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-slate-600 leading-relaxed">
            Tecnología y personas capacitadas trabajando juntas para que tú y tu vehículo lleguen bien.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tarjeta destacada con imagen */}
          <div data-reveal-img className="mc-parallax md:col-span-2 lg:row-span-3 min-h-[420px] rounded-[1.75rem] text-white">
            <Photo id={IMG.city} alt="Tráfico de la ciudad al atardecer visto desde la calle" sizes="(min-width: 1024px) 50vw, 100vw" className="mc-parallax__img" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] bg-white/15 backdrop-blur rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Ruta en vivo
              </span>
              <h3 className="mt-4 font-display font-normal text-3xl sm:text-4xl leading-tight max-w-md">
                Visualiza el recorrido de principio a fin.
              </h3>
              <p className="mt-3 text-white/75 text-sm sm:text-base max-w-md leading-relaxed">
                Clientes, conductores y administradores ven la ruta del servicio desde el origen hasta el destino.
              </p>
            </div>
          </div>

          {WHY_US.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.title}
                data-reveal
                className="group rounded-[1.5rem] bg-[#f6f4f0] p-7 transition-colors duration-500 hover:bg-primary-dark"
              >
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-white text-primary transition-colors duration-500 group-hover:bg-accent group-hover:text-primary-dark">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-display font-normal text-xl text-primary-dark transition-colors duration-500 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed transition-colors duration-500 group-hover:text-white/70">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-slate-500">Características principales</p>
          <div data-stagger className="mt-6 flex flex-wrap justify-center gap-2.5">
            {CHARACTERISTICS.map((item) => (
              <span
                key={item}
                className="text-sm text-primary-dark border border-primary-dark/15 rounded-full px-4 py-2 hover:border-accent hover:bg-accent/10 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
