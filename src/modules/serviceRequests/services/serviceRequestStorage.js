import solicitudApi from './solicitudApi.js';

// ── Mapeo de estados ──
const ESTADO_BACKEND_TO_FRONTEND = {
    'PENDIENTE': 'Pendiente',
    'EN_PROCESO': 'En Proceso',
    'COMPLETADO': 'Completado',
    'CANCELADO': 'Cancelado',
};

const ESTADO_FRONTEND_TO_BACKEND = {
    'Pendiente': 'PENDIENTE',
    'En Proceso': 'EN_PROCESO',
    'Completado': 'COMPLETADO',
    'Cancelado': 'CANCELADO',
};

// ── Mapeo de prioridades ──
const PRIORIDAD_BACKEND_TO_FRONTEND = {
    'BAJA': 'Baja',
    'MEDIA': 'Media',
    'ALTA': 'Alta',
    'URGENTE': 'Urgente',
};

const PRIORIDAD_FRONTEND_TO_BACKEND = {
    'Baja': 'BAJA',
    'Media': 'MEDIA',
    'Alta': 'ALTA',
    'Urgente': 'URGENTE',
};

// ── Helpers de transformación ──
function getClientName(cliente) {
    if (!cliente) return '';
    if (cliente.usuario) {
        return `${cliente.usuario.nombre || ''} ${cliente.usuario.apellido || ''}`.trim();
    }
    return cliente.nombre || '';
}

function getDriverName(conductor) {
    if (!conductor) return '';
    if (conductor.usuario) {
        return `${conductor.usuario.nombre || ''} ${conductor.usuario.apellido || ''}`.trim();
    }
    return conductor.nombre || '';
}

function getVehicleLabel(vehiculo) {
    if (!vehiculo) return '';
    return vehiculo.placa || vehiculo.modelo || vehiculo.marca || '';
}

export function mapSolicitudToFrontend(s) {
    if (!s) return null;
    return {
        id: s._id,
        code: s.codigo || '',
        client: getClientName(s.cliente),
        clientId: s.cliente?._id || '',
        clientEmail: s.correoCliente || '',
        driver: getDriverName(s.conductorAsignado),
        driverId: s.conductorAsignado?._id || '',
        vehicle: getVehicleLabel(s.vehiculo),
        vehicleId: s.vehiculo?._id || '',
        serviceType: s.tipoServicio || '',
        description: s.descripcion || '',
        origin: s.origen || '',
        destination: s.destino || '',
        scheduledDate: s.fechaProgramada
            ? new Date(s.fechaProgramada).toISOString().split('T')[0]
            : '',
        status: ESTADO_BACKEND_TO_FRONTEND[s.estado] || s.estado || 'Pendiente',
        priority: PRIORIDAD_BACKEND_TO_FRONTEND[s.prioridad] || s.prioridad || 'Media',
        createdBy: 'Admin',
        createdAt: s.createdAt
            ? new Date(s.createdAt).toISOString().split('T')[0]
            : '',
    };
}

export function mapRequestToBackend(form) {
    const payload = {
        codigo: form.code?.trim().toUpperCase(),
        cliente: form.clientId,
        correoCliente: form.clientEmail?.trim().toLowerCase(),
        tipoServicio: form.serviceType?.trim(),
        descripcion: form.description?.trim(),
        origen: form.origin?.trim(),
        destino: form.destination?.trim(),
        fechaProgramada: form.scheduledDate,
        prioridad: PRIORIDAD_FRONTEND_TO_BACKEND[form.priority] || 'MEDIA',
    };

    if (form.vehicleId) {
        payload.vehiculo = form.vehicleId;
    }

    if (form.status) {
        const estadoBackend = ESTADO_FRONTEND_TO_BACKEND[form.status];
        if (estadoBackend) payload.estado = estadoBackend;
    }

    return payload;
}

// ── API Functions (reemplazan localStorage) ──

export async function getServiceRequests() {
    const response = await solicitudApi.getAll();
    const solicitudes = response.data || response || [];
    return Array.isArray(solicitudes) ? solicitudes.map(mapSolicitudToFrontend) : [];
}

export async function getServiceRequestById(id) {
    const response = await solicitudApi.getById(id);
    const solicitud = response.data || response;
    return mapSolicitudToFrontend(solicitud);
}

export async function saveServiceRequest(form) {
    const payload = mapRequestToBackend(form);

    if (form.id) {
        await solicitudApi.update(form.id, payload);
    } else {
        await solicitudApi.create(payload);
    }

    // Refrescar lista completa desde el backend
    return getServiceRequests();
}

export async function deleteServiceRequest(id) {
    // El backend NO tiene endpoint DELETE físico.
    // Las solicitudes no se eliminan; usamos cancelar como alternativa.
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function assignDriver(solicitudId, driverId) {
    await solicitudApi.assignDriver(solicitudId, driverId);
    return getServiceRequests();
}

export async function cancelServiceRequest(id) {
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function completeServiceRequest(id) {
    await solicitudApi.complete(id);
    return getServiceRequests();
}

export function createEmptyServiceRequest() {
    const now = new Date();
    return {
        id: '',
        code: `SOL-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`,
        client: '',
        clientId: '',
        clientEmail: '',
        driver: '',
        driverId: '',
        vehicle: '',
        vehicleId: '',
        serviceType: 'Transporte Ejecutivo',
        description: '',
        origin: '',
        destination: '',
        scheduledDate: '',
        status: 'Pendiente',
        priority: 'Media',
        createdBy: 'Admin',
        createdAt: now.toISOString().split('T')[0],
    };
}