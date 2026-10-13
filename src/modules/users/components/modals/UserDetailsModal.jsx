import useModalA11y from '../../../../hooks/useModalA11y';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function UserDetailsModal({
  user,
  open,
  onClose,
}) {
  const modalRef = useModalA11y(open, onClose);

  if (!open || !user) return null;

  const nombreCompleto =
    `${user.nombre || ""} ${user.apellido || ""}`.trim() ||
    "Sin nombre";

  const initials = nombreCompleto
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const nombreRol =
    user.rol?.nombre ||
    user.rol?.name ||
    user.rol ||
    "Sin rol";

  const estadoActivo = user.estado === true;

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Encabezado */}
        <div className="mc-modal-header" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                color: "#ffffff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                textTransform: "uppercase",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(234, 88, 12, 0.22)",
              }}
            >
              {initials}
            </div>

            <div>
              <p className="mc-modal-subtitle" style={{ margin: 0 }}>
                Detalles del usuario
              </p>
              <h2
                id="user-details-title"
                style={{
                  margin: "4px 0 0",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                {nombreCompleto}
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                {user.correo || "Correo no registrado"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="mc-modal-close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Cuerpo */}
        <div
          className="mc-modal-body"
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Tarjeta 1: Información Personal */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ea580c",
                }}
              >
                <UserIcon />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Información Personal
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "14px 20px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Nombre
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {user.nombre || "No registrado"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Apellido
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {user.apellido || "No registrado"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Documento
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {user.tipoDocumento
                    ? `${user.tipoDocumento} - ${user.documento || ""}`
                    : user.documento || "No registrado"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Teléfono
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {user.telefono || "No registrado"}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Cuenta y Permisos */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                }}
              >
                <ShieldIcon />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Cuenta y Permisos
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "14px 20px",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Correo Electrónico
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                    wordBreak: "break-all",
                  }}
                >
                  {user.correo || "No registrado"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Rol Asignado
                </p>
                <div style={{ marginTop: 6 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 8,
                      background: "#f1f5f9",
                      color: "#334155",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "1px solid #e2e8f0",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {nombreRol}
                  </span>
                </div>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Estado
                </p>
                <div style={{ marginTop: 6 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 9999,
                      fontSize: 12.5,
                      fontWeight: 600,
                      backgroundColor: estadoActivo ? "#f0fdf4" : "#fef2f2",
                      color: estadoActivo ? "#16a34a" : "#dc2626",
                      border: `1px solid ${estadoActivo ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: estadoActivo ? "#22c55e" : "#ef4444",
                      }}
                    />
                    {estadoActivo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de modal */}
        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
