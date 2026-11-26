import { Link } from 'react-router-dom';
import { MdArrowOutward } from 'react-icons/md';
import Photo from './Photo';
import { SCENARIOS, SERVICE_INCLUDES } from '../data/landingContent';

// En desktop la sección se fija y las tarjetas avanzan en horizontal con el scroll (GSAP).
// En móvil/tablet es un carrusel nativo con scroll-snap.
export default function Scenarios() {
  return (
    <section id="servicios" className="mc-h-section relative bg-primary-dark text-white lg:h-screen lg:overflow-clip">
      <div className="h-full flex flex-col justify-center py-24 lg:py-0">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-10 mb-10 lg:mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="mc-eyebrow">Nuestro servicio</p>
            <h2 data-split className="mt-5 font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]">
              ¿Cuándo necesitas un conductor?
            </h2>
          </div>
          <p className="max-w-sm text-white/65 leading-relaxed">
            Conductor elegido para cualquier momento en que no puedas o no debas manejar. Desliza para ver algunos casos.
          </p>
        </div>

        <div className="mc-h-viewport overflow-x-auto lg:overflow-visible snap-x snap-mandatory">
          <div className="mc-h-track flex gap-5 lg:gap-8 w-max px-5 sm:px-8 md:px-10 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-[10vw]">
            {SCENARIOS.map((item, i) => (
              <article
                key={item.title}
                className="group snap-start relative w-[80vw] sm:w-[56vw] lg:w-[36vw] aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[62vh] rounded-[1.75rem] overflow-hidden bg-primary"
              >
                <Photo
                  id={item.img}
                  alt={item.alt}
                  sizes="(min-width: 1024px) 36vw, 80vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
                <span className="absolute top-6 left-6 font-display text-sm tracking-widest text-white/80">
                  0{i + 1} <span className="text-white/40">/ 0{SCENARIOS.length}</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-display font-normal text-3xl sm:text-4xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm sm:text-[15px] text-white/75 leading-relaxed max-w-md">{item.text}</p>
                </div>
              </article>
            ))}

            <article className="snap-start relative w-[80vw] sm:w-[56vw] lg:w-[30vw] aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[62vh] rounded-[1.75rem] bg-accent text-primary-dark p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em]">El servicio incluye</p>
                <ul className="mt-6 space-y-3">
                  {SERVICE_INCLUDES.map((item) => (
                    <li key={item} className="flex items-center gap-3 border-b border-primary-dark/15 pb-3 font-display text-lg sm:text-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-dark" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center justify-between gap-3 rounded-full bg-primary-dark text-white pl-6 pr-2 py-2 font-semibold no-underline hover:bg-primary transition-colors"
              >
                Pedir un conductor
                <span className="grid place-items-center w-10 h-10 rounded-full bg-accent text-primary-dark">
                  <MdArrowOutward className="w-5 h-5" aria-hidden />
                </span>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
