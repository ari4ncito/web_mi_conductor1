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
        const url = endpoints.auth.register || endpoints.clientes.create;
        const response = await axiosInstance.post(
            url,
            datos
        );

        return response.data;
    }


    async checkEmail(correo, signal) {
        const response = await axiosInstance.get(
            endpoints.auth.checkEmail,
            {
                params: { correo },
                signal
            }
        );

        return response.data;
    }


    async checkDocument(documento, signal, tipoDocumento) {
        const params = { documento };
        if (tipoDocumento) {
            params.tipoDocumento = tipoDocumento;
        }

        const response = await axiosInstance.get(
            endpoints.auth.checkDocument,
            {
                params,
                signal
            }
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
