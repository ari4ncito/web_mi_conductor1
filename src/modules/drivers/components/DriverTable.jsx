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
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', minWidth: 850, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Conductor
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Estado de licencia
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Categoría
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Estado actual
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedDrivers.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
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
                <tr
                  key={driver._id || index}
                  style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
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
                        <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                          {nombre || "Sin nombre"}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.2, marginTop: 4 }}>
                          {Array.isArray(driver.licencias) && driver.licencias.length > 1
                            ? `Licencias: ${driver.licencias.length} registradas`
                            : `Licencia: ${licencia || "Sin licencia"}`}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.2, marginTop: 2 }}>
                          Documento: {documento || "Sin documento"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                      <span className="mc-badge" style={getLicenseStatusStyle(licenseStatus)}>
                        {getLicenseStatusText(licenseStatus)}
                        <span>{licenseStatus === "Valid" ? "✓" : "!"}</span>
                      </span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>
                        Vence: {driver.fechaVencimiento
                          ? new Date(driver.fechaVencimiento).toLocaleDateString("es-CO")
                          : "Sin fecha"}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    {Array.isArray(driver.licencias) && driver.licencias.length > 1 ? (
                      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', maxWidth: 160 }}>
                        {driver.licencias.map((l, i) => (
                          <span
                            key={i}
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: '#f1f5f9',
                              color: '#334155',
                              fontSize: 11.5,
                              fontWeight: 700,
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            {l.categoria || l.categoriaLicencia}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 8,
                          background: '#f1f5f9',
                          color: '#334155',
                          fontSize: 12,
                          fontWeight: 700,
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {licenseCategory}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <span className="mc-badge" style={getCurrentStateStyle(currentState)}>
                      {getCurrentStateText(currentState)}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
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
            {drivers.length === 0
              ? "No hay conductores registrados"
              : `Mostrando ${startIndex + 1}–${Math.min(startIndex + pageSize, drivers.length)} de ${drivers.length} conductores`}
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
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: (currentPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#475569',
                cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
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
}
