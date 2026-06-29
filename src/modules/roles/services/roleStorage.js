// ======================================================
// Role Storage Service
// Encapsula toda la lógica del LocalStorage.
// En el futuro podrá reemplazarse por llamadas a la API.
// ======================================================

const STORAGE_KEY = "roles";

// ======================================================
// Rol del sistema
// Nunca puede eliminarse ni modificarse.
// ======================================================

const SYSTEM_ROLE = {
  id: 1,
  name: "Administrador",
  slug: "administrator",
  description: "Acceso total al sistema.",

  users: 1,

  status: "ACTIVE",

  system: true,

  createdAt: new Date().toISOString(),

  permissions: {
    configuration: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
    drivers: ["view", "create", "edit", "delete"],
    vehicles: ["view", "create", "edit", "delete"],
    services: ["view", "create", "edit", "delete"],
    execution: ["view", "create", "edit", "delete"],
    reports: ["view", "create", "edit", "delete"],
  },
};

// ======================================================

function save(roles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

// ======================================================

export function initializeRoles() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    save([SYSTEM_ROLE]);
    return [SYSTEM_ROLE];
  }

  const roles = JSON.parse(stored);

  const exists = roles.some((role) => role.system);

  if (!exists) {
    roles.unshift(SYSTEM_ROLE);
    save(roles);
  }

  return roles;
}

// ======================================================

export function getRoles() {
  return initializeRoles();
}

// ======================================================

export function getRole(id) {
  const roles = initializeRoles();

  return roles.find((role) => role.id === id);
}

// ======================================================

export function createRole(role) {
  const roles = initializeRoles();

  const newRole = {
    ...role,

    id: Date.now(),

    users: 0,

    system: false,

    status: "ACTIVE",

    createdAt: new Date().toISOString(),
  };

  roles.push(newRole);

  save(roles);

  return newRole;
}

// ======================================================

export function updateRole(id, data) {
  const roles = initializeRoles();

  const index = roles.findIndex((role) => role.id === id);

  if (index === -1) return null;

  if (roles[index].system) {
    throw new Error(
      "El rol Administrador no puede modificarse."
    );
  }

  roles[index] = {
    ...roles[index],
    ...data,
  };

  save(roles);

  return roles[index];
}

// ======================================================

export function deleteRole(id) {
  const roles = initializeRoles();

  const role = roles.find((r) => r.id === id);

  if (!role) return;

  if (role.system) {
    throw new Error(
      "No es posible eliminar el rol Administrador."
    );
  }

  const updated = roles.filter((r) => r.id !== id);

  save(updated);
}

// ======================================================

export function changeStatus(id) {
  const roles = initializeRoles();

  const role = roles.find((r) => r.id === id);

  if (!role) return;

  if (role.system) {
    throw new Error(
      "El rol Administrador siempre debe permanecer activo."
    );
  }

  role.status =
    role.status === "ACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  save(roles);

  return role;
}

// ======================================================

export function searchRoles(text) {
  const roles = initializeRoles();

  return roles.filter((role) =>
    role.name
      .toLowerCase()
      .includes(text.toLowerCase())
  );
}