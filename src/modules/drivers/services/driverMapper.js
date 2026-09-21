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