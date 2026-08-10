import { FiEye } from "react-icons/fi";

const PRIORITY_STYLES = {
  Crítica: "bg-red-100 text-red-700",
  Alta: "bg-orange-100 text-orange-700",
  Media: "bg-yellow-100 text-yellow-700",
  Baja: "bg-green-100 text-green-700",
};

const ReportsTable = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {
  const priorityStyle = (priority) =>
    PRIORITY_STYLES[priority] ??
    "bg-slate-100 text-slate-700";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Novedades Recientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimos reportes enviados por los conductores.
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
                Conductor
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Prioridad
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Fecha
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Hora
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Estado
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => {
              const selected =
                selectedIncident?.id === incident.id;

              return (
                <tr
                  key={incident.id}
                  className={`border-b border-slate-100 transition-all duration-200 ${
                    selected
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {incident.id}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {incident.conductor}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(
                        incident.prioridad
                      )}`}
                    >
                      {incident.prioridad}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center text-slate-600">
                    {incident.fecha}
                  </td>

                  <td className="px-4 py-4 text-center text-slate-600">
                    {incident.hora}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        incident.estado === "Pendiente"
                          ? "bg-amber-100 text-amber-700"
                          : incident.estado === "En proceso"
                          ? "bg-blue-100 text-blue-700"
                          : incident.estado === "Resuelta"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {incident.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        title="Ver detalle"
                        onClick={() => onSelectIncident(incident)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <FiEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReportsTable;