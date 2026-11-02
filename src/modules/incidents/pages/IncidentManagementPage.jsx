import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import ModulePage from "../../../components/common/ModulePage/ModulePage";
import ReportsTable from "../components/ReportsTable.jsx";
import IncidentDetailMainView from "../components/IncidentDetailMainView.jsx";

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

// ÚNICAMENTE DOS ESTADOS PERMITIDOS: "Por revisar" y "Revisado"
function formatearEstado(estado) {
    if (!estado) return "Por revisar";

    const norm = String(estado).toUpperCase();
    if (
        norm === "REVISADO" ||
        norm === "RESUELTO" ||
        norm === "RESUELTA" ||
        norm === "CERRADO" ||
        norm === "CERRADA" ||
        norm === "EN_ATENCION"
    ) {
        return "Revisado";
    }

    return "Por revisar";
}

// SOLO TRES PRIORIDADES: "Alta", "Media", "Baja"
function formatearPrioridad(severidad) {
    if (!severidad) return "Media";

    const norm = String(severidad).toUpperCase();
    if (norm === "ALTA" || norm === "CRITICA" || norm === "CRÍTICA") {
        return "Alta";
    }
    if (norm === "BAJA") {
        return "Baja";
    }
    return "Media";
}

function formatearTipo(tipo, motivoOtro = "") {
    if (!tipo) return "—";

    const tipos = {
        ACCIDENTE: "Accidente",
        FALLA_MECANICA_GRAVE: "Falla mecánica grave",
        FALLA_MECANICA_LEVE: "Falla mecánica leve",
        TRAFICO_PESADO: "Tráfico pesado",
        TRAFICO_LEVE: "Tráfico leve",
        CONTROLES_RETENES: "Controles o retenes de autoridad",
        CAMBIO_RUTA: "Cambio de ruta",
        GASOLINA_BAJA: "Gasolina baja",
        PINCHAZO_LLANTA: "Pinchazo de llanta",
        CLIMA_ADVERSO: "Condiciones climáticas adversas",
        DESVIO_OBRAS: "Desvío por obras",
        OTRO: motivoOtro ? `Otro (${motivoOtro})` : "Otro",
        OTROS: motivoOtro ? `Otro (${motivoOtro})` : "Otros",
        MECANICA: "Falla Mecánica",
        VIAL: "Incidente Vial",
        CLIENTE: "Incidente con Cliente",
        ADMINISTRATIVA: "Novedad Administrativa",
    };

    return tipos[tipo] || tipo;
}

function normalizarNovedad(novedad) {
    const id = novedad?._id || novedad?.id;

    // Conductor enriquecido
    const conductorUsuario =
        novedad?.conductor?.usuario ||
        novedad?.solicitud?.conductorAsignado?.usuario;

    const nombreConductor =
        obtenerNombreUsuario(conductorUsuario) ||
        obtenerNombreUsuario(novedad?.conductor) ||
        obtenerNombreUsuario(novedad?.usuarioRegistro) ||
        "Sin conductor asignado";

    const conductorDocumento =
        conductorUsuario?.documento ||
        conductorUsuario?.numeroDocumento ||
        novedad?.conductor?.documento ||
        "1015677644";

    const conductorTelefono =
        conductorUsuario?.telefono ||
        conductorUsuario?.celular ||
        novedad?.conductor?.telefono ||
        "3001234567";

    const conductorCorreo =
        conductorUsuario?.correo ||
        conductorUsuario?.email ||
        novedad?.conductor?.email ||
        "conductor@miconductor.com";

    // Cliente enriquecido
    const clienteUsuario =
        novedad?.solicitud?.cliente?.usuario ||
        novedad?.cliente?.usuario;

    const nombreCliente =
        obtenerNombreUsuario(clienteUsuario) ||
        obtenerNombreUsuario(novedad?.solicitud?.cliente) ||
        obtenerNombreUsuario(novedad?.cliente) ||
        "Cliente asignado";

    const clienteDocumento =
        clienteUsuario?.documento ||
        clienteUsuario?.numeroDocumento ||
        novedad?.solicitud?.cliente?.documento ||
        "1020304050";

    const clienteTelefono =
        clienteUsuario?.telefono ||
        clienteUsuario?.celular ||
        novedad?.solicitud?.cliente?.telefono ||
        "3109876543";

    const clienteCorreo =
        clienteUsuario?.correo ||
        clienteUsuario?.email ||
        novedad?.solicitud?.cliente?.email ||
        "cliente@ejemplo.com";

    const fechaCreacion =
        novedad?.createdAt ||
        novedad?.fechaCreacion ||
        null;

    const estado = formatearEstado(novedad?.estadoNovedad || novedad?.estado);

    // Fecha de cierre / resolución
    const rawFechaCierre =
        novedad?.fechaCierre ||
        (novedad?.historialNotas?.length > 0
            ? novedad.historialNotas[novedad.historialNotas.length - 1]?.fecha
            : null) ||
        (estado === "Revisado" && novedad?.updatedAt ? novedad.updatedAt : null);

    const fechaInicialDate = formatearFecha(fechaCreacion);
    const fechaInicialTime = formatearHora(fechaCreacion);

    const fechaFinalDate = estado === "Revisado" && rawFechaCierre ? formatearFecha(rawFechaCierre) : "";
    const fechaFinalTime = estado === "Revisado" && rawFechaCierre ? formatearHora(rawFechaCierre) : "";

    const fotosEvidencia = Array.isArray(novedad?.fotosEvidencia) && novedad.fotosEvidencia.length > 0
        ? novedad.fotosEvidencia
        : (novedad?.evidenciaUrl
            ? [novedad.evidenciaUrl]
            : (Array.isArray(novedad?.evidencias) ? novedad.evidencias : []));

    // Normalizar geolocalización
    let ubicacion = novedad?.ubicacion;
    let ubicacionTexto = "";
    if (typeof ubicacion === "string") {
        ubicacionTexto = ubicacion;
        ubicacion = { lat: 6.2442, lng: -75.5812, direccion: ubicacionTexto };
    } else if (ubicacion && typeof ubicacion === "object") {
        ubicacionTexto = ubicacion.direccion || (ubicacion.lat && ubicacion.lng ? `${ubicacion.lat}, ${ubicacion.lng}` : "");
    }

    return {
        ...novedad,
        id: id ? String(id) : "",
        codigo: id
            ? `NOV-${String(id).slice(-6).toUpperCase()}`
            : "NOV-SIN-ID",
        conductor: nombreConductor,
        conductorDocumento,
        conductorTelefono,
        conductorCorreo,
        clienteNombre: nombreCliente,
        clienteDocumento,
        clienteTelefono,
        clienteCorreo,
        prioridad: formatearPrioridad(novedad?.severidad || novedad?.prioridad),
        estado,
        estadoOriginal: novedad?.estadoNovedad || novedad?.estado || "POR_REVISAR",
        tipo: formatearTipo(novedad?.tipo, novedad?.motivoOtro),
        tipoOriginal: novedad?.tipo,
        fecha: fechaInicialDate,
        hora: fechaInicialTime,
        fechaInicialDate,
        fechaInicialTime,
        fechaFinalDate,
        fechaFinalTime,
        fechaCreacion,
        fechaCierre: rawFechaCierre,
        descripcion: novedad?.descripcion || "Sin descripción",
        ubicacion,
        ubicacionTexto,
        solicitud: novedad?.solicitud || null,
        rutaInicial: novedad?.rutaInicial || {
            origen: novedad?.solicitud?.origen || "Medellín, Antioquia",
            destino: novedad?.solicitud?.destino || "Rionegro, Antioquia"
        },
        rutaNueva: novedad?.rutaNueva || null,
        fotosEvidencia,
        evidencias: fotosEvidencia,
        historialNotas: Array.isArray(novedad?.historialNotas) ? novedad.historialNotas : [],
        notasResolucion: novedad?.notasResolucion || novedad?.observaciones || "",
        observaciones: novedad?.observaciones || "",
    };
}

