import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class UsuarioService {
    async getAll() {
        const response = await axiosInstance.get(
            endpoints.usuarios.getAll
        );

        return response.data;
    }

    async getById(id) {
        const response = await axiosInstance.get(
            endpoints.usuarios.getById(id)
        );

        return response.data;
    }

    async create(data) {
        const response = await axiosInstance.post(
            endpoints.usuarios.create,
            data
        );

        return response.data;
    }

    async update(id, data) {
        const response = await axiosInstance.put(
            endpoints.usuarios.update(id),
            data
        );

        return response.data;
    }

    async delete(id) {
        const response = await axiosInstance.delete(
            endpoints.usuarios.delete(id)
        );

        return response.data;
    }
}

export default new UsuarioService();