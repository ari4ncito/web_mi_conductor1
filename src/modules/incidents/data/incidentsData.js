import axiosInstance from "../../../services/api/axiosInstance.js";

const BASE_URL = "/novedades";

// Normaliza la respuesta del backend para obtener una lista de novedades.
function obtenerLista(response) {
    let resultado = response?.data?.data ?? response?.data ?? [];

    // Algunas respuestas pueden incluir la lista dentro de otra propiedad.
    if (!Array.isArray(resultado)) {
        if (Array.isArray(resultado?.novedades)) {
            resultado = resultado.novedades;
        } else if (Array.isArray(resultado?.rows)) {
            resultado = resultado.rows;
        } else if (Array.isArray(resultado?.data)) {
            resultado = resultado.data;
        } else {
            resultado = [];
        }
    }

    return resultado;
}

// Conserva la extracción de datos individuales del backend.
function obtenerRespuesta(response) {
    return response.data?.data ?? response.data;
}

// Exportación compatible con el Dashboard:
// incidentsData.filter(...) funcionará porque incidentsData es un arreglo.
const incidentsData = [];

const incidentMethods = {
    async getAll() {
        const response = await axiosInstance.get(BASE_URL);
        return obtenerLista(response);
    },

    async getById(id) {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return obtenerRespuesta(response);
    },

    async getBySolicitud(solicitudId) {
        const response = await axiosInstance.get(
            `${BASE_URL}/solicitud/${solicitudId}`
        );
        return obtenerLista(response);
    },

    async getByConductor(conductorId) {
        const response = await axiosInstance.get(
            `${BASE_URL}/conductor/${conductorId}`
        );
        return obtenerLista(response);
    },

    async updateEstado(id, estadoNovedad, observaciones) {
        const payload = { estadoNovedad };

        if (observaciones?.trim()) {
            payload.observaciones = observaciones.trim();
        }

        const response = await axiosInstance.patch(
            `${BASE_URL}/${id}/estado`,
            payload
        );

        return obtenerRespuesta(response);
    },

    async update(id, datos) {
        const response = await axiosInstance.put(
            `${BASE_URL}/${id}`,
            datos
        );

        return obtenerRespuesta(response);
    },
};

// Agrega los métodos al arreglo sin perder la compatibilidad con .filter().
Object.assign(incidentsData, incidentMethods);

export default incidentsData;