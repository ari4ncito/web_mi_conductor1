import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createEmptyClient, initialClients } from '../data/clientsData.js'
import ClientConfirmDialog from '../components/ClientConfirmDialog.jsx'
import ClientFormModal from '../components/ClientFormModal.jsx'
import ClientsPage from './ClientsPage.jsx'

export default function ClientsShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [clients, setClients] = useState(initialClients)
  const [deletingClient, setDeletingClient] = useState(null)

  const segments = location.pathname.split('/').filter(Boolean)
  const clientId = segments[1]
  const client = clients.find((item) => item.id === clientId)

  const closeModal = () => {
    navigate('/clients', { replace: true })
  }

  const handleDeleteRequest = (row) => {
    setDeletingClient(row)
  }

  const handleDeleteConfirm = () => {
    if (deletingClient) {
      setClients((current) => current.filter((item) => item.id !== deletingClient.id))
    }
    setDeletingClient(null)
  }

  const handleSave = (nextClient) => {
    const normalizedClient = {
      ...nextClient,
      id: nextClient.id || nextClient.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `client-${Date.now()}`,
    }

    setClients((current) => {
      const exists = current.some((item) => item.id === normalizedClient.id)
      if (!exists) {
        return [normalizedClient, ...current]
      }

      return current.map((item) => (item.id === normalizedClient.id ? normalizedClient : item))
    })
    closeModal()
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
      <ClientsPage clients={clients} onRequestDelete={handleDeleteRequest} />

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
