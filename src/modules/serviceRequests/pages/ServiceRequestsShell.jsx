
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getServiceRequests,
    saveServiceRequest,
    deleteServiceRequest,
    assignDriver,
    cancelServiceRequest,
    completeServiceRequest,
    createEmptyServiceRequest
} from "../services/serviceRequestStorage.js";

import clienteApi from "../services/clienteApi.js";
import conductorApi from "../services/conductorApi.js";
import vehiculoApi from "../services/vehiculoApi.js";

import ServiceRequestConfirmDialog from "../components/ServiceRequestConfirmDialog.jsx";
import ServiceRequestFormModal from "../components/ServiceRequestFormModal.jsx";
import ServiceRequestStatusModal from "../components/ServiceRequestStatusModal.jsx";
import AssignDriverModal from "../components/AssignDriverModal.jsx";
import ServiceRequestsPage from "./ServiceRequestsPage.jsx";

function obtenerMensajeError(error, mensajePredeterminado) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        mensajePredeterminado
    );
}

function obtenerLista(response, nombreAlternativo) {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.rows)) {
        return data.rows;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.data?.rows)) {
        return data.data.rows;
    }

    if (
        nombreAlternativo &&
        Array.isArray(data?.[nombreAlternativo])
    ) {
        return data[nombreAlternativo];
    }

    return [];
}