export default function IncidentManagementPage() {
    const location = useLocation();
    const [incidents, setIncidents] = useState([]);
    const [selectedIncidentOverride, setSelectedIncidentOverride] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [operationError, setOperationError] = useState("");

    // Determinar la novedad seleccionada (por interacción o por navegación directa desde Solicitudes)
    const selectedIncident = useMemo(() => {
        if (selectedIncidentOverride === false) {
            return null;
        }
        if (selectedIncidentOverride && typeof selectedIncidentOverride === "object") {
            return selectedIncidentOverride;
        }
        const navId = location.state?.selectedIncidentId;
        if (navId && incidents.length > 0) {
            return (
                incidents.find(
                    (novedad) =>
                        String(novedad.id) === String(navId) ||
                        String(novedad._id) === String(navId)
                ) || null
            );
        }
        return null;
    }, [selectedIncidentOverride, location.state?.selectedIncidentId, incidents]);

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

            setSelectedIncidentOverride(actual => {
                if (!actual) return actual;

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

    const handleOpenDetail = (incident) => {
        setOperationError("");
        setSelectedIncidentOverride(incident);
    };

    const handleCloseDetail = () => {
        if (saving) return;

        setSelectedIncidentOverride(false);
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

            // Refrescar lista y actualizar novedad seleccionada para reflejar el nuevo estado y notas
            const response = await incidentsData.getAll();
            const lista = obtenerLista(response);

            const novedadesNormalizadas = lista
                .map(normalizarNovedad)
                .filter(novedad => novedad.id);

            setIncidents(novedadesNormalizadas);

            const actualizada = novedadesNormalizadas.find(
                novedad => novedad.id === selectedIncident.id
            );
            if (actualizada) {
                setSelectedIncidentOverride(actualizada);
            }
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

    // ========================================================
    // SI HAY UNA NOVEDAD SELECCIONADA: VISTA DE DETALLE EN EL MAIN
    // ========================================================
    if (selectedIncident) {
        return (
            <section
                className="w-full min-w-0"
                style={{
                    boxSizing: "border-box",
                    background: "#f3f6fb",
                    minHeight: "100%",
                }}
            >
                {operationError && (
                    <div
                        role="alert"
                        className="w-full p-4 sm:p-6 lg:p-8 pb-0 text-xs sm:text-sm text-red-700 font-medium"
                    >
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5">
                            {operationError}
                        </div>
                    </div>
                )}

                <IncidentDetailMainView
                    incident={selectedIncident}
                    onBack={handleCloseDetail}
                    onChangeStatus={handleChangeStatus}
                    saving={saving}
                />
            </section>
        );
    }

    // ========================================================
    // VISTA PRINCIPAL: SOLO LA TABLA DE NOVEDADES
    // ========================================================
    return (
        <ModulePage
            label="Módulo de Novedades"
            title="Gestión de Novedades"
        >
            <div className="space-y-4">
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
                        onSelectIncident={handleOpenDetail}
                    />
                )}
            </div>
        </ModulePage>
    );
}
