import {
  FiX,
  FiImage,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";

import evidence1 from "../../../assets/evidence1.jpg";
import evidence2 from "../../../assets/evidence2.jpg";

const IncidentDetailModal = ({
  open,
  incident,
  onClose,
}) => {
  if (!open || !incident) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 md:px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Detalle de la Novedad
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información completa del reporte.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-6 p-6 md:p-8">
          {/* Estado */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estado
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.estado}
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700">
              {incident.prioridad}
            </span>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                ID Novedad
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Conductor
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.conductor}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Tipo
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.tipo}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Fecha y hora
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.fecha} - {incident.hora}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-800">
              Descripción
            </h3>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-600">
                {incident.descripcion}
              </p>
            </div>
          </div>

          {/* Evidencias */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FiImage className="text-slate-500" />

              <h3 className="text-sm font-bold text-slate-800">
                Evidencias
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <img
                src={evidence1}
                alt="Evidencia 1"
                className="h-48 w-full rounded-2xl object-cover"
              />

              <img
                src={evidence2}
                alt="Evidencia 2"
                className="h-48 w-full rounded-2xl object-cover"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="incident-observations"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Observaciones del Administrador
            </label>

            <textarea
              id="incident-observations"
              rows="4"
              placeholder="Escriba observaciones o seguimiento..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiRefreshCw size={17} />

              Solicitar Actualización
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <FiCheck size={17} />

              Marcar como Resuelta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailModal;