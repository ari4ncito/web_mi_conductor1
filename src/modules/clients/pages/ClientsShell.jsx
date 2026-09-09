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

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await ClienteService.getAll()
      const clientesData = Array.isArray(data) ? data : (data?.data || [])
      
      const mapped = clientesData.map(c => ({
         ...c,
         ...c.usuario,
         _id: c._id, // Keep the Cliente ID as the primary ID
         usuarioId: c.usuario?._id,
         rol: c.usuario?.rol
      }))
      
      setClients(mapped)
    } catch (err) {
      console.error("Error cargando clientes:", err)
      setError("No se pudieron cargar los clientes")
    } finally {
      setLoading(false)
    }
  }

  // Cargar cada vez que cambie la ruta, para actualizar después de editar/crear
  useEffect(() => {
    loadClients()
  }, [location.pathname])

  const [togglingClient, setTogglingClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const segments = location.pathname.split('/').filter(Boolean)
  const clientId = segments[1]
  const client = clients.find((item) => item._id === clientId)

  const filteredClients = useMemo(() => {
    let result = clients

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((c) => {
        const fullName = `${c.nombre || ""} ${c.apellido || ""}`.toLowerCase()
        return (
          fullName.includes(q) ||
          c.correo?.toLowerCase().includes(q) ||
          c.documento?.toLowerCase().includes(q) ||
          c.telefono?.toLowerCase().includes(q)
        )
      })
    }

    return result
  }, [clients, searchQuery])

  const closeModal = () => {
    navigate('/clients', { replace: true })
  }

  const handleDeleteRequest = (row) => {
    setTogglingClient(row)
  }

  const handleToggleStatusConfirm = async () => {
    if (togglingClient) {
      try {
        setError("")
        setSuccess("")
        // Desactivar/Activar el cliente (esto llama a un endpoint de Cliente en lugar de Usuario, o lo hacemos manualmente actualizando)
        const payload = { estado: !togglingClient.estado }
        await ClienteService.update(togglingClient._id, payload)
        
        // También desactivamos/activamos su usuario vinculado para mantener la consistencia
        if (togglingClient.usuarioId) {
          const userPayload = { estado: payload.estado, rol: togglingClient.rol?._id || togglingClient.rol }
          await UsuarioService.update(togglingClient.usuarioId, userPayload)
        }
        
        setSuccess(togglingClient.estado ? "Cliente desactivado correctamente" : "Cliente activado correctamente")
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
      // El backend de Clientes actualiza campos como direccion, pero la info personal va al Usuario
      const userPayload = {
        nombre: nextClient.nombre,
        apellido: nextClient.apellido,
        tipoDocumento: nextClient.tipoDocumento,
        documento: nextClient.documento,
        correo: nextClient.correo,
        telefono: nextClient.telefono,
        rol: nextClient.rol?._id || nextClient.rol
      }
      if (nextClient.usuarioId) {
        await UsuarioService.update(nextClient.usuarioId, userPayload)
      }
      
      // Update client fields if any (e.g. direccion)
      const clientPayload = {
        direccion: nextClient.direccion
      }
      await ClienteService.update(nextClient._id, clientPayload)
      setSuccess("Cliente actualizado correctamente.")
      setTimeout(() => setSuccess(""), 4000)
      
      await loadClients()
      closeModal()
    } catch (err) {
      console.error("Error al guardar cliente", err)
      setError("Error al guardar los cambios del cliente")
      setTimeout(() => setError(""), 4000)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterType('')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  const pathname = location.pathname
  const isRegisterRoute = pathname.endsWith('/register')
  const isEditRoute = pathname.endsWith('/edit')
  const isDetailRoute = segments.length === 2 && segments[0] === 'clients' && !isRegisterRoute && !isEditRoute

  const activeClient = client || {
    nombre: "", apellido: "", tipoDocumento: "CC", documento: "", correo: "", telefono: ""
  }

  return (
    <div style={{ position: 'relative', maxHeight: '100vh', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ClientsPage
        clients={filteredClients}
        onRequestDelete={handleDeleteRequest}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
        <RegisterClientModal />
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
    </div>
  )
}