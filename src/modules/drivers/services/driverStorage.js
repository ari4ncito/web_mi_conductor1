const STORAGE_KEY = 'mi_conductor_drivers';

const SEED_DRIVERS = [
  {
    id: 'd1',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    name: 'Julian Vance',
    idNumber: 'ID-08765410-X',
    email: 'j.vance@ejemplo-conductor.com',
    phone: '+1 502 3456 789',
    emergencyPhone: '+1 502 9876 543',
    location: 'Ciudad de Guatemala, Guatemala',
    license: 'ID-MC-99210',
    licenseCategory: 'Clase B / Profesional',
    licenseStatus: 'Valid',
    licenseExpiry: 'Oct 2026',
    licensePlaceOfIssue: '14 de Mayo, 2008',
    currentState: 'in-route',
    performance: 4.9,
    trips: 1284,
  },
  {
    id: 'd2',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    name: 'Elena Rodriguez',
    idNumber: 'ID-08612400-X',
    email: 'e.rodriguez@ejemplo-conductor.com',
    phone: '+1 502 2345 678',
    emergencyPhone: '+1 502 8765 432',
    location: 'Ciudad de Guatemala, Guatemala',
    license: 'ID-MC-86124',
    licenseCategory: 'Clase A / Particular',
    licenseStatus: 'Valid',
    licenseExpiry: 'Jan 2026',
    licensePlaceOfIssue: '22 de Enero, 2010',
    currentState: 'available',
    performance: 4.8,
    trips: 987,
  },
  {
    id: 'd3',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    name: 'Marcus Thorne',
    idNumber: 'ID-07761245-X',
    email: 'm.thorne@ejemplo-conductor.com',
    phone: '+1 502 1234 567',
    emergencyPhone: '+1 502 7654 321',
    location: 'Ciudad de Guatemala, Guatemala',
    license: 'ID-MC-77612',
    licenseCategory: 'Clase C / Pesado',
    licenseStatus: 'Expired',
    licenseExpiry: 'Oct 2024',
    licensePlaceOfIssue: '3 de Septiembre, 2006',
    currentState: 'off-duty',
    performance: 5.0,
    trips: 1456,
  },
];

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DRIVERS));
      return SEED_DRIVERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_DRIVERS;
  }
}

function writeAll(drivers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  } catch {
    /* noop */
  }
}

function makeId() {
  return `d${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getDrivers() {
  return readAll();
}

export function getDriverById(id) {
  return readAll().find((d) => d.id === id) ?? null;
}

export function createDriver(driverData) {
  const drivers = readAll();
  const newDriver = {
    id: makeId(),
    photo: driverData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    name: driverData.name || 'Sin Nombre',
    idNumber: driverData.idNumber || '',
    email: driverData.email || '',
    phone: driverData.phone || '',
    emergencyPhone: driverData.emergencyPhone || '',
    location: driverData.location || '',
    license: driverData.license || 'ID-MC-00000',
    licenseCategory: driverData.licenseCategory || '',
    licenseStatus: driverData.licenseStatus || 'Valid',
    licenseExpiry: driverData.licenseExpiry || '',
    licensePlaceOfIssue: driverData.licensePlaceOfIssue || '',
    currentState: driverData.currentState || 'available',
    performance: driverData.performance || 0,
    trips: driverData.trips || 0,
  };
  const updatedDrivers = [...drivers, newDriver];
  writeAll(updatedDrivers);
  return newDriver;
}

export function updateDriver(id, updates) {
  const drivers = readAll();
  const updatedDrivers = drivers.map((d) => d.id === id ? { ...d, ...updates } : d);
  writeAll(updatedDrivers);
  return updatedDrivers.find((d) => d.id === id);
}
