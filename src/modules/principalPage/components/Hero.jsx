import { Link } from 'react-router-dom';
import { MdPlayArrow } from 'react-icons/md';

export default function Hero() {
  const stats = [
    { value: "Go Driver", label: "CONDUCTORES CAPACITADOS" },
    { value: "Automóviles", label: "TRANSPORTE PRIVADO" },
    { value: "Ruta en Vivo", label: "VISUALIZACIÓN DE RUTA" },
  ];
  return (
    <section id="que-es" className="min-h-[calc(100svh-76px)] flex items-center bg-gradient-to-br from-white via-primary/5 to-accent/10 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Texto */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark leading-tight mb-4 sm:mb-6">
            Conducción segura y profesional para tu{" "}
            <span className="italic text-accent">vehículo</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mb-6 sm:mb-8 leading-relaxed">
            Trasladamos tu automóvil de manera segura cuando no puedas
            conducir por consumo de alcohol, cansancio o indisposición.
            Con asignación ágil, visualización de la ruta hacia tu destino y conductores calificados.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-12">
            <Link
              to="/"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-primary-dark hover:bg-primary transition-colors text-white text-sm font-semibold px-6 py-3 rounded-full shadow-sm"
            >
              Instala la aplicación
              <span
                aria-hidden
                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs"
              >
                <MdPlayArrow />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-slate-200/60">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-lg sm:text-2xl font-bold text-primary-dark">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-slate-500 mt-1 leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Mockup teléfono */}
        <div className="flex justify-center md:justify-end mt-4 md:mt-0">
          <div className="relative w-56 sm:w-64 h-[440px] sm:h-[500px] bg-primary-dark rounded-[2.5rem] p-3 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-b from-primary to-primary-dark rounded-[2rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-primary-dark rounded-b-xl z-10" />
              {/* Mapa / puntos */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-40 h-40 opacity-80">
                  <polygon
                    points="100,20 180,60 180,140 100,180 20,140 20,60"
                    fill="none"
                    stroke="#FB9833"
                    strokeWidth="1"
                  />
                  <circle cx="100" cy="60" r="5" fill="#FB9833" />
                  <circle cx="60" cy="110" r="4" fill="#ffffff" />
                  <circle cx="140" cy="120" r="4" fill="#ffffff" />
                </svg>
              </div>
              {/* Tarjeta inferior */}
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10" />
                    <p className="text-xs font-semibold text-slate-800">
                      Ricardo Silva
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs">•••</span>
                </div>
                <div className="bg-primary/5 rounded-lg px-3 py-2">
                  <p className="text-[9px] text-slate-400 tracking-wide">
                    DESTINO SUGERIDO
                  </p>
                  <p className="text-xs text-slate-700 font-medium">
                    Aeropuerto El Dorado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
