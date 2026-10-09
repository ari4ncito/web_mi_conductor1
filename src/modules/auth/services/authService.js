import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class AuthService {

    async login(datos) {

        const response = await axiosInstance.post(
            endpoints.auth.login,
            datos
        );

        return response.data;
    }


    async register(datos) {

        const response = await axiosInstance.post(
            endpoints.auth.clientes.create,
            datos
        );

        return response.data;
    }


    async forgotPassword(correo) {

        const response = await axiosInstance.post(
            endpoints.auth.forgotPassword,
            {
                correo
            }
        );

        return response.data;
    }


    async resetPassword(datos) {

        const response = await axiosInstance.post(
            endpoints.auth.resetPassword,
            datos
        );

        return response.data;
    }

}

export default new AuthService();