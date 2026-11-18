import { useState } from "react";
import useModalA11y from "../../../../hooks/useModalA11y";

export default function ChangeDriverStatusModal({
  driver,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  const modalRef = useModalA11y(open, onClose);
  const [nuevoEstado, setNuevoEstado] = useState(
    driver?.estadoConductor || (driver?.estado ? "ACTIVO" : "INACTIVO")
  );
  const [motivo, setMotivo] = useState("");

  if (!open || !driver) return null;

  const usuario = driver.usuario || {};
  const targetName =
    usuario.nombreCompleto ||
    `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() ||
    usuario.correo ||
    "este conductor";

  const estadoActual = driver.estadoConductor || (driver.estado ? "ACTIVO" : "INACTIVO");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      estadoConductor: nuevoEstado,
      motivo: motivo.trim(),
    });
  };

  const getExplicacion = (estado) => {
    switch (estado) {
      case "ACTIVO":
        return "El conductor podrá operar normalmente y recibir asignaciones si su licencia está vigente.";
      case "INACTIVO":
        return "El conductor quedará suspendido temporalmente. Su disponibilidad operativa se desactivará automáticamente y no recibirá servicios.";
      case "RETIRADO":
        return "El conductor deja definitivamente de prestar servicios con la empresa. Se conservará su historial de viajes y vehículos vinculados.";
      case "FALLECIDO":
        return "Estado definitivo por defunción del conductor. Se bloquea de forma permanente cualquier asignación y se protege su historial legal y operativo.";
      default:
        return "";
    }
  };

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        className="mc-modal mc-modal--sm"
        style={{ maxWidth: 500, borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="mc-modal-header" style={{ padding: "20px 24px 16px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(249, 115, 22, 0.12)",
                color: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <div>
              <h2
                id="status-modal-title"
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#11384a",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  margin: "0 0 4px",
                  lineHeight: 1.25,
                }}
              >
                Cambiar estado del conductor
              </h2>
              <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>
                Conductor: <strong style={{ color: "#0f172a" }}>{targetName}</strong>{" "}
                (Lic. {driver.licencia})
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Seleccionar nuevo estado administrativo:
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  padding: "0 12px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: "#f8fafc",
                  color: "#0f172a",
                  outline: "none",
                }}
              >
                <option value="ACTIVO">ACTIVO (Habilitado para operar)</option>
                <option value="INACTIVO">INACTIVO (Suspensión temporal)</option>
                <option value="RETIRADO">RETIRADO (Desvinculación definitiva)</option>
                <option value="FALLECIDO">FALLECIDO (Baja por defunción)</option>
              </select>
            </div>

            {/* Cuadro de consecuencias */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background:
                  nuevoEstado === "ACTIVO"
                    ? "#f0fdf4"
                    : nuevoEstado === "FALLECIDO"
                    ? "#f8fafc"
                    : "#fffbeb",
                border: `1px solid ${
                  nuevoEstado === "ACTIVO"
                    ? "#bbf7d0"
                    : nuevoEstado === "FALLECIDO"
                    ? "#e2e8f0"
                    : "#fef3c7"
                }`,
                fontSize: 12,
                color:
                  nuevoEstado === "ACTIVO"
                    ? "#166534"
                    : nuevoEstado === "FALLECIDO"
                    ? "#334155"
                    : "#92400e",
                lineHeight: 1.4,
              }}
            >
              <strong>Consecuencia administrativa:</strong> {getExplicacion(nuevoEstado)}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Motivo u observación del cambio:
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Indica el motivo administrativo o justificación de este cambio..."
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  padding: "10px 12px",
                  fontSize: 13,
                  outline: "none",
                  background: "#f8fafc",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div
            style={{
              paddingTop: 16,
              marginTop: 14,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mc-btn-secondary"
              style={{ height: 38, padding: "0 18px", borderRadius: 10, fontSize: 13.5 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || nuevoEstado === estadoActual}
              className="mc-btn-primary"
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 700,
                background: "#0e3b43",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(14, 59, 67, 0.3)",
                opacity: nuevoEstado === estadoActual ? 0.6 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{loading ? "Actualizando..." : "Confirmar cambio de estado"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

