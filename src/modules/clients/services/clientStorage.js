// modules/clients/services/clientStorage.js
//
// Capa de persistencia en localStorage para clientes.
// Reemplaza el useState con datos iniciales por almacenamiento persistente.

const STORAGE_KEY = 'mi_conductor_clients';

const SEED_CLIENTS = [
  {
    id: 'alex-moreno',
    name: 'Alejandro Moreno',
    email: 'alex.moreno@gmail.com',
    identification: '901234567-1',
    phone: '+57 300 000 0000',
    address: 'Av. Principal #123, Ciudad',
    notes: 'Cliente prioritario con programaciones recurrentes.',
    vehicles: '5',
    services: '84',
    status: 'Active',
    type: 'Corporativo',
    registrationDate: '2025-03-15',
    avatarStrong: true,
  },
  {
    id: 'isabella-santos',
    name: 'Isabella Santos',
    email: 'isantos.dev@icloud.com',
    identification: '1023456789',
    phone: '+57 301 111 2222',
    address: 'Calle 80 #45-20, Bogotá',
    notes: 'Prefiere atención en horarios de oficina.',
    vehicles: '1',
    services: '12',
    status: 'Active',
    type: 'Particular',
    registrationDate: '2025-06-20',
    avatarStrong: false,
  },
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@ejemplo.com',
    identification: '1122334455',
    phone: '+57 302 222 3344',
    address: 'Cra 15 #30-45, Medellín',
    notes: 'Cliente nuevo con contrato anual.',
    vehicles: '3',
    services: '45',
    status: 'Active',
    type: 'Corporativo',
    registrationDate: '2025-09-01',
    avatarStrong: true,
  },
  {
    id: 'lucia-ramirez',
    name: 'Lucía Ramírez',
    email: 'lucia.ramirez@ejemplo.com',
    identification: '9988776655',
    phone: '+57 303 333 4455',
    address: 'Av. Siempre Viva #742, Cali',
    notes: 'Solicita servicios esporádicos.',
    vehicles: '0',
    services: '8',
    status: 'Inactive',
    type: 'Particular',
    registrationDate: '2024-11-10',
    avatarStrong: false,
  },
  {
    id: 'javier-torres',
    name: 'Javier Torres',
    email: 'javier.torres@ejemplo.com',
    identification: '5566778899',
    phone: '+57 304 444 5566',
    address: 'Calle 50 #12-34, Barranquilla',
    notes: 'Cliente frecuente con múltiples unidades.',
    vehicles: '8',
    services: '120',
    status: 'Active',
    type: 'Corporativo',
    registrationDate: '2025-01-05',
    avatarStrong: true,
  },
];

/** Lee del localStorage; si no hay datos, siembra los iniciales */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CLIENTS));
      return SEED_CLIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_CLIENTS;
  }
}

function writeAll(clients) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch {
    /* noop */
  }
}

export function getClients() {
  return readAll();
}

export function getClientById(id) {
  return readAll().find((c) => c.id === id) ?? null;
}

export function saveClient(client) {
  const clients = readAll();
  const exists = clients.some((c) => c.id === client.id);
  let result;
  if (exists) {
    result = clients.map((c) => (c.id === client.id ? { ...c, ...client } : c));
  } else {
    result = [client, ...clients];
  }
  writeAll(result);
  return result;
}

export function deleteClient(id) {
  const clients = readAll().filter((c) => c.id !== id);
  writeAll(clients);
  return clients;
}
