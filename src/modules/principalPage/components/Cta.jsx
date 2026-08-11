import { Link } from 'react-router-dom';

export default function Cta() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto mb-4">
            ¿Listo para elevar el estándar de conducción?
          </h2>
          <p className="text-slate-200 text-sm max-w-md mx-auto mb-10">
            Únete a cientos de empresas y miles de usuarios que confían en Mi
            Conductor para sus necesidades de movilidad segura.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-accent hover:bg-accent/90 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-full"
            >
              Registrarme ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}