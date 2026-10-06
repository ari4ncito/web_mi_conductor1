import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const solicitudApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.solicitudes.getAll);
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(endpoints.solicitudes.getById(id));
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post(endpoints.solicitudes.create, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(endpoints.solicitudes.update(id), data);
        return response.data;
    },
    assignDriver: async (id, conductorId) => {
        const response = await axiosInstance.patch(
            endpoints.solicitudes.assignDriver(id),
            { conductorAsignado: conductorId }
        );
        return response.data;
    },
    cancel: async (id) => {
        const response = await axiosInstance.patch(endpoints.solicitudes.cancel(id));
        return response.data;
    },
    complete: async (id) => {
        const response = await axiosInstance.patch(endpoints.solicitudes.complete(id));
        return response.data;
    },
};

export default solicitudApi;