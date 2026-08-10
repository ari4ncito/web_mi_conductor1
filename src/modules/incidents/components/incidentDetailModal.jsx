import { useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiFlag,
  FiUser,
  FiX,
} from "react-icons/fi";

import evidence1 from "../assets/images/evidence1.jpg";
import evidence2 from "../assets/images/evidence2.jpg";

const STATUS = {
  Pendiente: "bg-amber-100 text-amber-700",
  "En proceso": "bg-blue-100 text-blue-700",
  Resuelta: "bg-green-100 text-green-700",
  Cancelada: "bg-red-100 text-red-700",
};

const IncidentDetailModal = ({ open, incident, onClose }) => {
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  if (!open || !incident) return null;

  const items = [
    {
      label: "ID",
      value: incident.id,
      icon: FiFileText,
    },
    {
      label: "Conductor",
      value: incident.conductor,
      icon: FiUser,
    },
    {
      label: "Tipo",
      value: incident.tipo,
      icon: FiFlag,
    },
    {
      label: "Prioridad",
      value: incident.prioridad,
      icon: FiFlag,
    },
    {
      label: "Fecha",
      value: incident.fecha,
      icon: FiCalendar,
    },
    {
      label: "Hora",
      value: incident.hora,
      icon: FiClock,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Detalle de la Novedad
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información completa del reporte.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-8 p-6">
          <div className="flex justify-end">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                STATUS[incident.estado]
              }`}
            >
              {incident.estado}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="text-slate-500" />

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-3 text-lg font-semibold text-slate-800">
              Descripción
            </h3>

            <p className="leading-7 text-slate-600">
              {incident.descripcion}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Evidencias
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {[evidence1, evidence2].map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Evidencia ${index + 1}`}
                  className="h-64 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Observaciones del Administrador
            </label>

            <textarea
              rows={5}
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500"
              placeholder="Escriba las observaciones..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100">
              Solicitar Actualización
            </button>

            <button className="rounded-xl bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-900">
              Marcar como Resuelta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailModal;