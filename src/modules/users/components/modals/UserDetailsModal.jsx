export default function UserDetailsModal({
  user,
  open,
  onClose,
}) {
  if (!open || !user) return null;

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="border-b bg-slate-50 px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Detalles del usuario
          </p>

          <div className="mt-5 flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
              {initials}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {user.name}
              </h2>

              <p className="text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="space-y-6 p-8">

          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Teléfono
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {user.phone || "No registrado"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Rol
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Estado
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  user.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status === "active"
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Último acceso
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {user.lastLogin}
              </p>
            </div>

          </div>

        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 border-t bg-slate-50 px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Cerrar
          </button>

        </div>

      </div>
    </div>
  );
}