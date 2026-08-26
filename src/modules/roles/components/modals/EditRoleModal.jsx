// modules/roles/components/modals/EditRoleModal.jsx

import { useEffect, useState } from 'react';

import RoleForm from '../RoleForm';

import PermissionTree, {
  emptyModulePerms,
} from '../PermissionTree';

import roleService from '../../services/roleService';


/* =========================================================
   CONVERTIR PERMISOS BACKEND → FRONTEND
========================================================= */

const adaptarPermisos = (
  permisos = []
) => {

  const resultado =
    emptyModulePerms();


  if (!Array.isArray(permisos)) {
    return resultado;
  }


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


    const [
      accion,
      modulo
    ] = partes;


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
       ACCIÓN
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
       MARCAR
    ===================================================== */

    resultado[
      frontendModulo
    ][
      frontendRecurso
    ][
      frontendAccion
    ] = true;

  });


  return resultado;

};


/* =========================================================
   CONVERTIR FRONTEND → IDS BACKEND
========================================================= */

const obtenerIdsPermisos = (
  permissions,
  permisos
) => {

  const ids = [];


  if (!Array.isArray(permisos)) {
    return ids;
  }


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


    const [
      accion,
      modulo
    ] = partes;


    let frontendModulo = null;

    let frontendRecurso = null;


    /* =====================================================
       RECURSO
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


      case 'vehiculos':
      case 'vehículos':

        frontendModulo =
          'vehicles';

        frontendRecurso =
          'vehiculos';

        break;


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
       ACCIÓN
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
       COMPROBAR MARCADO
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
   COMPONENTE
========================================================= */

export default function EditRoleModal({
  role,
  open,
  onClose,
  refresh,
  permisos = [],
}) {

  const [name, setName] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [permissions, setPermissions] =
    useState(emptyModulePerms());

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');


  /* =========================================================
     CARGAR INFORMACIÓN DEL ROL
  ========================================================= */

  useEffect(() => {

    if (!role) {
      return;
    }


    setName(
      role.name ?? ''
    );


    setSlug(
      role.slug ?? ''
    );


    setDescription(
      role.description ?? ''
    );


    /*
      role.backendPermissions contiene
      los permisos originales que
      vienen desde MongoDB.
    */

    const permisosBackend =
      role.backendPermissions ||
      [];


    const permisosAdaptados =
      adaptarPermisos(
        permisosBackend
      );


    console.log(
      'Permisos backend del rol:',
      permisosBackend
    );


    console.log(
      'Permisos adaptados para edición:',
      permisosAdaptados
    );


    setPermissions(
      permisosAdaptados
    );


    setError('');

  }, [role]);


  /* =========================================================
     CERRAR
  ========================================================= */

  const handleDiscard = () => {

    if (saving) {
      return;
    }

    onClose();

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
        obtenerIdsPermisos(
          permissions,
          permisos
        );


      const datos = {

        /*
          El backend espera "nombre",
          no "name".
        */

        nombre:
          name.trim(),

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
        'IDs enviados:',
        permisosIds
      );


      console.log(
        'Datos enviados para actualizar rol:',
        datos
      );


      await roleService.update(
        role.id,
        datos
      );


      console.log(
        'Rol actualizado correctamente.'
      );


      await refresh();


      onClose();


    } catch (error) {

      console.error(
        'Error actualizando rol:',
        error
      );


      setError(
        error?.response?.data?.message ||
        'No se pudo actualizar el rol.'
      );


    } finally {

      setSaving(false);

    }

  };


  /* =========================================================
     NO MOSTRAR
  ========================================================= */

  if (!open || !role) {
    return null;
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div
      style={{
        position: 'fixed',
        inset: 0,
        background:
          'rgba(15, 23, 42, 0.6)',
        backdropFilter:
          'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 40,
      }}
      onClick={handleDiscard}
    >

      <div
        style={{
          width:
            'min(960px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow:
            '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border:
            '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent:
              'space-between',
            gap: 16,
            padding:
              '28px 32px 24px',
            borderBottom:
              '1px solid rgba(17, 17, 17, 0.08)',
          }}
        >

          <div>

            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                textTransform:
                  'uppercase',
                letterSpacing:
                  '0.2em',
                color: '#ff9a2f',
              }}
            >
              Rol
            </p>


            <h2
              style={{
                margin:
                  '8px 0 0',
                fontSize: 22,
                fontWeight: 700,
                color: '#11384a',
                lineHeight: 1.2,
              }}
            >
              Configuración de Rol
            </h2>


            <p
              style={{
                margin:
                  '6px 0 0',
                color: '#7a7680',
                fontSize: 14,
              }}
            >
              Define los permisos y alcances para los miembros de tu equipo.
            </p>

          </div>


          <button
            type="button"
            onClick={handleDiscard}
            aria-label="Cerrar"
            disabled={saving}
            style={{
              border: 'none',
              background:
                'transparent',
              color: '#94a3b8',
              cursor: saving
                ? 'not-allowed'
                : 'pointer',
              flexShrink: 0,
              padding: 4,
            }}
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
            BODY
        ================================================= */}

        <form onSubmit={handleSave}>

          <div
            style={{
              padding:
                '24px 32px',
              display: 'flex',
              flexDirection:
                'column',
              gap: 24,
            }}
          >

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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'flex-end',
              gap: 12,
              padding:
                '16px 32px',
              borderTop:
                '1px solid rgba(17, 17, 17, 0.08)',
            }}
          >

            <button
              type="button"
              onClick={
                handleDiscard
              }
              disabled={saving}
              style={{
                height: 40,
                borderRadius: 12,
                border:
                  '1px solid rgba(17, 17, 17, 0.08)',
                background:
                  '#ffffff',
                color: '#1b1b1b',
                fontSize: 14,
                fontWeight: 500,
                cursor: saving
                  ? 'not-allowed'
                  : 'pointer',
                padding:
                  '0 20px',
              }}
            >
              Descartar Cambios
            </button>


            <button
              type="submit"
              disabled={saving}
              style={{
                height: 40,
                borderRadius: 12,
                border: 0,
                background:
                  '#ff9a2f',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: saving
                  ? 'not-allowed'
                  : 'pointer',
                padding:
                  '0 20px',
                display:
                  'inline-flex',
                alignItems:
                  'center',
                gap: 8,
                boxShadow:
                  '0 8px 16px rgba(255, 154, 47, 0.28)',
                opacity:
                  saving
                    ? 0.7
                    : 1,
              }}
            >

              {saving
                ? 'Guardando...'
                : 'Guardar Configuración de Rol'
              }


              {!saving && (

                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />

                </svg>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

} 