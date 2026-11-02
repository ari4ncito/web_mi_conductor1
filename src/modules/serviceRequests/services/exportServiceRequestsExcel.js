/**
 * Utilidad para exportar el listado completo de solicitudes a un archivo Excel (.xlsx)
 * con autoajuste de columnas y formato compatible con Microsoft Excel.
 */

export async function exportarSolicitudesAExcel(solicitudes = []) {
  if (!solicitudes || solicitudes.length === 0) {
    alert("No hay solicitudes para exportar a Excel.");
    return;
  }

  const XLSX = await import("xlsx");

  const rows = solicitudes.map((sol, idx) => {
    const tuvoNovedad = Boolean(sol.novedad);
    const detalleNovedad = tuvoNovedad
      ? `${sol.novedad.codigo || sol.novedad.id || "Novedad"} - ${sol.novedad.tipo || ""}: ${sol.novedad.descripcion || ""}`
      : "Sin novedades";

    return {
      "#": idx + 1,
      "Código de Solicitud": sol.code || sol.fullCode || sol.id || "—",
      "Tipo de Servicio": sol.serviceType || "—",
      "Estado": sol.status || "—",
      "Prioridad": sol.priority || "—",
      "Fecha Inicio":
        sol.fechaInicioFormatted?.fecha ||
        (sol.fechaInicio
          ? new Date(sol.fechaInicio).toLocaleDateString("es-CO")
          : "—"),
      "Hora Inicio":
        sol.fechaInicioFormatted?.hora ||
        (sol.fechaInicio
          ? new Date(sol.fechaInicio).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "—"),
      "Fecha Finalización":
        sol.fechaFinFormatted?.fecha ||
        (sol.fechaFin
          ? new Date(sol.fechaFin).toLocaleDateString("es-CO")
          : sol.status === "En Proceso"
          ? "En curso"
          : "—"),
      "Hora Finalización":
        sol.fechaFinFormatted?.hora ||
        (sol.fechaFin
          ? new Date(sol.fechaFin).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : sol.status === "En Proceso"
          ? "En curso"
          : "—"),
      "Doc. Cliente": sol.documento || "—",
      "Cliente": sol.client || "—",
      "Correo Cliente": sol.clientEmail || "—",
      "Vehículo": sol.vehicle || "—",
      "Doc. Conductor": sol.driverDocument || "—",
      "Conductor": sol.driver || "Sin conductor",
      "Origen": sol.origin || "—",
      "Destino": sol.destination || "—",
      "Descripción": sol.description || "Sin descripción",
      "¿Tuvo Novedad?": tuvoNovedad ? "Sí" : "No",
      "Detalle de Novedad": detalleNovedad,
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  const colKeys = Object.keys(rows[0] || {});
  ws["!cols"] = colKeys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] || "").length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 45) };
  });

  XLSX.utils.book_append_sheet(wb, ws, "Solicitudes");

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  XLSX.writeFile(wb, `Solicitudes_MiConductor_${dateStr}.xlsx`);
}
