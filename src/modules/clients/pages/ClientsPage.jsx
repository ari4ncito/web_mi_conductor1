import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import {
  DeleteActionButton,
  EditActionButton,
  ViewActionButton,
} from '../components/ClientActions.jsx' 
import ClientVehiclesModal from '../components/ClientVehiclesModal.jsx'
import ClienteService from '../services/ClienteService.js'
import exportClientsExcel from '../utils/exportClientsExcel.js'

function DownloadIcon({ width = 17, height = 17 }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

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

function ClientAvatar({ foto, name, size = 42, onClick }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [foto]);

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
    : 'CL';

  const hasPhoto = Boolean(foto && !imgError);

  return (
    <div
      onClick={hasPhoto && onClick ? onClick : undefined}
      role={hasPhoto && onClick ? 'button' : undefined}
      tabIndex={hasPhoto && onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hasPhoto && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      title={hasPhoto && onClick ? "Click para ampliar foto de perfil" : name}
      style={{
        position: 'relative',
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        cursor: hasPhoto && onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.10)',
        border: '2px solid #ffffff',
        outline: hasPhoto ? '2px solid #fdba74' : '1px solid #cbd5e1',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={(e) => {
        if (hasPhoto && onClick) {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 14px rgba(234, 88, 12, 0.35)';
          e.currentTarget.style.outline = '2px solid #ea580c';
        }
      }}
      onMouseLeave={(e) => {
        if (hasPhoto && onClick) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.10)';
          e.currentTarget.style.outline = '2px solid #fdba74';
        }
      }}
    >
      {hasPhoto ? (
        <>
          <img
            src={foto}
            alt={name || 'Foto de perfil'}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {onClick && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.18s ease',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1d7a94, #0b3b4a)',
            color: '#ffffff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.round(size * 0.36),
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function PhotoPreviewModal({ photo, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(11, 23, 33, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              {photo.name || 'Foto de Perfil del Cliente'}
            </h3>
            {photo.doc && (
              <span style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Documento: {photo.doc}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: 15,
              fontWeight: 'bold',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Image Container */}
        <div
          style={{
            padding: '28px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #f8fafc 0%, #edf2f7 100%)',
          }}
        >
          <div
            style={{
              width: 'min(280px, 70vw)',
              height: 'min(280px, 70vw)',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.25), 0 0 0 5px #ffffff, 0 0 0 8px #ea580c',
              position: 'relative',
              backgroundColor: '#ffffff',
            }}
          >
            <img
              src={photo.url}
              alt={photo.name || 'Foto de perfil ampliada'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              Foto del perfil móvil
            </span>
          </div>
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#ea580c',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            Abrir original
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage({
  clients: clientsFromParent = [],
  onRequestDelete,
  onRequestToggleStatus,
  searchQuery: searchQueryProp,
  onSearchChange: onSearchChangeProp,
  statusFilter: statusFilterProp,
  onStatusFilterChange: onStatusFilterChangeProp,
  error: parentError,
  success,
}) {
  const { hasPermission } = useAuth()
  const [clients, setClients] = useState(clientsFromParent)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [internalSearch, setInternalSearch] = useState('')
  const [internalStatusFilter, setInternalStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClientForVehicles, setSelectedClientForVehicles] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const pageSize = 5

  const searchQuery = searchQueryProp !== undefined ? searchQueryProp : internalSearch
  const statusFilter = statusFilterProp !== undefined ? statusFilterProp : internalStatusFilter

  const handleSearchChange = (val) => {
    if (onSearchChangeProp) {
      onSearchChangeProp(val)
    }
    setInternalSearch(val)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (val) => {
    if (onStatusFilterChangeProp) {
      onStatusFilterChangeProp(val)
    }
    setInternalStatusFilter(val)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (Array.isArray(clientsFromParent)) {
      setClients(clientsFromParent)
    }
  }, [clientsFromParent])

  const normalizeSearchText = (str) =>
    String(str ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const clientesFiltrados = clients.filter((row) => {
    const clienteActivo =
      row.estado !== false &&
      (row.usuario ? row.usuario.estado !== false : true)

    // 1. Filtro por estado (dropdown)
    if (statusFilter === 'active' && !clienteActivo) return false
    if (statusFilter === 'inactive' && clienteActivo) return false

    // 2. Búsqueda multicriterio sin distinguir mayúsculas ni tildes (todos los términos separados por espacio deben coincidir)
    const searchWords = normalizeSearchText(searchQuery).split(/\s+/).filter(Boolean)
    if (searchWords.length === 0) return true

    const usuario = row?.usuario || {}
    const nombre = row?.nombre || usuario.nombre || ''
    const apellido = row?.apellido || usuario.apellido || ''
    const nombreCompleto = row?.nombreCompleto || `${nombre} ${apellido}`.trim()
    const documento = row?.documento || usuario.documento || ''
    const tipoDocumento = row?.tipoDocumento || usuario.tipoDocumento || ''
    const correo = row?.correo || usuario.correo || ''
    const telefono = row?.telefono || usuario.telefono || ''
    const direccion = row?.direccion || usuario.direccion || ''
    const servicios = String(row.serviciosCount ?? row.servicios?.length ?? row.totalServicios ?? 0)
    const vehiculos = String(row.vehiculos?.length || 0)

    const fieldsText = normalizeSearchText([
      nombre,
      apellido,
      nombreCompleto,
      documento,
      tipoDocumento,
      correo,
      telefono,
      direccion,
      servicios,
      vehiculos,
    ].join(' '))

    const estadoTokens = clienteActivo
      ? ['activo', 'activa', 'activos', 'activas']
      : ['inactivo', 'inactiva', 'inactivos', 'inactivas', 'desactivado', 'desactivada']

    return searchWords.every((word) => {
      if (['activo', 'activa', 'activos', 'activas'].includes(word)) {
        return clienteActivo || fieldsText.includes(word)
      }
      if (['inactivo', 'inactiva', 'inactivos', 'inactivas', 'desactivado', 'desactivada'].includes(word)) {
        return !clienteActivo || fieldsText.includes(word)
      }
      return fieldsText.includes(word) || estadoTokens.some((t) => t.startsWith(word))
    })
  })

  const totalPages = Math.ceil(clientesFiltrados.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedClients = clientesFiltrados.slice(startIndex, startIndex + pageSize)

  return (
    <main
      className="p-3 sm:p-5 lg:p-6"
      style={{
        flex: 1,
        minWidth: 0,
        maxWidth: '100%',
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
          {/* BUSCADOR Y FILTRO DE ESTADO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flex: '1 1 240px',
              minWidth: 0,
              flexWrap: 'wrap',
            }}
          >
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
                  placeholder="Buscar por nombre, documento, correo, teléfono..."
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

            {/* SELECTOR DE ESTADO */}
            <div className="w-full sm:w-auto" style={{ position: 'relative', minWidth: 160 }}>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                style={{
                  height: 38,
                  padding: '0 32px 0 14px',
                  borderRadius: 10,
                  background: '#f0f5ff',
                  border: '1px solid rgba(27, 46, 61, 0.08)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#111111',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#667085',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
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
            <button
              type="button"
              onClick={() => exportClientsExcel(clientesFiltrados)}
              disabled={clientesFiltrados.length === 0}
              className="w-full sm:w-auto"
              title="Descargar listado en Excel"
              style={{
                height: 36,
                borderRadius: 10,
                border: '1px solid rgba(27, 46, 61, 0.12)',
                background: '#ffffff',
                color: '#166534',
                padding: '0 14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 500,
                cursor: clientesFiltrados.length === 0 ? 'not-allowed' : 'pointer',
                opacity: clientesFiltrados.length === 0 ? 0.5 : 1,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <DownloadIcon />
              <span>Exportar Excel</span>
            </button>

            {hasPermission('crear.clientes') && (
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
            )}
          </div>
        </div>

        {/* CONTENEDOR TABLA */}
        <div className="p-3 sm:p-4 lg:p-[20px_24px] overflow-hidden">
          <div style={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nombre del cliente
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tipo Doc.
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
                    <td colSpan="8" style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
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
                    const tipoDocumento = row?.tipoDocumento || usuario.tipoDocumento || ''
                    const correo = row?.correo || usuario.correo || ''
                    const fotoCliente = row?.foto || usuario?.foto || row?.avatar || null

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
                        {/* 1. NOMBRE DEL CLIENTE CON FOTO ORGANIZADA */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ClientAvatar
                              foto={fotoCliente}
                              name={nombreCompleto}
                              size={42}
                              onClick={fotoCliente ? () => setSelectedPhoto({
                                url: fotoCliente,
                                name: nombreCompleto,
                                doc: `${tipoDocumento} ${documento}`.trim(),
                                email: correo
                              }) : undefined}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                              <span style={{ color: '#0f172a', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {nombreCompleto || 'Sin nombre'}
                              </span>
                              {fotoCliente ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedPhoto({
                                    url: fotoCliente,
                                    name: nombreCompleto,
                                    doc: `${tipoDocumento} ${documento}`.trim(),
                                    email: correo
                                  })}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    padding: 0,
                                    margin: '2px 0 0',
                                    cursor: 'pointer',
                                    color: '#ea580c',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}
                                  title="Click para ampliar foto"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                    <line x1="11" y1="8" x2="11" y2="14"/>
                                    <line x1="8" y1="11" x2="14" y2="11"/>
                                  </svg>
                                  Ampliar foto
                                </button>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: 11, fontStyle: 'italic', marginTop: 1 }}>
                                  Sin foto
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. TIPO DE DOCUMENTO */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                          {tipoDocumento ? (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#f8fafc',
                                color: '#334155',
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                border: '1px solid #e2e8f0',
                                letterSpacing: '0.03em',
                              }}
                            >
                              {tipoDocumento}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
                              -
                            </span>
                          )}
                        </td>

                        {/* 3. DOCUMENTO */}
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

                        {/* 4. CORREO */}
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

                        {/* 6. ESTADO (SOLO SWITCH ESTANDARIZADO) */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={clienteActivo}
                              disabled={!hasPermission('editar.clientes')}
                              title={
                                !hasPermission('editar.clientes')
                                  ? 'No tienes permiso para cambiar el estado'
                                  : clienteActivo
                                  ? 'Activo - Clic para desactivar'
                                  : 'Inactivo - Clic para activar'
                              }
                              onClick={() => hasPermission('editar.clientes') && onRequestToggleStatus && onRequestToggleStatus(row)}
                              style={{
                                cursor: hasPermission('editar.clientes') ? 'pointer' : 'not-allowed',
                                opacity: hasPermission('editar.clientes') ? 1 : 0.6,
                                width: '38px',
                                height: '22px',
                                borderRadius: '12px',
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '2px',
                                border: 'none',
                                outline: 'none',
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
                            </button>
                          </div>
                        </td>

                        {/* 7. ACCIONES (ORDEN ESTANDARIZADO: VER -> EDITAR -> ELIMINAR) */}
                        <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <ViewActionButton
                              to={`/clients/${row._id}`}
                            />

                            {hasPermission('editar.clientes') && (
                              <EditActionButton
                                to={`/clients/${row._id}/edit`}
                              />
                            )}

                            {hasPermission('eliminar.clientes') && (
                              <DeleteActionButton
                                onClick={() =>
                                  onRequestDelete && onRequestDelete(row)
                                }
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
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

      {selectedPhoto && (
        <PhotoPreviewModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </main>
  )
}
