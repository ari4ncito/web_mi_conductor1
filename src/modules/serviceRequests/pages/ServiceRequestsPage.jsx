import { useState } from 'react'
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
        <div style={{ color: '#252525', fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400 }}>{label}</div>
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
        minWidth: 192,
        height: 44,
        borderRadius: 14,
        background: colors.accent,
        color: '#111111',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '0 18px',
        fontSize: 16,
        fontWeight: 400,
        textDecoration: 'none',
        boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)',
      }}
    >
      <PlusIcon />
      <span>Registrar Solicitud</span>
    </Link>
  )
}

function SearchPill({ value, onChange }) {
  return (
    <div
      style={{
        width: 250,
        height: 66,
        borderRadius: 18,
        background: '#dfeeff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        padding: '0 18px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ width: 18, display: 'inline-flex', flexShrink: 0 }}>
        <SearchIcon size={18} color="#9aa5b1" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar solicitud..."
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 18,
          lineHeight: 1.15,
          color: '#1f2937',
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

function DownloadIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 4v9M8.5 9.5 12 13l3.5-3.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </TableActionIcon>
  )
}

function PrintIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M7 8V4h10v4M7 17h10v3H7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M5 9h14a2 2 0 0 1 2 2v4H17v-2H7v2H3v-4a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
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
      padding: '4px 14px',
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
  onRequestDelete,
  onRequestStatusChange,
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

  const statusOptions = ['', 'Pendiente', 'En Proceso', 'Completado', 'Cancelado'];

  const activeFilters = (filterStatus || filterDateFrom || filterDateTo);

  const totalRequests = requests.length;
  const enProceso = requests.filter(r => r.status === 'En Proceso').length;
  const completados = requests.filter(r => r.status === 'Completado').length;

  return (
    <main style={{ flex: 1, minWidth: 0, padding: '44px 24px 32px 28px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 34 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 16 }}>
            <span>Admin</span>
            <BreadcrumbArrow />
            <span>Ejecución</span>
            <BreadcrumbArrow />
            <span style={{ color: '#bb6a00', fontWeight: 700 }}>Solicitudes</span>
          </div>
          <h1 style={{ margin: '8px 0 0', fontSize: 22, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>Solicitudes</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 2 }}>
          <OrangeButton />
          <HeaderAction width={40} height={44} background="#dceafb">
            <BellIcon />
          </HeaderAction>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 34 }}>
        <MetricCard label="Total solicitudes" value={totalRequests.toLocaleString()} detail="+8% este mes" accent />
        <MetricCard label="En ejecución" value={enProceso.toLocaleString()} detail="Servicios activos" />
        <MetricCard label="Completados" value={completados.toLocaleString()} detail="Servicios finalizados" />
      </section>

      <section style={{ background: colors.surface, borderRadius: 28, border: `1px solid ${colors.border}`, boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDateDropdown(false); }}
                style={{ height: 44, borderRadius: 12, border: 0, background: '#dceafb', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#1f2937', fontSize: 16, cursor: 'pointer' }}
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
                        padding: '10px 18px',
                        border: 'none',
                        background: filterStatus === opt ? '#dceafb' : 'transparent',
                        color: '#1f2937',
                        fontSize: 15,
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
                style={{ height: 44, borderRadius: 12, border: 0, background: '#dceafb', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#1f2937', fontSize: 16, cursor: 'pointer' }}
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
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
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
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => { onFilterDateChange('', ''); setShowDateDropdown(false); }}
                      style={{
                        padding: '6px 14px',
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
                style={{ height: 44, borderRadius: 12, border: 0, background: '#fee2e2', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#991b1b', fontSize: 16, cursor: 'pointer' }}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <SearchPill value={searchQuery} onChange={onSearchChange} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 6 }}>
            <button type="button" aria-label="Descargar" style={{ border: 0, background: 'transparent', padding: 0, color: '#111111' }}>
              <DownloadIcon />
            </button>
            <button type="button" aria-label="Imprimir" style={{ border: 0, background: 'transparent', padding: 0, color: '#111111' }}>
              <PrintIcon />
            </button>
          </div>
        </div>

        <div style={{ background: '#edf3fa' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['SOLICITUD', 'CLIENTE', 'CONDUCTOR', 'VEHÍCULO', 'ESTADO', 'ACCIONES'].map((label) => (
                  <th key={label} style={{ padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((row, index) => (
                <tr key={row.id} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{row.code}</div>
                        <div style={{ color: '#667085', fontSize: 14, lineHeight: 1.2, marginTop: 2 }}>{row.serviceType}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.client}</td>
                  <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.driver}</td>
                  <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.vehicle}</td>
                  <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      {row.status === 'Pendiente' ? (
                        <AssignActionButton onClick={() => onAssignDriver(row)} />
                      ) : null}
                      <ViewActionButton to={`/service-requests/${row.id}`} />
                      <DeleteActionButton onClick={() => onRequestDelete(row)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 24px', background: '#e8f1fb' }}>
          <div style={{ color: '#111111', fontSize: 16 }}>Mostrando {requests.length} solicitudes</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: colors.surface, color: '#111111', display: 'grid', placeItems: 'center', padding: 0 }}>
              <BreadcrumbArrow />
            </button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: colors.accent, color: '#111111', fontSize: 18, fontWeight: 400 }}>1</button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: 'transparent', color: '#111111', fontSize: 18 }}>2</button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: 'transparent', color: '#111111', fontSize: 18 }}>3</button>
            <button type="button" style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: colors.surface, color: '#111111', display: 'grid', placeItems: 'center', padding: 0, transform: 'rotate(180deg)' }}>
              <BreadcrumbArrow />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}