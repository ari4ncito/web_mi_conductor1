import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class UsuarioService {

    async getAll() {

        const response = await axiosInstance.get(
            endpoints.usuarios.getAll
        );

        return response.data;
    }

}

export default new UsuarioService();