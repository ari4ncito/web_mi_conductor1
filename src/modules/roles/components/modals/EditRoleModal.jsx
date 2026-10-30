// modules/roles/components/modals/EditRoleModal.jsx

import { useEffect, useState } from 'react';
import RoleForm from '../RoleForm';
import PermissionTree, { emptyModulePerms } from '../PermissionTree';
import roleService from '../../services/roleService';

/* =========================================================
   CONVERTIR PERMISOS BACKEND → FRONTEND
========================================================= */
const adaptarPermisos = (permisos = []) => {
  const resultado = emptyModulePerms();

  if (!Array.isArray(permisos)) {
    return resultado;
  }

  permisos.forEach((permiso) => {
    const codigo = permiso.codigo?.toLowerCase();
    if (!codigo) return;

    const partes = codigo.split('.');
    if (partes.length !== 2) return;

    const [accion, modulo] = partes;
    let frontendModulo = null;
    let frontendRecurso = null;

    switch (modulo) {
      case 'roles':
        frontendModulo = 'configuration';
        frontendRecurso = 'roles';
        break;
      case 'permisos':
        frontendModulo = 'configuration';
        frontendRecurso = 'permisos';
        break;
      case 'usuarios':
        frontendModulo = 'users';
        frontendRecurso = 'usuarios';
        break;
      case 'clientes':
        frontendModulo = 'users';
        frontendRecurso = 'clientes';
        break;
      case 'vehiculos':
      case 'vehículos':
        frontendModulo = 'vehicles';
        frontendRecurso = 'vehiculos';
        break;
      case 'conductores':
        frontendModulo = 'execution';
        frontendRecurso = 'conductores';
        break;
      case 'novedades':
        frontendModulo = 'execution';
        frontendRecurso = 'novedades';
        break;
      default:
        return;
    }

    let frontendAccion = null;
    switch (accion) {
      case 'ver':
        frontendAccion = 'view';
        break;
      case 'editar':
        frontendAccion = 'edit';
        break;
      case 'crear':
        frontendAccion = 'add';
        break;
      case 'eliminar':
        frontendAccion = 'delete';
        break;
      default:
        return;
    }

    resultado[frontendModulo][frontendRecurso][frontendAccion] = true;
  });

  return resultado;
};

/* =========================================================
   CONVERTIR FRONTEND → IDS BACKEND
========================================================= */
const obtenerIdsPermisos = (permissions, permisos) => {
  const ids = [];
  if (!Array.isArray(permisos)) return ids;

  permisos.forEach((permiso) => {
    const codigo = permiso.codigo?.toLowerCase();
    if (!codigo) return;

    const partes = codigo.split('.');
    if (partes.length !== 2) return;

    const [accion, modulo] = partes;
    let frontendModulo = null;
    let frontendRecurso = null;

    switch (modulo) {
      case 'roles':
        frontendModulo = 'configuration';
        frontendRecurso = 'roles';
        break;
      case 'permisos':
        frontendModulo = 'configuration';
        frontendRecurso = 'permisos';
        break;
      case 'usuarios':
        frontendModulo = 'users';
        frontendRecurso = 'usuarios';
        break;
      case 'clientes':
        frontendModulo = 'users';
        frontendRecurso = 'clientes';
        break;
      case 'vehiculos':
      case 'vehículos':
        frontendModulo = 'vehicles';
        frontendRecurso = 'vehiculos';
        break;
      case 'conductores':
        frontendModulo = 'execution';
        frontendRecurso = 'conductores';
        break;
      case 'novedades':
        frontendModulo = 'execution';
        frontendRecurso = 'novedades';
        break;
      default:
        return;
    }

    let frontendAccion = null;
    switch (accion) {
      case 'ver':
        frontendAccion = 'view';
        break;
      case 'editar':
        frontendAccion = 'edit';
        break;
      case 'crear':
        frontendAccion = 'add';
        break;
      case 'eliminar':
        frontendAccion = 'delete';
        break;
      default:
        return;
    }

    const marcado = permissions?.[frontendModulo]?.[frontendRecurso]?.[frontendAccion];
    if (marcado) {
      if (permiso._id) {
        ids.push(permiso._id);
      } else if (permiso.id) {
        ids.push(permiso.id);
      }
    }
  });

  return ids;
};

