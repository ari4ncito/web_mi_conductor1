import axios from "axios";

const API_URL = "http://localhost:3000/api/vehiculos";

class VehiculoService {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
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

  // Borrado lógico
  async delete(id) {
    const response = await axios.put(`${API_URL}/${id}`, { estado: false });
    return response.data;
  }
}

export default new VehiculoService();
