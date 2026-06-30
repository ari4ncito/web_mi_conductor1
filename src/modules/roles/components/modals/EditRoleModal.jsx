// modules/roles/components/modals/EditRoleModal.jsx
import { useEffect, useState } from 'react';
import RoleForm from '../RoleForm';
import PermissionTree, { emptyModulePerms } from '../PermissionTree';
import { updateRole } from '../../services/roleStorage';

/**
 * @param {{
 *   role: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   refresh: () => void,
 * }} props
 */
export default function EditRoleModal({ role, open, onClose, refresh }) {
  const [name,        setName]        = useState('');
  const [slug,        setSlug]        = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(emptyModulePerms());

  /* Poblar campos cuando cambia el rol seleccionado */
  useEffect(() => {
    if (role) {
      setName(role.name ?? '');
      setSlug(role.slug ?? '');
      setDescription(role.description ?? '');
      // Si el rol tiene permisos en formato módulo los usamos; si no, vacío
      setPermissions(
        role.permissions && typeof role.permissions === 'object' && !Array.isArray(role.permissions)
          ? role.permissions
          : emptyModulePerms()
      );
    }
  }, [role]);

  if (!open || !role) return null;

  const handleDiscard = () => {
    onClose();
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateRole(role.id, { name, slug, description, permissions });
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
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
            <RoleForm
              name={name}
              slug={slug}
              description={description}
              onNameChange={setName}
              onSlugChange={setSlug}
              onDescriptionChange={setDescription}
            />

            <hr className="border-slate-100" />

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