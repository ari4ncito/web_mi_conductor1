
import { useCallback, useEffect, useMemo, useState } from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage";

import IncidentStats from "../components/IncidentStats.jsx";
import ReportsTable from "../components/ReportsTable.jsx";
import IncidentChart from "../components/IncidentChart.jsx";
import IncidentDetailModal from "../components/incidentDetailModal.jsx";

import incidentsData from "../data/incidentsData.js";

function obtenerMensajeError(error, mensajePredeterminado) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        mensajePredeterminado
    );
}

function obtenerLista(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.rows)) {
        return response.rows;
    }

    if (Array.isArray(response?.novedades)) {
        return response.novedades;
    }

    if (Array.isArray(response?.data?.rows)) {
        return response.data.rows;
    }

    if (Array.isArray(response?.data?.novedades)) {
        return response.data.novedades;
    }

    return [];
}

function obtenerNombreUsuario(usuario) {
    if (!usuario) return "";

    return [
        usuario.nombre,
        usuario.apellido,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();
}

function formatearFecha(fecha) {
    if (!fecha) return "—";

    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatearHora(fecha) {
    if (!fecha) return "—";

    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function formatearEstado(estado) {
    const estados = {
        PENDIENTE: "Pendiente",
        EN_ATENCION: "En atención",
        RESUELTA: "Resuelta",
        CERRADA: "Cerrada",
    };

    return estados[estado] || estado || "Pendiente";
}

function formatearPrioridad(severidad) {
    const prioridades = {
        BAJA: "Baja",
        MEDIA: "Media",
        ALTA: "Alta",
        CRITICA: "Crítica",
    };

    return prioridades[severidad] || severidad || "—";
}

function formatearTipo(tipo) {
    const tipos = {
        MECANICA: "Mecánica",
        VIAL: "Vial",
        CLIENTE: "Cliente",
        ADMINISTRATIVA: "Administrativa",
        OTROS: "Otros",
    };

    return tipos[tipo] || tipo || "—";
}

function normalizarNovedad(novedad) {
    const id = novedad?._id || novedad?.id;

    const conductorUsuario = novedad?.conductor?.usuario;

    const nombreConductor =
        obtenerNombreUsuario(conductorUsuario) ||
        obtenerNombreUsuario(novedad?.conductor) ||
        obtenerNombreUsuario(novedad?.usuarioRegistro);

    const fechaCreacion =
        novedad?.createdAt ||
        novedad?.fechaCreacion ||
        null;

    const evidenciaUrl = novedad?.evidenciaUrl || "";

    return {
        ...novedad,
        id: id ? String(id) : "",
        codigo: id
            ? `NOV-${String(id).slice(-6).toUpperCase()}`
            : "NOV-SIN-ID",
        conductor: nombreConductor || "Sin conductor asignado",
        prioridad: formatearPrioridad(novedad?.severidad),
        estado: formatearEstado(novedad?.estadoNovedad),
        estadoOriginal: novedad?.estadoNovedad || "PENDIENTE",
        tipo: formatearTipo(novedad?.tipo),
        fecha: formatearFecha(fechaCreacion),
        hora: formatearHora(fechaCreacion),
        fechaCreacion,
        descripcion: novedad?.descripcion || "Sin descripción",
        ubicacion: novedad?.ubicacion || "",
        evidencias: evidenciaUrl ? [evidenciaUrl] : [],
        evidenciaUrl,
        observaciones: novedad?.observaciones || "",
    };
}

export default function IncidentManagementPage() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [operationError, setOperationError] = useState("");

    const cargarNovedades = useCallback(async ({
        mostrarCarga = true,
        limpiarError = true,
    } = {}) => {
        if (mostrarCarga) {
            setLoading(true);
        }

        if (limpiarError) {
            setError("");
        }

        try {
            const response = await incidentsData.getAll();
            const lista = obtenerLista(response);

            const novedadesNormalizadas = lista
                .map(normalizarNovedad)
                .filter(novedad => novedad.id);

            setIncidents(novedadesNormalizadas);

            setSelectedIncident(actual => {
                if (!actual) return null;

                return (
                    novedadesNormalizadas.find(
                        novedad => novedad.id === actual.id
                    ) || null
                );
            });
        } catch (err) {
            console.error("Error cargando novedades:", err);

            setError(
                obtenerMensajeError(
                    err,
                    "No se pudieron cargar las novedades."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelado = false;

        const iniciarCarga = async () => {
            if (cancelado) return;

            await cargarNovedades({
                mostrarCarga: false,
                limpiarError: false,
            });
        };

        const tarea = Promise.resolve().then(iniciarCarga);

        return () => {
            cancelado = true;
            void tarea;
        };
    }, [cargarNovedades]);

    const handleOpenModal = incident => {
        setOperationError("");
        setSelectedIncident(incident);
    };

    const handleCloseModal = () => {
        if (saving) return;

        setSelectedIncident(null);
        setOperationError("");
    };

    const handleChangeStatus = async (
        estadoNovedad,
        observaciones
    ) => {
        if (!selectedIncident?.id || saving) return;

        try {
            setSaving(true);
            setOperationError("");

            await incidentsData.updateEstado(
                selectedIncident.id,
                estadoNovedad,
                observaciones
            );

            await cargarNovedades();
        } catch (err) {
            console.error(
                "Error actualizando el estado de la novedad:",
                err
            );

            const mensaje = obtenerMensajeError(
                err,
                "No se pudo actualizar la novedad."
            );

            setOperationError(mensaje);

            throw new Error(mensaje, {
                cause: err,
            });
        } finally {
            setSaving(false);
        }
    };

    const incidentsForDisplay = useMemo(
        () => incidents,
        [incidents]
    );

    return (
        <ModulePage
            label="Gestión de Novedades"
            title="Gestión de Novedades"
        >
            <div className="space-y-6">
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => void cargarNovedades()}
                            disabled={loading}
                            className="mt-3 rounded-lg bg-white px-4 py-2 font-semibold text-red-700 shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Cargando..." : "Reintentar"}
                        </button>
                    </div>
                )}

                {operationError && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {operationError}
                    </div>
                )}

                <IncidentStats incidents={incidentsForDisplay} />

                {loading && incidents.length === 0 ? (
                    <div
                        role="status"
                        className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm"
                    >
                        Cargando novedades...
                    </div>
                ) : (
                    <ReportsTable
                        incidents={incidentsForDisplay}
                        selectedIncident={selectedIncident}
                        onSelectIncident={handleOpenModal}
                    />
                )}

                <IncidentChart incidents={incidentsForDisplay} />
            </div>

            <IncidentDetailModal
                key={selectedIncident?.id || "sin-novedad"}
                open={Boolean(selectedIncident)}
                incident={selectedIncident}
                onClose={handleCloseModal}
                onChangeStatus={handleChangeStatus}
                saving={saving}
            />
        </ModulePage>
    );
}
