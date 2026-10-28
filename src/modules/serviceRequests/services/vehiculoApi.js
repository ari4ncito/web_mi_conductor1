import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

const vehiculoApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.vehiculos.getAll);
        return response.data;
    },

    getByCliente: async (clienteId) => {
        if (!clienteId) {
            return [];
        }

        const response = await axiosInstance.get(
            `/vehiculos/cliente/${clienteId}`
        );

        return response.data;
    },

    create: async (data) => {
        const response = await axiosInstance.post(
            endpoints.vehiculos.getAll,
            data
        );
        return response.data;
    }
};

export default vehiculoApi;