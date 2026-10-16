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
  onRequestToggleStatus,
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
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        {/* BUSCADOR Y BOTON REGISTRAR */}
        <div
          className="p-3 sm:p-4 lg:p-[18px_24px]"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
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
            className="w-full sm:w-auto"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <Link
              to="/clients/register"
              className="w-full sm:w-auto"
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
        <div className="p-3 sm:p-4 lg:p-[20px_24px] overflow-hidden">
          <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nombre del cliente
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Documento
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Correo
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Vehículos
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Total servicios
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Estado
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                      Cargando clientes...
                    </td>
                  </tr>
                ) : paginatedClients.length > 0 ? (
                  paginatedClients.map((row, index) => {
                    const usuario = row?.usuario || {}
                    const nombre = row?.nombre || usuario.nombre || ''
                    const apellido = row?.apellido || usuario.apellido || ''
                    const nombreCompleto = `${nombre} ${apellido}`.trim()
                    const documento = row?.documento || usuario.documento || ''
                    const correo = row?.correo || usuario.correo || ''

                    const clienteActivo =
                      row.estado !== false &&
                      (row.usuario ? row.usuario.estado !== false : true)

                    return (
                      <tr
                        key={row._id || `cliente-${index}`}
                        style={{
                          background: '#ffffff',
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff' }}
                      >
                        {/* 1. NOMBRE DEL CLIENTE */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                          <span style={{ color: '#0f172a', fontSize: 14, fontWeight: 600 }}>
                            {nombreCompleto || 'Sin nombre'}
                          </span>
                        </td>

                        {/* 2. DOCUMENTO */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                          {documento ? (
                            <span style={{ color: '#334155', fontSize: 13.5, fontWeight: 500 }}>
                              {documento}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
                              Sin documento
                            </span>
                          )}
                        </td>

                        {/* 3. CORREO */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5 }}>
                          {correo ? (
                            <span style={{ color: '#334155', fontWeight: 500 }}>{correo}</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>Sin correo</span>
                          )}
                        </td>

                        {/* 4. VEHICULOS */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedClientForVehicles(row)}
                            style={{
                              border: '1px solid #bbf7d0',
                              background: '#f0fdf4',
                              color: '#15803d',
                              padding: '5px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#f0fdf4' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
                              <circle cx="7" cy="17" r="2" />
                              <path d="M9 17h6" />
                              <circle cx="17" cy="17" r="2" />
                            </svg>
                            Ver vehículos
                          </button>
                        </td>

                        {/* 5. TOTAL SERVICIOS */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 12,
                              background: '#f1f5f9',
                              color: '#334155',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {row.serviciosCount ?? row.servicios?.length ?? row.totalServicios ?? 0}
                          </span>
                        </td>

                        {/* 6. ESTADO (SWITCH COMPACTO) */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div
                            title={clienteActivo ? 'Activo - Clic para desactivar' : 'Inactivo - Clic para activar'}
                            onClick={() => onRequestToggleStatus && onRequestToggleStatus(row)}
                            style={{
                              cursor: 'pointer',
                              width: '38px',
                              height: '22px',
                              borderRadius: '12px',
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px',
                              backgroundColor: clienteActivo ? '#22c55e' : '#cbd5e1',
                              transition: 'background-color 0.2s ease',
                              margin: '0 auto',
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                position: 'absolute',
                                top: '2px',
                                left: clienteActivo ? '18px' : '2px',
                                transition: 'left 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                              }}
                            />
                          </div>
                        </td>

                        {/* 7. ACCIONES */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
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
                    <td colSpan="7" style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                      {clients.length === 0
                        ? 'No hay clientes registrados.'
                        : 'No se encontraron clientes con los filtros seleccionados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINACIÓN COMPACTA Y SENCILLA */}
            {clientesFiltrados.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 18px',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div style={{ color: '#64748b', fontSize: 12.5, fontWeight: 500 }}>
                  Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, clientesFiltrados.length)} de {clientesFiltrados.length} cliente{clientesFiltrados.length === 1 ? '' : 's'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: currentPage === 1 ? '#cbd5e1' : '#475569',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                    aria-label="Página anterior"
                  >
                    <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10.5 2.5 6 6 1.5" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      style={{
                        minWidth: 28,
                        height: 28,
                        padding: '0 6px',
                        borderRadius: 6,
                        border: page === currentPage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                        background: page === currentPage ? '#0f172a' : '#ffffff',
                        color: page === currentPage ? '#ffffff' : '#475569',
                        fontSize: 12,
                        fontWeight: page === currentPage ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: (currentPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#475569',
                      cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transform: 'rotate(180deg)',
                    }}
                    aria-label="Página siguiente"
                  >
                    <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10.5 2.5 6 6 1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
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
