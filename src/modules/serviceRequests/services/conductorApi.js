import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const conductorApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.conductores.getAll);
        return response.data;
    },
};

export default conductorApi;