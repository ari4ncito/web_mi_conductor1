import { FiEye } from "react-icons/fi";

const BADGE_STYLES = {
  Crítica: "bg-red-100 text-red-600",
  Media: "bg-amber-100 text-amber-600",
  Baja: "bg-green-100 text-green-600",
};

const ReportsTable = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {
  const getBadgeStyle = (prioridad) => {
    return (
      BADGE_STYLES[prioridad] ||
      "bg-slate-100 text-slate-600"
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-col gap-2 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Novedades Recientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimos reportes enviados por los conductores.
          </p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
          {incidents.length} novedades
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Conductor
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Prioridad
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Fecha
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Hora
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => {
              const isSelected =
                selectedIncident?.id === incident.id;

              return (
                <tr
                  key={incident.id}
                  className={`border-b border-slate-100 transition ${
                    isSelected
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-5 text-center text-sm font-semibold text-slate-700">
                    {incident.id}
                  </td>

                  <td className="px-6 py-5 text-center text-sm text-slate-600">
                    {incident.conductor}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                        incident.prioridad
                      )}`}
                    >
                      {incident.prioridad}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center text-sm text-slate-600">
                    {incident.fecha}
                  </td>

                  <td className="px-6 py-5 text-center text-sm text-slate-600">
                    {incident.hora}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button
                      type="button"
                      title="Ver novedad"
                      onClick={() =>
                        onSelectIncident(incident)
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {incidents.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500">
            No hay novedades registradas.
          </p>
        </div>
      )}
    </section>
  );
};

export default ReportsTable;