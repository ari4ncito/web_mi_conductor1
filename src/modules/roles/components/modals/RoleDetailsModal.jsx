// modules/roles/components/modals/RoleDetailsModal.jsx
import RoleStatusBadge from '../RoleStatusBadge';
import PermissionTree, { emptyModulePerms } from '../PermissionTree';

/**
 * @param {{
 *   role: object | null,
 *   open: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function RoleDetailsModal({ role, open, onClose }) {
  if (!open || !role) return null;

  // Normalizar permisos al formato módulo
  const perms =
    role.permissions && typeof role.permissions === 'object' && !Array.isArray(role.permissions)
      ? role.permissions
      : emptyModulePerms();

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{
          width: 'min(980px, calc(100% - 32px))',
          maxWidth: 980,
          maxHeight: '92vh',
          borderRadius: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">Rol</p>
            <h2 className="mc-modal-title">
              {role.name}
            </h2>
            <p className="mc-modal-desc">
              Detalle y configuración de permisos del rol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="mc-modal-close"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mc-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {/* Slug */}
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Identificador único (slug)
              </p>
              <p style={{ margin: 0, fontSize: 14, fontFamily: 'monospace', color: '#1e293b', background: '#f1f5f9', padding: '6px 10px', borderRadius: 8, display: 'inline-block' }}>
                {role.slug || '—'}
              </p>
            </div>

            {/* Usuarios asignados */}
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Usuarios asignados
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>
                {role.usersAttached ?? 0} usuarios
              </p>
            </div>

            {/* Estado */}
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Estado actual
              </p>
              <div style={{ paddingTop: 4 }}>
                <RoleStatusBadge status={role.status} />
              </div>
            </div>

            {/* Descripción (full width) */}
            {role.description && (
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Descripción
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  {role.description}
                </p>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(27, 46, 61, 0.08)', margin: 0 }} />

          {/* Permisos (solo lectura) */}
          <PermissionTree value={perms} onChange={() => {}} readOnly />
        </div>

        {/* Footer */}
        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-primary"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
