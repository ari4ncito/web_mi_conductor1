import axios from "axios";

const API_URL = "http://localhost:3000/api/vehiculos";

class VehiculoService {
  async getAll(params = {}) {
    const response = await axios.get(API_URL, { params });
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getByCliente(clienteId) {
    const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
    return response.data;
  }

  async verificarPlaca(placa) {
    const response = await axios.get(`${API_URL}/verificar-placa/${encodeURIComponent(placa.trim().toUpperCase())}`);
    return response.data;
  }

  async cambiarEstado(id, { estadoVehiculo, motivo }) {
    const response = await axios.patch(`${API_URL}/${id}/estado`, {
      estadoVehiculo,
      motivo
    });
    return response.data;
  }

  async create(data) {
    const response = await axios.post(API_URL, data);
    return response.data;
  }

  async update(id, data) {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export default new VehiculoService();
