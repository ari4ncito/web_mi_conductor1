import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class ClienteService {
    async getAll() {
        const response = await axiosInstance.get(endpoints.clientes.getAll);
        return response.data;
    }

    async getById(id) {
        const response = await axiosInstance.get(endpoints.clientes.getById(id));
        return response.data;
    }

    async create(data) {
        const response = await axiosInstance.post(endpoints.clientes.create, data);
        return response.data;
    }

    async update(id, data) {
        const response = await axiosInstance.put(endpoints.clientes.update(id), data);
        return response.data;
    }

    async delete(id) {
        const response = await axiosInstance.delete(endpoints.clientes.delete(id));
        return response.data;
    }
}

export default new ClienteService();
