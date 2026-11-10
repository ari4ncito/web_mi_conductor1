import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ViewActionButton,
  DeleteActionButton,
  AssignActionButton,
  RouteActionButton,
  IncidentActionButton,
} from '../components/ServiceRequestActions.jsx'
import { exportarSolicitudesAExcel } from '../services/exportServiceRequestsExcel.js'

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

function SearchIcon({ size = 18, color = '#b3b7bf' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
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

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      lineHeight: 1.2,
      fontFamily: 'inherit',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function ServiceRequestsPage({
  requests = [],
  loading = false,
  error = null,
  success = '',
  onRequestDelete,
  onAssignDriver,
  onViewRoute,
  onViewIncident,
  searchQuery = '',
  onSearchChange,
  filterStatus = '',
  onFilterStatusChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(requests.length / pageSize) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedRequests = requests.slice(startIndex, startIndex + pageSize);

  const showPagination = requests.length > 0;

  return (
    <main className="p-3 sm:p-5 lg:p-6" style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}>
      {success && (
        <div
          role="status"
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

      <section style={{ background: colors.surface, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <div className="p-3 sm:p-4 lg:p-[18px_24px]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 340px', flexWrap: 'wrap' }}>
            <SearchPill
              value={searchQuery}
              onChange={(val) => {
                onSearchChange(val);
                setCurrentPage(1);
              }}
            />

            <div style={{ position: 'relative', minWidth: 160 }}>
              <select
                value={filterStatus}
                onChange={(e) => {
                  onFilterStatusChange(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => exportarSolicitudesAExcel(requests)}
              disabled={requests.length === 0}
              className="w-full sm:w-auto"
              title="Descargar listado en Excel"
              style={{
                height: 36,
                borderRadius: 10,
                border: '1px solid rgba(27, 46, 61, 0.12)',
                background: '#fff',
                color: '#166534',
                padding: '0 14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 500,
                cursor: requests.length === 0 ? 'not-allowed' : 'pointer',
                opacity: requests.length === 0 ? 0.5 : 1,
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              <DownloadIcon />
              <span>Exportar Excel</span>
            </button>

            <OrangeButton />
          </div>
        </div>

        {/* ── Estados de carga / error ── */}
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#667085', fontSize: 16, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Cargando solicitudes...
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626', fontSize: 16, background: '#fef2f2' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="p-3 sm:p-4 lg:p-[20px_24px] overflow-hidden">
            <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', minWidth: 1050, borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Solicitud
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Inicio
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cliente
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Vehículo
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Conductor
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Finalización
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                      Estado
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                        No se encontraron solicitudes.
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((row) => (
                      <tr
                        key={row.id}
                        style={{
                          background: '#ffffff',
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                      >
                        {/* 1. Solicitud (Código y Tipo de servicio) */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#0f172a', fontSize: 13.5, lineHeight: 1.25, fontWeight: 600 }}>{row.code}</div>
                            <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.2, marginTop: 2 }}>{row.serviceType}</div>
                          </div>
                        </td>

                        {/* 2. Fecha y hora de inicio (Fecha pequeña de primeras, abajo hora) */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#334155', fontSize: 12.5, lineHeight: 1.25, fontWeight: 600 }}>
                              {row.fechaInicioFormatted?.fecha || '—'}
                            </div>
                            <div style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.2, marginTop: 2, fontWeight: 500 }}>
                              {row.fechaInicioFormatted?.hora || '—'}
                            </div>
                          </div>
                        </td>

                        {/* 3. Cliente (Documento de primeras, abajo nombre del cliente pequeño pero visible) */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#0f172a', fontSize: 13, lineHeight: 1.25, fontWeight: 600 }}>
                              {row.documento || 'Sin doc'}
                            </div>
                            <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.2, marginTop: 2, fontWeight: 500 }}>
                              {row.client || '—'}
                            </div>
                          </div>
                        </td>

                        {/* 4. Vehículo */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle', color: '#334155', fontSize: 13, fontWeight: 500 }}>
                          {row.vehicle || '—'}
                        </td>

                        {/* 5. Conductor (Documento de primeras, abajo nombre del conductor pequeño pero visible) */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#0f172a', fontSize: 13, lineHeight: 1.25, fontWeight: 600 }}>
                              {row.driverDocument || (row.driver ? 'Conductor' : 'Sin asignar')}
                            </div>
                            <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.2, marginTop: 2, fontWeight: 500 }}>
                              {row.driver || 'Sin asignar'}
                            </div>
                          </div>
                        </td>

                        {/* 6. Fecha y hora de finalización (Fecha pequeña de primeras, abajo hora) */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#334155', fontSize: 12.5, lineHeight: 1.25, fontWeight: 600 }}>
                              {row.fechaFinFormatted?.fecha || '—'}
                            </div>
                            <div style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.2, marginTop: 2, fontWeight: 500 }}>
                              {row.fechaFinFormatted?.hora || (row.status === 'En Proceso' ? 'En curso' : 'Pendiente')}
                            </div>
                          </div>
                        </td>

                        {/* 7. Estado */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <StatusBadge status={row.status} />
                        </td>

                        {/* 8. Acciones */}
                        <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            {row.status === 'Pendiente' ? (
                              <AssignActionButton onClick={() => onAssignDriver(row)} />
                            ) : null}

                            {/* Botón Ver ruta: solo visible cuando el estado de la solicitud esté en "En Proceso" */}
                            {row.status === 'En Proceso' ? (
                              <RouteActionButton
                                onClick={() => {
                                  if (onViewRoute) {
                                    onViewRoute(row);
                                  }
                                }}
                              />
                            ) : null}

                            {/* Botón Novedad: solo visible si el servicio tuvo una novedad asociada */}
                            {row.novedad ? (
                              <IncidentActionButton
                                onClick={() => {
                                  if (onViewIncident) {
                                    onViewIncident(row.novedad);
                                  }
                                }}
                              />
                            ) : null}

                            <ViewActionButton to={`/service-requests/${row.id}`} />
                            {!['completado', 'completada', 'cancelado', 'cancelada'].includes(
                              String(row.status || '').trim().toLowerCase()
                            ) ? (
                              <DeleteActionButton onClick={() => onRequestDelete(row)} />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {showPagination && (
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
                    Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, requests.length)} de {requests.length} solicitudes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.max(1, validPage - 1))}
                      disabled={validPage === 1}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        color: validPage === 1 ? '#cbd5e1' : '#475569',
                        cursor: validPage === 1 ? 'not-allowed' : 'pointer',
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
                          border: page === validPage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                          background: page === validPage ? '#0f172a' : '#ffffff',
                          color: page === validPage ? '#ffffff' : '#475569',
                          fontSize: 12,
                          fontWeight: page === validPage ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.min(totalPages, validPage + 1))}
                      disabled={validPage === totalPages || totalPages === 0}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        color: (validPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#475569',
                        cursor: (validPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
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
        )}
      </section>
    </main>
  )
}
