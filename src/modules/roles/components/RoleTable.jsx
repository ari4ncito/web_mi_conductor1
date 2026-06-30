// modules/roles/components/RoleTable.jsx
import RoleStatusBadge from './RoleStatusBadge';

/** Mapa de colores de acento por tipo de rol */
const ACCENT = {
  admin:      { bar: 'bg-amber-800',  subtitle: 'text-amber-800' },
  operations: { bar: 'bg-teal-600',   subtitle: 'text-teal-600'  },
  client:     { bar: 'bg-slate-400',  subtitle: 'text-slate-400' },
};

/** Deriva el acento a partir del status y el tipo de rol */
function getAccent(role) {
  if (role.accent) return ACCENT[role.accent] ?? ACCENT.client;
  if (role.system || role.status === 'locked') return ACCENT.admin;
  if (role.level === 'operations' || role.level === 'driver') return ACCENT.operations;
  return ACCENT.client;
}

/** Ícono de lápiz (pencil) */
function PencilIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
      />
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
      {/* ── Tabla ─────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60">
              {['ROLE NAME', 'DESCRIPTION', 'USERS ATTACHED', 'STATUS', 'ACTIONS'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold uppercase tracking-wide
                             text-slate-400 px-6 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No se encontraron roles.
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const accent = getAccent(role);
                const users  = role.usersAttached ?? 0;

                return (
                  <tr
                    key={role.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Role Name */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-3">
                        {/* Barra de acento */}
                        <span
                          className={`w-1 h-10 rounded-full shrink-0 mt-0.5 ${accent.bar}`}
                        />
                        <div>
                          <span className="block font-semibold text-slate-900">
                            {role.name}
                          </span>
                          {role.subtitle && (
                            <span className={`block text-xs font-medium mt-0.5 ${accent.subtitle}`}>
                              {role.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5 align-top text-slate-500 max-w-xs">
                      {role.description ?? '—'}
                    </td>

                    {/* Users Attached */}
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        {String(users).padStart(2, '0')} Users
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5 align-top">
                      <RoleStatusBadge status={role.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 align-top">
                      <button
                        type="button"
                        onClick={() => onEdit(role)}
                        aria-label={`Editar ${role.name}`}
                        className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500
                                   hover:bg-slate-50 hover:text-slate-700
                                   inline-flex items-center justify-center transition-colors"
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100 flex-wrap gap-3">
        <p className="text-sm text-slate-400">
          Showing {from}–{to} of {total} roles
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="min-w-[2.25rem] h-9 px-3 rounded-lg border border-slate-200
                       text-sm text-slate-600 hover:bg-slate-50 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Números */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={
                p === currentPage
                  ? 'min-w-[2.25rem] h-9 px-3 rounded-lg text-sm font-semibold text-white bg-orange-500'
                  : 'min-w-[2.25rem] h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors'
              }
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="min-w-[2.25rem] h-9 px-3 rounded-lg border border-slate-200
                       text-sm text-slate-600 hover:bg-slate-50 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}