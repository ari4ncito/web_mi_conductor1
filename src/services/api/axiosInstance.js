import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Primero buscamos el token permanente
        // y si no existe, buscamos el temporal.
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        // Si existe token, lo enviamos al backend
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;