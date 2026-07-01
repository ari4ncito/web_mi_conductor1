export default function DeleteUserModal({
  user,
  open,
  onClose,
  onConfirm,
}) {
  if (!open || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
        style={{ maxWidth: 'min(560px, calc(100% - 64px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Eliminar usuario
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Confirmar eliminación
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              🗑️
            </div>
          </div>

          <p className="text-center text-slate-600">
            ¿Estás seguro de eliminar al usuario
            <br />
            <span className="font-bold text-slate-900">
              {user.name}
            </span>
            ?
          </p>

          <p className="text-center text-sm text-slate-500">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}