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

export default function VehicleTable({ vehicles, currentPage, pageSize, onPageChange, onViewDetails, onEdit, onDelete }) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(vehicles.length / pageSize);

  const showPagination = vehicles.length > 0;

  function getStatusStyle(estado) {
    switch (estado) {
      case true: return { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' };
      case false: return { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' };
      default: return { background: '#fdf2f8', color: '#9d174d', border: '1px solid #fbcfe8' };
    }
  }

  function getStatusText(estado) {
    switch (estado) {
      case true: return 'ACTIVO';
      case false: return 'INACTIVO';
      default: return 'DESCONOCIDO';
    }
  }

  return (
    <>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Matrícula</th>
              <th>Propietario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="mc-table-empty">
                  No se encontraron vehículos.
                </td>
              </tr>
            ) : (
              paginatedVehicles.map((vehicle, index) => (
                <tr key={vehicle._id || index}>
                  <td className="mc-cell-entity">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-start', width: '100%' }}>
                      <img
                        src={vehicle.foto || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop'}
                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                        style={{ width: 48, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(27, 46, 61, 0.08)', flexShrink: 0 }}
                      />
                      <div style={{ textAlign: 'left', minWidth: 0 }}>
                        <div style={{ color: '#1e293b', fontSize: 15, lineHeight: 1.2 }}>
                          {vehicle.marca} {vehicle.modelo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mc-badge" style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      {vehicle.placa}
                    </span>
                  </td>
                  <td>{vehicle.cliente?.usuario?.nombre || vehicle.cliente?.nombre || 'Sin cliente'} {vehicle.cliente?.usuario?.apellido || vehicle.cliente?.apellido || ''}</td>
                  <td>
                    <div
                      title={vehicle.estado ? 'Activo' : 'Inactivo'}
                      style={{
                        width: '54px',
                        height: '34px',
                        borderRadius: '20px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '3px',
                        backgroundColor: vehicle.estado ? '#22c55e' : '#ef4444',
                        boxShadow: vehicle.estado ? '0 3px 10px rgba(34, 197, 94, 0.25)' : '0 3px 10px rgba(239, 68, 68, 0.25)',
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
                          left: vehicle.estado ? '23px' : '3px',
                          transition: 'left 0.25s ease',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.20)',
                        }}
                      />
                      <span
                        style={{
                          width: '100%',
                          textAlign: vehicle.estado ? 'left' : 'right',
                          padding: vehicle.estado ? '0 0 0 8px' : '0 8px 0 0',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 700,
                          lineHeight: '28px',
                          userSelect: 'none',
                        }}
                      >
                        {vehicle.estado ? '✓' : '✕'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="mc-actions">
                      <button type="button" className="mc-icon-btn" title="Ver detalle" onClick={() => onViewDetails(vehicle)}>
                        <EyeIconSm />
                      </button>
                      {onEdit && (
                        <button type="button" className="mc-icon-btn" title="Editar vehículo" onClick={() => onEdit(vehicle)}>
                          <PencilIconSm />
                        </button>
                      )}
                      {onDelete && (
                        <button type="button" className="mc-icon-btn mc-icon-btn--danger" title="Eliminar vehículo" onClick={() => onDelete(vehicle)}>
                          <TrashIconSm />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="mc-pagination">
          <div className="mc-pagination-info">
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, vehicles.length)} de {vehicles.length} vehículos
          </div>
          <div className="mc-pagination-controls">
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`mc-pagination-num${page === currentPage ? ' mc-pagination-num--active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ transform: 'rotate(180deg)' }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
