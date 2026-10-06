import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DeleteActionButton,
  EditActionButton,
  ViewActionButton,
} from '../components/ClientActions.jsx'
import ClientVehiclesModal from '../components/ClientVehiclesModal.jsx'
import ClienteService from '../services/clienteService.js'

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
}

function SearchIcon({ size = 16, color = '#8b98a8' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  )
}

function UserAvatar({ name, size = 40 }) {
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
    : ''

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fb923c, #ea580c)',
        color: '#ffffff',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        lineHeight: 1,
        textTransform: 'uppercase',
        flexShrink: 0,
      }}
    >
      {initials || 'CL'}
    </div>
  )
}

export default function ClientsPage({
  clients: clientsFromParent = [],
  onRequestDelete,
  searchQuery: searchQueryProp,
  onSearchChange: onSearchChangeProp,
  error: parentError,
  success,
}) {
  const [clients, setClients] = useState(clientsFromParent)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [internalSearch, setInternalSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClientForVehicles, setSelectedClientForVehicles] = useState(null)
  const pageSize = 5

  const searchQuery = searchQueryProp !== undefined ? searchQueryProp : internalSearch

  const handleSearchChange = (val) => {
    if (onSearchChangeProp) {
      onSearchChangeProp(val)
    }
    setInternalSearch(val)
    setCurrentPage(1)
  }

  const cargarClientes = async () => {
    try {
      setLoading(true)
      setLoadError('')

      const response = await ClienteService.getAll()

      let clientesRecibidos = []

      if (Array.isArray(response)) {
        clientesRecibidos = response
      } else if (Array.isArray(response?.data)) {
        clientesRecibidos = response.data
      } else if (Array.isArray(response?.data?.data)) {
        clientesRecibidos = response.data.data
      }

      setClients(clientesRecibidos)
    } catch (error) {
      console.error('Error al cargar clientes:', error)

      setLoadError(
        error.response?.data?.message ||
        error.message ||
        'No se pudieron cargar los clientes.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!clientsFromParent || clientsFromParent.length === 0) {
      cargarClientes()
    }
  }, [])

  useEffect(() => {
    if (Array.isArray(clientsFromParent)) {
      setClients(clientsFromParent)
    }
  }, [clientsFromParent])

  const clientesFiltrados = clients.filter((row) => {
    const usuario = row?.usuario || {}

    const nombre = row?.nombre || usuario.nombre || ''
    const apellido = row?.apellido || usuario.apellido || ''
    const nombreCompleto = `${nombre} ${apellido}`.trim().toLowerCase()
    const correo = (row?.correo || usuario.correo || '').toLowerCase()
    const documento = (row?.documento || usuario.documento || '').toLowerCase()

    const busqueda = (searchQuery || '').trim().toLowerCase()

    return (
      !busqueda ||
      nombreCompleto.includes(busqueda) ||
      correo.includes(busqueda) ||
      documento.includes(busqueda)
    )
  })

  const totalPages = Math.ceil(clientesFiltrados.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedClients = clientesFiltrados.slice(startIndex, startIndex + pageSize)

  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        padding: '24px',
        boxSizing: 'border-box',
        background: colors.background,
      }}
    >
      {/* MENSAJES DE ESTADO */}
      {(parentError || loadError) && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 10,
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {parentError || loadError}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 10,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {success}
        </div>
      )}

      {/* TABLA Y CONTENEDOR PRINCIPAL */}
      <section
        style={{
          background: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* BUSCADOR Y BOTON REGISTRAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '18px 24px',
            borderBottom: `1px solid ${colors.border}`,
            flexWrap: 'wrap',
          }}
        >
          {/* BUSCADOR */}
          <div
            style={{
              flex: '1 1 200px',
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 10,
                background: '#f0f5ff',
                border: '1px solid rgba(27, 46, 61, 0.08)',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SearchIcon />
              </span>

              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13,
                  color: '#111111',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* BOTON REGISTRAR CLIENTE */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <Link
              to="/clients/register"
              style={{
                height: 36,
                borderRadius: 10,
                border: 'none',
                background: colors.accent,
                color: '#111111',
                padding: '0 16px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(255, 154, 47, 0.25)',
                cursor: 'pointer',
              }}
            >
              <UserPlusIcon />
              Registrar Cliente
            </Link>
          </div>
        </div>

        {/* CONTENEDOR TABLA */}
        <div style={{ padding: '24px' }}>
          <div className="mc-table-wrap">
            <table className="mc-table" style={{ minWidth: 850 }}>
              <thead>
                <tr>
                  {[
                    'Nombre del cliente',
                    'Vehículos',
                    'Total servicios',
                    'Estado',
                    'Acciones',
                  ].map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="mc-table-empty">
                      Cargando clientes...
                    </td>
                  </tr>
                ) : paginatedClients.length > 0 ? (
                  paginatedClients.map((row, index) => {
                    const usuario = row?.usuario || {}
                    const nombre = row?.nombre || usuario.nombre || ''
                    const apellido = row?.apellido || usuario.apellido || ''
                    const nombreCompleto = `${nombre} ${apellido}`.trim()
                    const correo = row?.correo || usuario.correo || ''

                    const clienteActivo =
                      row.estado !== false &&
                      (row.usuario ? row.usuario.estado !== false : true)

                    return (
                      <tr key={row._id || `cliente-${index}`}>
                        {/* CLIENTE */}
                        <td className="mc-cell-entity">
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 14,
                              justifyContent: 'flex-start',
                              width: '100%',
                            }}
                          >
                            <UserAvatar name={nombreCompleto} size={40} />

                            <div
                              style={{
                                textAlign: 'left',
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  color: '#1e293b',
                                  fontSize: 15,
                                  lineHeight: 1.2,
                                }}
                              >
                                {nombreCompleto || 'Sin nombre'}
                              </div>

                              <div
                                style={{
                                  color: '#667085',
                                  fontSize: 13,
                                  lineHeight: 1.2,
                                  marginTop: 4,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {correo || 'Sin correo'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* VEHICULOS */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedClientForVehicles(row)}
                              style={{
                                border: 'none',
                                background: '#f0fdf4',
                                color: '#16a34a',
                                padding: '4px 10px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                                <circle cx="12" cy="12" r="2.8" />
                              </svg>
                              Ver
                            </button>
                          </div>
                        </td>

                        {/* SERVICIOS */}
                        <td>
                          {row.serviciosCount ?? row.servicios?.length ?? 0}
                        </td>

                        {/* ESTADO */}
                        <td>
                          <div
                            title={clienteActivo ? 'Activo' : 'Inactivo'}
                            style={{
                              width: '54px',
                              height: '34px',
                              borderRadius: '20px',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '3px',
                              backgroundColor: clienteActivo
                                ? '#22c55e'
                                : '#ef4444',
                              boxShadow: clienteActivo
                                ? '0 3px 10px rgba(34, 197, 94, 0.25)'
                                : '0 3px 10px rgba(239, 68, 68, 0.25)',
                              margin: '0 auto',
                            }}
                          >
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                position: 'absolute',
                                top: '3px',
                                left: clienteActivo ? '23px' : '3px',
                                transition: 'left 0.25s ease',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.20)',
                              }}
                            />
                            <span
                              style={{
                                width: '100%',
                                textAlign: clienteActivo ? 'left' : 'right',
                                padding: clienteActivo
                                  ? '0 0 0 8px'
                                  : '0 8px 0 0',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 700,
                                lineHeight: '28px',
                                userSelect: 'none',
                              }}
                            >
                              {clienteActivo ? '✓' : '✕'}
                            </span>
                          </div>
                        </td>

                        {/* ACCIONES */}
                        <td>
                          <div className="mc-actions">
                            <EditActionButton
                              to={`/clients/${row._id}/edit`}
                            />

                            <ViewActionButton
                              to={`/clients/${row._id}`}
                            />

                            <DeleteActionButton
                              onClick={() =>
                                onRequestDelete && onRequestDelete(row)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="mc-table-empty">
                      {clients.length === 0
                        ? 'No hay clientes registrados.'
                        : 'No se encontraron clientes con los filtros seleccionados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACION */}
          {clientesFiltrados.length > 0 && (
            <div className="mc-pagination">
              <div className="mc-pagination-info">
                {`Mostrando ${startIndex + 1}–${Math.min(
                  startIndex + pageSize,
                  clientesFiltrados.length
                )} de ${clientesFiltrados.length} cliente${
                  clientesFiltrados.length === 1 ? '' : 's'
                }`}
              </div>

              <div className="mc-pagination-controls">
                <button
                  type="button"
                  className="mc-pagination-arrow"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 10.5 2.5 6 6 1.5" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={`mc-pagination-num${
                        page === currentPage ? ' mc-pagination-num--active' : ''
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="mc-pagination-arrow"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{ transform: 'rotate(180deg)' }}
                  aria-label="Página siguiente"
                >
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 10.5 2.5 6 6 1.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedClientForVehicles && (
        <ClientVehiclesModal
          client={selectedClientForVehicles}
          onClose={() => setSelectedClientForVehicles(null)}
        />
      )}
    </main>
  )
}
