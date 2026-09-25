import driverService from "../services/driverService.js";

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

export default function DriverTable({
  drivers,
  currentPage,
  pageSize,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = drivers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(drivers.length / pageSize);

  const showPagination = drivers.length > 0;

  const handleDelete = async (driver) => {
    if (!driver?._id) {
      alert("No se encontró el ID del conductor.");
      return;
    }

    const nombre =
      `${driver.usuario?.nombre || ""} ${driver.usuario?.apellido || ""}`.trim() || "este conductor";

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar definitivamente a ${nombre}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    try {
      await driverService.delete(driver._id);
      alert("Conductor eliminado correctamente.");
      if (onDelete) {
        onDelete(driver);
      }
    } catch (error) {
      console.error("Error al eliminar conductor:", error);
      alert(error.response?.data?.message || "No se pudo eliminar el conductor.");
    }
  };

  const getLicenseStatus = (driver) => {
    if (!driver.fechaVencimiento) {
      return "Unknown";
    }
    const fechaVencimiento = new Date(driver.fechaVencimiento);
    const hoy = new Date();
    return fechaVencimiento < hoy ? "Expired" : "Valid";
  };

  const getLicenseStatusStyle = (status) => {
    switch (status) {
      case "Valid":
        return { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" };
      case "Expired":
        return { background: "#fdf2f8", color: "#9d174d", border: "1px solid #fbcfe8" };
      default:
        return { background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" };
    }
  };

  const getLicenseStatusText = (status) => {
    switch (status) {
      case "Valid": return "VÁLIDA";
      case "Expired": return "VENCIDA";
      default: return "SIN DATOS";
    }
  };

  const getCurrentState = (driver) => {
    if (driver.disponible === true) {
      return "available";
    }
    return "off-duty";
  };

  const getCurrentStateStyle = (state) => {
    switch (state) {
      case "available":
        return { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" };
      case "off-duty":
        return { background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" };
      default:
        return { background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" };
    }
  };

  const getCurrentStateText = (state) => {
    switch (state) {
      case "available": return "DISPONIBLE";
      case "off-duty": return "FUERA DE SERVICIO";
      default: return "SIN ESTADO";
    }
  };

  return (
    <div>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Conductor</th>
              <th>Estado de licencia</th>
              <th>Categoría</th>
              <th>Estado actual</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginatedDrivers.length === 0 ? (
              <tr>
                <td colSpan={5} className="mc-table-empty">
                  No hay conductores registrados.
                </td>
              </tr>
            ) : (
              paginatedDrivers.map((driver, index) => {
                const nombre =
                  `${driver.usuario?.nombre || ""} ${driver.usuario?.apellido || ""}`.trim();
                const documento = driver.usuario?.documento || "";
                const licencia = driver.licencia || "";
                const licenseStatus = getLicenseStatus(driver);
                const licenseCategory = driver.categoriaLicencia || "N/A";
                const currentState = getCurrentState(driver);

                const initials = nombre
                  ? nombre.split(" ").map((w) => w[0]).slice(0, 2).join("")
                  : "C";

                return (
                  <tr key={driver._id || index}>
                    <td className="mc-cell-entity">
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* AVATAR */}
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

                        <div style={{ textAlign: "left" }}>
                          <div style={{ color: "#1e293b", fontSize: 15, lineHeight: 1.2 }}>
                            {nombre || "Sin nombre"}
                          </div>
                          <div style={{ color: "#667085", fontSize: 13, lineHeight: 1.2, marginTop: 4 }}>
                            Licencia: {licencia || "Sin licencia"}
                          </div>
                          <div style={{ color: "#667085", fontSize: 12, lineHeight: 1.2, marginTop: 3 }}>
                            Documento: {documento || "Sin documento"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        <span className="mc-badge" style={getLicenseStatusStyle(licenseStatus)}>
                          {getLicenseStatusText(licenseStatus)}
                          <span>{licenseStatus === "Valid" ? "✓" : "!"}</span>
                        </span>
                        <span style={{ fontSize: 13, color: "#667085" }}>
                          Vence: {driver.fechaVencimiento
                            ? new Date(driver.fechaVencimiento).toLocaleDateString("es-CO")
                            : "Sin fecha"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="mc-badge" style={{ background: "#f9fafb", color: "#4b5563", border: "1px solid #e5e7eb" }}>
                        {licenseCategory}
                      </span>
                    </td>

                    <td>
                      <span className="mc-badge" style={getCurrentStateStyle(currentState)}>
                        {getCurrentStateText(currentState)}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td>
                      <div className="mc-actions">
                        <button type="button" className="mc-icon-btn" title="Ver detalle" onClick={() => onViewDetails(driver)}>
                          <EyeIconSm />
                        </button>
                        <button type="button" className="mc-icon-btn" title="Editar" onClick={() => onEdit(driver)}>
                          <PencilIconSm />
                        </button>
                        <button type="button" className="mc-icon-btn mc-icon-btn--danger" title="Eliminar conductor" onClick={() => handleDelete(driver)}>
                          <TrashIconSm />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="mc-pagination">
          <div className="mc-pagination-info">
            {drivers.length === 0
              ? "No hay conductores registrados"
              : `Mostrando ${startIndex + 1}–${Math.min(startIndex + pageSize, drivers.length)} de ${drivers.length} conductores`}
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
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ transform: "rotate(180deg)" }}
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
}
