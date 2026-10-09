// modules/roles/components/modals/CreateRoleModal.jsx

import { useState } from 'react';

import RoleForm from '../RoleForm';

import PermissionTree, {
  emptyModulePerms,
} from '../PermissionTree';

import roleService from '../../services/roleService';


export default function CreateRoleModal({
  open,
  onClose,
  refresh,
  permisos = [],
}) {

  const [name, setName] = useState('');

  const [slug, setSlug] = useState('');

  const [description, setDescription] = useState('');

  const [permissions, setPermissions] =
    useState(emptyModulePerms());

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');


  /* =========================================================
     REINICIAR FORMULARIO
  ========================================================= */

  const reset = () => {

    setName('');

    setSlug('');

    setDescription('');

    setPermissions(
      emptyModulePerms()
    );

    setError('');

  };


  /* =========================================================
     CERRAR MODAL
  ========================================================= */

  const handleDiscard = () => {

    if (saving) {
      return;
    }

    reset();

    onClose();

  };


  /* =========================================================
     OBTENER IDs DE PERMISOS
     
     Convierte:

     configuration.roles.view = true

     en:

     ID del permiso "ver.roles"
  ========================================================= */

  const obtenerIdsPermisos = () => {

    const ids = [];


    permisos.forEach((permiso) => {

      const codigo =
        permiso.codigo?.toLowerCase();


      if (!codigo) {
        return;
      }


      const partes =
        codigo.split('.');


      if (partes.length !== 2) {
        return;
      }


      const [accion, modulo] =
        partes;


      let frontendModulo = null;

      let frontendRecurso = null;


      /* =====================================================
         CONFIGURACIÓN
      ===================================================== */

      switch (modulo) {

        case 'roles':

          frontendModulo =
            'configuration';

          frontendRecurso =
            'roles';

          break;


        case 'permisos':

          frontendModulo =
            'configuration';

          frontendRecurso =
            'permisos';

          break;


        /* ===================================================
           USUARIOS
        =================================================== */

        case 'usuarios':

          frontendModulo =
            'users';

          frontendRecurso =
            'usuarios';

          break;


        case 'clientes':

          frontendModulo =
            'users';

          frontendRecurso =
            'clientes';

          break;


        /* ===================================================
           VEHÍCULOS
        =================================================== */

        case 'vehiculos':
        case 'vehículos':

          frontendModulo =
            'vehicles';

          frontendRecurso =
            'vehiculos';

          break;


        /* ===================================================
           EJECUCIÓN
        =================================================== */

        case 'conductores':

          frontendModulo =
            'execution';

          frontendRecurso =
            'conductores';

          break;


        case 'novedades':

          frontendModulo =
            'execution';

          frontendRecurso =
            'novedades';

          break;


        default:

          return;

      }


      /* =====================================================
         CONVERTIR ACCIÓN BACKEND → FRONTEND
      ===================================================== */

      let frontendAccion = null;


      switch (accion) {

        case 'ver':

          frontendAccion =
            'view';

          break;


        case 'editar':

          frontendAccion =
            'edit';

          break;


        case 'crear':

          frontendAccion =
            'add';

          break;


        case 'eliminar':

          frontendAccion =
            'delete';

          break;


        default:

          return;

      }


      /* =====================================================
         COMPROBAR SI ESTÁ MARCADO
      ===================================================== */

      const marcado =
        permissions?.[
          frontendModulo
        ]?.[
          frontendRecurso
        ]?.[
          frontendAccion
        ];


      if (marcado) {

        if (permiso._id) {

          ids.push(
            permiso._id
          );

        } else if (permiso.id) {

          ids.push(
            permiso.id
          );

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


    if (saving) {
      return;
    }


    try {

      setSaving(true);

      setError('');


      const permisosIds =
        obtenerIdsPermisos();


      const datos = {

        nombre: name.trim(),

        descripcion:
          description.trim(),

        permisos:
          permisosIds,

      };


      console.log(
        'Permisos seleccionados:',
        permissions
      );


      console.log(
        'IDs de permisos:',
        permisosIds
      );


      console.log(
        'Datos enviados para crear rol:',
        datos
      );


      await roleService.create(
        datos
      );


      console.log(
        'Rol creado correctamente.'
      );


      await refresh();


      reset();

      onClose();


    } catch (error) {

      console.error(
        'Error creando rol:',
        error
      );


      setError(
        error?.response?.data?.message ||
        'No se pudo crear el rol.'
      );


    } finally {

      setSaving(false);

    }

  };


  /* =========================================================
     NO MOSTRAR
  ========================================================= */

  if (!open) {
    return null;
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div
      className="mc-modal-overlay"
      onClick={handleDiscard}
    >

      <div
        className="mc-modal"
        style={{ maxWidth: 960 }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mc-modal-header">

          <div>

            <p className="mc-modal-subtitle">
              Rol
            </p>

            <h2 className="mc-modal-title">
              Configuración de Rol
            </h2>

            <p className="mc-modal-desc">
              Define los permisos y alcances para los miembros de tu equipo.
            </p>

          </div>

          <button
            type="button"
            onClick={handleDiscard}
            aria-label="Cerrar"
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

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />

            </svg>

          </button>

        </div>


        {/* =================================================
            FORMULARIO
        ================================================= */}

        <form onSubmit={handleSave}>

          <div className="mc-modal-body">

            <RoleForm
              name={name}
              slug={slug}
              description={description}
              onNameChange={
                setName
              }
              onSlugChange={
                setSlug
              }
              onDescriptionChange={
                setDescription
              }
            />


            <hr
              className="border-slate-100"
            />


            <PermissionTree
              value={permissions}
              onChange={
                setPermissions
              }
            />


            {/* ERROR */}

            {error && (

              <div
                style={{
                  padding:
                    '12px 16px',
                  borderRadius: 12,
                  background:
                    '#fff1f2',
                  border:
                    '1px solid #fecdd3',
                  color: '#be123c',
                  fontSize: 14,
                }}
              >

                {error}

              </div>

            )}

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

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

              {saving
                ? 'Guardando...'
                : 'Guardar Configuración de Rol'
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
