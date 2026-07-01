export default function ReportUnavailableModal({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Información
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Generar reporte
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              📄
            </div>
          </div>

          <p className="text-center text-lg font-semibold text-slate-800">
            Función no disponible
          </p>

          <p className="text-center text-slate-500">
            La generación de reportes generales aún no está disponible.
            Esta funcionalidad será incorporada en una próxima actualización
            del sistema.
          </p>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}