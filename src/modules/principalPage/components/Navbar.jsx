import { Link } from 'react-router-dom';

const scrollTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-slate-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link 
          to="/" 
          className="text-xl font-bold text-primary-dark">
        
          Mi Conductor

        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <li>
            <a href="#sobre-mi-conductor" onClick={scrollTo('sobre-mi-conductor')} className="hover:text-primary transition-colors">
              ¿Qué es?
            </a>
          </li>
          <li>
            <a href="#servicios" onClick={scrollTo('servicios')} className="hover:text-primary transition-colors">
              Servicios
            </a>
          </li>
          <li>
            <a href="#usuarios" onClick={scrollTo('usuarios')} className="hover:text-primary transition-colors">
              Usuarios
            </a>
          </li>
          <li>
            <a href="#funciones" onClick={scrollTo('funciones')} className="hover:text-primary transition-colors">
              Funciones
            </a>
          </li>
          <li>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-primary transition-colors">
              FAQ
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:inline text-sm text-slate-700 hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-accent hover:bg-accent/90 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Registrate aquí
          </Link>
        </div>
      </nav>
    </header>
  );
}