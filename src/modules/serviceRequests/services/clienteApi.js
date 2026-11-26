import axiosInstance from "../../../services/api/axiosInstance";

const clienteApi = {
    getAll: async () => {
        const response = await axiosInstance.get("/clientes/lista");
        return response.data;
    },

    getAllFull: async (params = { limit: 1000 }) => {
        const response = await axiosInstance.get("/clientes", { params });
        return response.data;
    },

    create: async (data) => {
        const response = await axiosInstance.post("/clientes", data);
        return response.data;
    },

    getRoles: async () => {
        const response = await axiosInstance.get("/roles");
        return response.data;
    }
};

export default clienteApi;
