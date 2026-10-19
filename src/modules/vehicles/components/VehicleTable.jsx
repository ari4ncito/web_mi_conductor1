import { useState } from 'react';

function EyeIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PencilIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TrashIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M9 7V5.5h6V7M8 7l.8 12h6.4L16 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CameraIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ExpirationCell({ dateValue, feminine = false }) {
  if (!dateValue) {
    return (
      <span style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>
        No registrada
      </span>
    );
  }

  const cleanStr = String(dateValue).split('T')[0];
  const parts = cleanStr.split('-');
  let targetDate;
  if (parts.length === 3) {
    targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    targetDate = new Date(dateValue);
  }

  if (isNaN(targetDate.getTime())) {
    return <span style={{ color: '#94a3b8', fontSize: 13 }}>-</span>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const year = targetDate.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;

  const isExpired = targetDate.getTime() < today.getTime();

  if (isExpired) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span
          style={{
            color: '#dc2626',
            fontWeight: 700,
            fontSize: 12.5,
            lineHeight: 1.2,
          }}
        >
          {feminine ? 'Vencida' : 'Vencido'}
        </span>
        <span style={{ color: '#ef4444', fontSize: 11.5, lineHeight: 1.2 }}>
          {dateFormatted}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <span
        style={{
          color: '#16a34a',
          fontWeight: 600,
          fontSize: 13,
          lineHeight: 1.2,
        }}
      >
        {dateFormatted}
      </span>
    </div>
  );
}

export default function VehicleTable({
  vehicles,
  currentPage,
  pageSize,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenPhotos,
}) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(vehicles.length / pageSize) || 1;

  const showPagination = vehicles.length > 0;

  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', minWidth: 1020, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vehículo
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Matrícula
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Propietario
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Venc. SOAT
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Venc. Tecnomecánica
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
          {paginatedVehicles.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                No se encontraron vehículos.
              </td>
            </tr>
          ) : (
            paginatedVehicles.map((vehicle, index) => {
              const photoUrl =
                vehicle.foto ||
                vehicle.foto1 ||
                (Array.isArray(vehicle.fotos) && vehicle.fotos[0]) ||
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop';

              const photoCount =
                (Array.isArray(vehicle.fotos) ? vehicle.fotos.filter(Boolean).length : 0) ||
                ([vehicle.foto1, vehicle.foto2, vehicle.foto3, vehicle.foto].filter(Boolean).length) ||
                1;

              const ownerName = `${vehicle.cliente?.usuario?.nombre || vehicle.cliente?.nombre || 'Sin cliente'} ${vehicle.cliente?.usuario?.apellido || vehicle.cliente?.apellido || ''}`.trim();

              return (
                <tr
                  key={vehicle._id || index}
                  style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  {/* 1. VEHÍCULO & THUMBNAIL */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                        onClick={() => onOpenPhotos && onOpenPhotos(vehicle)}
                        title="Ver fotos del vehículo"
                      >
                        <img
                          src={photoUrl}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          style={{
                            width: 52,
                            height: 42,
                            objectFit: 'cover',
                            borderRadius: 10,
                            border: '1px solid #e2e8f0',
                            display: 'block',
                            transition: 'transform 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: -3,
                            right: -3,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#ff9a2f',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <CameraIconSm />
                        </div>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: '#0f172a', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                          {vehicle.marca} {vehicle.modelo}
                        </div>
                        <div style={{ color: '#64748b', fontSize: 12.5, marginTop: 3 }}>
                          {vehicle.tipoVehiculo || 'Vehículo'} {vehicle.color ? `• ${vehicle.color}` : ''} {vehicle.anio ? `• ${vehicle.anio}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. MATRÍCULA / PLACA */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 8,
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        fontSize: 12.5,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      {vehicle.placa || 'SIN PLACA'}
                    </span>
                  </td>

                  {/* 3. PROPIETARIO */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5, fontWeight: 500 }}>
                    {ownerName || 'Sin propietario'}
                  </td>

                  {/* 4. FECHA VENCIMIENTO SOAT */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <ExpirationCell
                      dateValue={vehicle.fechaVencimientoSoat || vehicle.soatVencimiento}
                      feminine={false}
                    />
                  </td>

                  {/* 5. FECHA VENCIMIENTO TECNOMECÁNICA */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <ExpirationCell
                      dateValue={vehicle.fechaVencimientoTecnomecanica || vehicle.tecnomecanicaVencimiento}
                      feminine={true}
                    />
                  </td>

                  {/* 6. ESTADO (SWITCH COMPACTO) */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div
                      title={vehicle.estado ? 'Activo - Clic para desactivar' : 'Inactivo - Clic para activar'}
                      onClick={() => onToggleStatus && onToggleStatus(vehicle)}
                      style={{
                        cursor: 'pointer',
                        width: '38px',
                        height: '22px',
                        borderRadius: '12px',
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px',
                        backgroundColor: vehicle.estado ? '#22c55e' : '#cbd5e1',
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
                          left: vehicle.estado ? '18px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                        }}
                      />
                    </div>
                  </td>

                  {/* 5. ACCIONES */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="mc-icon-btn"
                        title="Ver detalle"
                        onClick={() => onViewDetails(vehicle)}
                      >
                        <EyeIconSm />
                      </button>

                      {onEdit && (
                        <button
                          type="button"
                          className="mc-icon-btn"
                          title="Editar vehículo"
                          onClick={() => onEdit(vehicle)}
                        >
                          <PencilIconSm />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          className="mc-icon-btn mc-icon-btn--danger"
                          title="Eliminar vehículo"
                          onClick={() => onDelete(vehicle)}
                        >
                          <TrashIconSm />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* PAGINACIÓN COMPACTA Y SENCILLA */}
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
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, vehicles.length)} de {vehicles.length} vehículo{vehicles.length === 1 ? '' : 's'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
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
  );
}
