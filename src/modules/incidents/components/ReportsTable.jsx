import { useState, useMemo } from "react";
import exportIncidentsExcel from "../utils/exportIncidentsExcel.js";

const BADGE_STYLES = {
  Crítica: "bg-red-50 text-red-600 border border-red-200",
  Alta: "bg-red-50 text-red-600 border border-red-200",
  Media: "bg-amber-50 text-amber-700 border border-amber-200",
  Baja: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

function EyeIconSm() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ size = 16, color = "#b3b7bf" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const ReportsTable = ({
  incidents = [],
  selectedIncident,
  onSelectIncident,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const pageSize = 5;

  // Filtrado integral (Buscador y Estado)
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Filtro de estado ("Por revisar" o "Revisado")
      if (filterStatus) {
        const est = (incident.estado || "").toLowerCase();
        if (filterStatus === "Por revisar") {
          if (!est.includes("revisar")) return false;
        } else if (filterStatus === "Revisado") {
          if (!est.includes("revisado") || est.includes("por")) return false;
        }
      }

      // Buscador general
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase().trim();
        const codigo = (incident.codigo || incident.id || "").toLowerCase();
        const conductor = (incident.conductor || "").toLowerCase();
        const prioridad = (incident.prioridad || "").toLowerCase();
        const estado = (incident.estado || "").toLowerCase();
        const tipo = (incident.tipo || "").toLowerCase();
        const fecha = (incident.fecha || incident.fechaInicialDate || "").toLowerCase();
        const hora = (incident.hora || incident.fechaInicialTime || "").toLowerCase();
        const cliente = (incident.clienteNombre || "").toLowerCase();
        const descripcion = (incident.descripcion || "").toLowerCase();

        const matchText =
          codigo.includes(term) ||
          conductor.includes(term) ||
          prioridad.includes(term) ||
          estado.includes(term) ||
          tipo.includes(term) ||
          fecha.includes(term) ||
          hora.includes(term) ||
          cliente.includes(term) ||
          descripcion.includes(term);

        if (!matchText) return false;
      }

      return true;
    });
  }, [incidents, searchQuery, filterStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredIncidents.length / pageSize)
  );

  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;

  const paginatedIncidents = filteredIncidents.slice(
    startIndex,
    startIndex + pageSize
  );

  const showPagination = filteredIncidents.length > 0;

  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBadgeStyle = (prioridad) =>
    BADGE_STYLES[prioridad] ||
    "bg-amber-50 text-amber-700 border border-amber-200";

  // Solo dos estados permitidos: "Por revisar" y "Revisado"
  const renderEstadoBadge = (incident) => {
    const estado = incident.estado || "Por revisar";
    const esRevisado = estado.toLowerCase().includes("revisado") && !estado.toLowerCase().includes("por");

    if (esRevisado) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 600,
          background: '#f0fdf4',
          color: '#16a34a',
          lineHeight: 1.2,
          border: '1px solid #bbf7d0',
          fontFamily: 'inherit',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          Revisado
        </span>
      );
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        background: '#fef2f2',
        color: '#dc2626',
        lineHeight: 1.2,
        border: '1px solid #fecaca',
        fontFamily: 'inherit',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
        Por revisar
      </span>
    );
  };

  return (
    <section style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
      {/* ── Barra superior: Buscador, Filtro de estado y Exportar Excel como en Vehículos ── */}
      <div className="p-3 sm:p-4 lg:p-[18px_24px]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid rgba(27, 46, 61, 0.08)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 340px', flexWrap: 'wrap' }}>
          {/* Buscador de novedades */}
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 10,
                background: '#f0f5ff',
                border: '1px solid rgba(27, 46, 61, 0.08)',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SearchIcon size={16} />
              </span>

              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar novedad..."
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13,
                  color: '#111111',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Selector de estado exactamente como en Vehículos */}
          <div style={{ position: 'relative', minWidth: 160 }}>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: 38,
                padding: '0 32px 0 14px',
                borderRadius: 10,
                background: '#f0f5ff',
                border: '1px solid rgba(27, 46, 61, 0.08)',
                fontSize: 13,
                fontWeight: 500,
                color: '#111111',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                appearance: 'none',
                WebkitAppearance: 'none',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Todos los estados</option>
              <option value="Por revisar">Por revisar</option>
              <option value="Revisado">Revisado</option>
            </select>
            <span
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#667085',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Botón Exportar Excel exactamente como en Vehículos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => exportIncidentsExcel(filteredIncidents)}
            disabled={filteredIncidents.length === 0}
            className="w-full sm:w-auto"
            title="Descargar listado en Excel"
            style={{
              height: 36,
              borderRadius: 10,
              border: '1px solid rgba(27, 46, 61, 0.12)',
              background: '#fff',
              color: '#166534',
              padding: '0 14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: filteredIncidents.length === 0 ? 'not-allowed' : 'pointer',
              opacity: filteredIncidents.length === 0 ? 0.5 : 1,
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            <DownloadIcon />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* ── Tabla de Novedades con tipografía idéntica a Vehículos ── */}
      <div className="p-3 sm:p-4 lg:p-[20px_24px] overflow-hidden">
        <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Novedad
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fecha inicial
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Conductor
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Prioridad
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                  Estado
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fecha de finalización
                </th>
                <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', width: '90px' }}>
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                    {searchQuery || filterStatus
                      ? "No se encontraron novedades con los filtros seleccionados."
                      : "No hay novedades registradas."}
                  </td>
                </tr>
              ) : (
                paginatedIncidents.map((incident) => {
                  const isSelected = selectedIncident?.id === incident.id;

                  return (
                    <tr
                      key={incident.id}
                      style={{
                        background: '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      {/* 1. Columna Novedad */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            color: "#0f172a",
                            fontSize: 13.5,
                            fontWeight: 700,
                            lineHeight: 1.25,
                          }}
                        >
                          {incident.codigo || incident.id}
                        </div>
                      </td>

                      {/* 2. Columna Fecha inicial (inmediatamente a la derecha de Novedad) */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#334155', fontSize: 12.5, fontWeight: 600, lineHeight: 1.25 }}>
                            {incident.fechaInicialDate || incident.fecha}
                          </span>
                          <span style={{ color: '#64748b', fontSize: 11.5, fontWeight: 500, lineHeight: 1.2, marginTop: 2 }}>
                            {incident.fechaInicialTime || incident.hora}
                          </span>
                        </div>
                      </td>

                      {/* 3. Columna Conductor */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                        <span style={{ color: '#1e293b', fontSize: 13, fontWeight: 600 }}>
                          {incident.conductor}
                        </span>
                      </td>

                      {/* 4. Columna Prioridad */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyle(
                            incident.prioridad
                          )}`}
                        >
                          {incident.prioridad}
                        </span>
                      </td>

                      {/* 5. Columna Estado */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                        {renderEstadoBadge(incident)}
                      </td>

                      {/* 6. Columna Fecha de finalización */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                        {incident.fechaFinalDate ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#334155', fontSize: 12.5, fontWeight: 600, lineHeight: 1.25 }}>
                              {incident.fechaFinalDate}
                            </span>
                            <span style={{ color: '#64748b', fontSize: 11.5, fontWeight: 500, lineHeight: 1.2, marginTop: 2 }}>
                              {incident.fechaFinalTime}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>—</span>
                        )}
                      </td>

                      {/* 7. Columna Acción: botón centrado exactamente con el encabezado */}
                      <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center', width: '90px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            type="button"
                            title="Ver detalle"
                            aria-label={`Ver novedad ${incident.codigo || incident.id}`}
                            aria-pressed={isSelected}
                            onClick={() => onSelectIncident(incident)}
                            className="mc-icon-btn hover:text-orange-500 hover:border-orange-200 transition"
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

          {/* ── Paginación idéntica a Vehículos y Solicitudes ── */}
          {showPagination && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>
                Mostrando {startIndex + 1}–
                {Math.min(
                  startIndex + pageSize,
                  filteredIncidents.length
                )}{" "}
                de {filteredIncidents.length} novedades
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => onPageChange(effectivePage - 1)}
                  disabled={effectivePage === 1}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: effectivePage === 1 ? '#cbd5e1' : '#475569',
                    cursor: effectivePage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                  aria-label="Página anterior"
                >
                  <svg
                    width="6"
                    height="10"
                    viewBox="0 0 8 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 10.5 2.5 6 6 1.5" />
                  </svg>
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    style={{
                      minWidth: 28,
                      height: 28,
                      padding: '0 6px',
                      borderRadius: 6,
                      border: page === effectivePage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      background: page === effectivePage ? '#0f172a' : '#ffffff',
                      color: page === effectivePage ? '#ffffff' : '#475569',
                      fontSize: 12,
                      fontWeight: page === effectivePage ? 700 : 500,
                      cursor: 'pointer',
                    }}
                    aria-current={
                      page === effectivePage ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => onPageChange(effectivePage + 1)}
                  disabled={effectivePage === totalPages}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: effectivePage === totalPages ? '#cbd5e1' : '#475569',
                    cursor: effectivePage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    transform: 'rotate(180deg)',
                  }}
                  aria-label="Página siguiente"
                >
                  <svg
                    width="6"
                    height="10"
                    viewBox="0 0 8 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 10.5 2.5 6 6 1.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReportsTable;
