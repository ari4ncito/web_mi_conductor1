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

export default function ClientConfirmDialog({ title, description, onCancel, onConfirm, confirmLabel = 'Eliminar' }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 40,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        style={{
          width: 'min(560px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: colors.surface,
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255, 154, 47, 0.14)', color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <WarningIcon />
            </div>
            <div>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Confirmación
              </p>
              <h2 id="confirm-delete-title" style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700, color: '#11384a', lineHeight: 1.1 }}>
                {title}
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                {description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              color: colors.text,
              fontSize: 16,
              cursor: 'pointer',
            }}
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
