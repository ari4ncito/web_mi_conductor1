import * as XLSX from "xlsx";

/**
 * Genera y descarga un reporte en formato Excel (.xlsx) con el listado
 * filtrado o total de usuarios administrativos, excluyendo cualquier dato sensible.
 *
 * @param {Array} users - Listado de usuarios a exportar
 * @param {string} [filename] - Nombre opcional para el archivo descargado
 */
export function exportUsersToExcel(users = [], filename = "Reporte_Usuarios_MiConductor.xlsx") {
  if (!users || users.length === 0) {
    throw new Error("No hay usuarios para exportar.");
  }

  const dataRows = users.map((u, index) => {
    const nombreCompleto =
      u.nombreCompleto ||
      `${u.nombre || ""} ${u.apellido || ""}`.trim() ||
      "Sin registrar";

    const rolNombre =
      typeof u.rol === "string"
        ? u.rol
        : u.rol?.nombre || u.rol?.name || u.rol?.slug || "Sin rol";

    const fechaCreacion = u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "No disponible";

    const fechaNacimiento = u.fechaNacimiento
      ? new Date(u.fechaNacimiento).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        })
      : "No registrada";

    return {
      "N°": index + 1,
      "Tipo de documento": u.tipoDocumento || "CC",
      "Número de documento": u.documento || "No registrado",
      "Nombre completo": nombreCompleto,
      "Correo electrónico": u.correo || "",
      "Teléfono": u.telefono || "No registrado",
      "Fecha de nacimiento": fechaNacimiento,
      "Edad": u.edad !== undefined && u.edad !== null ? `${u.edad} años` : "No registrada",
      "Rol": rolNombre,
      "Estado de cuenta": u.estado ? "Activo" : "Inactivo",
      "Activación por correo": u.isActivated ? "Activada" : "Pendiente de activación",
      "Fecha de registro": fechaCreacion,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  // Ajuste de ancho de columnas
  const colWidths = [
    { wch: 5 },  // N°
    { wch: 18 }, // Tipo documento
    { wch: 22 }, // Documento
    { wch: 30 }, // Nombre completo
    { wch: 32 }, // Correo
    { wch: 16 }, // Teléfono
    { wch: 20 }, // Fecha nacimiento
    { wch: 10 }, // Edad
    { wch: 18 }, // Rol
    { wch: 18 }, // Estado
    { wch: 24 }, // Activación
    { wch: 22 }, // Fecha registro
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

  XLSX.writeFile(workbook, filename);
}

