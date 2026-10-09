// modules/roles/services/roleService.js

import axiosInstance from "../../../services/api/axiosInstance";
import endpoints from "../../../services/api/endpoints";

class RoleService {

    async getAll() {

        const response = await axiosInstance.get(
            endpoints.roles.getAll
        );

        return response.data;
    }


    async getById(id) {

        const response = await axiosInstance.get(
            endpoints.roles.getById(id)
        );

        return response.data;
    }


    async create(datos) {

        const response = await axiosInstance.post(
            endpoints.roles.create,
            datos
        );

        return response.data;
    }


    async update(id, datos) {

        const response = await axiosInstance.put(
            endpoints.roles.update(id),
            datos
        );

        return response.data;
    }


    async delete(id) {

        const response = await axiosInstance.delete(
            endpoints.roles.delete(id)
        );

        return response.data;
    }

}

export default new RoleService();