const STORAGE_KEY = 'mi_conductor_drivers';

const SEED_DRIVERS = [
  {
    id: 'd1',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    name: 'Julian Vance',
    license: 'ID-MC-99210',
    licenseStatus: 'Valid',
    licenseExpiry: 'Oct 2026',
    currentState: 'in-route',
    performance: 4.9,
    trips: 1284,
  },
  {
    id: 'd2',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    name: 'Elena Rodriguez',
    license: 'ID-MC-86124',
    licenseStatus: 'Valid',
    licenseExpiry: 'Jan 2026',
    currentState: 'available',
    performance: 4.8,
    trips: 987,
  },
  {
    id: 'd3',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    name: 'Marcus Thorne',
    license: 'ID-MC-77612',
    licenseStatus: 'Expired',
    licenseExpiry: 'Oct 2024',
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
    license: driverData.license || 'ID-MC-00000',
    licenseStatus: driverData.licenseStatus || 'Valid',
    licenseExpiry: driverData.licenseExpiry || '',
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
