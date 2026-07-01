export default function UserTable({
  users,
  onViewDetails,
  onEditUser,
  onDeleteUser,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-slate-50">
            <tr className="text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4 text-left font-semibold">
                Usuario
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Rol
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Estado
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Último acceso
              </th>

              <th className="px-6 py-4 text-center font-semibold">
                Acciones
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">

            {users.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="py-14 text-center text-slate-500"
                >
                  No existen usuarios registrados.
                </td>
              </tr>

            ) : (

              users.map((user) => {

                const initials = user.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("");

                return (

                  <tr
                    key={user.id}
                    className="transition hover:bg-orange-50/40"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow">

                          {initials}

                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">

                        {user.role}

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "active"
                          ? "Activo"
                          : "Inactivo"}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">

                      {user.lastLogin}

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => onViewDetails(user)}
                          className="rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                        >
                          👁 Ver
                        </button>

                        <button
                          onClick={() => onEditUser(user)}
                          className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
                        >
                          ✏ Editar
                        </button>

                        <button
                          onClick={() => onDeleteUser(user)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                        >
                          🗑 Eliminar
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              })

            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}