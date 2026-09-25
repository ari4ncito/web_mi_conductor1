import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ViewActionButton, DeleteActionButton, AssignActionButton } from '../components/ServiceRequestActions.jsx'

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
}

const statusConfig = {
  'Pendiente': { color: '#f97316', bg: '#fff7ed', dot: '#f97316' },
  'En Proceso': { color: '#2563eb', bg: '#eff6ff', dot: '#2563eb' },
  'Completado': { color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  'Cancelado': { color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
};

function BreadcrumbArrow() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
      <path d="M2 1.5 5.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ size = 18, color = '#b3b7bf' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#2b2b2b' }}>
      <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.1L5.5 15h13l-1.2-1.9c-.5-.5-.8-1.3-.8-2.1V8.5A4.5 4.5 0 0 0 12 4Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M8.5 12.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14.5 9.5v5M12 12h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3.8 19c.8-2.8 3.4-4.8 6.4-4.8s5.6 2 6.4 4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function MetricCard({ label, value, detail, accent = false }) {
  return (
    <article
      style={{
        minHeight: 134,
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ color: '#252525', fontSize: 17, letterSpacing: '0.12em', fontWeight: 400 }}>{label}</div>
        <div style={{ marginTop: 10, color: colors.text, fontSize: 18, fontWeight: 400 }}>{value}</div>
      </div>
      <div style={{ color: accent ? '#b96a00' : colors.text, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {accent ? <span style={{ color: '#c97300' }}>↗</span> : null}
        <span style={{ fontSize: 17 }}>{detail}</span>
      </div>
    </article>
  )
}

function HeaderAction({ children, width = 40, height = 40, background = colors.surface }) {
  return (
    <button
      type="button"
      style={{
        width,
        height,
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background,
        display: 'grid',
        placeItems: 'center',
        padding: 0,
        color: '#2b2b2b',
      }}
    >
      {children}
    </button>
  )
}

function OrangeButton() {
  return (
    <Link
      to="/service-requests/register"
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
      <PlusIcon />
      Registrar Solicitud
    </Link>
  )
}

function SearchPill({ value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 10,
        background: '#f0f5ff',
        border: '1px solid rgba(27, 46, 61, 0.08)',
        flex: 1,
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
        <SearchIcon size={16} />
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar solicitud..."
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
  )
}

function TableActionIcon({ children }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#111111' }}>
      {children}
    </span>
  )
}

function FilterIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    </TableActionIcon>
  )
}

function CalendarIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3.5v4M16 3.5v4M4 9h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </TableActionIcon>
  )
}



function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '24px',
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function ServiceRequestsPage({
  requests = [],
  loading = false,
  error = null,
  onRequestDelete,
  onAssignDriver,
  searchQuery = '',
  onSearchChange,
  filterStatus = '',
  onFilterStatusChange,
  filterDateFrom = '',
  filterDateTo = '',
  onFilterDateChange,
  onClearFilters,
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const statusOptions = ['', 'Pendiente', 'En Proceso', 'Completado', 'Cancelado'];

  useEffect(() => {
    setCurrentPage(1);
  }, [requests]);

  const activeFilters = (filterStatus || filterDateFrom || filterDateTo);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = requests.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(requests.length / pageSize);

  const showPagination = requests.length > 0;
  const completados = requests.filter(r => r.status === 'Completado').length;

  return (
    <main style={{ flex: 1, minWidth: 0, padding: '24px', boxSizing: 'border-box' }}>
      <section style={{ background: colors.surface, borderRadius: 24, border: `1px solid ${colors.border}`, boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 24px', borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 200px', minWidth: 0, display: 'flex', gap: 10 }}>
            <SearchPill value={searchQuery} onChange={onSearchChange} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDateDropdown(false); }}
                style={{ height: 36, borderRadius: 10, border: 0, background: '#dceafb', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1f2937', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
              >
                <FilterIcon />
                <span>{filterStatus || 'Filter By Status'}</span>
              </button>
              {showStatusDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 180,
                    overflow: 'hidden',
                  }}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { onFilterStatusChange(opt); setShowStatusDropdown(false); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: filterStatus === opt ? '#dceafb' : 'transparent',
                        color: '#1f2937',
                        fontSize: 14,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'block',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f5fe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = filterStatus === opt ? '#dceafb' : 'transparent'}
                    >
                      {opt || 'Todos'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowDateDropdown(!showDateDropdown); setShowStatusDropdown(false); }}
                style={{ height: 36, borderRadius: 10, border: 0, background: '#dceafb', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1f2937', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
              >
                <CalendarIcon />
                <span>Scheduled Date</span>
              </button>
              {showDateDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 240,
                    padding: 16,
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#667085', marginBottom: 4 }}>Desde</label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => onFilterDateChange(e.target.value, filterDateTo)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#667085', marginBottom: 4 }}>Hasta</label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => onFilterDateChange(filterDateFrom, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => { onFilterDateChange('', ''); setShowDateDropdown(false); }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        background: '#fff',
                        color: '#667085',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              )}
            </div>
            {activeFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                style={{ height: 36, borderRadius: 10, border: 0, background: '#fee2e2', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#991b1b', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
              >
                Limpiar filtros
              </button>
            ) : null}
            
            <OrangeButton />
          </div>
        </div>

        {/* ── Estados de carga / error ── */}
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#667085', fontSize: 16 }}>
            Cargando solicitudes...
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626', fontSize: 16, background: '#fef2f2' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ padding: '24px' }}>
            <div className="mc-table-wrap">
              <table className="mc-table" style={{ minWidth: 850 }}>
              <thead>
                <tr>
                  {['Solicitud', 'Cliente', 'Conductor', 'Vehículo', 'Estado', 'Acciones'].map((label) => (
                    <th key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="mc-table-empty">
                      No se encontraron solicitudes.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: '#1e293b', fontSize: 15, lineHeight: 1.2, fontWeight: 600 }}>{row.code}</div>
                          <div style={{ color: '#667085', fontSize: 13, lineHeight: 1.2, marginTop: 2 }}>{row.serviceType}</div>
                        </div>
                      </div>
                    </td>
                    <td>{row.client}</td>
                    <td>{row.driver}</td>
                    <td>{row.vehicle}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>
                      <div className="mc-actions">
                        {row.status === 'Pendiente' ? (
                          <AssignActionButton onClick={() => onAssignDriver(row)} />
                        ) : null}
                        <ViewActionButton to={`/service-requests/${row.id}`} />
                        <DeleteActionButton onClick={() => onRequestDelete(row)} />
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {showPagination && (
          <div className="mc-pagination">
            <div className="mc-pagination-info">
              Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, requests.length)} de {requests.length} solicitudes
            </div>
            <div className="mc-pagination-controls">
              <button
                type="button"
                className="mc-pagination-arrow"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <BreadcrumbArrow />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`mc-pagination-num${page === currentPage ? ' mc-pagination-num--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="mc-pagination-arrow"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{ transform: 'rotate(180deg)' }}
              >
                <BreadcrumbArrow />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
