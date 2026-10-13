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
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{ maxWidth: 840 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">
              Novedad
            </p>
            <h2 className="mc-modal-title">
              Detalle de la Novedad
            </h2>
            <p className="mc-modal-desc">
              Información completa del reporte y seguimiento de la novedad.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="mc-modal-body space-y-6">
          {/* Estado */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
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
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-400">
                ID Novedad
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-400">
                Conductor
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.conductor}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-400">
                Tipo
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {incident.tipo}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
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

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
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
                loading="lazy"
                width="400"
                height="192"
                className="h-48 w-full rounded-2xl object-cover"
              />

              <img
                src={evidence2}
                alt="Evidencia 2"
                loading="lazy"
                width="400"
                height="192"
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
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-secondary"
          >
            Cerrar
          </button>

          <button
            type="button"
            className="mc-btn-primary"
          >
            <FiCheck size={17} />
            Marcar como Resuelta
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailModal;
