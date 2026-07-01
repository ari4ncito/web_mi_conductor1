// modules/roles/components/modals/ChangeStatusModal.jsx
import { toggleRoleStatus } from '../../services/roleStorage';

/** Ícono de advertencia */
function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

/**
 * @param {{
 *   role: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   refresh: () => void,
 * }} props
 */
export default function ChangeStatusModal({ role, open, onClose, refresh }) {
  if (!open || !role) return null;

  const isActive = role.status === 'active';

  const handleConfirm = () => {
    toggleRoleStatus(role.id);
    refresh();
    onClose();
  };

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
        style={{
          width: 'min(560px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflow: 'hidden',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 24px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fde6d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#c26b00" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
                Cambiar estado
              </h3>
              <p style={{ margin: '4px 0 0', color: '#7a7680', fontSize: 14 }}>
                Esta acción afecta el acceso del rol en el sistema.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', flexShrink: 0, padding: 4 }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 32px' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#4a5568', lineHeight: 1.6 }}>
            {isActive
              ? <>¿Deseas <span style={{ fontWeight: 600, color: '#dc2626' }}>desactivar</span> el rol <span style={{ fontWeight: 600, color: '#11384a' }}>"{role.name}"</span>? Los usuarios con este rol perderán acceso inmediatamente.</>
              : <>¿Deseas <span style={{ fontWeight: 600, color: '#0d9488' }}>activar</span> el rol <span style={{ fontWeight: 600, color: '#11384a' }}>"{role.name}"</span>? Los usuarios asignados recuperarán su acceso.</>
            }
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '16px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ height: 40, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '0 20px' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              height: 40,
              borderRadius: 12,
              border: 0,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0 20px',
              background: isActive ? '#dc2626' : '#ff9a2f',
              boxShadow: isActive ? 'none' : '0 8px 16px rgba(255, 154, 47, 0.28)',
            }}
          >
            {isActive ? 'Desactivar rol' : 'Activar rol'}
          </button>
        </div>
      </div>
    </div>
  );
}