import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },

    timeout: 30000,
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