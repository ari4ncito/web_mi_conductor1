import { Link } from 'react-router-dom';

export default function Hero() {
  const stats = [
    { value: "3", label: "ROLES ESPECIALIZADOS" },
    { value: "12+", label: "MÓDULOS ACTIVOS" },
    { value: "99%", label: "DISPONIBILIDAD" },
  ];
  return (
    <section id="que-es" className="bg-gradient-to-br from-white via-primary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark leading-tight mb-6">
            Innovación que inspira{" "}
            <span className="italic text-accent">confianza</span>
          </h1>
          <p className="text-slate-600 text-base max-w-md mb-8">
            Transformamos la forma de solicitar un conductor.
            Con tecnología de seguimiento en tiempo real,
            gestión inteligente y profesionales capacitados,
            hacemos que cada recorrido sea más seguro, eficiente
            y confiable.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-dark hover:bg-primary transition-colors text-white text-sm font-medium px-6 py-3 rounded-full"
            >
              Instala la aplicación
              <span
                aria-hidden
                className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]"
              >
                ▶
              </span>
            </Link>
          </div>
          <div className="flex gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary-dark">
                  {stat.value}
                </p>
                <p className="text-[11px] tracking-wide text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Mockup teléfono */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-[520px] bg-primary-dark rounded-[2.5rem] p-3 shadow-2xl">
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