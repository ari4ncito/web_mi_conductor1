import { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import UsuarioService from '../../users/services/usuarioService.js'
import ClienteService from '../services/ClienteService.js'

import ClientConfirmDialog from '../components/ClientConfirmDialog.jsx'
import ClientFormModal from '../components/ClientFormModal.jsx'
import RegisterClientModal from '../components/RegisterClientModal.jsx'

import ClientsPage from './ClientsPage.jsx'

export default function ClientsShell() {
  const location = useLocation()
  const navigate = useNavigate()

  // CLIENTES DEL BACKEND 

  
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadClients = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const data = await ClienteService.getAll()
      let clientesData = [];
      if (Array.isArray(data)) clientesData = data;
      else if (data && Array.isArray(data.data)) clientesData = data.data;
      else if (data && data.data && Array.isArray(data.data.rows)) clientesData = data.data.rows;
      else if (data && Array.isArray(data.rows)) clientesData = data.rows;
      else if (data && Array.isArray(data.clientes)) clientesData = data.clientes;
      
      const mapped = clientesData.map(c => ({
         ...c,
         ...c.usuario,
         _id: c._id, // Keep the Cliente ID as the primary ID
         usuarioId: c.usuario?._id,
         rol: c.usuario?.rol,
         foto: c.foto || c.usuario?.foto || null,
         direccion: c.direccion || c.usuario?.direccion || ''
      }))
      
      setClients(mapped)
    } catch (err) {
      console.error("Error cargando clientes:", err)
      if (!silent) setError("No se pudieron cargar los clientes")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Cargar cada vez que cambie la ruta y refrescar en segundo plano para reflejar fotos subidas desde móvil
  useEffect(() => {
    loadClients()
    const onFocus = () => loadClients(true)
    const interval = setInterval(() => loadClients(true), 8000)
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [location.pathname])

  const [togglingClient, setTogglingClient] = useState(null)
  const [deletingClient, setDeletingClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterType, setFilterType] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const segments = location.pathname.split('/').filter(Boolean)
  const clientId = segments[1]
  const client = clients.find((item) => item._id === clientId)

  const closeModal = () => {
    navigate('/clients', { replace: true })
  }

  const handleDeleteRequest = (row) => {
    setDeletingClient(row)
  }

  const handleDeleteConfirm = async () => {
    if (deletingClient) {
      try {
        setError("")
        setSuccess("")
        await ClienteService.delete(deletingClient._id)
        
        setSuccess("Cliente eliminado correctamente. Su acceso móvil ha sido revocado.")
        setTimeout(() => setSuccess(""), 4000)
        
        await loadClients()
      } catch (err) {
        console.error("Error al eliminar cliente", err)
        const backendMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Error al eliminar el cliente"
        setError(backendMsg)
        setTimeout(() => setError(""), 5000)
        await loadClients()
      }
    }
    setDeletingClient(null)
  }

  const handleToggleStatusConfirm = async () => {
    if (togglingClient) {
      try {
        setError("")
        setSuccess("")
        const currentlyActive =
          togglingClient.estado !== false &&
          (togglingClient.usuario ? togglingClient.usuario.estado !== false : true)
        const nextEstado = !currentlyActive

        const payload = { estado: nextEstado }
        await ClienteService.update(togglingClient._id, payload)
        
        // También desactivamos/activamos su usuario vinculado para mantener la consistencia
        if (togglingClient.usuarioId) {
          const userPayload = { estado: nextEstado, rol: togglingClient.rol?._id || togglingClient.rol }
          await UsuarioService.update(togglingClient.usuarioId, userPayload).catch(() => {})
        }
        
        setSuccess(
          !nextEstado
            ? "Cliente desactivado correctamente. Su acceso a la app móvil ha sido revocado."
            : "Cliente activado correctamente."
        )
        setTimeout(() => setSuccess(""), 4000)
        
        await loadClients()
      } catch (err) {
        console.error("Error al cambiar estado del cliente", err)
        setError("Error al cambiar el estado del cliente")
        setTimeout(() => setError(""), 4000)
      }
    }
    setTogglingClient(null)
  }

  const handleSave = async (nextClient) => {
    try {
      setError("")
      setSuccess("")
      // En edición de cliente no se envía ni modifica tipoDocumento ni documento
      const userPayload = {
        nombre: nextClient.nombre,
        apellido: nextClient.apellido,
        correo: nextClient.correo,
        telefono: nextClient.telefono,
        foto: nextClient.foto || null,
        rol: nextClient.rol?._id || nextClient.rol,
        fechaNacimiento: nextClient.fechaNacimiento,
        edad: nextClient.edad,
      }
      if (nextClient.usuarioId) {
        await UsuarioService.update(nextClient.usuarioId, userPayload)
      }
      
      // Update client fields if any (e.g. direccion, foto, fechaNacimiento, edad)
      const clientPayload = {
        nombre: nextClient.nombre,
        apellido: nextClient.apellido,
        correo: nextClient.correo,
        telefono: nextClient.telefono,
        direccion: nextClient.direccion,
        foto: nextClient.foto || null,
        fechaNacimiento: nextClient.fechaNacimiento,
        edad: nextClient.edad,
      }
      await ClienteService.update(nextClient._id, clientPayload)
      setSuccess("Cliente actualizado correctamente.")
      setTimeout(() => setSuccess(""), 4000)
      
      await loadClients()
      closeModal()
    } catch (err) {
      console.error("Error al guardar cliente", err)
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Error al guardar los cambios del cliente";
      setError(msg)
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setFilterType('')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  const pathname = location.pathname
  const isRegisterRoute = pathname.endsWith('/register')
  const isEditRoute = pathname.endsWith('/edit')
  const isDetailRoute = segments.length === 2 && segments[0] === 'clients' && !isRegisterRoute && !isEditRoute

  const activeClient = client || {
    nombre: "", apellido: "", tipoDocumento: "CC", documento: "", correo: "", telefono: "", direccion: "", fechaNacimiento: ""
  }

  return (
    <div style={{ position: 'relative', maxHeight: '100vh', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ClientsPage
        clients={clients}
        onRequestDelete={handleDeleteRequest}
        onRequestToggleStatus={(row) => setTogglingClient(row)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        onFilterDateChange={(from, to) => {
          setFilterDateFrom(from)
          setFilterDateTo(to)
        }}
        onClearFilters={handleClearFilters}
        error={error}
        success={success}
      />

      {isRegisterRoute ? (
        <RegisterClientModal 
          onSuccess={(msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 4000); }}
          onError={(msg) => { setError(msg); setTimeout(() => setError(""), 4000); }}
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

      {togglingClient ? (
        <ClientConfirmDialog
          title={togglingClient.estado ? "Desactivar cliente" : "Activar cliente"}
          description={togglingClient.estado 
            ? `¿Desea desactivar a ${togglingClient.nombre} ${togglingClient.apellido}? No podrá acceder al sistema.` 
            : `¿Desea activar a ${togglingClient.nombre} ${togglingClient.apellido}? Volverá a tener acceso al sistema.`}
          onCancel={() => setTogglingClient(null)}
          onConfirm={handleToggleStatusConfirm}
          confirmLabel={togglingClient.estado ? "Desactivar" : "Activar"}
        />
      ) : null}

      {deletingClient ? (
        <ClientConfirmDialog
          title="Eliminar cliente"
          description={`¿Está seguro de que desea eliminar a ${deletingClient.nombre} ${deletingClient.apellido}? Esta acción no se puede deshacer.`}
          onCancel={() => setDeletingClient(null)}
          onConfirm={handleDeleteConfirm}
          confirmLabel="Eliminar"
        />
      ) : null}
    </div>
  )
}
