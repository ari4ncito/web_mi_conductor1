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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mc-modal-header">
          <div>
            <h2 className="mc-modal-title">
              {role.name}
            </h2>
            <p className="mc-modal-desc">
              Detalle y permisos del rol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Slug */}
            {role.slug && (
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Identificador (slug)
                </p>
                <p style={{ margin: 0, fontSize: 14, fontFamily: 'monospace', color: '#3d4f5c' }}>{role.slug}</p>
              </div>
            )}

            {/* Estado */}
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Estado
              </p>
              <RoleStatusBadge status={role.status} />
            </div>

            {/* Descripción (full width) */}
            {role.description && (
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: '#9a96a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Descripción
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#3d4f5c', lineHeight: 1.6 }}>{role.description}</p>
              </div>
            )}
          </div>

          <hr className="mc-modal-footer" />

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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
