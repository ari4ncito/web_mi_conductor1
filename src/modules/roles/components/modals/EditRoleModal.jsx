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
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 24px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ff9a2f' }}>
              Rol
            </p>
            <h2 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
              Configuración de Rol
            </h2>
            <p style={{ margin: '6px 0 0', color: '#7a7680', fontSize: 14 }}>
              Define los permisos y alcances para los miembros de tu equipo.
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
        <form onSubmit={handleSave}>
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '16px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
            <button
              type="button"
              onClick={handleDiscard}
              style={{ height: 40, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '0 20px' }}
            >
              Descartar Cambios
            </button>
            <button
              type="submit"
              style={{ height: 40, borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '0 20px', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
            >
              Guardar Configuración de Rol
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}