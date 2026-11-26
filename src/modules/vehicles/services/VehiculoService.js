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

  // excluirId: id del vehículo en edición para no detectarse a sí mismo como duplicado
  async verificarPlaca(placa, excluirId) {
    const params = excluirId ? { excluirId } : undefined;
    const placaLimpia = String(placa).replace(/[\s-]/g, "").toUpperCase();
    const response = await axiosInstance.get(`${BASE_PATH}/verificar-placa/${encodeURIComponent(placaLimpia)}`, { params });
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
