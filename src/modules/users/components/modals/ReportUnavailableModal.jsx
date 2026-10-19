export default function ReportUnavailableModal({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal mc-modal--sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">
              Información
            </p>
            <h2 className="mc-modal-title">
              Generar reporte
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mc-modal-body">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              📄
            </div>
          </div>

          <p className="text-center text-lg font-semibold text-slate-800 mb-2">
            Función no disponible
          </p>

          <p className="text-center text-slate-500 text-sm leading-relaxed m-0">
            La generación de reportes generales aún no está disponible.
            Esta funcionalidad será incorporada en una próxima actualización
            del sistema.
          </p>
        </div>

        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-primary"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

