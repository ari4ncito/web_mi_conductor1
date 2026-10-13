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
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', minWidth: 750, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conductor</th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prioridad</th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hora</th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Acción</th>
          </tr>
        </thead>

        <tbody>
          {paginatedIncidents.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                No hay novedades registradas.
              </td>
            </tr>
          ) : (
            paginatedIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;

              return (
                <tr
                  key={incident.id}
                  style={{
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? '#f8fafc' : '#ffffff'; }}
                >
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <div style={{ color: '#0f172a', fontSize: 14, fontWeight: 600 }}>{incident.id}</div>
                  </td>
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5, fontWeight: 500 }}>
                    {incident.conductor}
                  </td>
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                        incident.prioridad
                      )}`}
                    >
                      {incident.prioridad}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5 }}>
                    {incident.fecha}
                  </td>
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#64748b', fontSize: 13 }}>
                    {incident.hora}
                  </td>
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
            })
          )}
        </tbody>
      </table>

      {showPagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ color: '#64748b', fontSize: 12.5, fontWeight: 500 }}>
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, incidents.length)} de {incidents.length} novedad{incidents.length === 1 ? '' : 'es'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              aria-label="Página anterior"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                style={{
                  minWidth: 28,
                  height: 28,
                  padding: '0 6px',
                  borderRadius: 6,
                  border: page === currentPage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: page === currentPage ? '#0f172a' : '#ffffff',
                  color: page === currentPage ? '#ffffff' : '#475569',
                  fontSize: 12,
                  fontWeight: page === currentPage ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transform: 'rotate(180deg)',
              }}
              aria-label="Página siguiente"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