export default function EditRoleModal({
  role,
  open,
  onClose,
  refresh,
  permisos = [],
  onShowAlert,
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(emptyModulePerms());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* =========================================================
     CARGAR INFORMACIÓN DEL ROL
  ========================================================= */
  useEffect(() => {
    if (!role) return;

    setName(role.name ?? '');
    setSlug(role.slug ?? '');
    setDescription(role.description ?? '');

    const permisosBackend = role.backendPermissions || [];
    const permisosAdaptados = adaptarPermisos(permisosBackend);

    setPermissions(permisosAdaptados);
    setError('');
  }, [role]);

  const handleDiscard = () => {
    if (saving) return;
    onClose();
  };

  /* =========================================================
     GUARDAR
  ========================================================= */
  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    // Validación
    const trimmedName = name.trim();
    if (!trimmedName) {
      const msg = 'El nombre del rol es obligatorio.';
      setError(msg);
      onShowAlert?.({
        type: 'warning',
        title: 'Datos no válidos',
        message: 'El nombre del rol no puede quedar vacío.',
      });
      return;
    }

    const permisosIds = obtenerIdsPermisos(permissions, permisos);
    if (permisosIds.length === 0) {
      const msg = 'Debes asignar al menos un permiso al rol.';
      setError(msg);
      onShowAlert?.({
        type: 'warning',
        title: 'Datos no válidos',
        message: 'Debes seleccionar al menos un permiso para este rol.',
      });
      return;
    }

    try {
      setSaving(true);
      setError('');

      const datos = {
        nombre: trimmedName,
        descripcion: description.trim(),
        permisos: permisosIds,
      };

      console.log('Actualizando rol:', datos);
      await roleService.update(role.id, datos);

      onShowAlert?.({
        type: 'success',
        title: '¡Rol actualizado con éxito!',
        message: `Los cambios para el rol "${trimmedName}" han sido guardados correctamente.`,
      });

      await refresh();
      onClose();
    } catch (err) {
      console.error('Error actualizando rol:', err);
      const errorMsg =
        err?.response?.data?.message ||
        'No se pudo actualizar el rol. Intenta nuevamente.';
      setError(errorMsg);
      onShowAlert?.({
        type: 'error',
        title: 'Error al guardar',
        message: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open || !role) return null;

  return (
    <div className="mc-modal-overlay" onClick={handleDiscard}>
      <div
        className="mc-modal mc-modal--xl"
        style={{
          width: 'min(1080px, calc(100% - 32px))',
          maxWidth: 1080,
          maxHeight: '92vh',
          borderRadius: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">Rol</p>
            <h2 className="mc-modal-title">Configuración de Rol</h2>
            <p className="mc-modal-desc">
              Define los permisos y alcances para los miembros de tu equipo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDiscard}
            aria-label="Cerrar modal"
            disabled={saving}
            className="mc-modal-close"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="mc-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <RoleForm
              name={name}
              slug={slug}
              description={description}
              onNameChange={setName}
              onSlugChange={setSlug}
              onDescriptionChange={setDescription}
            />

            <hr style={{ border: 'none', borderTop: '1px solid rgba(27, 46, 61, 0.08)', margin: 0 }} />

            <PermissionTree
              value={permissions}
              onChange={setPermissions}
            />

            {/* ERROR INLINE */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  color: '#be123c',
                  fontSize: 13.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="mc-modal-footer">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              className="mc-btn-secondary"
            >
              Descartar Cambios
            </button>

            <button
              type="submit"
              disabled={saving}
              className="mc-btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración de Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
