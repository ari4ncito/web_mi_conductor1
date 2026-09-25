import { useState } from "react";
import { FiEye } from "react-icons/fi";

const BADGE_STYLES = {
  Crítica: "bg-red-100 text-red-600",
  Media: "bg-amber-100 text-amber-600",
  Baja: "bg-green-100 text-green-600",
};

function EyeIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

const ReportsTable = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(incidents.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedIncidents = incidents.slice(startIndex, startIndex + pageSize);

  const showPagination = incidents.length > 0;

  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBadgeStyle = (prioridad) => {
    return (
      BADGE_STYLES[prioridad] ||
      "bg-slate-100 text-slate-600"
    );
  };

  return (
    <div>
      <div className="mc-table-wrap">
        <table className="mc-table" style={{ minWidth: 750 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Conductor</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acción</th>
            </tr>
          </thead>

            <tbody>
              {paginatedIncidents.map((incident) => {
                const isSelected =
                  selectedIncident?.id === incident.id;

                return (
                  <tr key={incident.id}>
                    <td>
                      <div style={{ color: '#1e293b', fontSize: 15, fontWeight: 600 }}>{incident.id}</div>
                    </td>
                    <td>{incident.conductor}</td>

                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                          incident.prioridad
                        )}`}
                      >
                        {incident.prioridad}
                      </span>
                    </td>
                    <td>{incident.fecha}</td>
                    <td>{incident.hora}</td>
                    <td>
                      <div className="mc-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          title="Ver novedad"
                          onClick={() => onSelectIncident(incident)}
                          className="mc-icon-btn"
                        >
                          <EyeIconSm />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        {incidents.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#667085', fontSize: 14 }}>
            No hay novedades registradas.
          </div>
        )}
      </div>

      {showPagination && (
        <div className="mc-pagination">
          <div className="mc-pagination-info">
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, incidents.length)} de {incidents.length} novedades
          </div>
          <div className="mc-pagination-controls">
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`mc-pagination-num${page === currentPage ? ' mc-pagination-num--active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ transform: 'rotate(180deg)' }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
