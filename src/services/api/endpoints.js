const endpoints = {
    auth: {
        login: "/auth/login",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password"
    },
    roles: {
        getAll: "/roles",
        getById: (id) => `/roles/${id}`,
        create: "/roles",
        update: (id) => `/roles/${id}`,
        delete: (id) => `/roles/${id}`
    },
    permisos: {
        getAll: "/permisos",
        getById: (id) => `/permisos/${id}`,
        create: "/permisos",
        update: (id) => `/permisos/${id}`,
        delete: (id) => `/permisos/${id}`
    },
    clientes: {
        getAll: "/clientes",
        getById: (id) => `/clientes/${id}`,
        create: "/clientes",
        update: (id) => `/clientes/${id}`,
        delete: (id) => `/clientes/${id}`
    },
    usuarios: {
        getAll: "/usuarios",
        getById: (id) => `/usuarios/${id}`,
        create: "/usuarios",
        update: (id) => `/usuarios/${id}`,
        delete: (id) => `/usuarios/${id}`
    },
    conductores: {
        getAll: "/conductores",
        getById: (id) => `/conductores/${id}`,
        getByUsuario: (usuarioId) => `/conductores/usuario/${usuarioId}`,
        getDisponibles: "/conductores/disponibles",
        create: "/conductores",
        update: (id) => `/conductores/${id}`,
        delete: (id) => `/conductores/${id}`,
        updateDisponibilidad: (id) => `/conductores/${id}/disponibilidad`,
        updateLicencia: (id) => `/conductores/${id}/licencia`
    },
    vehiculos: {
        getAll: "/vehiculos"
    },
    // Parte de solicitud
    solicitudes: {
        getAll: "/solicitudes",
        getById: (id) => `/solicitudes/${id}`,
        create: "/solicitudes",
        update: (id) => `/solicitudes/${id}`,
        assignDriver: (id) => `/solicitudes/${id}/asignar-conductor`,
        cancel: (id) => `/solicitudes/${id}/cancelar`,
        complete: (id) => `/solicitudes/${id}/completar`
    }
};

export default endpoints;