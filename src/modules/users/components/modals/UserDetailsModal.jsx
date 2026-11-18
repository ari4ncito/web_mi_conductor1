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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const calcularEdad = (fechaStr) => {
  if (!fechaStr) return null;
  const hoy = new Date();
  const fechaNac = new Date(fechaStr);
  if (isNaN(fechaNac.getTime())) return null;
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad >= 0 ? edad : null;
};

const formatearFechaNacimiento = (fechaStr) => {
  if (!fechaStr) return "No registrada";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return fechaStr;
  return fecha.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function UserDetailsModal({
  user,
  open,
  onClose,
}) {
  const modalRef = useModalA11y(open, onClose);

  if (!open || !user) return null;

  const nombreCompleto =
    user.nombreCompleto ||
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

  const edadFinal =
    user.edad !== undefined && user.edad !== null && user.edad !== ""
      ? `${user.edad} años`
      : user.fechaNacimiento && calcularEdad(user.fechaNacimiento) !== null
        ? `${calcularEdad(user.fechaNacimiento)} años`
        : "No registrada";

  const fieldLabelStyle = {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const fieldValueStyle = {
    margin: "4px 0 0",
    fontSize: 14.5,
    fontWeight: 600,
    color: "#0f172a",
    lineHeight: 1.4,
  };

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{
          maxWidth: 720,
          width: "100%",
          maxHeight: "none",
          borderRadius: 20,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Encabezado */}
        <div
          style={{
            padding: "13px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                color: "#ffffff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                textTransform: "uppercase",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
              }}
            >
              {initials}
            </div>

            <div>
              <h2
                id="user-details-title"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#11384a",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  lineHeight: 1.2,
                }}
              >
                {nombreCompleto}
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
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
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Cuerpo sin scroll */}
        <div
          style={{
            padding: "16px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "14px 18px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
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
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Información del Usuario
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 18px",
              }}
            >
              {/* 1. Tipo de documento y Documento */}
              <div>
                <p style={fieldLabelStyle}>Tipo de documento</p>
                <p style={fieldValueStyle}>
                  {user.tipoDocumento || "No registrado"}
                </p>
              </div>

              <div>
                <p style={fieldLabelStyle}>Documento</p>
                <p style={fieldValueStyle}>
                  {user.documento || "No registrado"}
                </p>
              </div>

              {/* 2. Nombre completo y Correo */}
              <div>
                <p style={fieldLabelStyle}>Nombre completo</p>
                <p style={fieldValueStyle}>
                  {nombreCompleto}
                </p>
              </div>

              <div>
                <p style={fieldLabelStyle}>Correo electrónico</p>
                <p style={{ ...fieldValueStyle, wordBreak: "break-all" }}>
                  {user.correo || "No registrado"}
                </p>
              </div>

              {/* 3. Fecha de nacimiento y Edad */}
              <div>
                <p style={fieldLabelStyle}>Fecha de nacimiento</p>
                <p style={fieldValueStyle}>
                  {formatearFechaNacimiento(user.fechaNacimiento)}
                </p>
              </div>

              <div>
                <p style={fieldLabelStyle}>Edad</p>
                <p style={fieldValueStyle}>
                  {edadFinal}
                </p>
              </div>

              {/* 4. Teléfono y Rol */}
              <div>
                <p style={fieldLabelStyle}>Teléfono</p>
                <p style={fieldValueStyle}>
                  {user.telefono || "No registrado"}
                </p>
              </div>

              <div>
                <p style={fieldLabelStyle}>Rol asignado</p>
                <div style={{ marginTop: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 6,
                      background: "#f1f5f9",
                      color: "#334155",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "1px solid #e2e8f0",
                      textTransform: "uppercase",
                    }}
                  >
                    {nombreRol}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de modal */}
        <div
          style={{
            padding: "12px 26px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-primary"
            style={{
              height: 38,
              padding: "0 22px",
              fontSize: 13.5,
              borderRadius: 9,
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
