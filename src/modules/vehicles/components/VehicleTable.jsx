const headerStyle = { padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' };
const cellStyle = { padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' };

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

function BaseIconButton({ children, title, onClick, color = '#111111' }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      width: 36,
      height: 36,
      borderRadius: 12,
      border: '1px solid rgba(17, 17, 17, 0.08)',
      background: '#ffffff',
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(18, 39, 52, 0.04)',
    }}>
      {children}
    </button>
  )
}

export default function VehicleTable({ vehicles, currentPage, pageSize, onPageChange, onViewDetails, onEdit, onDelete }) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(vehicles.length / pageSize);

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

  const pageInfoStyle = { color: '#111111', fontSize: 16 };
  const paginationBtnStyle = { width: 38, height: 48, borderRadius: 10, border: 0, fontSize: 18, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerStyle}>FOTO</th>
              <th style={headerStyle}>NOMBRE DEL VEHÍCULO</th>
              <th style={headerStyle}>MATRÍCULA</th>
              <th style={headerStyle}>PROPIETARIO</th>
              <th style={headerStyle}>ESTADO</th>
              <th style={headerStyle}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVehicles.map((vehicle, index) => (
              <tr key={vehicle._id || index} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                <td style={cellStyle}>
                  <img
                    src={vehicle.foto || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop'}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    style={{ width: 48, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(27, 46, 61, 0.08)' }}
                  />
                </td>
                <td style={cellStyle}>{vehicle.marca} {vehicle.modelo}</td>
                <td style={cellStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 20, background: '#dbeafe', color: '#1d4ed8', fontSize: 14, fontWeight: 600, border: '1px solid #bfdbfe' }}>
                    {vehicle.placa}
                  </span>
                </td>
                <td style={cellStyle}>{vehicle.cliente?.usuario?.nombre} {vehicle.cliente?.usuario?.apellido}</td>
                <td style={cellStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600, ...getStatusStyle(vehicle.estado) }}>
                    {getStatusText(vehicle.estado)}
                  </span>
                </td>
                <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <BaseIconButton title="Ver detalle" onClick={() => onViewDetails(vehicle)}>
                      <EyeIconSm />
                    </BaseIconButton>
                    {onEdit && (
                      <BaseIconButton title="Editar vehículo" onClick={() => onEdit(vehicle)}>
                        <PencilIconSm />
                      </BaseIconButton>
                    )}
                    {onDelete && (
                      <BaseIconButton title="Eliminar vehículo" onClick={() => onDelete(vehicle)} color="#c64a4a">
                        <TrashIconSm />
                      </BaseIconButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 24px', background: '#e8f1fb' }}>
        <div style={pageInfoStyle}>
          Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, vehicles.length)} de {vehicles.length} vehículos
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: '#ffffff', color: '#111111', display: 'grid', placeItems: 'center', padding: 0, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10.5 2.5 6 6 1.5" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                ...paginationBtnStyle,
                background: page === currentPage ? '#ff9a2f' : 'transparent',
                color: '#111111',
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: '#ffffff', color: '#111111', display: 'grid', placeItems: 'center', padding: 0, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transform: 'rotate(180deg)' }}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10.5 2.5 6 6 1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}