export const PERMISSION_GROUPS = [
  {
    id: 'roles',
    label: 'Gestión de roles',
    permissions: ['Crear roles', 'Editar roles', 'Asignar permisos'],
  },
  {
    id: 'drivers',
    label: 'Conductores',
    permissions: ['Ver conductores', 'Editar conductores', 'Asignar rutas'],
  },
  {
    id: 'tracking',
    label: 'Seguimiento',
    permissions: ['Ver mapa', 'Exportar reportes', 'Alertas en tiempo real'],
  },
  {
    id: 'reports',
    label: 'Reportes',
    permissions: ['Ver reportes', 'Descargar reportes', 'Programar envíos'],
  },
];

export default PERMISSION_GROUPS;
