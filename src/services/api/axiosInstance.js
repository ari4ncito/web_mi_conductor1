import axios from "axios";

const API_BASE_URL =
    import.meta.env?.VITE_API_URL || "http://localhost:4000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

export default axiosInstance;
