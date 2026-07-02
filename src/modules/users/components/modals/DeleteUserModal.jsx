export default function DeleteUserModal({
  user,
  open,
  onClose,
  onConfirm,
}) {
  if (!open || !user) return null;

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
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(560px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(214, 69, 69, 0.12)', color: '#d64545', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 4.5 20 18H4L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9v4.5M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, color: '#d64545', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Eliminar usuario
              </p>
              <h2 style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700, color: '#11384a', lineHeight: 1.1 }}>
                Confirmar eliminación
              </h2>
              <p style={{ margin: '12px 0 0', color: '#7a7680', fontSize: 15, lineHeight: 1.6 }}>
                ¿Estás seguro de eliminar al usuario <strong style={{ color: '#1b1b1b' }}>{user.name}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ height: 46, padding: '0 22px', borderRadius: 14, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 16, cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ height: 46, padding: '0 22px', borderRadius: 14, border: 0, background: '#d64545', color: '#ffffff', fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 16px rgba(214, 69, 69, 0.22)' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}