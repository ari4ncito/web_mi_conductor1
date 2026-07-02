const STORAGE_KEY = 'mi_conductor_vehicles';

const SEED_VEHICLES = [
  { id: 'v1', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop', name: 'Mercedes-Benz S-Class', licensePlate: 'ABC-1234', owner: 'Alexander Sterling', status: 'active' },
  { id: 'v2', photo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=150&fit=crop', name: 'Porsche Cayenne Turbo', licensePlate: 'DRV-7788', owner: 'Elena Rodriguez', status: 'maintenance' },
  { id: 'v3', photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=150&fit=crop', name: 'Tesla Model Y', licensePlate: 'ELX-9012', owner: 'Enterprise Logistics', status: 'off-duty' },
  { id: 'v4', photo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=150&fit=crop', name: 'BMW 7 Series', licensePlate: 'BMW-7890', owner: 'Premium Rides Inc.', status: 'active' },
  { id: 'v5', photo: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=150&fit=crop', name: 'Audi A8L', licensePlate: 'AUD-5678', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v6', photo: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=200&h=150&fit=crop', name: 'Range Rover Vogue', licensePlate: 'RRV-3456', owner: 'Alexander Sterling', status: 'maintenance' },
  { id: 'v7', photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=150&fit=crop', name: 'Lexus LS', licensePlate: 'LEX-1234', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v8', photo: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=150&fit=crop', name: 'Cadillac CT6', licensePlate: 'CAD-5678', owner: 'Premium Rides Inc.', status: 'off-duty' },
  { id: 'v9', photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=150&fit=crop', name: 'Jaguar XJ', licensePlate: 'JAG-9012', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v10', photo: 'https://images.unsplash.com/photo-1571171637424-047fdc11e307?w=200&h=150&fit=crop', name: 'Maserati Quattroporte', licensePlate: 'MAS-3456', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v11', photo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=150&fit=crop', name: 'Bentley Flying Spur', licensePlate: 'BEN-7890', owner: 'Alexander Sterling', status: 'active' },
  { id: 'v12', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop', name: 'Rolls-Royce Ghost', licensePlate: 'RRG-5678', owner: 'Premium Rides Inc.', status: 'maintenance' },
  { id: 'v13', photo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=150&fit=crop', name: 'Mercedes-Benz E-Class', licensePlate: 'MBE-3456', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v14', photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=150&fit=crop', name: 'BMW 5 Series', licensePlate: 'BMW-1234', owner: 'Elena Rodriguez', status: 'off-duty' },
  { id: 'v15', photo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=150&fit=crop', name: 'Audi A6', licensePlate: 'AUD-3456', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v16', photo: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=150&fit=crop', name: 'Tesla Model S', licensePlate: 'TMS-9012', owner: 'Premium Rides Inc.', status: 'active' },
  { id: 'v17', photo: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=200&h=150&fit=crop', name: 'Range Rover Sport', licensePlate: 'RRS-7890', owner: 'Luxury Transport Co.', status: 'maintenance' },
  { id: 'v18', photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=150&fit=crop', name: 'Lexus ES', licensePlate: 'LEX-5678', owner: 'Alexander Sterling', status: 'active' },
  { id: 'v19', photo: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=150&fit=crop', name: 'Cadillac XT5', licensePlate: 'CAD-9012', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v20', photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=150&fit=crop', name: 'Jaguar F-PACE', licensePlate: 'JAG-1234', owner: 'Enterprise Logistics', status: 'off-duty' },
  { id: 'v21', photo: 'https://images.unsplash.com/photo-1571171637424-047fdc11e307?w=200&h=150&fit=crop', name: 'Maserati Levante', licensePlate: 'MAS-5678', owner: 'Premium Rides Inc.', status: 'active' },
  { id: 'v22', photo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=150&fit=crop', name: 'Bentley Bentayga', licensePlate: 'BEN-3456', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v23', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop', name: 'Rolls-Royce Cullinan', licensePlate: 'RRC-7890', owner: 'Alexander Sterling', status: 'maintenance' },
  { id: 'v24', photo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=150&fit=crop', name: 'Mercedes-Benz GLE', licensePlate: 'MBG-9012', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v25', photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=150&fit=crop', name: 'BMW X5', licensePlate: 'BMX-1234', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v26', photo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=150&fit=crop', name: 'Audi Q7', licensePlate: 'AUQ-5678', owner: 'Premium Rides Inc.', status: 'off-duty' },
  { id: 'v27', photo: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=150&fit=crop', name: 'Tesla Model X', licensePlate: 'TMX-3456', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v28', photo: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=200&h=150&fit=crop', name: 'Range Rover Velar', licensePlate: 'RRV-7890', owner: 'Alexander Sterling', status: 'maintenance' },
  { id: 'v29', photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=150&fit=crop', name: 'Lexus RX', licensePlate: 'LEXR-9012', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v30', photo: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=150&fit=crop', name: 'Cadillac Escalade', licensePlate: 'CADE-1234', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v31', photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=150&fit=crop', name: 'Jaguar I-PACE', licensePlate: 'JAGI-5678', owner: 'Premium Rides Inc.', status: 'off-duty' },
  { id: 'v32', photo: 'https://images.unsplash.com/photo-1571171637424-047fdc11e307?w=200&h=150&fit=crop', name: 'Maserati Ghibli', licensePlate: 'MASG-3456', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v33', photo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=150&fit=crop', name: 'Bentley Continental GT', licensePlate: 'BENC-7890', owner: 'Alexander Sterling', status: 'maintenance' },
  { id: 'v34', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop', name: 'Rolls-Royce Wraith', licensePlate: 'RRW-9012', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v35', photo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=150&fit=crop', name: 'Mercedes-Benz AMG GT', licensePlate: 'MBAM-1234', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v36', photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=150&fit=crop', name: 'BMW M8', licensePlate: 'BMWM-5678', owner: 'Premium Rides Inc.', status: 'off-duty' },
  { id: 'v37', photo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=150&fit=crop', name: 'Audi RS7', licensePlate: 'AURS-3456', owner: 'Luxury Transport Co.', status: 'active' },
  { id: 'v38', photo: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=150&fit=crop', name: 'Tesla Roadster', licensePlate: 'TMR-7890', owner: 'Alexander Sterling', status: 'maintenance' },
  { id: 'v39', photo: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=200&h=150&fit=crop', name: 'Range Rover Evoque', licensePlate: 'RRE-9012', owner: 'Elena Rodriguez', status: 'active' },
  { id: 'v40', photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=150&fit=crop', name: 'Lexus LC', licensePlate: 'LEXLC-1234', owner: 'Enterprise Logistics', status: 'active' },
  { id: 'v41', photo: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=150&fit=crop', name: 'Cadillac CT5', licensePlate: 'CADCT-5678', owner: 'Premium Rides Inc.', status: 'off-duty' },
  { id: 'v42', photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=150&fit=crop', name: 'Jaguar XE', licensePlate: 'JAGXE-3456', owner: 'Luxury Transport Co.', status: 'active' },
];

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VEHICLES));
      return SEED_VEHICLES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_VEHICLES;
  }
}

function writeAll(vehicles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch {
    /* noop */
  }
}

function makeId() {
  return `v${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getVehicles() {
  return readAll();
}

export function getVehicleById(id) {
  return readAll().find((v) => v.id === id) ?? null;
}

export function createVehicle(vehicleData) {
  const vehicles = readAll();
  const newVehicle = {
    id: makeId(),
    photo: vehicleData.photo || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
    name: vehicleData.name || 'Sin Nombre',
    licensePlate: vehicleData.licensePlate || 'XXX-XXXX',
    owner: vehicleData.owner || 'Sin Propietario',
    status: vehicleData.status || 'active',
    color: vehicleData.color || '',
    year: vehicleData.year || new Date().getFullYear(),
    category: vehicleData.category || '',
  };
  const updatedVehicles = [...vehicles, newVehicle];
  writeAll(updatedVehicles);
  return newVehicle;
}

export function updateVehicle(id, updates) {
  const vehicles = readAll();
  const updatedVehicles = vehicles.map((v) => v.id === id ? { ...v, ...updates } : v);
  writeAll(updatedVehicles);
  return updatedVehicles.find((v) => v.id === id);
}

export function deleteVehicle(id) {
  const vehicles = readAll();
  const updatedVehicles = vehicles.filter((v) => v.id !== id);
  writeAll(updatedVehicles);
  return true;
}