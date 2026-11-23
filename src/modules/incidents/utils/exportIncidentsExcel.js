/**
 * Exporta la lista de novedades a un archivo Excel (.xlsx)
 * con todos los campos clave: código, fechas y horas, conductor,
 * prioridad, estado, cliente, servicio, origen, destino, descripción y notas.
 */
export default async function exportIncidentsExcel(incidents) {
  if (!incidents || incidents.length === 0) {
    alert('No hay novedades para exportar a Excel.');
    return;
  }
  const XLSX = await import('xlsx');

  const rows = incidents.map((inc, idx) => ({
    '#': idx + 1,
    'Novedad': inc.codigo || inc.id || '',
    'Fecha Inicial': inc.fechaInicialDate || inc.fecha || '',
    'Hora Inicial': inc.fechaInicialTime || inc.hora || '',
    'Fecha Finalización': inc.fechaFinalDate || '—',
    'Hora Finalización': inc.fechaFinalTime || '—',
    'Conductor': inc.conductor || '',
    'Doc. Conductor': inc.conductorDocumento || '',
    'Tel. Conductor': inc.conductorTelefono || '',
    'Prioridad': inc.prioridad || '',
    'Estado': inc.estado || 'Por revisar',
    'Tipo de Novedad': inc.tipo || '',
    'Cliente': inc.clienteNombre || '',
    'Doc. Cliente': inc.clienteDocumento || '',
    'Tel. Cliente': inc.clienteTelefono || '',
    'Origen del Servicio': inc.origenServicio || inc.solicitud?.origen || '—',
    'Destino del Servicio': inc.destinoServicio || inc.solicitud?.destino || '—',
    'Dirección / Ubicación': inc.ubicacionTexto || inc.ubicacion?.direccion || '',
    'Descripción del Incidente': inc.descripcion || '',
    'Notas del Administrador': inc.observaciones || inc.adminNotes || inc.notasSolucion || '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  const colKeys = Object.keys(rows[0] || {});
  ws['!cols'] = colKeys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] || '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 45) };
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Novedades');

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `Novedades_MiConductor_${dateStr}.xlsx`);
}

