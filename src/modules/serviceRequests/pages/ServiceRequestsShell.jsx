import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    getServiceRequests,
    saveServiceRequest,
    deleteServiceRequest,
    assignDriver,
    cancelServiceRequest,
    completeServiceRequest,
    createEmptyServiceRequest,
} from '../services/serviceRequestStorage.js'
import clienteApi from '../services/clienteApi.js'
import conductorApi from '../services/conductorApi.js'
import vehiculoApi from '../services/vehiculoApi.js'
import ServiceRequestConfirmDialog from '../components/ServiceRequestConfirmDialog.jsx'
import ServiceRequestFormModal from '../components/ServiceRequestFormModal.jsx'
import ServiceRequestStatusModal from '../components/ServiceRequestStatusModal.jsx'
import AssignDriverModal from '../components/AssignDriverModal.jsx'
import ServiceRequestsPage from './ServiceRequestsPage.jsx'

export default function ServiceRequestsShell() {
    const location = useLocation()
    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [deletingRequest, setDeletingRequest] = useState(null)
    const [statusChangeRequest, setStatusChangeRequest] = useState(null)
    const [assigningRequest, setAssigningRequest] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterDateFrom, setFilterDateFrom] = useState('')
    const [filterDateTo, setFilterDateTo] = useState('')

    // Datos auxiliares para los selects del formulario
    const [clients, setClients] = useState([])
    const [drivers, setDrivers] = useState([])
    const [vehicles, setVehicles] = useState([])

    // Cargar solicitudes al montar
    const loadRequests = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getServiceRequests()
            setRequests(data)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al cargar solicitudes')
            console.error('Error cargando solicitudes:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadRequests()
        }, 0)
        return () => clearTimeout(timeoutId)
    }, [loadRequests])

    // Cargar clientes, conductores y vehículos del backend (solo lectura)
    useEffect(() => {
        async function loadAuxData() {
            try {
                const [clientsRes, driversRes, vehiclesRes] = await Promise.all([
                    clienteApi.getAll(),
                    conductorApi.getAll(),
                    vehiculoApi.getAll(),
                ])
                setClients(clientsRes.data || clientsRes || [])
                setDrivers(driversRes.data || driversRes || [])
                setVehicles(vehiclesRes.data || vehiclesRes || [])
            } catch (err) {
                console.error('Error cargando datos auxiliares:', err)
            }
        }
        loadAuxData()
    }, [])

    const segments = location.pathname.split('/').filter(Boolean)
    const requestId = segments[1]
    const request = requests.find((item) => item.id === requestId)

    const filteredRequests = useMemo(() => {
        let result = requests;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((r) =>
                r.code.toLowerCase().includes(q) ||
                r.client.toLowerCase().includes(q) ||
                r.driver.toLowerCase().includes(q) ||
                r.vehicle.toLowerCase().includes(q) ||
                r.serviceType.toLowerCase().includes(q)
            );
        }

        if (filterStatus) {
            result = result.filter((r) => r.status === filterStatus);
        }

        if (filterDateFrom) {
            result = result.filter((r) => r.scheduledDate >= filterDateFrom);
        }
        if (filterDateTo) {
            result = result.filter((r) => r.scheduledDate <= filterDateTo);
        }

        return result;
    }, [requests, searchQuery, filterStatus, filterDateFrom, filterDateTo]);

    const closeModal = () => {
        navigate('/service-requests', { replace: true })
    }

    const handleDeleteRequest = (row) => {
        setDeletingRequest(row)
    }

    const handleDeleteConfirm = async () => {
        if (deletingRequest) {
            try {
                const updated = await deleteServiceRequest(deletingRequest.id);
                setRequests(updated);
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar la solicitud')
            }
        }
        setDeletingRequest(null)
    }

    const handleSave = async (nextRequest) => {
        try {
            const updated = await saveServiceRequest(nextRequest);
            setRequests(updated);
            closeModal()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar la solicitud')
        }
    }

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
    }

    const handleStatusUpdate = async (newStatus) => {
        if (!statusChangeRequest) return;

        try {
            if (newStatus === 'Cancelado') {
                const updated = await cancelServiceRequest(statusChangeRequest.id);
                setRequests(updated);
            } else if (newStatus === 'Completado') {
                const updated = await completeServiceRequest(statusChangeRequest.id);
                setRequests(updated);
            } else {
                // Para Pendiente / En Proceso usamos actualización general
                const updated = await saveServiceRequest({
                    ...statusChangeRequest,
                    status: newStatus,
                });
                setRequests(updated);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar el estado')
        }
        setStatusChangeRequest(null);
    }

    const handleAssignDriver = async (driverInfo) => {
        if (!assigningRequest) return;

        try {
            const updated = await assignDriver(assigningRequest.id, driverInfo.driverId);
            setRequests(updated);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al asignar conductor')
        }
        setAssigningRequest(null);
    }

    const pathname = location.pathname
    const isRegisterRoute = pathname.endsWith('/register')
    const isEditRoute = pathname.endsWith('/edit')
    const isDetailRoute = segments.length === 2 && segments[0] === 'service-requests' && !isRegisterRoute && !isEditRoute

    const activeRequest = request || createEmptyServiceRequest()
    const registerTitle = 'Registrar Nueva Solicitud'
    const registerDescription = 'Ingrese los datos para crear una nueva solicitud de servicio en la plataforma.'

    return (
        <div style={{ position: 'relative' }}>
            <ServiceRequestsPage
                requests={filteredRequests}
                loading={loading}
                error={error}
                onRequestDelete={handleDeleteRequest}
                onAssignDriver={setAssigningRequest}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                filterDateFrom={filterDateFrom}
                filterDateTo={filterDateTo}
                onFilterDateChange={(from, to) => { setFilterDateFrom(from); setFilterDateTo(to); }}
                onClearFilters={handleClearFilters}
            />

            {isRegisterRoute ? (
                <ServiceRequestFormModal
                    title={registerTitle}
                    description={registerDescription}
                    request={createEmptyServiceRequest()}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    submitLabel="Registrar Solicitud"
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            ) : null}

            {isEditRoute ? (
                <ServiceRequestFormModal
                    title="Editar Solicitud"
                    description="Actualice los datos de la solicitud de servicio."
                    request={activeRequest}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    submitLabel="Guardar Cambios"
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            ) : null}

            {isDetailRoute ? (
                <ServiceRequestFormModal
                    title="Detalle de la Solicitud"
                    description="Toda la información de la solicitud se muestra en modo solo lectura."
                    request={activeRequest}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    readOnly
                    submitLabel="Cerrar"
                    closeLabel="Cerrar"
                    onClose={closeModal}
                    onSubmit={closeModal}
                />
            ) : null}

            {deletingRequest ? (
                <ServiceRequestConfirmDialog
                    title="Eliminar solicitud"
                    description={`¿Desea eliminar la solicitud ${deletingRequest.code}? Esta acción no se puede deshacer.`}
                    onCancel={() => setDeletingRequest(null)}
                    onConfirm={handleDeleteConfirm}
                    confirmLabel="Eliminar"
                />
            ) : null}

            {statusChangeRequest ? (
                <ServiceRequestStatusModal
                    request={statusChangeRequest}
                    onClose={() => setStatusChangeRequest(null)}
                    onChangeStatus={handleStatusUpdate}
                />
            ) : null}

            {assigningRequest ? (
                <AssignDriverModal
                    onClose={() => setAssigningRequest(null)}
                    onAssign={handleAssignDriver}
                    drivers={drivers}
                />
            ) : null}
        </div>
    )
}
