import axiosInstance from "../../../services/api/axiosInstance";

class VehiculoService {
  async getAll() {
    const response = await axiosInstance.get("/vehiculos");
    return response.data;
  }

  async getById(id) {
    const response = await axiosInstance.get(`/vehiculos/${id}`);
    return response.data;
  }

  async getByCliente(clienteId) {
    const response = await axiosInstance.get(`/vehiculos/cliente/${clienteId}`);
    return response.data;
  }

  async create(data) {
    const response = await axiosInstance.post("/vehiculos", data);
    return response.data;
  }

  async update(id, data) {
    const response = await axiosInstance.put(`/vehiculos/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await axiosInstance.delete(`/vehiculos/${id}`);
    return response.data;
  }
}

export default new VehiculoService();
