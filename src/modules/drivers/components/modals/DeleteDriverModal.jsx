import useModalA11y from "../../../../hooks/useModalA11y";

export default function DeleteDriverModal({
  driver,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  const modalRef = useModalA11y(open, onClose);
  if (!open || !driver) return null;

  const usuario = driver.usuario || {};
  const targetName =
    usuario.nombreCompleto ||
    `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() ||
    usuario.correo ||
    "este conductor";

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-driver-title"
        className="mc-modal mc-modal--sm"
        style={{ maxWidth: 490, borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="mc-modal-header" style={{ padding: "20px 24px 16px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#dc2626",
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
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#dc2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                Eliminación de la tabla
              </p>
              <h2
                id="delete-driver-title"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#11384a",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  margin: "3px 0 6px",
                  lineHeight: 1.25,
                }}
              >
                ¿Deseas quitar este conductor de la tabla?
              </h2>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                Se removerá a <strong style={{ color: "#0f172a" }}>{targetName}</strong> de la vista del listado de la tabla.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 24px 16px" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              fontSize: 12,
              color: "#1e40af",
              lineHeight: 1.4,
            }}
          >
            <strong>Protección de datos:</strong> Esta acción únicamente quita el registro de la vista de la tabla. La información, licencias y servicios del conductor se mantienen íntegros y seguros en la base de datos.
          </div>
        </div>

        <div
          style={{
            padding: "14px 24px 18px",
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
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="mc-btn-danger"
            style={{
              height: 38,
              padding: "0 20px",
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Quitando..." : "Quitar de la tabla"}
          </button>
        </div>
      </div>
    </div>
  );
}
