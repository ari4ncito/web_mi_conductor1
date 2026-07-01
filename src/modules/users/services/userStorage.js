const STORAGE_KEY = "mi_conductor_users";

const SEED_USERS = [
  {
    id: "user_1",
    name: "Carlos Sánchez",
    email: "carlos.sanchez@ejemplo.com",
    phone: "+57 300 123 4567",
    role: "Administrador",
    status: "active",
    lastLogin: "2026-06-28 14:32",
  },
  {
    id: "user_2",
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+57 301 987 6543",
    role: "Conductor",
    status: "active",
    lastLogin: "2026-06-29 09:15",
  },
  {
    id: "user_3",
    name: "María Rodríguez",
    email: "maria.rodriguez@ejemplo.com",
    phone: "+57 302 555 1212",
    role: "Cliente",
    status: "active",
    lastLogin: "2026-06-25 11:00",
  },
  {
    id: "user_4",
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    phone: "+57 303 444 3333",
    role: "Administrador",
    status: "active",
    lastLogin: "2026-06-30 08:45",
  },
  {
    id: "user_5",
    name: "Luis Gómez",
    email: "luis.gomez@ejemplo.com",
    phone: "+57 304 777 8888",
    role: "Conductor",
    status: "inactive",
    lastLogin: "2026-06-27 16:20",
  },
];

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(SEED_USERS)
      );
      return SEED_USERS;
    }

    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
}

function writeAll(users) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
  );
}

function makeId() {
  return `user_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

export function getUsers() {
  return readAll();
}

export function getUserById(id) {
  return readAll().find((user) => user.id === id);
}

export function createUser(data) {
  const users = readAll();

  const newUser = {
    id: makeId(),
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone || "",
    role: data.role,
    status: data.status,
    lastLogin: "Nunca",
  };

  users.push(newUser);

  writeAll(users);

  return newUser;
}

export function updateUser(id, updates) {
  const users = readAll();

  const updatedUsers = users.map((user) =>
    user.id === id
      ? {
          ...user,
          ...updates,
        }
      : user
  );

  writeAll(updatedUsers);

  return updatedUsers.find(
    (user) => user.id === id
  );
}

export function deleteUser(id) {
  const users = readAll().filter(
    (user) => user.id !== id
  );

  writeAll(users);

  return users;
}

export function resetUsers() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(SEED_USERS)
  );

  return SEED_USERS;
}