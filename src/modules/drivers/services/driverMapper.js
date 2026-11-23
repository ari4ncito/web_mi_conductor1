const formatDate = (date) => {

    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toISOString().split("T")[0];
};


const getLicenseStatus = (date) => {

    if (!date) {
        return "Unknown";
    }

    const today = new Date();
    const expiration = new Date(date);

    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    return expiration < today
        ? "Expired"
        : "Valid";
};


export const mapDriverFromBackend = (conductor) => {

    const usuario = conductor?.usuario || {};

    const nombreCompleto = [
        usuario.nombre,
        usuario.apellido
    ]
        .filter(Boolean)
        .join(" ");

    return {
        id: conductor._id,

        name: nombreCompleto,

        firstName: usuario.nombre || "",
        lastName: usuario.apellido || "",

        idNumber: usuario.documento || "",
        documentType: usuario.tipoDocumento || "CC",

        email: usuario.correo || "",
        phone: usuario.telefono || "",

        license: conductor.licencia || "",

        licenseCategory:
            conductor.categoriaLicencia || "",

        licenseIssueDate:
            formatDate(conductor.fechaExpedicion),

        licenseExpiry:
            formatDate(conductor.fechaVencimiento),

        licenseStatus:
            getLicenseStatus(
                conductor.fechaVencimiento
            ),

        licencias: Array.isArray(conductor.licencias) && conductor.licencias.length > 0
            ? conductor.licencias.map((l) => ({
                numero: l.numero || l.licencia || "",
                categoria: (l.categoria || l.categoriaLicencia || "").toUpperCase(),
                fechaExpedicion: formatDate(l.fechaExpedicion),
                fechaVencimiento: formatDate(l.fechaVencimiento),
                lugarExpedicion: l.lugarExpedicion || "",
                status: getLicenseStatus(l.fechaVencimiento),
              }))
            : conductor.licencia
              ? [{
                  numero: conductor.licencia,
                  categoria: (conductor.categoriaLicencia || "").toUpperCase(),
                  fechaExpedicion: formatDate(conductor.fechaExpedicion),
                  fechaVencimiento: formatDate(conductor.fechaVencimiento),
                  lugarExpedicion: "",
                  status: getLicenseStatus(conductor.fechaVencimiento),
                }]
              : [],

        experience:
            conductor.experiencia ?? 0,

        available:
            conductor.disponible ?? false,

        currentState:
            conductor.disponible
                ? "available"
                : "off-duty",

        // Estos campos todavía no existen en el backend
        performance: null,
        trips: 0,
        photo: "",
        emergencyPhone: "",
        location: "",
        licensePlaceOfIssue: "",

        backendData: conductor
    };
};