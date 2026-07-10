import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createEmptyServiceRequest } from '../data/serviceRequestsData.js'
import { getServiceRequests, saveServiceRequest, deleteServiceRequest } from '../services/serviceRequestStorage.js'
import ServiceRequestConfirmDialog from '../components/ServiceRequestConfirmDialog.jsx'
import ServiceRequestFormModal from '../components/ServiceRequestFormModal.jsx'
import ServiceRequestStatusModal from '../components/ServiceRequestStatusModal.jsx'
import AssignDriverModal from '../components/AssignDriverModal.jsx'
import ServiceRequestsPage from './ServiceRequestsPage.jsx'

export default function ServiceRequestsShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const [requests, setRequests] = useState(() => getServiceRequests())
  const [deletingRequest, setDeletingRequest] = useState(null)
  const [statusChangeRequest, setStatusChangeRequest] = useState(null)
  const [assigningRequest, setAssigningRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const segments = location.pathname.split('/').filter(Boolean)
  const requestId = segments[1]
  const request = requests.find((item) => item.id === requestId)

  const filteredRequests = useMemo(() => {
    let result = requests;

    // Filtro por texto (código, cliente, conductor, vehículo)
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

    // Filtro por estado
    if (filterStatus) {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Filtro por rango de fecha programada
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

  const handleDeleteConfirm = () => {
    if (deletingRequest) {
      const updated = deleteServiceRequest(deletingRequest.id);
      setRequests(updated);
    }
    setDeletingRequest(null)
  }

  const handleSave = (nextRequest) => {
    const normalizedRequest = {
      ...nextRequest,
      id: nextRequest.id || `sr-${Date.now()}`,
    }

    const updated = saveServiceRequest(normalizedRequest);
    setRequests(updated);
    closeModal()
  }

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
  }

  const handleStatusChange = (row) => {
    setStatusChangeRequest(row);
  }

  const handleStatusUpdate = (newStatus) => {
    if (statusChangeRequest) {
      const updated = saveServiceRequest({ ...statusChangeRequest, status: newStatus });
      setRequests(updated);
    }
    setStatusChangeRequest(null);
  }

  const handleAssignDriver = (driverInfo) => {
    if (assigningRequest) {
      const updated = saveServiceRequest({
        ...assigningRequest,
        driver: driverInfo.driverName,
        status: 'En Proceso',
      });
      setRequests(updated);
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
    <div style={{ position: 'relative', maxHeight: '100vh', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ServiceRequestsPage
        requests={filteredRequests}
        onRequestDelete={handleDeleteRequest}
        onRequestStatusChange={handleStatusChange}
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
        />
      ) : null}
    </div>
  )
}
