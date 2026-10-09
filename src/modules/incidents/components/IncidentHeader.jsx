import { FiBell, FiSearch, FiRefreshCw } from "react-icons/fi";

const IncidentHeader = () => {
  return (
    <header className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Información */}
      <div>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Supervise en tiempo real las novedades operativas reportadas por los
          conductores y gestione su seguimiento desde un único lugar.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Buscador */}
        <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white md:w-80">
          <FiSearch className="mr-3 text-lg text-slate-400" />

          <input
            type="text"
            placeholder="Buscar conductor o novedad..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Actualizar */}
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <FiRefreshCw />

          Actualizar
        </button>

        {/* Notificaciones */}
        
      </div>
    </header>
  );
};

export default IncidentHeader;
