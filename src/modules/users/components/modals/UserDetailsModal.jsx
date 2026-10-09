export default function UserDetailsModal({
  user,
  open,
  onClose,
}) {
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
    .toUpperCase();

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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}

        <div
          className="mc-modal-header"
        >
          <p
            className="mc-modal-subtitle"
          >
            Detalles del usuario
          </p>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              className="mc-modal-title"
            >
              {initials}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#11384a",
                  lineHeight: 1.2,
                }}
              >
                {nombreCompleto}
              </h2>

              <p
                className="mc-modal-desc"
              >
                {user.correo || "Correo no registrado"}
              </p>
            </div>
          </div>
        </div>

        {/* Información */}

        <div
          style={{
            padding: '24px',
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Nombre
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
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
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Apellido
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
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
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Documento
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
                }}
              >
                {user.tipoDocumento
                  ? `${user.tipoDocumento} ${user.documento || ""}`
                  : user.documento || "No registrado"}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Teléfono
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
                }}
              >
                {user.telefono || "No registrado"}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Rol
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
                }}
              >
                {nombreRol}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Estado
              </p>

              <span
                style={{
                  display: "inline-flex",
                  marginTop: 6,
                  padding: '24px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  background: estadoActivo
                    ? "#d4f5dc"
                    : "#fce4e4",
                  color: estadoActivo
                    ? "#1f8b3c"
                    : "#c93a3a",
                }}
              >
                {estadoActivo ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Correo
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
                  wordBreak: "break-word",
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
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9a96a0",
                }}
              >
                Último acceso
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#11384a",
                }}
              >
                {user.ultimoAcceso ||
                  user.lastLogin ||
                  "Sin registros"}
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}

        <div
          className="mc-modal-footer"
        >
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

