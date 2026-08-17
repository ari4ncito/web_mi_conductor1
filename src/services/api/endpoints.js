const endpoints = {
    auth: {
        login: "/auth/login",

        clientes: {
            create: "/clientes"
        },

        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password"
    },

    roles: {
        getAll: "/roles",
        create: "/roles",
        update: (id) => `/roles/${id}`,
        delete: (id) => `/roles/${id}`,
    },

    permisos: {
        getAll: "/permisos",
        create: "/permisos",
        update: (id) => `/permisos/${id}`,
        delete: (id) => `/permisos/${id}`,
    },
};

export default endpoints;