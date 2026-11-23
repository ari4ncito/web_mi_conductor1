import {
  MdMap,
  MdExplore,
  MdLocationOn,
  MdDirectionsCar,
  MdSecurity,
} from "react-icons/md";

export default function Features() {
  return (
    <section id="funciones" className="bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Visualización de Ruta */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 sm:mb-6">
              <MdMap className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-primary-dark mb-2">
              Visualización de Ruta
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-sm leading-relaxed">
              Visualiza el trazado del trayecto desde el origen hasta la
              entrega final de tu automóvil. Nuestra plataforma te brinda control,
              claridad y tranquilidad durante todo el servicio.
            </p>

            <div className="flex-1 flex items-center justify-center py-4">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
                  <MdExplore className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">

            {/* Seguimiento del Servicio */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 flex items-start gap-3 sm:gap-4 border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MdLocationOn className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-primary-dark mb-1">
                  Ruta del Servicio
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Visualiza el mapa de la ruta entre el origen y el destino para
                  conocer con certeza el camino recorrido hasta la entrega del automóvil.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* Conductores Profesionales */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3 sm:mb-4">
                  <MdDirectionsCar className="w-6 h-6" />
                </div>

                <h3 className="text-sm font-semibold text-primary-dark mb-1.5">
                  Conductores Profesionales
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Nuestro equipo está conformado por conductores capacitados,
                  comprometidos con brindar un servicio seguro y confiable.
                </p>
              </div>

              {/* Gestión Inteligente */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-4">
                  <MdSecurity className="w-6 h-6" />
                </div>

                <h3 className="text-sm font-semibold text-primary-dark mb-1.5">
                  Gestión Inteligente
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
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
