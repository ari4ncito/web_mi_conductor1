// modules/roles/components/modals/CreateRoleModal.jsx

import { useState } from 'react';
import RoleForm from '../RoleForm';
import PermissionTree, { emptyModulePerms } from '../PermissionTree';
import roleService from '../../services/roleService';

export default function CreateRoleModal({
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
     REINICIAR FORMULARIO
  ========================================================= */
  const reset = () => {
    setName('');
    setSlug('');
    setDescription('');
    setPermissions(emptyModulePerms());
    setError('');
  };

  /* =========================================================
     CERRAR MODAL
  ========================================================= */
  const handleDiscard = () => {
    if (saving) return;
    reset();
    onClose();
  };

  /* =========================================================
     OBTENER IDs DE PERMISOS
  ========================================================= */
  const obtenerIdsPermisos = () => {
    const ids = [];

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

  /* =========================================================
     GUARDAR
  ========================================================= */
  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    // Validación de datos
    const trimmedName = name.trim();
    if (!trimmedName) {
      const msg = 'El nombre del rol es obligatorio.';
      setError(msg);
      onShowAlert?.({
        type: 'warning',
        title: 'Datos no válidos',
        message: 'Por favor ingresa un nombre para el nuevo rol.',
      });
      return;
    }

    const permisosIds = obtenerIdsPermisos();
    if (permisosIds.length === 0) {
      const msg = 'Debes seleccionar al menos un permiso para el rol.';
      setError(msg);
      onShowAlert?.({
        type: 'warning',
        title: 'Datos no válidos',
        message: 'Debes asignar al menos un permiso de módulo al nuevo rol.',
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

      console.log('Creando rol:', datos);
      await roleService.create(datos);

      onShowAlert?.({
        type: 'success',
        title: '¡Rol creado con éxito!',
        message: `El rol "${trimmedName}" y sus permisos han sido configurados correctamente.`,
      });

      await refresh();
      reset();
      onClose();
    } catch (err) {
      console.error('Error creando rol:', err);
      const errorMsg =
        err?.response?.data?.message ||
        'No se pudo guardar el rol. Verifica la información ingresada.';
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

  if (!open) return null;

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

        {/* FORMULARIO */}
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
