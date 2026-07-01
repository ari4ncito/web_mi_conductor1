// modules/users/services/userStorage.js
//
// Capa de datos "fake backend" usando localStorage.
// Reemplaza esto por llamadas reales a tu API cuando esté lista
// (mismo nombre de funciones para no tocar los componentes).

const STORAGE_KEY = 'mi_conductor_users';

const SEED_USERS = [
  {
    id: 'user_1',
    name: 'Carlos Sánchez',
    email: 'carlos.sanchez@ejemplo.com',
    phone: '+57 300 123 4567',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2026-06-28 14:32',
  },
  {
    id: 'user_2',
    name: 'María García',
    email: 'maria.garcia@ejemplo.com',
    phone: '+57 301 987 6543',
    role: 'Operador',
    status: 'active',
    lastLogin: '2026-06-29 09:15',
  },
  {
    id: 'user_3',
    name: 'Pedro López',
    email: 'pedro.lopez@ejemplo.com',
    phone: '+57 302 555 1212',
    role: 'Visualizador',
    status: 'inactive',
    lastLogin: '2026-06-25 11:00',
  },
  {
    id: 'user_4',
    name: 'Ana Martínez',
    email: 'ana.martinez@ejemplo.com',
    phone: '+57 303 444 3333',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2026-06-30 08:45',
  },
  {
    id: 'user_5',
    name: 'Luis Fernández',
    email: 'luis.fernandez@ejemplo.com',
    phone: '+57 304 777 8888',
    role: 'Operador',
    status: 'active',
    lastLogin: '2026-06-27 16:20',
  },
];

/** Lee del localStorage; si no hay nada, siembra los datos iniciales */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
}

function writeAll(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* noop */
  }
}

function makeId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── API pública ─────────────────────────────────────────────────────────

export function getUsers() {
  return readAll();
}

export function getUserById(id) {
  return readAll().find((u) => u.id === id) ?? null;
}

export function createUser({ name, email, phone, role, status }) {
  const users = readAll();
  const newUser = {
    id: makeId(),
    name: name?.trim() || 'Sin nombre',
    email: email?.trim() || '',
    phone: phone?.trim() || '',
    role: role || 'Visualizador',
    status: status || 'active',
    lastLogin: '—',
  };
  writeAll([...users, newUser]);
  return newUser;
}

export function updateUser(id, updates) {
  const users = readAll();
  const next = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
  writeAll(next);
  return next.find((u) => u.id === id);
}

export function deleteUser(id) {
  const users = readAll().filter((u) => u.id !== id);
  writeAll(users);
}
