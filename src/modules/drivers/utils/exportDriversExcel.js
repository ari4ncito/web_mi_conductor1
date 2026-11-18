import * as XLSX from "xlsx";

/**
 * Calcula la antigüedad en meses y años a partir de una fecha de registro.
 */
function calcularAntiguedad(fechaCreacion) {
  if (!fechaCreacion) return "No disponible";
  const inicio = new Date(fechaCreacion);
  if (isNaN(inicio.getTime())) return "No disponible";
  const hoy = new Date();

  let anios = hoy.getFullYear() - inicio.getFullYear();
  let meses = hoy.getMonth() - inicio.getMonth();
  if (meses < 0) {
    anios--;
    meses += 12;
  }

  if (anios === 0 && meses === 0) {
    const dias = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    return dias <= 1 ? "Reciente (hoy)" : `${dias} días`;
  }
  if (anios === 0) {
    return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  }
  return `${anios} ${anios === 1 ? "año" : "años"}${meses > 0 ? ` y ${meses} m` : ""}`;
}

/**
 * Genera y descarga un archivo Excel real (.xlsx) con los datos de los conductores.
 * Excluye contraseñas, tokens y cualquier dato sensible de autenticación.
 *
 * @param {Array} drivers - Listado de conductores (filtrado o total)
 * @param {string} [filename] - Nombre de descarga del archivo
 */
export function exportDriversToExcel(drivers = [], filename = "Reporte_Conductores_MiConductor.xlsx") {
  if (!drivers || drivers.length === 0) {
    throw new Error("No hay conductores para exportar.");
  }

  const rows = drivers.map((d, index) => {
    const usuario = d.usuario || {};

    const nombreCompleto =
      usuario.nombreCompleto ||
      `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() ||
      d.nombreCompleto ||
      "Sin registrar";

    // Categorías de licencia
    let categoriasTexto = "N/A";
    if (Array.isArray(d.categoriasLicencia) && d.categoriasLicencia.length > 0) {
      categoriasTexto = d.categoriasLicencia.join(", ");
    } else if (d.categoriaLicencia) {
      categoriasTexto = d.categoriaLicencia;
    }

    const fechaExpedicion = d.fechaExpedicion
      ? new Date(d.fechaExpedicion).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        })
      : "No registrada";

    const fechaVencimiento = d.fechaVencimiento
      ? new Date(d.fechaVencimiento).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        })
      : "No registrada";

    // Estado de la licencia
    let estadoLicencia = "SIN DATOS";
    if (d.fechaVencimiento) {
      const venc = new Date(d.fechaVencimiento);
      const hoy = new Date();
      estadoLicencia = venc < hoy ? "VENCIDA" : "VÁLIDA";
    }

    const fechaRegistro = d.createdAt
      ? new Date(d.createdAt).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "No disponible";

    const antiguedad = calcularAntiguedad(d.createdAt);

    return {
      "N°": index + 1,
      "Tipo de documento": usuario.tipoDocumento || d.tipoDocumento || "CC",
      "Número de documento": usuario.documento || d.documento || "No registrado",
      "Nombre completo": nombreCompleto,
      "Correo electrónico": usuario.correo || d.correo || "No registrado",
      "Teléfono": usuario.telefono || d.telefono || "No registrado",
      "Número de licencia": d.licencia || "No registrada",
      "Categorías de licencia": categoriasTexto,
      "Fecha de expedición": fechaExpedicion,
      "Fecha de vencimiento": fechaVencimiento,
      "Estado de licencia": estadoLicencia,
      "Experiencia profesional declarada":
        d.experiencia !== undefined && d.experiencia !== null
          ? `${d.experiencia} años`
          : "0 años",
      "Antigüedad en Mi Conductor": antiguedad,
      "Disponibilidad operativa": d.disponible ? "Disponible" : "Fuera de servicio",
      "Estado administrativo": d.estadoConductor || (d.estado ? "ACTIVO" : "INACTIVO"),
      "Fecha de registro": fechaRegistro,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 5 },  // N°
    { wch: 18 }, // Tipo documento
    { wch: 22 }, // Documento
    { wch: 30 }, // Nombre completo
    { wch: 32 }, // Correo
    { wch: 16 }, // Teléfono
    { wch: 22 }, // Licencia
    { wch: 22 }, // Categorías
    { wch: 18 }, // Fecha expedición
    { wch: 18 }, // Fecha vencimiento
    { wch: 18 }, // Estado licencia
    { wch: 30 }, // Experiencia declarada
    { wch: 24 }, // Antigüedad
    { wch: 24 }, // Disponibilidad
    { wch: 22 }, // Estado administrativo
    { wch: 22 }, // Fecha registro
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Conductores");
  XLSX.writeFile(workbook, filename);
}

