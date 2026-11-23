/**
 * Exporta la lista de vehículos a un archivo Excel (.xlsx)
 * con TODOS los datos: propietario, placa, marca, modelo, año, color,
 * tipo de vehículo, chasis, combustible, SOAT, tecnomecánica, estado, etc.
 */
export default async function exportVehiclesExcel(vehicles) {
  if (!vehicles || vehicles.length === 0) return;
  const XLSX = await import('xlsx');

  const formatDate = (d) => {
    if (!d) return '';
    const str = String(d).split('T')[0];
    const parts = str.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return str;
  };

  const getEstadoFecha = (d) => {
    if (!d) return '';
    const str = String(d).split('T')[0];
    const parts = str.split('-');
    if (parts.length !== 3) return '';
    const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dt.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dt < today ? 'Vencido' : 'Vigente';
  };

  const rows = vehicles.map((v, idx) => ({
    '#': idx + 1,
    'Placa': v.placa || '',
    'Tipo de Vehículo': v.tipoVehiculo || '',
    'Marca': v.marca || '',
    'Modelo': v.modelo || '',
    'Año': v.anio || '',
    'Color': v.color || '',
    'No. Chasis / VIN': v.numeroChasis || '',
    'Combustible': v.tipoCombustible || '',
    'No. Puertas': v.numeroPuertas || '',
    // Propietario
    'Propietario - Nombre': `${v.cliente?.usuario?.nombre || v.cliente?.nombre || ''} ${v.cliente?.usuario?.apellido || v.cliente?.apellido || ''}`.trim(),
    'Propietario - Documento': v.cliente?.usuario?.documento || v.cliente?.documento || '',
    'Propietario - Correo': v.cliente?.usuario?.correo || v.cliente?.correo || '',
    'Propietario - Teléfono': v.cliente?.usuario?.telefono || v.cliente?.telefono || '',
    // Documentación
    'SOAT - Vencimiento': formatDate(v.fechaVencimientoSoat || v.soatVencimiento),
    'SOAT - Estado': getEstadoFecha(v.fechaVencimientoSoat || v.soatVencimiento),
    'Tecnomecánica - Vencimiento': formatDate(v.fechaVencimientoTecnomecanica || v.tecnomecanicaVencimiento),
    'Tecnomecánica - Estado': getEstadoFecha(v.fechaVencimientoTecnomecanica || v.tecnomecanicaVencimiento),
    'Compañía Aseguradora': v.companiaAseguradora || '',
    'Estado Seguro': v.estadoSeguro || '',
    // Estado general
    'Estado': v.estadoVehiculo === 'en_mantenimiento' ? 'En Mantenimiento' : v.estadoVehiculo === 'vendido' ? 'Vendido' : v.estadoVehiculo === 'inactivo' || v.estado === false ? 'Inactivo' : 'Activo',
    'Motivo de Estado': v.motivoCambioEstado || '',
  }));

  // Crear workbook y hoja
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Ajustar ancho de columnas
  const colKeys = Object.keys(rows[0] || {});
  ws['!cols'] = colKeys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] || '').length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Vehículos');

  // Generar y descargar
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `Vehiculos_MiConductor_${dateStr}.xlsx`);
}
