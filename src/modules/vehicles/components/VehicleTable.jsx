export default function VehicleTable({ vehicles, currentPage, pageSize, onPageChange, onViewDetails }) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(vehicles.length / pageSize);

  function getStatusStyle(status) {
    switch (status) {
      case 'active': return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'maintenance': return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'off-duty': return 'bg-gray-50 text-gray-600 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case 'active': return 'ACTIVO';
      case 'maintenance': return 'MANTENIMIENTO';
      case 'off-duty': return 'FUERA DE SERVICIO';
      default: return status;
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">FOTO</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">NOMBRE DEL VEHÍCULO</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">MATRÍCULA</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">PROPIETARIO</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ESTADO</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <img
                    src={vehicle.photo}
                    alt={vehicle.name}
                    className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{vehicle.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                    {vehicle.licensePlate}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{vehicle.owner}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(vehicle)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    Ver detalle
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-6 py-6">
        <div className="text-sm text-slate-600">
          Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, vehicles.length)} de {vehicles.length} vehículos
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                page === currentPage
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
