import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createEmptyClient } from '../data/clientsData.js'
import { getClients, saveClient, deleteClient } from '../services/clientStorage.js'
import ClientConfirmDialog from '../components/ClientConfirmDialog.jsx'
import ClientFormModal from '../components/ClientFormModal.jsx'
import ClientsPage from './ClientsPage.jsx'

export default function ClientsShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const [clients, setClients] = useState(() => getClients())
  const [deletingClient, setDeletingClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const segments = location.pathname.split('/').filter(Boolean)
  const clientId = segments[1]
  const client = clients.find((item) => item.id === clientId)

  const filteredClients = useMemo(() => {
    let result = clients;

    // Filtro por texto (nombre, email, identificación, teléfono)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.identification && c.identification.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q))
      );
    }

    // Filtro por tipo
    if (filterType) {
      result = result.filter((c) => c.type === filterType);
    }

    // Filtro por rango de fecha de registro
    if (filterDateFrom) {
      result = result.filter((c) => c.registrationDate >= filterDateFrom);
    }
    if (filterDateTo) {
      result = result.filter((c) => c.registrationDate <= filterDateTo);
    }

    return result;
  }, [clients, searchQuery, filterType, filterDateFrom, filterDateTo]);

  const closeModal = () => {
    navigate('/clients', { replace: true })
  }

  const handleDeleteRequest = (row) => {
    setDeletingClient(row)
  }

  const handleDeleteConfirm = () => {
    if (deletingClient) {
      const updated = deleteClient(deletingClient.id);
      setClients(updated);
    }
    setDeletingClient(null)
  }

  const handleSave = (nextClient) => {
    const normalizedClient = {
      ...nextClient,
      id: nextClient.id || nextClient.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `client-${Date.now()}`,
    }

    const updated = saveClient(normalizedClient);
    setClients(updated);
    closeModal()
  }

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('');
    setFilterDateFrom('');
    setFilterDateTo('');
  }

  const pathname = location.pathname
  const isRegisterRoute = pathname.endsWith('/register')
  const isEditRoute = pathname.endsWith('/edit')
  const isDetailRoute = segments.length === 2 && segments[0] === 'clients' && !isRegisterRoute

  const activeClient = client || createEmptyClient()
  const registerTitle = 'Registrar Nuevo Cliente'
  const registerDescription = 'Ingrese los datos para dar de alta un nuevo cliente en la plataforma.'

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ClientsPage
        clients={filteredClients}
        onRequestDelete={handleDeleteRequest}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        onFilterDateChange={(from, to) => { setFilterDateFrom(from); setFilterDateTo(to); }}
        onClearFilters={handleClearFilters}
      />

      {isRegisterRoute ? (
        <ClientFormModal
          title={registerTitle}
          description={registerDescription}
          client={createEmptyClient()}
          submitLabel="Registrar Cliente"
          closeLabel="Cancelar"
          onClose={closeModal}
          onSubmit={handleSave}
        />
      ) : null}

      {isEditRoute ? (
        <ClientFormModal
          title="Editar Cliente"
          description="Actualice los datos del cliente sin perder la estructura original del formulario."
          client={activeClient}
          submitLabel="Guardar Cambios"
          closeLabel="Cancelar"
          onClose={closeModal}
          onSubmit={handleSave}
        />
      ) : null}

      {isDetailRoute ? (
        <ClientFormModal
          title="Detalle del Cliente"
          description="Toda la información del cliente se muestra en modo solo lectura."
          client={activeClient}
          readOnly
          submitLabel="Cerrar"
          closeLabel="Cerrar"
          onClose={closeModal}
          onSubmit={closeModal}
        />
      ) : null}

      {deletingClient ? (
        <ClientConfirmDialog
          title="Eliminar cliente"
          description={`¿Desea eliminar a ${deletingClient.name}? Esta acción no se puede deshacer.`}
          onCancel={() => setDeletingClient(null)}
          onConfirm={handleDeleteConfirm}
          confirmLabel="Eliminar"
        />
      ) : null}
    </div>
  )
}
