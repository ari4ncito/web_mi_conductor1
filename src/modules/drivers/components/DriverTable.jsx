const headerStyle = { padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' };
const cellStyle = { padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' };

function EyeIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function PencilIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
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

export default function DriverTable({ drivers, currentPage, pageSize, onPageChange, onViewDetails, onEdit }) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = drivers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(drivers.length / pageSize);

  function getLicenseStatusStyle(status) {
    switch (status) {
      case 'Valid': return { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' };
      case 'Expired': return { background: '#fdf2f8', color: '#9d174d', border: '1px solid #fbcfe8' };
      default: return { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' };
    }
  }

  function getCurrentStateStyle(state) {
    switch (state) {
      case 'in-route': return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'available': return { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' };
      case 'off-duty': return { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' };
      default: return { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' };
    }
  }

  function getCurrentStateText(state) {
    switch (state) {
      case 'in-route': return 'EN RUTA';
      case 'available': return 'DISPONIBLE';
      case 'off-duty': return 'FUERA DE SERVICIO';
      default: return state;
    }
  }

  function getLicenseStatusText(status) {
    switch (status) {
      case 'Valid': return 'VÁLIDA';
      case 'Expired': return 'VENCIDA';
      default: return status;
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
              <th style={headerStyle}>CONDUCTOR</th>
              <th style={headerStyle}>ESTADO DE LICENCIA</th>
              <th style={headerStyle}>ESTADO ACTUAL</th>
              <th style={headerStyle}>DESEMPEÑO</th>
              <th style={headerStyle}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDrivers.map((driver, index) => (
              <tr key={driver.id} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(27, 46, 61, 0.08)' }}
                    />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{driver.name}</div>
                      <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, marginTop: 2 }}>{driver.license}</div>
                    </div>
                  </div>
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600, ...getLicenseStatusStyle(driver.licenseStatus) }}>
                      {getLicenseStatusText(driver.licenseStatus)}
                      <span>{driver.licenseStatus === 'Valid' ? '✓' : '!'}</span>
                    </span>
                    <span style={{ fontSize: 14, color: '#667085' }}>Vence: {driver.licenseExpiry}</span>
                  </div>
                </td>
                <td style={cellStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600, ...getCurrentStateStyle(driver.currentState) }}>
                    {getCurrentStateText(driver.currentState)}
                  </span>
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span style={{ color: '#111111', fontSize: 16 }}>{driver.performance.toFixed(1)}</span>
                  </div>
                </td>
                <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <BaseIconButton title="Ver detalle" onClick={() => onViewDetails(driver)}>
                      <EyeIconSm />
                    </BaseIconButton>
                    <BaseIconButton title="Editar" onClick={() => onEdit(driver)}>
                      <PencilIconSm />
                    </BaseIconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 24px', background: '#e8f1fb' }}>
        <div style={pageInfoStyle}>
          Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, drivers.length)} de {drivers.length} conductores
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
                fontWeight: page === currentPage ? 400 : 400,
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
