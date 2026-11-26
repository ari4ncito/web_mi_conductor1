import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const conductorApi = {
    getAll: async (params = { limit: 1000 }) => {
        const response = await axiosInstance.get(endpoints.conductores.getAll, { params });
        return response.data;
    },
};

export default conductorApi;