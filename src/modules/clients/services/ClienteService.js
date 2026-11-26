import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class ClienteService {
    async getAll(params = { limit: 100 }) {
        const response = await axiosInstance.get(endpoints.clientes.getAll, { params });
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

    // excluirId: id del usuario en edición para no detectarse a sí mismo como duplicado
    async verificarDocumento(documento, excluirId) {
        const params = excluirId ? { excluirId } : undefined;
        const response = await axiosInstance.get(endpoints.clientes.verificarDocumento(documento), { params });
        return response.data;
    }

    async verificarCorreo(correo, excluirId) {
        const params = excluirId ? { excluirId } : undefined;
        const response = await axiosInstance.get(
            endpoints.clientes.verificarCorreo(String(correo).trim().toLowerCase()),
            { params }
        );
        return response.data;
    }
}

export default new ClienteService();
