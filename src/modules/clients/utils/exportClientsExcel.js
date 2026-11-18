import * as XLSX from "xlsx";

/**
 * Genera y descarga un reporte en formato Excel (.xlsx) con el listado
 * filtrado o total de clientes de Mi Conductor.
 *
 * @param {Array} clients - Listado de clientes a exportar
 * @param {string} [filename] - Nombre del archivo a descargar
 */
export function exportClientsExcel(clients = [], filename = "Reporte_Clientes_MiConductor.xlsx") {
  if (!clients || clients.length === 0) {
    throw new Error("No hay clientes para exportar.");
  }

  const dataRows = clients.map((c, index) => {
    const usuario = c?.usuario || {};
    const nombre = c?.nombre || usuario.nombre || "";
    const apellido = c?.apellido || usuario.apellido || "";
    const nombreCompleto = `${nombre} ${apellido}`.trim() || "Sin registrar";

    const tipoDoc = c?.tipoDocumento || usuario.tipoDocumento || "CC";
    const numDoc = c?.documento || usuario.documento || "No registrado";
    const correo = c?.correo || usuario.correo || "No registrado";
    const telefono = c?.telefono || usuario.telefono || "No registrado";
    const direccion = c?.direccion || "No registrada";
    const totalVehiculos = Array.isArray(c?.vehiculos) ? c.vehiculos.length : 0;
    const totalServicios = c?.serviciosCount ?? c?.servicios?.length ?? c?.totalServicios ?? 0;

    const clienteActivo =
      c.estado !== false &&
      (usuario.estado !== undefined ? usuario.estado !== false : true);

    const fechaRegistro = c.createdAt || usuario.createdAt
      ? new Date(c.createdAt || usuario.createdAt).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "No disponible";

    return {
      "N°": index + 1,
      "Tipo de documento": tipoDoc,
      "Número de documento": numDoc,
      "Nombre completo": nombreCompleto,
      "Correo electrónico": correo,
      "Teléfono": telefono,
      "Dirección": direccion,
      "Vehículos registrados": totalVehiculos,
      "Servicios solicitados": totalServicios,
      "Estado": clienteActivo ? "Activo" : "Inactivo",
      "Fecha de registro": fechaRegistro,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  worksheet["!cols"] = [
    { wch: 6 },  // N°
    { wch: 18 }, // Tipo doc
    { wch: 22 }, // Num doc
    { wch: 30 }, // Nombre
    { wch: 32 }, // Correo
    { wch: 18 }, // Teléfono
    { wch: 26 }, // Dirección
    { wch: 22 }, // Vehículos
    { wch: 22 }, // Servicios
    { wch: 14 }, // Estado
    { wch: 18 }, // Fecha
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

  XLSX.writeFile(workbook, filename);
}

export default exportClientsExcel;

