// modules/roles/components/modals/CreateRoleModal.jsx
import { useState } from 'react';
import RoleForm from '../RoleForm';
import PermissionTree, { emptyModulePerms } from '../PermissionTree';
import { createRole } from '../../services/roleStorage';

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   refresh: () => void,
 * }} props
 */
export default function CreateRoleModal({ open, onClose, refresh }) {
  const [name,        setName]        = useState('');
  const [slug,        setSlug]        = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(emptyModulePerms());

  if (!open) return null;

  const reset = () => {
    setName('');
    setSlug('');
    setDescription('');
    setPermissions(emptyModulePerms());
  };

  const handleDiscard = () => {
    reset();
    onClose();
  };

  const handleSave = (e) => {
    e.preventDefault();
    createRole({ name, slug, description, permissions });
    refresh();
    reset();
    onClose();
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm
                 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl
                   max-h-[90vh] overflow-y-auto border border-slate-100"
        style={{ maxWidth: 'min(960px, calc(100% - 40px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-7 pb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Rol
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
              Configuración de Rol
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Define los permisos y alcances para los miembros de tu equipo.
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
        <form onSubmit={handleSave}>
          <div className="px-8 py-6 space-y-6">
            {/* Campos */}
            <RoleForm
              name={name}
              slug={slug}
              description={description}
              onNameChange={setName}
              onSlugChange={setSlug}
              onDescriptionChange={setDescription}
            />

            {/* Separador */}
            <hr className="border-slate-100" />

            {/* Permisos de Módulo */}
            <PermissionTree value={permissions} onChange={setPermissions} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center justify-center gap-2
                         border border-teal-600 text-teal-700 hover:bg-teal-50
                         text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Descartar Cambios
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2
                         bg-orange-500 hover:bg-orange-600 text-white
                         text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Guardar Configuración de Rol
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}