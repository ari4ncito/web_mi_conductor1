import driverService from "../services/driverService.js";

const headerStyle = {
  padding: "18px 20px",
  color: "#0d3349",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  textAlign: "center",
};

const cellStyle = {
  padding: "18px 20px",
  color: "#111111",
  fontSize: 16,
  textAlign: "center",
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

function PencilIconSm() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M13.5 5.5 18 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIconSm() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M5 7h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 7V4.5h6V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M7 7.5 8 20h8l1-12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M10 11v5.5M14 11v5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BaseIconButton({
  children,
  title,
  onClick,
  color = "#111111",
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        border: "1px solid rgba(17, 17, 17, 0.08)",
        background: disabled ? "#f3f4f6" : "#ffffff",
        color: disabled ? "#9ca3af" : color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 4px 10px rgba(18, 39, 52, 0.04)",
      }}
    >
      {children}
    </button>
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
  const startIndex =
    (currentPage - 1) * pageSize;

  const paginatedDrivers =
    drivers.slice(
      startIndex,
      startIndex + pageSize
    );

  const totalPages =
    Math.ceil(drivers.length / pageSize);

  // ==========================================
  // ELIMINAR CONDUCTOR
  // ==========================================
  const handleDelete = async (driver) => {
    if (!driver?._id) {
      alert("No se encontró el ID del conductor.");
      return;
    }

    const nombre =
      `${driver.usuario?.nombre || ""} ${
        driver.usuario?.apellido || ""
      }`.trim() || "este conductor";

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar definitivamente a ${nombre}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    try {
      await driverService.delete(driver._id);

      alert("Conductor eliminado correctamente.");

      // Avisar al componente padre para actualizar la lista
      if (onDelete) {
        onDelete(driver);
      }
    } catch (error) {
      console.error(
        "Error al eliminar conductor:",
        error
      );

      alert(
        error.response?.data?.message ||
          "No se pudo eliminar el conductor."
      );
    }
  };

  const getLicenseStatus = (driver) => {
    if (!driver.fechaVencimiento) {
      return "Unknown";
    }

    const fechaVencimiento =
      new Date(driver.fechaVencimiento);

    const hoy = new Date();

    return fechaVencimiento < hoy
      ? "Expired"
      : "Valid";
  };

  const getLicenseStatusStyle = (status) => {
    switch (status) {
      case "Valid":
        return {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #a7f3d0",
        };

      case "Expired":
        return {
          background: "#fdf2f8",
          color: "#9d174d",
          border: "1px solid #fbcfe8",
        };

      default:
        return {
          background: "#f9fafb",
          color: "#4b5563",
          border: "1px solid #e5e7eb",
        };
    }
  };

  const getLicenseStatusText = (status) => {
    switch (status) {
      case "Valid":
        return "VÁLIDA";

      case "Expired":
        return "VENCIDA";

      default:
        return "SIN DATOS";
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
        return {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #a7f3d0",
        };

      case "off-duty":
        return {
          background: "#f9fafb",
          color: "#4b5563",
          border: "1px solid #e5e7eb",
        };

      default:
        return {
          background: "#f9fafb",
          color: "#4b5563",
          border: "1px solid #e5e7eb",
        };
    }
  };

  const getCurrentStateText = (state) => {
    switch (state) {
      case "available":
        return "DISPONIBLE";

      case "off-duty":
        return "FUERA DE SERVICIO";

      default:
        return "SIN ESTADO";
    }
  };

  const pageInfoStyle = {
    color: "#111111",
    fontSize: 16,
  };

  const paginationBtnStyle = {
    width: 38,
    height: 48,
    borderRadius: 10,
    border: 0,
    fontSize: 18,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div>
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={headerStyle}>
                CONDUCTOR
              </th>

              <th style={headerStyle}>
                ESTADO DE LICENCIA
              </th>

              <th style={headerStyle}>
                ESTADO ACTUAL
              </th>

              <th style={headerStyle}>
                EXPERIENCIA
              </th>

              <th style={headerStyle}>
                ACCIONES
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedDrivers.map(
              (driver, index) => {
                const nombre =
                  `${driver.usuario?.nombre || ""} ${
                    driver.usuario?.apellido || ""
                  }`.trim();

                const documento =
                  driver.usuario?.documento || "";

                const licencia =
                  driver.licencia || "";

                const licenseStatus =
                  getLicenseStatus(driver);

                const currentState =
                  getCurrentState(driver);

                const experiencia =
                  Number(driver.experiencia) || 0;

                return (
                  <tr
                    key={driver._id || index}
                    style={{
                      background:
                        index % 2 === 1
                          ? "#f0f1f3"
                          : "#f8fbff",
                    }}
                  >
                    {/* ================================
                        CONDUCTOR
                    ================================= */}

                    <td
                      style={{
                        padding: "18px 24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          justifyContent: "center",
                        }}
                      >
                        {/* AVATAR */}

                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "#ff9a2f",
                            color: "#111111",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {(
                            driver.usuario?.nombre?.[0] ||
                            "C"
                          ).toUpperCase()}
                        </div>

                        <div
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              color: "#111111",
                              fontSize: 16,
                              lineHeight: 1.2,
                              fontWeight: 600,
                            }}
                          >
                            {nombre || "Sin nombre"}
                          </div>

                          <div
                            style={{
                              color: "#667085",
                              fontSize: 14,
                              lineHeight: 1.2,
                              marginTop: 4,
                            }}
                          >
                            Licencia:{" "}
                            {licencia ||
                              "Sin licencia"}
                          </div>

                          <div
                            style={{
                              color: "#667085",
                              fontSize: 13,
                              lineHeight: 1.2,
                              marginTop: 3,
                            }}
                          >
                            Documento:{" "}
                            {documento ||
                              "Sin documento"}
                          </div>
                        </div>
                      </div>
                    </td>


                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            ...getLicenseStatusStyle(
                              licenseStatus
                            ),
                          }}
                        >
                          {getLicenseStatusText(
                            licenseStatus
                          )}

                          <span>
                            {licenseStatus ===
                            "Valid"
                              ? "✓"
                              : "!"}
                          </span>
                        </span>

                        <span
                          style={{
                            fontSize: 14,
                            color: "#667085",
                          }}
                        >
                          Vence:{" "}
                          {driver.fechaVencimiento
                            ? new Date(
                                driver.fechaVencimiento
                              ).toLocaleDateString(
                                "es-CO"
                              )
                            : "Sin fecha"}
                        </span>
                      </div>
                    </td>


                    <td style={cellStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 14,
                          fontWeight: 600,
                          ...getCurrentStateStyle(
                            currentState
                          ),
                        }}
                      >
                        {getCurrentStateText(
                          currentState
                        )}
                      </span>
                    </td>


                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#f59e0b",
                          }}
                        >
                          ★
                        </span>

                        <span
                          style={{
                            color: "#111111",
                            fontSize: 16,
                          }}
                        >
                          {experiencia.toFixed(1)}
                        </span>

                        <span
                          style={{
                            color: "#667085",
                            fontSize: 13,
                          }}
                        >
                          años
                        </span>
                      </div>
                    </td>


                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {/* VER */}

                        <BaseIconButton
                          title="Ver detalle"
                          onClick={() =>
                            onViewDetails(driver)
                          }
                        >
                          <EyeIconSm />
                        </BaseIconButton>

                        {/* EDITAR */}

                        <BaseIconButton
                          title="Editar"
                          onClick={() =>
                            onEdit(driver)
                          }
                        >
                          <PencilIconSm />
                        </BaseIconButton>

                        {/* ELIMINAR */}

                        <BaseIconButton
                          title="Eliminar conductor"
                          color="#d64545"
                          onClick={() =>
                            handleDelete(driver)
                          }
                        >
                          <TrashIconSm />
                        </BaseIconButton>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 24px 24px",
          background: "#e8f1fb",
        }}
      >
        <div style={pageInfoStyle}>
          {drivers.length === 0
            ? "No hay conductores registrados"
            : `Mostrando ${
                startIndex + 1
              }–${Math.min(
                startIndex + pageSize,
                drivers.length
              )} de ${
                drivers.length
              } conductores`}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* ANTERIOR */}

          <button
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
            style={{
              width: 28,
              height: 40,
              borderRadius: 10,
              border:
                "1px solid rgba(17,17,17,0.08)",
              background: "#ffffff",
              color: "#111111",
              display: "grid",
              placeItems: "center",
              padding: 0,
              cursor:
                currentPage === 1
                  ? "not-allowed"
                  : "pointer",
              opacity:
                currentPage === 1 ? 0.5 : 1,
            }}
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10.5 2.5 6 6 1.5" />
            </svg>
          </button>

          {/* NÚMEROS */}

          {Array.from(
            {
              length: totalPages,
            },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() =>
                onPageChange(page)
              }
              style={{
                ...paginationBtnStyle,
                background:
                  page === currentPage
                    ? "#ff9a2f"
                    : "transparent",
                color: "#111111",
                fontWeight: 400,
              }}
            >
              {page}
            </button>
          ))}

          {/* SIGUIENTE */}

          <button
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            style={{
              width: 28,
              height: 40,
              borderRadius: 10,
              border:
                "1px solid rgba(17,17,17,0.08)",
              background: "#ffffff",
              color: "#111111",
              display: "grid",
              placeItems: "center",
              padding: 0,
              cursor:
                currentPage === totalPages ||
                totalPages === 0
                  ? "not-allowed"
                  : "pointer",
              opacity:
                currentPage === totalPages ||
                totalPages === 0
                  ? 0.5
                  : 1,
              transform: "rotate(180deg)",
            }}
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10.5 2.5 6 6 1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}