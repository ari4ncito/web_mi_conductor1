// modules/roles/components/RoleTable.jsx
import RoleStatusBadge from './RoleStatusBadge';

/** Mapa de colores de acento por tipo de rol */
const ACCENT = {
  admin:      { bar: '#92400e' },
  operations: { bar: '#0d9488' },
  client:     { bar: '#94a3b8' },
};

/** Verifica si un rol es del sistema o predeterminado (solo Administrador) */
export function isSystemRole(role) {
  if (!role) return false;
  const name = String(role.name || '').trim().toLowerCase();
  const slug = String(role.slug || '').trim().toLowerCase();
  if (name === 'administrador' || name === 'admin' || slug === 'admin' || slug === 'administrador') {
    return true;
  }
  return role.esSistema === true || role.esSistema === 'true' || role.system === true;
}

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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
 *   onToggleStatus?: (role: object) => void,
 *   onStatus?: (role: object) => void,
 *   onDelete?: (role: object) => void,
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
  onToggleStatus,
  onStatus,
  onDelete,
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

  const handleStatusToggle = onToggleStatus || onStatus;

  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', minWidth: 780, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rol
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Descripción
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Usuarios
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Estado
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                No se encontraron roles con el criterio de búsqueda.
              </td>
            </tr>
          ) : (
            roles.map((role) => {
              const accent = getAccent(role);
              const users  = role.usersAttached ?? 0;
              const isSystem = isSystemRole(role);
              const isActive = role.status === 'active';

              return (
                <tr
                  key={role.id}
                  style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  {/* Role Name */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-start' }}>
                      <span style={{ width: 4, height: 38, borderRadius: 2, background: accent.bar, flexShrink: 0 }} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.2, fontWeight: 600 }}>{role.name}</div>
                        {role.subtitle && (
                          <div style={{ color: '#64748b', fontSize: 12.5, lineHeight: 1.2, marginTop: 2 }}>{role.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5 }}>
                    {role.description ?? '—'}
                  </td>

                  {/* Users Attached */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 8,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: 12,
                        fontWeight: 700,
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      {String(users).padStart(2, '0')} usuarios
                    </span>
                  </td>

                  {/* Estado con Switch Interactivo */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        disabled={isSystem}
                        title={
                          isSystem
                            ? 'El rol predeterminado del sistema permanece siempre activo'
                            : isActive
                            ? 'Rol activo • Clic para desactivar'
                            : 'Rol inactivo • Clic para activar'
                        }
                        onClick={() => {
                          if (!isSystem && handleStatusToggle) {
                            handleStatusToggle(role);
                          }
                        }}
                        style={{
                          position: 'relative',
                          width: 40,
                          height: 22,
                          borderRadius: 12,
                          background: isSystem ? '#10b981' : isActive ? '#10b981' : '#cbd5e1',
                          border: 'none',
                          padding: 2,
                          cursor: isSystem ? 'not-allowed' : 'pointer',
                          opacity: isSystem ? 0.75 : 1,
                          transition: 'background-color 0.25s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          outline: 'none',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#ffffff',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                            transform: isActive ? 'translateX(18px)' : 'translateX(0px)',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'block',
                          }}
                        />
                      </button>
                      <RoleStatusBadge status={role.status} />
                    </div>
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <button type="button" className="mc-icon-btn" title={`Ver detalles de ${role.name}`} onClick={() => onDetails(role)}>
                        <EyeIcon />
                      </button>
                      <button type="button" className="mc-icon-btn" title={`Editar ${role.name}`} onClick={() => onEdit(role)}>
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className={`mc-icon-btn ${isSystem ? '' : 'mc-icon-btn--danger'}`}
                        title={
                          isSystem
                            ? 'Rol de Administrador del sistema (protegido)'
                            : `Eliminar rol ${role.name}`
                        }
                        onClick={() => onDelete?.(role)}
                        style={{
                          color: isSystem ? '#94a3b8' : undefined,
                          cursor: isSystem ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ── Paginación ── */}
      {showPagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ color: '#64748b', fontSize: 12.5, fontWeight: 500 }}>
            Mostrando {from}–{to} de {total} roles
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              aria-label="Página anterior"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange?.(p)}
                style={{
                  minWidth: 28,
                  height: 28,
                  padding: '0 6px',
                  borderRadius: 6,
                  border: p === currentPage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: p === currentPage ? '#0f172a' : '#ffffff',
                  color: p === currentPage ? '#ffffff' : '#475569',
                  fontSize: 12,
                  fontWeight: p === currentPage ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transform: 'rotate(180deg)',
              }}
              aria-label="Página siguiente"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
