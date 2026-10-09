const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(20, 45, 61, 0.78)',
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 4.5 20 18H4L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v4.5M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function ServiceRequestConfirmDialog({ title, description, onCancel, onConfirm, confirmLabel = 'Eliminar' }) {
  return (
    <div
      className="mc-modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-confirm-title"
        className="mc-modal mc-modal--sm"
      >
        <div className="mc-modal-header">
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255, 154, 47, 0.14)', color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <WarningIcon />
            </div>
            <div>
              <p className="mc-modal-subtitle">
                Confirmación
              </p>
              <h2 id="sr-confirm-title" className="mc-modal-title">
                {title}
              </h2>
              <p className="mc-modal-desc">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            className="mc-btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 14,
              border: 0,
              background: '#d64545',
              color: colors.surface,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(214, 69, 69, 0.22)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

