export default function Features() {
  return (
    <section id="funciones" className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monitoreo en Tiempo Real */}
          <div className="bg-white rounded-2xl p-8 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg mb-6">
              🗺️
            </div>

            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Monitoreo en Tiempo Real
            </h3>

            <p className="text-sm text-slate-500 mb-8 max-w-sm">
              Sigue el recorrido de tu conductor desde el inicio hasta la
              entrega del vehículo. Nuestra plataforma te brinda mayor control,
              transparencia y tranquilidad durante todo el servicio.
            </p>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-3xl text-primary/40">
                  🧭
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="grid grid-rows-[auto_1fr] gap-6">

            {/* Seguimiento del Servicio */}
            <div className="bg-white rounded-2xl p-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
                📍
              </div>

              <div>
                <h3 className="text-base font-semibold text-primary-dark mb-1">
                  Seguimiento del Servicio
                </h3>

                <p className="text-sm text-slate-500">
                  Consulta la ubicación del conductor y conoce el estado del
                  recorrido en tiempo real para mantener el control durante todo
                  el servicio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* Conductores Profesionales */}
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg mb-4">
                  👨‍✈️
                </div>

                <h3 className="text-sm font-semibold text-primary-dark mb-1">
                  Conductores Profesionales
                </h3>

                <p className="text-xs text-slate-500">
                  Nuestro equipo está conformado por conductores capacitados,
                  comprometidos con brindar un servicio seguro y confiable.
                </p>
              </div>

              {/* Gestión Inteligente */}
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg mb-4">
                  🛡️
                </div>

                <h3 className="text-sm font-semibold text-primary-dark mb-1">
                  Gestión Inteligente
                </h3>

                <p className="text-xs text-slate-500">
                  Administra usuarios, conductores, vehículos y servicios desde
                  una plataforma diseñada para ofrecer organización, control y
                  eficiencia.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}