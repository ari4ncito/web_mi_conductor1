import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const vehiculoApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.vehiculos.getAll);
        return response.data;
    },
};

export default vehiculoApi;