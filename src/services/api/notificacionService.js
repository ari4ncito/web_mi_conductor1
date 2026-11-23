// src/services/api/notificacionService.js

import axiosInstance from "./axiosInstance";
import endpoints from "./endpoints";

class NotificacionService {
    /**
     * Consulta las notificaciones del usuario autenticado.
     * @param {Object} params - { page, limit, leida }
     */
    async getAll(params = {}) {
        const response = await axiosInstance.get(
            endpoints.notificaciones.getAll,
            { params }
        );
        return response.data;
    }

    /**
     * Consulta el contador de notificaciones no leídas.
     */
    async getUnreadCount() {
        const response = await axiosInstance.get(
            endpoints.notificaciones.getUnreadCount
        );
        return response.data;
    }

    /**
     * Marca una notificación específica como leída.
     * @param {string} id - ID de la notificación
     */
    async markAsRead(id) {
        const response = await axiosInstance.patch(
            endpoints.notificaciones.markAsRead(id)
        );
        return response.data;
    }

    /**
     * Marca todas las notificaciones del usuario como leídas.
     */
    async markAllAsRead() {
        const response = await axiosInstance.patch(
            endpoints.notificaciones.markAllAsRead
        );
        return response.data;
    }

    /**
     * Registra un token de dispositivo para notificaciones push (opcional FCM).
     */
    async registerDevice(datos) {
        const response = await axiosInstance.post(
            endpoints.notificaciones.registerDevice,
            datos
        );
        return response.data;
    }

    /**
     * Desvincula un token de dispositivo (opcional FCM).
     */
    async removeDevice(token) {
        const response = await axiosInstance.delete(
            endpoints.notificaciones.removeDevice,
            { data: { token } }
        );
        return response.data;
    }
}

export default new NotificacionService();

