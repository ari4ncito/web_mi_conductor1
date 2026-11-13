// modules/roles/components/PermissionTree.jsx
import React from 'react';

export const MODULES = [
  {
    id: 'configuration',
    label: 'Configuración',
    description: 'Roles, permisos y configuración del sistema.',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    resources: ['roles', 'permisos'],
  },

  {
    id: 'users',
    label: 'Usuarios',
    description: 'Gestión y control de cuentas de usuario.',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    resources: ['usuarios'],
  },

  {
    id: 'services',
    label: 'Servicios',
    description: 'Gestión de vehículos y conductores.',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    ),
    resources: ['vehiculos', 'conductores'],
  },

  {
    id: 'execution',
    label: 'Ejecución',
    description: 'Clientes, solicitudes, novedades y ejecución de operaciones.',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="5" y="4" width="14" height="17" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 13 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    resources: ['clientes', 'solicitudes', 'novedades'],
  },
];

export const SOLICITUD_ACTIONS = [
  {
    key: 'register',
    label: 'Registrar',
  },
  {
    key: 'assign',
    label: 'Asignar conductor',
  },
  {
    key: 'viewRoute',
    label: 'Ver ruta',
  },
  {
    key: 'viewDetails',
    label: 'Ver detalles',
  },
  {
    key: 'cancel',
    label: 'Cancelar solicitud',
  },
];

export const CRUD_ACTIONS = [
  {
    key: 'view',
    label: 'Ver',
  },
  {
    key: 'edit',
    label: 'Editar',
  },
  {
    key: 'add',
    label: 'Agregar',
  },
  {
    key: 'delete',
    label: 'Eliminar',
  },
];

const emptyActions = () => ({
  view: false,
  edit: false,
  add: false,
  delete: false,
});

const emptySolicitudActions = () => ({
  register: false,
  assign: false,
  viewRoute: false,
  viewDetails: false,
  cancel: false,
});

export const emptyModulePerms = () => ({
  configuration: {
    roles: emptyActions(),
    permisos: emptyActions(),
  },

  users: {
    usuarios: emptyActions(),
  },

  services: {
    vehiculos: emptyActions(),
    conductores: emptyActions(),
  },

  execution: {
    clientes: emptyActions(),
    solicitudes: emptySolicitudActions(),
    novedades: emptyActions(),
  },
});



export default function PermissionTree({
  value,
  onChange,
  readOnly = false,
}) {


  const toggle = (
    moduleId,
    resource,
    actionKey
  ) => {

    if (readOnly) {
      return;
    }

    const currentModule =
      value?.[moduleId] || {};

    const currentResource =
      currentModule?.[resource] ||
      emptyActions();

    onChange({
      ...value,

      [moduleId]: {

        ...currentModule,

        [resource]: {

          ...currentResource,

          [actionKey]:
            !currentResource[actionKey],

        },

      },
    });
  };



  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <span className="text-base font-semibold text-slate-900">
          Permisos de Módulo
        </span>

        <span className="text-sm font-semibold text-teal-600">
          {MODULES.length} Módulos Disponibles
        </span>

      </div>


      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {MODULES.map((mod) => {

          const moduleValue =
            value?.[mod.id] || {};

          // Si está en modo solo lectura (detalle del rol), ocultar módulos que no tengan ningún permiso seleccionado
          if (readOnly) {
            const hasAnyAction = mod.resources.some((resource) => {
              const resPerms = moduleValue?.[resource] || {};
              return Object.values(resPerms).some(Boolean);
            });

            if (!hasAnyAction) {
              return null;
            }
          }

          return (

            <div
              key={mod.id}
              className="border border-slate-200 rounded-xl p-4"
            >

              {/* CABECERA DEL MÓDULO */}

              <div className="flex items-start gap-3">

                <span className="w-9 h-9 rounded-lg bg-teal-800 flex items-center justify-center shrink-0">

                  {mod.icon}

                </span>

                <div>

                  <span className="font-semibold text-slate-900 text-sm">
                    {mod.label}
                  </span>

                  <p className="text-xs text-slate-400 mt-1">
                    {mod.description}
                  </p>

                </div>

              </div>


              {/* RECURSOS */}

              <div className="mt-5 space-y-4">

                {mod.resources.map((resource) => {

                  const resourcePermissions =
                    moduleValue?.[resource] ||
                    emptyActions();

                  // En modo solo lectura, si el recurso no tiene ninguna acción activa, ocultarlo
                  if (readOnly) {
                    const hasAction = Object.values(resourcePermissions).some(Boolean);
                    if (!hasAction) return null;
                  }

                  return (

                    <div
                      key={resource}
                      className="border border-slate-100 rounded-lg p-3"
                    >

                      {/* NOMBRE DEL RECURSO */}

                      <div className="mb-2">

                        <span className="text-sm font-semibold text-slate-700 capitalize">
                          {resource}
                        </span>

                      </div>


                      {/* CHECKBOXES */}

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">

                        {(resource === 'solicitudes' ? SOLICITUD_ACTIONS : CRUD_ACTIONS).map((action) => {

                          const checked =
                            !!resourcePermissions[
                              action.key
                            ];

                          return (

                            <label
                              key={action.key}
                              className="flex items-center gap-1.5 cursor-pointer select-none"
                            >

                              <div className="relative inline-flex items-center justify-center">

                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggle(
                                      mod.id,
                                      resource,
                                      action.key
                                    )
                                  }
                                  disabled={readOnly}
                                  className="
                                    peer
                                    h-4
                                    w-4
                                    appearance-none
                                    rounded
                                    border
                                    border-slate-300
                                    checked:bg-orange-500
                                    checked:border-orange-500
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                    transition-colors
                                  "
                                />

                                <svg
                                  className="
                                    pointer-events-none
                                    absolute
                                    w-2.5
                                    h-2.5
                                    text-white
                                    opacity-0
                                    peer-checked:opacity-100
                                  "
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >

                                  <path
                                    d="M2 6l3 3 5-5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />

                                </svg>

                              </div>

                              <span className="text-sm text-slate-600">
                                {action.label}
                              </span>

                            </label>

                          );

                        })}

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}
