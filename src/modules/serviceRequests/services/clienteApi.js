import axiosInstance from "../../../services/api/axiosInstance";

const clienteApi = {
    getAll: async () => {
        const response = await axiosInstance.get("/clientes/lista");
        return response.data;
    }
};

export default clienteApi;