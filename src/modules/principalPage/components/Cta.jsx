import { Link } from 'react-router-dom';

export default function Cta() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pb-12 sm:pb-20">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl px-6 sm:px-8 py-12 sm:py-16 text-center shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto mb-3 sm:mb-4 leading-tight">
            ¿Listo para elevar el estándar de conducción?
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed">
            Únete a cientos de empresas y miles de usuarios que confían en Mi
            Conductor para sus necesidades de movilidad segura.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto text-center bg-accent hover:bg-accent/90 transition-colors text-white text-sm font-semibold px-8 py-3.5 rounded-full shadow-md"
            >
              Registrarme ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
