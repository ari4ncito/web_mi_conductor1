
import { useState } from "react";
import {
    FiX,
    FiImage,
    FiCheck,
    FiRefreshCw,
} from "react-icons/fi";

const STATUS_STYLES = {
    Pendiente: {
        color: "#c2410c",
        background: "#fff7ed",
    },
    "En atención": {
        color: "#1d4ed8",
        background: "#eff6ff",
    },
    Resuelta: {
        color: "#15803d",
        background: "#f0fdf4",
    },
    Cerrada: {
        color: "#475569",
        background: "#f1f5f9",
    },
};

const PRIORITY_STYLES = {
    "Crítica": {
        background: "#FDECEC",
        color: "#D93025",
    },
    Alta: {
        background: "#FDECEC",
        color: "#D93025",
    },
    Media: {
        background: "#FFF4DB",
        color: "#C88600",
    },
    Baja: {
        background: "#EAF8EE",
        color: "#1E8E3E",
    },
};

const IncidentDetailModal = ({
    open,
    incident,
    onClose,
    onChangeStatus,
    saving = false,
}) => {
    const [observaciones, setObservaciones] = useState(
        incident?.observaciones || ""
    );

    const [localError, setLocalError] = useState("");

    if (!open || !incident) {
        return null;
    }

    const statusStyle =
        STATUS_STYLES[incident.estado] || {
            color: "#374151",
            background: "#f3f4f6",
        };

    const priorityStyle =
        PRIORITY_STYLES[incident.prioridad] || {
            background: "#f1f5f9",
            color: "#475569",
        };

    const estaCerrada =
        incident.estadoOriginal === "CERRADA";

    const estaResuelta =
        incident.estadoOriginal === "RESUELTA";

    const ejecutarCambio = async estado => {
        setLocalError("");

        const textoObservaciones = observaciones.trim();

        if (
            textoObservaciones.length > 0 &&
            textoObservaciones.length < 5
        ) {
            setLocalError(
                "Las observaciones deben tener al menos 5 caracteres."
            );
            return;
        }

        try {
            await onChangeStatus(
                estado,
                textoObservaciones
            );
        } catch (error) {
            setLocalError(
                error?.message ||
                "No se pudo actualizar la novedad."
            );
        }
    };

    const evidencia =
        incident.evidenciaUrl ||
        incident.evidencias?.[0] ||
        "";

    return (
        <div
            className="mc-modal-overlay"
            onMouseDown={event => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="incident-detail-title"
                className="mc-modal"
                style={{
                    width: "min(900px, calc(100% - 32px))",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <div className="mc-modal-header">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 20,
                        }}
                    >
                        <div style={{ maxWidth: 520 }}>
                            <p className="mc-modal-subtitle">
                                Novedad
                            </p>

                            <h2
                                id="incident-detail-title"
                                className="mc-modal-title"
                            >
                                {incident.codigo || incident.id}
                            </h2>

                            <p className="mc-modal-desc">
                                Información completa de la novedad reportada.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="mc-modal-close"
                            disabled={saving}
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <div className="mc-modal-body">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "22px 18px",
                        }}
                    >
                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                ID Novedad
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                {incident.codigo || incident.id}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Estado
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span
                                    style={{
                                        display: "inline-flex",
                                        borderRadius: 20,
                                        padding: "6px 12px",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        ...statusStyle,
                                    }}
                                >
                                    {incident.estado}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Conductor
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                {incident.conductor || "Sin conductor asignado"}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Prioridad
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span
                                    style={{
                                        display: "inline-flex",
                                        borderRadius: 20,
                                        padding: "6px 12px",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        ...priorityStyle,
                                    }}
                                >
                                    {incident.prioridad}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Tipo de novedad
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                {incident.tipo}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Fecha y hora
                            </div>

                            <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                {incident.fecha} — {incident.hora}
                            </div>
                        </div>

                        {incident.ubicacion && (
                            <div>
                                <div className="mb-2 text-sm font-medium text-slate-600">
                                    Ubicación
                                </div>

                                <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                    {incident.ubicacion}
                                </div>
                            </div>
                        )}

                        <div style={{ gridColumn: "1 / -1" }}>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Descripción
                            </div>

                            <div className="min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800">
                                {incident.descripcion}
                            </div>
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <div className="mb-2 text-sm font-medium text-slate-600">
                                Evidencia
                            </div>

                            {evidencia ? (
                                <a
                                    href={evidencia}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 underline"
                                >
                                    <FiImage />
                                    Ver evidencia adjunta
                                </a>
                            ) : (
                                <p className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                                    Esta novedad no tiene evidencia adjunta.
                                </p>
                            )}
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <label
                                htmlFor="incident-observaciones"
                                className="mb-2 block text-sm font-medium text-slate-600"
                            >
                                Observaciones
                            </label>

                            <textarea
                                id="incident-observaciones"
                                value={observaciones}
                                onChange={event => {
                                    setObservaciones(event.target.value);
                                    setLocalError("");
                                }}
                                rows={4}
                                maxLength={2000}
                                placeholder="Escribe las observaciones sobre esta novedad..."
                                disabled={saving || estaCerrada}
                                className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                            />

                            {incident.observaciones && (
                                <p className="mt-2 text-xs text-slate-500">
                                    Observaciones registradas:{" "}
                                    {incident.observaciones}
                                </p>
                            )}
                        </div>
                    </div>

                    {localError && (
                        <div
                            role="alert"
                            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            {localError}
                        </div>
                    )}

                    {estaCerrada && (
                        <p className="mt-4 text-sm text-slate-500">
                            Esta novedad está cerrada y no se puede modificar.
                        </p>
                    )}
                </div>

                <div
                    style={{
                        borderTop: "1px solid rgba(17, 17, 17, 0.08)",
                        padding: "20px 32px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="mc-btn-secondary"
                        disabled={saving}
                    >
                        Cerrar
                    </button>

                    {!estaCerrada && !estaResuelta && (
                        <button
                            type="button"
                            onClick={() =>
                                void ejecutarCambio("EN_ATENCION")
                            }
                            disabled={saving}
                            className="mc-btn-secondary"
                        >
                            <span className="inline-flex items-center gap-2">
                                <FiRefreshCw />
                                {saving
                                    ? "Actualizando..."
                                    : "Solicitar actualización"}
                            </span>
                        </button>
                    )}

                    {!estaCerrada && !estaResuelta && (
                        <button
                            type="button"
                            onClick={() =>
                                void ejecutarCambio("RESUELTA")
                            }
                            disabled={saving}
                            className="mc-btn-primary"
                        >
                            <span className="inline-flex items-center gap-2">
                                <FiCheck />
                                {saving
                                    ? "Guardando..."
                                    : "Marcar como resuelta"}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncidentDetailModal;
