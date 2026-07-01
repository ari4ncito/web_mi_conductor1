export default function DriverTable({ drivers, currentPage, pageSize, onPageChange, onViewDetails, onEdit }) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = drivers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(drivers.length / pageSize);

  function getLicenseStatusStyle(status) {
    switch (status) {
      case 'Valid': return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'Expired': return 'bg-pink-50 text-pink-700 border border-pink-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  }

  function getCurrentStateStyle(state) {
    switch (state) {
      case 'in-route': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'available': return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'off-duty': return 'bg-gray-50 text-gray-600 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  }

  function getCurrentStateText(state) {
    switch (state) {
      case 'in-route': return 'EN RUTA';
      case 'available': return 'DISPONIBLE';
      case 'off-duty': return 'FUERA DE SERVICIO';
      default: return state;
    }
  }

  function getLicenseStatusText(status) {
    switch (status) {
      case 'Valid': return 'VÁLIDA';
      case 'Expired': return 'VENCIDA';
      default: return status;
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CONDUCTOR</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ESTADO DE LICENCIA</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ESTADO ACTUAL</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">DESEMPEÑO</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDrivers.map((driver) => (
              <tr key={driver.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-12 h-12 object-cover rounded-full border border-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{driver.name}</div>
                      <div className="text-sm text-slate-500">{driver.license}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getLicenseStatusStyle(driver.licenseStatus)}`}>
                      {getLicenseStatusText(driver.licenseStatus)}
                      {driver.licenseStatus === 'Valid' ? <span className="ml-1">✓</span> : <span className="ml-1">!</span>}
                    </span>
                    <span className="text-xs text-slate-500">Vence: {driver.licenseExpiry}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCurrentStateStyle(driver.currentState)}`}>
                    {getCurrentStateText(driver.currentState)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold text-slate-800">{driver.performance.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(driver)}
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(driver)}
                      className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-6 py-6">
        <div className="text-sm text-slate-600">
          Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, drivers.length)} de {drivers.length} conductores
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
