const STORAGE_KEY = 'mi_conductor_service_requests';

const SEED_REQUESTS = [
  {
    id: 'sr-001',
    code: 'SOL-2025-001',
    client: 'Alejandro Moreno',
    clientEmail: 'alex.moreno@gmail.com',
    driver: 'Carlos Mendoza',
    vehicle: 'ABC-123',
    serviceType: 'Transporte Ejecutivo',
    description: 'Traslado ejecutivo al aeropuerto internacional. Recoger en Av. Principal #123 a las 07:00 AM.',
    origin: 'Av. Principal #123, Ciudad',
    destination: 'Aeropuerto Internacional',
    scheduledDate: '2025-07-15',
    status: 'Pendiente',
    priority: 'Alta',
    createdBy: 'Admin',
    createdAt: '2025-07-01',
  },
  {
    id: 'sr-002',
    code: 'SOL-2025-002',
    client: 'Isabella Santos',
    clientEmail: 'isantos.dev@icloud.com',
    driver: 'Lucía Ramírez',
    vehicle: 'XYZ-789',
    serviceType: 'Servicio Día Completo',
    description: 'Recorrido por varios puntos turísticos de la ciudad con paradas programadas.',
    origin: 'Calle 80 #45-20, Bogotá',
    destination: 'Múltiples destinos',
    scheduledDate: '2025-07-16',
    status: 'En Proceso',
    priority: 'Media',
    createdBy: 'Admin',
    createdAt: '2025-07-01',
  },
  {
    id: 'sr-003',
    code: 'SOL-2025-003',
    client: 'Carlos Mendoza',
    clientEmail: 'carlos.mendoza@ejemplo.com',
    driver: 'Javier Torres',
    vehicle: 'DEF-456',
    serviceType: 'Transporte Ejecutivo',
    description: 'Traslado ejecutivo a reunión de negocios en zona financiera.',
    origin: 'Cra 15 #30-45, Medellín',
    destination: 'Zona Financiera, Edificio Corporativo',
    scheduledDate: '2025-07-14',
    status: 'Completado',
    priority: 'Alta',
    createdBy: 'Admin',
    createdAt: '2025-06-30',
  },
  {
    id: 'sr-004',
    code: 'SOL-2025-004',
    client: 'Lucía Ramírez',
    clientEmail: 'lucia.ramirez@ejemplo.com',
    driver: 'Pedro Gómez',
    vehicle: 'GHI-789',
    serviceType: 'Servicio Empresarial',
    description: 'Transporte corporativo para visita a sucursal.',
    origin: 'Av. Siempre Viva #742, Cali',
    destination: 'Sucursal Norte, Cali',
    scheduledDate: '2025-07-18',
    status: 'Pendiente',
    priority: 'Baja',
    createdBy: 'Admin',
    createdAt: '2025-07-02',
  },
  {
    id: 'sr-005',
    code: 'SOL-2025-005',
    client: 'Javier Torres',
    clientEmail: 'javier.torres@ejemplo.com',
    driver: 'Ana Martínez',
    vehicle: 'JKL-012',
    serviceType: 'Transporte Ejecutivo',
    description: 'Traslado a cena de negocios con recogida en oficina.',
    origin: 'Calle 50 #12-34, Barranquilla',
    destination: 'Restaurante La 52, Barranquilla',
    scheduledDate: '2025-07-17',
    status: 'En Proceso',
    priority: 'Media',
    createdBy: 'Admin',
    createdAt: '2025-07-01',
  },
  {
    id: 'sr-006',
    code: 'SOL-2025-006',
    client: 'Alejandro Moreno',
    clientEmail: 'alex.moreno@gmail.com',
    driver: 'Roberto Díaz',
    vehicle: 'MNO-345',
    serviceType: 'Servicio Día Completo',
    description: 'Recorrido ejecutivo completo con visitas a 3 sucursales.',
    origin: 'Oficina Principal',
    destination: 'Sucursales varias',
    scheduledDate: '2025-07-20',
    status: 'Pendiente',
    priority: 'Alta',
    createdBy: 'Admin',
    createdAt: '2025-07-03',
  },
  {
    id: 'sr-007',
    code: 'SOL-2025-007',
    client: 'Isabella Santos',
    clientEmail: 'isantos.dev@icloud.com',
    driver: 'Laura Vega',
    vehicle: 'PQR-678',
    serviceType: 'Transporte Ejecutivo',
    description: 'Traslado personal al centro comercial.',
    origin: 'Calle 80 #45-20, Bogotá',
    destination: 'Centro Comercial Unicentro',
    scheduledDate: '2025-07-12',
    status: 'Completado',
    priority: 'Baja',
    createdBy: 'Admin',
    createdAt: '2025-06-28',
  },
  {
    id: 'sr-008',
    code: 'SOL-2025-008',
    client: 'Carlos Mendoza',
    clientEmail: 'carlos.mendoza@ejemplo.com',
    driver: 'Felipe Rojas',
    vehicle: 'STU-901',
    serviceType: 'Servicio Empresarial',
    description: 'Transporte ejecutivo para convención anual de la empresa.',
    origin: 'Hotel Intercontinental',
    destination: 'Centro de Convenciones',
    scheduledDate: '2025-07-22',
    status: 'Cancelado',
    priority: 'Alta',
    createdBy: 'Admin',
    createdAt: '2025-07-01',
  },
];

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REQUESTS));
      return SEED_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_REQUESTS;
  }
}

function writeAll(requests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    /* noop */
  }
}

export function getServiceRequests() {
  return readAll();
}

export function getServiceRequestById(id) {
  return readAll().find((r) => r.id === id) ?? null;
}

export function saveServiceRequest(request) {
  const requests = readAll();
  const exists = requests.some((r) => r.id === request.id);
  let result;
  if (exists) {
    result = requests.map((r) => (r.id === request.id ? { ...r, ...request } : r));
  } else {
    result = [request, ...requests];
  }
  writeAll(result);
  return result;
}

export function deleteServiceRequest(id) {
  const requests = readAll().filter((r) => r.id !== id);
  writeAll(requests);
  return requests;
}
