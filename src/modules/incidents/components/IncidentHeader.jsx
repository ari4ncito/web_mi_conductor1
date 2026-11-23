import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import {
  ESTADOS_NOVEDAD,
  SEVERIDADES,
} from "../utils/incidentHelpers.js";

export default function IncidentHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  onRefresh,
  onCreate,
  loading,
}) {
  return (
    <header className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Gestión de novedades
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Consulta, registra y realiza seguimiento a las novedades operativas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <FiPlus />
            Nueva novedad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1fr)_200px_190px]">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-blue-500">
          <FiSearch className="shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar novedades..."
            className="w-full py-2.5 text-sm outline-none"
            aria-label="Buscar novedades"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          aria-label="Filtrar por estado"
        >
          <option value="TODOS">Todos los estados</option>
          {ESTADOS_NOVEDAD.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(event) => onSeverityChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          aria-label="Filtrar por severidad"
        >
          <option value="TODAS">Todas las severidades</option>
          {SEVERIDADES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}