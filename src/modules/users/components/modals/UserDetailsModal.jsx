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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(640px, calc(100% - 40px))",
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: 30,
          background: "#ffffff",
          boxShadow: "0 30px 90px rgba(5, 16, 24, 0.28)",
          overflowY: "auto",
          border: "1px solid rgba(17, 17, 17, 0.08)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}

        <div
          style={{
            padding: "28px 32px 24px",
            borderBottom: "1px solid rgba(17, 17, 17, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#ff9a2f",
            }}
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
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fde6d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#c26b00",
                flexShrink: 0,
              }}
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
                style={{
                  margin: "4px 0 0",
                  color: "#7a7680",
                  fontSize: 14,
                }}
              >
                {user.correo || "Correo no registrado"}
              </p>
            </div>
          </div>
        </div>

        {/* Información */}

        <div
          style={{
            padding: "24px 32px",
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
                  padding: "4px 14px",
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
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "16px 32px",
            borderTop: "1px solid rgba(17, 17, 17, 0.08)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 44,
              borderRadius: 14,
              border: 0,
              background: "#ff9a2f",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              padding: "0 32px",
              boxShadow:
                "0 8px 16px rgba(255, 154, 47, 0.28)",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
