
import solicitudApi from "./solicitudApi.js";

const ESTADO_BACKEND_TO_FRONTEND = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En Proceso",
    COMPLETADO: "Completado",
    CANCELADO: "Cancelado"
};

const PRIORIDAD_BACKEND_TO_FRONTEND = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    URGENTE: "Urgente"
};

const PRIORIDAD_FRONTEND_TO_BACKEND = {
    Baja: "BAJA",
    Media: "MEDIA",
    Alta: "ALTA",
    Urgente: "URGENTE"
};

function obtenerDatosRespuesta(response) {
    return response?.data ?? response;
}

function obtenerListaRespuesta(response) {
    const data = obtenerDatosRespuesta(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.solicitudes)) return data.solicitudes;

    return [];
}

function getClientName(cliente) {
    if (!cliente) return "";

    if (cliente.usuario) {
        return `${cliente.usuario.nombre || ""} ${cliente.usuario.apellido || ""}`.trim();
    }

    return cliente.nombre || "";
}

function getDriverName(conductor) {
    if (!conductor) return "";

    if (conductor.usuario) {
        return `${conductor.usuario.nombre || ""} ${conductor.usuario.apellido || ""}`.trim();
    }

    return conductor.nombre || "";
}

function getVehicleLabel(vehiculo) {
    if (!vehiculo) return "";

    return [
        vehiculo.placa,
        vehiculo.marca,
        vehiculo.modelo
    ].filter(Boolean).join(" ");
}

export function mapSolicitudToFrontend(solicitud) {
    if (!solicitud) return null;

    return {
        id: solicitud._id,
        code: solicitud.codigo || "",
        client: getClientName(solicitud.cliente),
        clientId: solicitud.cliente?._id || solicitud.cliente || "",
        clientEmail: solicitud.correoCliente || "",
        driver: getDriverName(solicitud.conductorAsignado),
        driverId:
            solicitud.conductorAsignado?._id ||
            solicitud.conductorAsignado ||
            "",
        vehicle: getVehicleLabel(solicitud.vehiculo),
        vehicleId: solicitud.vehiculo?._id || solicitud.vehiculo || "",
        serviceType: solicitud.tipoServicio || "",
        description: solicitud.descripcion || "",
        origin: solicitud.origen || "",
        destination: solicitud.destino || "",
        scheduledDate: solicitud.fechaProgramada || "",
        status:
            ESTADO_BACKEND_TO_FRONTEND[solicitud.estado] ||
            solicitud.estado ||
            "Pendiente",
        priority:
            PRIORIDAD_BACKEND_TO_FRONTEND[solicitud.prioridad] ||
            solicitud.prioridad ||
            "Media",
        createdBy: "Admin",
        createdAt: solicitud.createdAt || ""
    };
}

export function mapRequestToBackend(form) {
    const payload = {
        cliente: form.clientId,
        correoCliente: form.clientEmail?.trim().toLowerCase(),
        tipoServicio: form.serviceType?.trim(),
        descripcion: form.description?.trim(),
        origen: form.origin?.trim(),
        destino: form.destination?.trim(),
        prioridad:
            PRIORIDAD_FRONTEND_TO_BACKEND[form.priority] || "MEDIA"
    };

    if (form.driverId) {
        payload.conductorAsignado = form.driverId;
    }

    if (form.vehicleId) {
        payload.vehiculo = form.vehicleId;
    }

    // El backend genera el código y la fecha programada.
    // El estado también lo determina el backend.
    return payload;
}

export async function getServiceRequests() {
    const response = await solicitudApi.getAll();
    const solicitudes = obtenerListaRespuesta(response);

    return solicitudes
        .map(mapSolicitudToFrontend)
        .filter(Boolean);
}

export async function getServiceRequestById(id) {
    const response = await solicitudApi.getById(id);
    const solicitud = obtenerDatosRespuesta(response);

    return mapSolicitudToFrontend(solicitud);
}

export async function saveServiceRequest(form) {
    const payload = mapRequestToBackend(form);

    if (form.id) {
        await solicitudApi.update(form.id, payload);
    } else {
        await solicitudApi.create(payload);
    }

    return getServiceRequests();
}

export async function deleteServiceRequest(id) {
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
    return {
        id: "",
        code: "",
        client: "",
        clientId: "",
        clientEmail: "",
        driver: "",
        driverId: "",
        vehicle: "",
        vehicleId: "",
        serviceType: "Transporte Ejecutivo",
        description: "",
        origin: "",
        destination: "",
        scheduledDate: "",
        status: "Pendiente",
        priority: "Media",
        createdBy: "Admin",
        createdAt: ""
    };
}