function ErrorModal({ mensaje, onClose }) {
    return (
        <div className="mc-modal-overlay" style={{ zIndex: 1300 }}>
            <div
                className="mc-modal mc-modal--sm"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="sr-general-error-title"
                style={{
                    maxWidth: 480,
                    width: "calc(100% - 32px)"
                }}
            >
                <div className="mc-modal-header">
                    <p className="mc-modal-subtitle">
                        No se pudo completar la operación
                    </p>

                    <h2
                        id="sr-general-error-title"
                        className="mc-modal-title"
                    >
                        Revisa la información
                    </h2>

                    <p className="mc-modal-desc">{mensaje}</p>
                </div>

                <div className="mc-modal-footer">
                    <button
                        type="button"
                        className="mc-btn-primary"
                        onClick={onClose}
                        autoFocus
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ServiceRequestsShell() {
    const location = useLocation();
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const [deletingRequest, setDeletingRequest] = useState(null);
    const [statusChangeRequest, setStatusChangeRequest] = useState(null);
    const [assigningRequest, setAssigningRequest] = useState(null);
    const [operationError, setOperationError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [clients, setClients] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const emptyRequest = useMemo(
        () => createEmptyServiceRequest(),
        []
    );

    // Carga inicial de solicitudes.
    useEffect(() => {
        let cancelado = false;

        async function cargarSolicitudesIniciales() {
            try {
                const data = await getServiceRequests();

                if (!cancelado) {
                    setRequests(data);
                    setError(null);
                }
            } catch (err) {
                if (!cancelado) {
                    setError(
                        obtenerMensajeError(
                            err,
                            "Error al cargar las solicitudes."
                        )
                    );

                    console.error(
                        "Error cargando solicitudes:",
                        err
                    );
                }
            } finally {
                if (!cancelado) {
                    setLoading(false);
                }
            }
        }

        void cargarSolicitudesIniciales();

        return () => {
            cancelado = true;
        };
    }, []);

    // Carga de datos auxiliares del módulo.
    // Cada respuesta se procesa por separado para evitar que el fallo
    // de una petición impida cargar las demás.
    useEffect(() => {
        let cancelado = false;

        async function cargarDatosAuxiliares() {
            const resultados = await Promise.allSettled([
                clienteApi.getAll(),
                conductorApi.getAll(),
                vehiculoApi.getAll()
            ]);

            if (cancelado) return;

            const [clientesResultado, conductoresResultado, vehiculosResultado] =
                resultados;

            if (clientesResultado.status === "fulfilled") {
                setClients(
                    obtenerLista(
                        clientesResultado.value,
                        "clientes"
                    )
                );
            } else {
                console.error(
                    "Error cargando clientes:",
                    clientesResultado.reason
                );
            }

            if (conductoresResultado.status === "fulfilled") {
                setDrivers(
                    obtenerLista(
                        conductoresResultado.value,
                        "conductores"
                    )
                );
            } else {
                console.error(
                    "Error cargando conductores:",
                    conductoresResultado.reason
                );
            }

            if (vehiculosResultado.status === "fulfilled") {
                setVehicles(
                    obtenerLista(
                        vehiculosResultado.value,
                        "vehiculos"
                    )
                );
            } else {
                console.error(
                    "Error cargando vehículos:",
                    vehiculosResultado.reason
                );
            }
        }

        void cargarDatosAuxiliares();

        return () => {
            cancelado = true;
        };
    }, []);

    // Consulta los vehículos activos pertenecientes a un cliente.
    // El resultado se entrega al formulario para actualizar su selector.
    const cargarVehiculosCliente = useCallback(async clienteId => {
        if (!clienteId) {
            return [];
        }

        const response = await vehiculoApi.getByCliente(clienteId);

        return obtenerLista(response, "vehiculos");
    }, []);

    const segments = location.pathname.split("/").filter(Boolean);
    const requestId = segments[1] || "";

    const isRegisterRoute =
        location.pathname.endsWith("/register");

    const isEditRoute =
        location.pathname.endsWith("/edit");

    const isDetailRoute =
        segments.length === 2 &&
        segments[0] === "service-requests" &&
        !isRegisterRoute &&
        !isEditRoute;

    const request = useMemo(
        () =>
            requests.find(
                item => String(item.id) === requestId
            ) || null,
        [requests, requestId]
    );

    const filteredRequests = useMemo(() => {
        let result = requests;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();

            result = result.filter(item =>
                (item.code || "").toLowerCase().includes(query) ||
                (item.client || "").toLowerCase().includes(query) ||
                (item.driver || "").toLowerCase().includes(query) ||
                (item.vehicle || "").toLowerCase().includes(query) ||
                (item.serviceType || "").toLowerCase().includes(query)
            );
        }

        if (filterStatus) {
            result = result.filter(
                item => item.status === filterStatus
            );
        }

        if (filterDateFrom || filterDateTo) {
            result = result.filter(item => {
                if (!item.scheduledDate) return false;

                const date = new Date(item.scheduledDate);

                if (Number.isNaN(date.getTime())) return false;

                const dateString = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, "0"),
                    String(date.getDate()).padStart(2, "0")
                ].join("-");

                if (filterDateFrom && dateString < filterDateFrom) {
                    return false;
                }

                if (filterDateTo && dateString > filterDateTo) {
                    return false;
                }

                return true;
            });
        }

        return result;
    }, [
        requests,
        searchQuery,
        filterStatus,
        filterDateFrom,
        filterDateTo
    ]);

    const closeModal = useCallback(() => {
        setOperationError("");
        navigate("/service-requests", { replace: true });
    }, [navigate]);

    const handleSave = async nextRequest => {
        if (saving) return;

        setSaving(true);
        setOperationError("");

        try {
            const updated = await saveServiceRequest(nextRequest);

            setRequests(updated);
            closeModal();
        } catch (err) {
            setOperationError(
                obtenerMensajeError(
                    err,
                    "Error al guardar la solicitud."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingRequest) return;

        try {
            const updated = await deleteServiceRequest(
                deletingRequest.id
            );

            setRequests(updated);
            setDeletingRequest(null);
        } catch (err) {
            setOperationError(
                obtenerMensajeError(
                    err,
                    "Error al cancelar la solicitud."
                )
            );
        }
    };

    const handleStatusUpdate = async newStatus => {
        if (!statusChangeRequest) return;

        try {
            let updated;

            if (newStatus === "Cancelado") {
                updated = await cancelServiceRequest(
                    statusChangeRequest.id
                );
            } else if (newStatus === "Completado") {
                updated = await completeServiceRequest(
                    statusChangeRequest.id
                );
            } else {
                throw new Error(
                    "Para iniciar una solicitud debes asignar un conductor."
                );
            }

            setRequests(updated);
            setStatusChangeRequest(null);
        } catch (err) {
            setOperationError(
                obtenerMensajeError(
                    err,
                    "Error al cambiar el estado."
                )
            );
        }
    };

    const handleAssignDriver = async driverInfo => {
        if (!assigningRequest) return;

        try {
            const updated = await assignDriver(
                assigningRequest.id,
                driverInfo.driverId
            );

            setRequests(updated);
            setAssigningRequest(null);
        } catch (err) {
            setOperationError(
                obtenerMensajeError(
                    err,
                    "Error al asignar el conductor."
                )
            );
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilterStatus("");
        setFilterDateFrom("");
        setFilterDateTo("");
    };

    const closeOperationError = () => {
        setOperationError("");
    };

    const propsFormulario = {
        clients,
        drivers,
        vehicles,
        onLoadVehicles: cargarVehiculosCliente
    };

    return (
        <div style={{ position: "relative" }}>
            <ServiceRequestsPage
                requests={filteredRequests}
                loading={loading}
                error={error}
                onRequestDelete={setDeletingRequest}
                onAssignDriver={setAssigningRequest}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                filterDateFrom={filterDateFrom}
                filterDateTo={filterDateTo}
                onFilterDateChange={(from, to) => {
                    setFilterDateFrom(from);
                    setFilterDateTo(to);
                }}
                onClearFilters={handleClearFilters}
            />

            {isRegisterRoute && (
                <ServiceRequestFormModal
                    key="register-service-request"
                    title="Registrar Nueva Solicitud"
                    description="Ingresa los datos del servicio que se solicita para hoy."
                    request={emptyRequest}
                    {...propsFormulario}
                    submitLabel={
                        saving
                            ? "Registrando..."
                            : "Registrar Solicitud"
                    }
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            )}

            {isEditRoute && request && (
                <ServiceRequestFormModal
                    key={`edit-${request.id}`}
                    title="Editar Solicitud"
                    description="Actualiza los datos de la solicitud."
                    request={request}
                    {...propsFormulario}
                    submitLabel="Guardar Cambios"
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            )}

            {isDetailRoute && request && (
                <ServiceRequestFormModal
                    key={`detail-${request.id}`}
                    title="Detalle de la Solicitud"
                    description="Información de la solicitud en modo de solo lectura."
                    request={request}
                    {...propsFormulario}
                    readOnly
                    submitLabel="Cerrar"
                    closeLabel="Cerrar"
                    onClose={closeModal}
                    onSubmit={closeModal}
                />
            )}

            {isDetailRoute && !request && loading && (
                <div role="status" aria-live="polite">
                    Cargando detalle de la solicitud...
                </div>
            )}

            {isDetailRoute && !request && !loading && (
                <ErrorModal
                    mensaje="No se encontró la solicitud. Vuelve a la lista y abre nuevamente el detalle."
                    onClose={closeModal}
                />
            )}

            {deletingRequest && (
                <ServiceRequestConfirmDialog
                    title="Cancelar solicitud"
                    description={`¿Deseas cancelar la solicitud ${deletingRequest.code}?`}
                    onCancel={() => setDeletingRequest(null)}
                    onConfirm={handleDeleteConfirm}
                    confirmLabel="Cancelar solicitud"
                />
            )}

            {statusChangeRequest && (
                <ServiceRequestStatusModal
                    request={statusChangeRequest}
                    onClose={() => setStatusChangeRequest(null)}
                    onChangeStatus={handleStatusUpdate}
                />
            )}

            {assigningRequest && (
                <AssignDriverModal
                    onClose={() => setAssigningRequest(null)}
                    onAssign={handleAssignDriver}
                    drivers={drivers}
                />
            )}

            {operationError && (
                <ErrorModal
                    mensaje={operationError}
                    onClose={closeOperationError}
                />
            )}
        </div>
    );
}
