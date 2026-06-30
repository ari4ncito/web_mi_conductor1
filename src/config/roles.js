export const DEFAULT_ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Control total del sistema y configuración general.',
    level: 'Súper admin',
    status: 'active',
    system: true,
    permissions: ['Crear roles', 'Editar roles', 'Asignar permisos', 'Ver conductores', 'Editar conductores', 'Ver mapa', 'Exportar reportes'],
  },
  {
    id: 'operator',
    name: 'Operador',
    description: 'Gestiona conductores, rutas y seguimiento diario.',
    level: 'Operación',
    status: 'active',
    system: false,
    permissions: ['Ver conductores', 'Editar conductores', 'Asignar rutas', 'Ver mapa', 'Alertas en tiempo real'],
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Consulta información sin editar contenido.',
    level: 'Consulta',
    status: 'inactive',
    system: false,
    permissions: ['Ver conductores', 'Ver mapa', 'Ver reportes'],
  },
];

export default DEFAULT_ROLES;
