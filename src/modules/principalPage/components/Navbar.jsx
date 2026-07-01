export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <a href="#" className="text-xl font-bold text-slate-900">
          Mi Conductor
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <li>
            <a href="#" className="text-amber-600 font-medium">
              ¿Qué es?
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Usuarios
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Funciones
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900 transition-colors"
          >
            Login
          </a>
          <a
            href="#"
            className="bg-amber-500 hover:bg-amber-600 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Crea tu cuenta
          </a>
        </div>
      </nav>
    </header>
  );
}