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
          width: 'min(960px, calc(100% - 40px))',
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
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
              {role.name}
            </h2>
            <p style={{ margin: '6px 0 0', color: '#7a7680', fontSize: 14 }}>
              Detalle y permisos del rol.
            </p>
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
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
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

          <hr style={{ border: 'none', borderTop: '1px solid rgba(17, 17, 17, 0.08)', margin: 0 }} />

          {/* Permisos (solo lectura) */}
          <PermissionTree value={perms} onChange={() => {}} readOnly />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '16px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ height: 40, borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '0 24px', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}