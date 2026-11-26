import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },

    timeout: 45000,
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

// Reintento automático (1 vez) para consultas GET que sufran timeout o corte transitorio de red
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        const isGet = (config?.method || "").toLowerCase() === "get";
        const isTransient =
            error?.code === "ECONNABORTED" ||
            (!error?.response && error?.message === "Network Error");

        if (config && isGet && isTransient && !config._retried) {
            config._retried = true;
            await new Promise((resolve) => setTimeout(resolve, 800));
            return axiosInstance(config);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;