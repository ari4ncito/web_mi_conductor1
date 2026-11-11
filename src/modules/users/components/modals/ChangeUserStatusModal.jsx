import useModalA11y from "../../../../hooks/useModalA11y";

export default function ChangeUserStatusModal({
  user,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  const modalRef = useModalA11y(open, onClose);
  if (!open || !user) return null;

  const willDeactivate = Boolean(user.estado);
  const targetName =
    user.nombreCompleto ||
    `${user.nombre || ""} ${user.apellido || ""}`.trim() ||
    user.correo ||
    "este usuario";

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
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
                background: willDeactivate
                  ? "rgba(245, 158, 11, 0.14)"
                  : "rgba(34, 197, 94, 0.14)",
                color: willDeactivate ? "#d97706" : "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {willDeactivate ? (
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>

            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: willDeactivate ? "#d97706" : "#16a34a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {willDeactivate ? "Desactivar cuenta" : "Reactivar cuenta"}
              </p>
              <h2
                id="status-modal-title"
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#11384a",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  margin: "4px 0 8px",
                  lineHeight: 1.25,
                }}
              >
                {willDeactivate
                  ? "¿Deseas desactivar este usuario?"
                  : "¿Deseas reactivar este usuario?"}
              </h2>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#475569",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Usuario: <strong style={{ color: "#0f172a" }}>{targetName}</strong>{" "}
                ({user.correo})
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 24px 16px" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: willDeactivate ? "#fffbeb" : "#f0fdf4",
              border: `1px solid ${willDeactivate ? "#fef3c7" : "#bbf7d0"}`,
              fontSize: 12.5,
              color: willDeactivate ? "#92400e" : "#166534",
              lineHeight: 1.4,
            }}
          >
            {willDeactivate ? (
              <>
                <strong>Consecuencias de la desactivación:</strong> El usuario
                no podrá iniciar sesión en la plataforma ni acceder a los
                servicios administrativos. Su información histórica y registros
                asociados se conservarán intactos en el sistema.
              </>
            ) : (
              <>
                <strong>Consecuencias de la reactivación:</strong> El usuario
                podrá volver a iniciar sesión y acceder a las funciones que su
                rol le permita dentro de la plataforma.
              </>
            )}
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
            className={willDeactivate ? "mc-btn-danger" : "mc-btn-primary"}
            style={{
              height: 38,
              padding: "0 20px",
              borderRadius: 10,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Procesando..."
              : willDeactivate
              ? "Sí, desactivar usuario"
              : "Sí, activar usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

