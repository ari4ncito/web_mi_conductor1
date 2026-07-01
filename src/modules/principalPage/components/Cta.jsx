export default function Cta() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto mb-4">
            ¿Listo para elevar el estándar de conducción?
          </h2>
          <p className="text-amber-100 text-sm max-w-md mx-auto mb-10">
            Únete a cientos de empresas y miles de usuarios que confían en Mi
            Conductor para sus necesidades de movilidad segura.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="bg-slate-900 hover:bg-slate-800 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-full"
            >
              Registrarme ahora
            </a>
            <a
              href="#"
              className="bg-amber-700/40 hover:bg-amber-700/60 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-full border border-white/20"
            >
              Contactar ventas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}