// modules/roles/components/RoleTable.jsx
import RoleStatusBadge from './RoleStatusBadge';

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

  const showPagination = total > 5;

  return (
    <div>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              {['Rol', 'Descripción', 'Usuarios', 'Estado', 'Acciones'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} className="mc-table-empty">
                  No se encontraron roles.
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const accent = getAccent(role);
                const users  = role.usersAttached ?? 0;

                return (
                  <tr key={role.id}>
                    {/* Role Name */}
                    <td className="mc-cell-entity">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-start' }}>
                        <span style={{ width: 4, height: 40, borderRadius: 2, background: accent.bar, flexShrink: 0 }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: '#1e293b', fontSize: 15, lineHeight: 1.2, fontWeight: 600 }}>{role.name}</div>
                          {role.subtitle && (
                            <div style={{ color: '#667085', fontSize: 13, lineHeight: 1.2, marginTop: 2 }}>{role.subtitle}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td>{role.description ?? '—'}</td>

                    {/* Users Attached */}
                    <td>
                      <span className="mc-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                        {String(users).padStart(2, '0')} usuarios
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <RoleStatusBadge status={role.status} />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="mc-actions">
                        <button type="button" className="mc-icon-btn" title={`Ver detalles de ${role.name}`} onClick={() => onDetails(role)}>
                          <EyeIcon />
                        </button>
                        <button type="button" className="mc-icon-btn" title={`Editar ${role.name}`} onClick={() => onEdit(role)}>
                          <PencilIcon />
                        </button>
                        <button type="button" className="mc-icon-btn mc-icon-btn--primary" title={role.status === 'active' ? 'Desactivar' : 'Activar'} onClick={() => onStatus(role)}>
                          <ShieldIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      {showPagination && (
        <div className="mc-pagination">
          <div className="mc-pagination-info">
            Mostrando {from}–{to} de {total} roles
          </div>

          <div className="mc-pagination-controls">
            <button
              type="button"
              className="mc-pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`mc-pagination-num${p === currentPage ? ' mc-pagination-num--active' : ''}`}
                onClick={() => onPageChange?.(p)}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="mc-pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              style={{ transform: 'rotate(180deg)' }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
