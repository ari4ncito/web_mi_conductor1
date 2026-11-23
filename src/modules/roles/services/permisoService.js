// modules/roles/services/permisoService.js

import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class PermisoService {

    async getAll() {

        const response = await axiosInstance.get(
            endpoints.permisos.getAll
        );

        return response.data;
    }


    async getById(id) {

        const response = await axiosInstance.get(
            `/permisos/${id}`
        );

        return response.data;
    }


    async create(datos) {

        const response = await axiosInstance.post(
            endpoints.permisos.create,
            datos
        );

        return response.data;
    }


    async update(id, datos) {

        const response = await axiosInstance.put(
            endpoints.permisos.update(id),
            datos
        );

        return response.data;
    }


    async delete(id) {

        const response = await axiosInstance.delete(
            endpoints.permisos.delete(id)
        );

        return response.data;
    }

}

export default new PermisoService();