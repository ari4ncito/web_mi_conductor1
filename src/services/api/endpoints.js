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
        getById: (id) => `/roles/${id}`,
        create: "/roles",
        update: (id) => `/roles/${id}`,
        delete: (id) => `/roles/${id}`,
    },

    permisos: {
        getAll: "/permisos",
        getById: (id) => `/permisos/${id}`,
        create: "/permisos",
        update: (id) => `/permisos/${id}`,
        delete: (id) => `/permisos/${id}`,
    },

    usuarios: {
        getAll: "/usuarios",
        getById: (id) => `/usuarios/${id}`,
        create: "/usuarios",
        update: (id) => `/usuarios/${id}`,
        delete: (id) => `/usuarios/${id}`,
    },
};

export default endpoints;