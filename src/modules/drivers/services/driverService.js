import axiosInstance from "../../../services/api/axiosInstance.js";
import endpoints from "../../../services/api/endpoints.js";

const driverService = {

    async getAll() {

        const response = await axiosInstance.get(
            endpoints.conductores.getAll
        );

        return response.data.data;
    },

    async getById(id) {

        const response = await axiosInstance.get(
            endpoints.conductores.getById(id)
        );

        return response.data.data;
    },

    async getByUsuario(usuarioId) {

        const response = await axiosInstance.get(
            endpoints.conductores.getByUsuario(usuarioId)
        );

        return response.data.data;
    },

    async getDisponibles() {

        const response = await axiosInstance.get(
            endpoints.conductores.getDisponibles
        );

        return response.data.data;
    },

    async create(datos) {

        const response = await axiosInstance.post(
            endpoints.conductores.create,
            datos
        );

        return response.data.data;
    },

    async update(id, datos) {

        const response = await axiosInstance.put(
            endpoints.conductores.update(id),
            datos
        );

        return response.data.data;
    },

    async delete(id) {

        const response = await axiosInstance.delete(
            endpoints.conductores.delete(id)
        );

        return response.data;
    },

    async updateDisponibilidad(id, disponible) {

        const response = await axiosInstance.patch(
            endpoints.conductores.updateDisponibilidad(id),
            {
                disponible
            }
        );

        return response.data.data;
    },

    async updateLicencia(id, datos) {

        const response = await axiosInstance.patch(
            endpoints.conductores.updateLicencia(id),
            datos
        );

        return response.data.data;
    }
};

export default driverService;