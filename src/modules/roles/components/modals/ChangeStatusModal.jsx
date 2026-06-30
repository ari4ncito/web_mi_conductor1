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
    /* Overlay */
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm
                 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <WarningIcon />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Cambiar estado
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Esta acción afecta el acceso del rol en el sistema.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            {isActive
              ? <>¿Deseas <span className="font-semibold text-red-600">desactivar</span> el rol <span className="font-semibold text-slate-900">"{role.name}"</span>? Los usuarios con este rol perderán acceso inmediatamente.</>
              : <>¿Deseas <span className="font-semibold text-teal-600">activar</span> el rol <span className="font-semibold text-slate-900">"{role.name}"</span>? Los usuarios asignados recuperarán su acceso.</>
            }
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center
                       border border-slate-200 text-slate-600 hover:bg-slate-50
                       text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`inline-flex items-center justify-center text-white text-sm font-medium
                        px-5 py-2.5 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-teal-600 hover:bg-teal-700'
                        }`}
          >
            {isActive ? 'Desactivar rol' : 'Activar rol'}
          </button>
        </div>
      </div>
    </div>
  );
}