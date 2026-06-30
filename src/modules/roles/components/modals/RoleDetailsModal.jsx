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
    /* Overlay */
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm
                 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {role.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Detalle y permisos del rol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-1"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-6">
            {/* Slug */}
            {role.slug && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Identificador (slug)
                </p>
                <p className="text-sm font-mono text-slate-700">{role.slug}</p>
              </div>
            )}

            {/* Estado */}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                Estado
              </p>
              <RoleStatusBadge status={role.status} />
            </div>

            {/* Descripción (full width) */}
            {role.description && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Descripción
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{role.description}</p>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Permisos (solo lectura) */}
          <PermissionTree value={perms} onChange={() => {}} readOnly />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-8 py-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center
                       bg-slate-100 hover:bg-slate-200 text-slate-700
                       text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}