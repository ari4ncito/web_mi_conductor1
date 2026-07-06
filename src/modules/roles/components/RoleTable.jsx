// modules/roles/components/RoleTable.jsx
import RoleStatusBadge from './RoleStatusBadge';

const headerStyle = { padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' };
const cellStyle = { padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' };

/** Mapa de colores de acento por tipo de rol */
const ACCENT = {
  admin:      { bar: '#92400e' },
  operations: { bar: '#0d9488' },
  client:     { bar: '#94a3b8' },
};

/** Deriva el acento a partir del status y el tipo de rol */
function getAccent(role) {
  if (role.accent) return ACCENT[role.accent] ?? ACCENT.client;
  if (role.system || role.status === 'locked') return ACCENT.admin;
  if (role.level === 'operations' || role.level === 'driver') return ACCENT.operations;
  return ACCENT.client;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
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

/**
 * @param {{
 *   roles: Array<{
 *     id: string,
 *     name: string,
 *     subtitle?: string,
 *     description?: string,
 *     usersAttached?: number,
 *     status: 'active' | 'locked' | 'inactive',
 *     accent?: 'admin' | 'operations' | 'client',
 *     system?: boolean,
 *   }>,
 *   onEdit: (role: object) => void,
 *   onDetails: (role: object) => void,
 *   onStatus: (role: object) => void,
 *   currentPage?: number,
 *   totalRoles?: number,
 *   pageSize?: number,
 *   onPageChange?: (page: number) => void,
 * }} props
 */
export default function RoleTable({
  roles,
  onEdit,
  onDetails,
  onStatus,
  currentPage = 1,
  totalRoles,
  pageSize = 3,
  onPageChange,
}) {
  const total = totalRoles ?? roles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(from + pageSize - 1, total);

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ROL', 'DESCRIPCIÓN', 'USUARIOS', 'ESTADO', 'ACCIONES'].map((h) => (
                <th key={h} style={headerStyle}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#667085', fontSize: 16 }}>
                  No se encontraron roles.
                </td>
              </tr>
            ) : (
              roles.map((role, index) => {
                const accent = getAccent(role);
                const users  = role.usersAttached ?? 0;

                return (
                  <tr key={role.id} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                    {/* Role Name */}
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                        <span style={{ width: 4, height: 40, borderRadius: 2, background: accent.bar, flexShrink: 0 }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{role.name}</div>
                          {role.subtitle && (
                            <div style={{ color: '#667085', fontSize: 14, lineHeight: 1.2, marginTop: 2 }}>{role.subtitle}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td style={cellStyle}>{role.description ?? '—'}</td>

                    {/* Users Attached */}
                    <td style={cellStyle}>
                      <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', fontSize: 14, fontWeight: 600 }}>
                        {String(users).padStart(2, '0')} usuarios
                      </span>
                    </td>

                    {/* Status */}
                    <td style={cellStyle}>
                      <RoleStatusBadge status={role.status} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <BaseIconButton title={`Ver detalles de ${role.name}`} onClick={() => onDetails(role)}>
                          <EyeIcon />
                        </BaseIconButton>
                        <BaseIconButton title={`Editar ${role.name}`} onClick={() => onEdit(role)}>
                          <PencilIcon />
                        </BaseIconButton>
                        <BaseIconButton title={role.status === 'active' ? 'Desactivar' : 'Activar'} onClick={() => onStatus(role)} color="#2563eb">
                          <ShieldIcon />
                        </BaseIconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 24px', borderTop: '1px solid rgba(27, 46, 61, 0.08)', flexWrap: 'wrap', gap: 12, background: '#e8f1fb' }}>
        <div style={{ color: '#111111', fontSize: 16 }}>
          Mostrando {from}–{to} de {total} roles
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: '#ffffff', color: '#111111', display: 'grid', placeItems: 'center', padding: 0, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10.5 2.5 6 6 1.5" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              style={{
                width: 38,
                height: 48,
                borderRadius: 10,
                border: 0,
                fontSize: 18,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: p === currentPage ? '#ff9a2f' : 'transparent',
                color: '#111111',
              }}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
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