import axiosInstance from "../../../services/api/axiosInstance.js";

const BASE_PATH = "/vehiculos";

class VehiculoService {
  async getAll(params = {}) {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  }

  async getById(id) {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  }

  async getByCliente(clienteId) {
    const response = await axiosInstance.get(`${BASE_PATH}/cliente/${clienteId}`);
    return response.data;
  }

  async verificarPlaca(placa) {
    const response = await axiosInstance.get(`${BASE_PATH}/verificar-placa/${encodeURIComponent(placa.trim().toUpperCase())}`);
    return response.data;
  }

  async cambiarEstado(id, { estadoVehiculo, motivo }) {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}/estado`, {
      estadoVehiculo,
      motivo
    });
    return response.data;
  }

  async create(data) {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  }

  async update(id, data) {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await axiosInstance.delete(`${BASE_PATH}/${id}`);
    return response.data;
  }
}

export default new VehiculoService();
