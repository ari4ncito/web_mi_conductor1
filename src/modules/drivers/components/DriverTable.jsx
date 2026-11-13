import { memo } from "react";

function EyeIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PencilIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TrashIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M5 7h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 7V4.5h6V7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 7.5 8 20h8l1-12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 11v5.5M14 11v5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// Ícono exacto de cambio de estado (Curved arrows con círculo azul y cuadrado turquesa)
function ChangeStatusIconSm() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
      {/* Círculo azul superior izquierdo */}
      <circle cx="7.5" cy="7.5" r="2.8" fill="#3b82f6" />
      {/* Flecha curva superior azul */}
      <path
        d="M10.8 5.6C15 4.8 18.2 6.8 19 10.5m0 0l-2.6-.8m2.6.8l1-2.6"
        stroke="#2563eb"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cuadrado turquesa inferior derecho */}
      <rect x="13.8" y="13.8" width="5.5" height="5.5" rx="1.3" fill="#10b981" />
      {/* Flecha curva inferior azul */}
      <path
        d="M13.2 18.4C9 19.2 5.8 17.2 5 13.5m0 0l2.6.8m-2.6-.8l-1 2.6"
        stroke="#2563eb"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DriverTable = memo(function DriverTable({
  drivers,
  currentPage,
  pageSize,
  onPageChange,
  onViewDetails,
  onEdit,
  onDeleteRequest,
  onToggleDisponibilidad,
  onChangeStatusRequest,
  onViewLicenses,
  canEdit = true,
  canDelete = true,
}) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = drivers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(drivers.length / pageSize);
  const showPagination = drivers.length > 0;

  const getLicenseStatus = (driver) => {
    const licList = Array.isArray(driver.licencias) && driver.licencias.length > 0
      ? driver.licencias
      : (driver.fechaVencimiento || driver.licencia ? [{ fechaVencimiento: driver.fechaVencimiento }] : []);

    if (licList.length === 0) return "Valid";

    const hoy = new Date();
    const hayVencida = licList.some((lic) => {
      if (!lic.fechaVencimiento) return false;
      const fv = new Date(lic.fechaVencimiento);
      return !isNaN(fv.getTime()) && fv < hoy;
    });

    return hayVencida ? "Expired" : "Valid";
  };

  const getLicenseStatusStyle = (status) => {
    switch (status) {
      case "Valid":
        return { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" };
      case "Expired":
        return { background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3" };
      default:
        return { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" };
    }
  };

  const getAdminStatusStyle = (status) => {
    switch (status) {
      case "ACTIVO":
        return { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" };
      case "INACTIVO":
        return { background: "#fffbeb", color: "#92400e", border: "1px solid #fef3c7" };
      case "RETIRADO":
        return { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" };
      case "FALLECIDO":
        return { background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a" };
      default:
        return { background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
    }
  };

  return (
    <div style={{ overflowX: "auto", background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
      <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Conductor
            </th>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Licencias
            </th>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Estado Licencia
            </th>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Disponibilidad
            </th>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Estado
            </th>
            <th style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedDrivers.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                No hay conductores disponibles para mostrar.
              </td>
            </tr>
          ) : (
            paginatedDrivers.map((driver) => {
              const usuario = driver.usuario || {};
              const nombre = usuario.nombre || driver.nombre || "";
              const apellido = usuario.apellido || driver.apellido || "";
              const nombreCompleto =
                usuario.nombreCompleto ||
                `${nombre} ${apellido}`.trim() ||
                driver.name ||
                "Conductor sin nombre";

              const tipoDoc = usuario.tipoDocumento || driver.tipoDocumento || driver.documentType || "CC";
              const numDoc = usuario.documento || driver.documento || driver.idNumber || "N/A";

              const isOperativo = Boolean(driver.disponible ?? driver.available);
              const estadoAdmin = driver.estadoConductor || (driver.estado === false ? "INACTIVO" : "ACTIVO");
              const licenseStatus = getLicenseStatus(driver);
              const fotoPerfil = driver.fotoPerfil || usuario.fotoPerfil || driver.foto || usuario.foto || null;

              const initials =
                (nombre?.[0] || "") + (apellido?.[0] || "") ||
                nombreCompleto?.[0] ||
                "C";

              return (
                <tr
                  key={driver._id || driver.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.15s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Conductor: Avatar (Foto si existe, o Iniciales) + Nombre + Documento */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {fotoPerfil ? (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1.5px solid #fed7aa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff7ed",
                          }}
                        >
                          <img
                            src={fotoPerfil}
                            alt={nombreCompleto}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                          <div
                            style={{
                              display: "none",
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(135deg, #fb923c, #ea580c)",
                              color: "#ffffff",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {initials}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #fb923c, #ea580c)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                      )}

                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>
                          {nombreCompleto}
                        </div>
                        <div style={{ color: "#475569", fontSize: 12.5, lineHeight: 1.3, marginTop: 3 }}>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{tipoDoc}:</span> {numDoc}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 11.5, lineHeight: 1.2, marginTop: 1 }}>
                          {usuario.correo || "Sin correo"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* REQUERIMIENTO 2: Solo botón "Ver licencias" en la columna */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewLicenses) onViewLicenses(driver);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 10,
                        background: "#fff7ed",
                        border: "1px solid #ffedd5",
                        color: "#c2410c",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#ffedd5";
                        e.currentTarget.style.borderColor = "#fed7aa";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#fff7ed";
                        e.currentTarget.style.borderColor = "#ffedd5";
                      }}
                      title="Ver todas las licencias del conductor"
                    >
                      <DocumentIconSm />
                      <span>Ver licencias</span>
                    </button>
                  </td>

                  {/* Estado Licencia: Sin fecha, solo estado VÁLIDA(S) */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          ...getLicenseStatusStyle(licenseStatus),
                        }}
                      >
                        {licenseStatus === "Valid" ? "✓ VÁLIDA(S)" : "! VENCIDA(S)"}
                      </span>
                    </div>
                  </td>

                  {/* Disponibilidad Operativa */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <div
                      title={
                        !canEdit
                          ? "No tienes permiso para cambiar la disponibilidad"
                          : isOperativo
                          ? "Disponible - Clic para poner Fuera de Servicio"
                          : "Fuera de Servicio - Clic para marcar Disponible"
                      }
                      onClick={() => canEdit && onToggleDisponibilidad && onToggleDisponibilidad(driver)}
                      style={{
                        cursor: canEdit ? "pointer" : "not-allowed",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: isOperativo ? "#ecfdf5" : "#f1f5f9",
                        border: `1px solid ${isOperativo ? "#a7f3d0" : "#cbd5e1"}`,
                        color: isOperativo ? "#047857" : "#475569",
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isOperativo ? "#10b981" : "#94a3b8",
                        }}
                      />
                      {isOperativo ? "Disponible" : "Fuera de servicio"}
                    </div>
                  </td>

                  {/* Estado Administrativo */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        ...getAdminStatusStyle(estadoAdmin),
                      }}
                    >
                      {estadoAdmin}
                    </span>
                  </td>

                  {/* REQUERIMIENTO 3: Acciones con el ícono de cambio de estado incluido */}
                  <td style={{ padding: "12px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      <button
                        type="button"
                        className="mc-icon-btn"
                        title="Ver detalle del conductor"
                        onClick={() => onViewDetails(driver)}
                      >
                        <EyeIconSm />
                      </button>

                      {canEdit && (
                        <button
                          type="button"
                          className="mc-icon-btn"
                          title="Editar información"
                          onClick={() => onEdit(driver)}
                        >
                          <PencilIconSm />
                        </button>
                      )}

                      {/* Botón de cambio de estado con el ícono exacto solicitado */}
                      {canEdit && (
                        <button
                          type="button"
                          className="mc-icon-btn"
                          title="Cambiar estado administrativo"
                          onClick={() => onChangeStatusRequest && onChangeStatusRequest(driver)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChangeStatusIconSm />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          className="mc-icon-btn mc-icon-btn--danger"
                          title="Eliminar conductor de la tabla"
                          onClick={() => onDeleteRequest && onDeleteRequest(driver)}
                        >
                          <TrashIconSm />
                        </button>
                      )}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ color: "#64748b", fontSize: 12.5, fontWeight: 500 }}>
            {drivers.length === 0
              ? "No hay conductores registrados"
              : `Mostrando ${startIndex + 1}–${Math.min(startIndex + pageSize, drivers.length)} de ${drivers.length} conductores`}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: currentPage === 1 ? "#cbd5e1" : "#475569",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                  padding: "0 6px",
                  borderRadius: 6,
                  border: page === currentPage ? "1px solid #0f172a" : "1px solid #e2e8f0",
                  background: page === currentPage ? "#0f172a" : "#ffffff",
                  color: page === currentPage ? "#ffffff" : "#475569",
                  fontSize: 12,
                  fontWeight: page === currentPage ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: (currentPage === totalPages || totalPages === 0) ? "#cbd5e1" : "#475569",
                cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transform: "rotate(180deg)",
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
});

export default DriverTable;
