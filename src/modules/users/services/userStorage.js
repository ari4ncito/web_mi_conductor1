const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'Mateo Álvarez',
    email: 'mateo@micondutor.com',
    role: 'Administrador',
    status: 'active',
    lastLogin: 'Hoy, 09:15',
    phone: '+57 300 123 4567',
    permissions: ['Ver conductores', 'Editar conductores', 'Gestionar roles'],
  },
  {
    id: 'u2',
    name: 'Laura Rojas',
    email: 'laura@micondutor.com',
    role: 'Operador',
    status: 'active',
    lastLogin: 'Ayer, 18:40',
    phone: '+57 301 765 4321',
    permissions: ['Ver conductores', 'Asignar rutas', 'Reportes'],
  },
  {
    id: 'u3',
    name: 'Carlos Paredes',
    email: 'carlos@micondutor.com',
    role: 'Visualizador',
    status: 'inactive',
    lastLogin: 'Hace 3 días',
    phone: '+57 310 555 1234',
    permissions: ['Ver conductores', 'Ver reportes'],
  },
];

export function getUsers() {
  return DEFAULT_USERS;
}
