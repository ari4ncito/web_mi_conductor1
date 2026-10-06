import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const clienteApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.clientes.getAll);
        return response.data;
    },
};

export default clienteApi;