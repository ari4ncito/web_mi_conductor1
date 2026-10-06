export default function DeleteUserModal({
  user,
  open,
  onClose,
  onConfirm,
}) {
  if (!open || !user) return null;

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="mc-modal mc-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mc-modal-header">
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(214, 69, 69, 0.12)', color: '#d64545', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 4.5 20 18H4L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9v4.5M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="mc-modal-subtitle">
                Eliminar usuario
              </p>
              <h2 className="mc-modal-title">
                Confirmar eliminación
              </h2>
              <p className="mc-modal-desc">
                ¿Estás seguro de eliminar al usuario <strong style={{ color: '#1b1b1b' }}>{user.name}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-secondary"
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
