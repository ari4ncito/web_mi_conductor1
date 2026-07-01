export default function Features() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seguimiento Avanzado */}
          <div className="bg-white rounded-2xl p-8 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-lg mb-6">
              🗺️
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Seguimiento Avanzado
            </h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm">
              Monitoreo constante de cada kilómetro. Nuestra tecnología GPS de
              baja latencia asegura que siempre sepas dónde está tu servicio.
            </p>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-3xl text-slate-300">
                  🧭
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="grid grid-rows-[auto_1fr] gap-6">
            <div className="bg-white rounded-2xl p-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-lg shrink-0">
                💳
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Pagos Inteligentes
                </h3>
                <p className="text-sm text-slate-500">
                  Liquidaciones automáticas para conductores y facturación
                  transparente para clientes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-lg mb-4">
                  🎯
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Asignación AI
                </h3>
                <p className="text-xs text-slate-500">
                  Algoritmos que eligen al mejor conductor según cercanía y
                  calificación.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-lg mb-4">
                  🛡️
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Seguridad Encriptada
                </h3>
                <p className="text-xs text-slate-500">
                  Tus datos y transacciones están protegidos bajo estándares
                  bancarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}