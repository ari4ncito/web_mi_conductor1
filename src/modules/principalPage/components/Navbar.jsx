import { Link } from 'react-router-dom';

const scrollTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <a href="#que-es" onClick={scrollTo('que-es')} className="text-xl font-bold text-slate-900">
          Mi Conductor
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <li>
            <a href="#que-es" onClick={scrollTo('que-es')} className="text-amber-600 font-medium">
              ¿Qué es?
            </a>
          </li>
          <li>
            <a href="#usuarios" onClick={scrollTo('usuarios')} className="hover:text-slate-900 transition-colors">
              Usuarios
            </a>
          </li>
          <li>
            <a href="#funciones" onClick={scrollTo('funciones')} className="hover:text-slate-900 transition-colors">
              Funciones
            </a>
          </li>
          <li>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-amber-500 hover:bg-amber-600 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Crea tu cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}