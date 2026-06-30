// modules/roles/services/roleStorage.js
//
// Capa de datos "fake backend" usando localStorage.
// Reemplaza esto por llamadas reales a tu API cuando esté lista
// (mismo nombre de funciones para no tocar los componentes).

import { emptyModulePerms } from '../components/PermissionTree';

const STORAGE_KEY = 'mi_conductor_roles';

/** Datos iniciales, igual a los que se ven en la imagen de Role Management */
const SEED_ROLES = [
  {
    id: 'role_admin',
    name: 'Administrator',
    subtitle: 'Full System Access',
    slug: 'administrator',
    description: 'Can manage all system entities, users, and configurations.',
    usersAttached: 4,
    status: 'locked', // -> "SYSTEM LOCKED" en RoleStatusBadge
    accent: 'admin',
    system: true, // no se puede editar ni desactivar
    permissions: {
      configuration: { view: true, edit: true, add: true, delete: true },
      users:         { view: true, edit: true, add: true, delete: true },
      vehicles:      { view: true, edit: true, add: true, delete: true },
      execution:     { view: true, edit: true, add: true, delete: true },
    },
  },
  {
    id: 'role_driver',
    name: 'Driver',
    subtitle: 'Execution Permissions',
    slug: 'driver',
    description: 'Access to service execution logs and driver mobile portal.',
    usersAttached: 142,
    status: 'active',
    accent: 'operations',
    system: false,
    permissions: {
      ...emptyModulePerms(),
      execution: { view: true, edit: true, add: false, delete: false },
    },
  },
  {
    id: 'role_enterprise_client',
    name: 'Enterprise Client',
    subtitle: 'Reporting Access',
    slug: 'enterprise_client',
    description: 'Limited to analytics dashboards and invoicing modules.',
    usersAttached: 18,
    status: 'active',
    accent: 'client',
    system: false,
    permissions: {
      ...emptyModulePerms(),
      users: { view: true, edit: false, add: false, delete: false },
    },
  },
];

/** Lee del localStorage; si no hay nada, siembra los datos iniciales */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ROLES));
      return SEED_ROLES;
    }
    return JSON.parse(raw);
  } catch {
    // localStorage corrupto o no disponible (SSR) -> usar seed en memoria
    return SEED_ROLES;
  }
}

function writeAll(roles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
  } catch {
    /* noop: si falla, los cambios solo viven en memoria de esta sesión */
  }
}

/** Genera un id simple único */
function makeId() {
  return `role_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── API pública (usada por Roles.jsx y los modales) ───────────────────────

export function getRoles() {
  return readAll();
}

export function getRoleById(id) {
  return readAll().find((r) => r.id === id) ?? null;
}

export function createRole({ name, slug, description, permissions }) {
  const roles = readAll();
  const newRole = {
    id: makeId(),
    name: name?.trim() || 'Sin nombre',
    subtitle: '',
    slug: slug?.trim() || '',
    description: description?.trim() || '',
    usersAttached: 0,
    status: 'active',
    accent: 'client',
    system: false,
    permissions: permissions ?? emptyModulePerms(),
  };
  writeAll([...roles, newRole]);
  return newRole;
}

export function updateRole(id, updates) {
  const roles = readAll();
  const next = roles.map((r) => (r.id === id ? { ...r, ...updates } : r));
  writeAll(next);
  return next.find((r) => r.id === id);
}

export function deleteRole(id) {
  const roles = readAll().filter((r) => r.id !== id);
  writeAll(roles);
}

export function toggleRoleStatus(id) {
  const roles = readAll();
  const next = roles.map((r) =>
    r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
  );
  writeAll(next);
  return next.find((r) => r.id === id);
}

/** Útil para development: borra todo y vuelve a sembrar */
export function resetRoles() {
  writeAll(SEED_ROLES);
  return SEED_ROLES;
}