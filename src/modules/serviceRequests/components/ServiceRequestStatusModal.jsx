const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const statusConfig = {
  'Pendiente': { color: '#f97316', bg: '#fff7ed', label: 'Pendiente' },
  'En Proceso': { color: '#2563eb', bg: '#eff6ff', label: 'En Proceso' },
  'Completado': { color: '#16a34a', bg: '#f0fdf4', label: 'Completado' },
  'Cancelado': { color: '#dc2626', bg: '#fef2f2', label: 'Cancelado' },
};

export default function ServiceRequestStatusModal({ request, onClose, onChangeStatus }) {
  const statuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
  const currentStatus = request?.status || 'Pendiente';

  return (
    <div
      className="mc-modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-status-title"
        className="mc-modal mc-modal--sm"
      >
        <div className="mc-modal-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <p className="mc-modal-subtitle">
                Estado
              </p>
              <h2 id="sr-status-title" className="mc-modal-title">
                Cambiar Estado
              </h2>
              <p className="mc-modal-desc">
                Seleccione el nuevo estado para la solicitud <strong>{request?.code}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="mc-modal-close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ color: '#6b5e52', fontSize: 16 }}>Estado actual: </span>
            <span style={{
              display: 'inline-block',
              padding: '24px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              background: statusConfig[currentStatus]?.bg || '#f3f4f6',
              color: statusConfig[currentStatus]?.color || '#374151',
            }}>
              {currentStatus}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {statuses.filter(s => s !== currentStatus).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChangeStatus(status)}
                style={{
                  width: '100%',
                  padding: '24px',
                  borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  background: statusConfig[status]?.bg || '#ffffff',
                  color: statusConfig[status]?.color || '#111111',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: statusConfig[status]?.color || '#999',
                  display: 'inline-block',
                }} />
                {status}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

