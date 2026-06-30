export default function UserTable({ users, onSelectUser, onEditUser, onViewDetails, onDeleteUser }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Usuario</th>
            <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Rol</th>
            <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Estado</th>
            <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Último acceso</th>
            <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td
                className="px-5 py-4"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center justify-center">
                    {user.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-700">{user.role}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-5 py-4 text-slate-500">{user.lastLogin}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails(user)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Ver detalles
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditUser(user)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteUser(user)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
