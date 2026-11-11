import useModalA11y from "../../../../hooks/useModalA11y";

export default function DeleteUserModal({
  user,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  const modalRef = useModalA11y(open, onClose);
  if (!open || !user) return null;

  const targetName =
    user.nombreCompleto ||
    `${user.nombre || ""} ${user.apellido || ""}`.trim() ||
    user.correo ||
    "este usuario";

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="mc-modal mc-modal--sm"
        style={{ maxWidth: 480, borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="mc-modal-header" style={{ padding: "24px 24px 16px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ef4444",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                Eliminación permanente
              </p>
              <h2
                id="modal-title"
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#11384a",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  margin: "4px 0 8px",
                  lineHeight: 1.25,
                }}
              >
                ¿Deseas eliminar este usuario?
              </h2>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#475569",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Estás a punto de eliminar definitivamente al usuario{" "}
                <strong style={{ color: "#0f172a" }}>{targetName}</strong>{" "}
                ({user.correo}).
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 24px 16px" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              fontSize: 12.5,
              color: "#9f1239",
              lineHeight: 1.4,
            }}
          >
            <strong>Advertencia de integridad:</strong> Si el usuario tiene registros vinculados como Conductor o Cliente, el sistema impedirá su eliminación para proteger el historial y te sugerirá <em>desactivar su cuenta</em>.
          </div>
        </div>

        <div
          className="mc-modal-footer"
          style={{
            padding: "16px 24px",
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
            style={{ height: 38, padding: "0 18px", borderRadius: 10 }}
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
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Eliminando..." : "Eliminar permanentemente"}
          </button>
        </div>
      </div>
    </div>
  );
}
