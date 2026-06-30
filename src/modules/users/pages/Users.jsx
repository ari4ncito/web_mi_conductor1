import { useMemo, useState } from 'react';
import UserTable from '../components/UserTable';
import EditUserModal from '../components/EditUserModal';
import { getUsers } from '../services/userStorage';

const permissionGroups = [
  {
    id: 'account',
    label: 'Cuenta',
    permissions: ['Ver perfil', 'Editar perfil', 'Cambiar contraseña'],
  },
  {
    id: 'fleet',
    label: 'Flota',
    permissions: ['Ver conductores', 'Editar conductores', 'Asignar rutas'],
  },
  {
    id: 'operations',
    label: 'Operaciones',
    permissions: ['Ver reportes', 'Exportar reportes', 'Alertas'],
  },
];

export default function Users() {
  const [users, setUsers] = useState(getUsers());
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(getUsers()[0]);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query));
  }, [users, search]);

  const toggleGroup = (groupId) => {
    setCollapsedGroups((current) => ({ ...current, [groupId]: !current[groupId] }));
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setSelectedUser(updatedUser);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`¿Eliminar a ${user.name}?`)) {
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Administración / Configuración</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">Gestión de usuarios</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">Administra acceso, roles y estado de los usuarios del portal.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-500"
            >
              + Nuevo usuario
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Usuarios</h2>
                <p className="mt-1 text-sm text-slate-500">Filtra por nombre, correo o rol.</p>
              </div>
              <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <span className="text-slate-400">🔎</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar usuarios"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="p-6">
              <UserTable
                users={filteredUsers}
                onSelectUser={setSelectedUser}
                onEditUser={handleEditUser}
                onViewDetails={handleViewDetails}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          </section>

          <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.28em] text-orange-500">Ajustes de usuario</p>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{selectedUser?.name ?? 'Selecciona un usuario'}</h2>
              <p className="mt-2 text-sm text-slate-500">Visualiza información rápida y permisos.</p>
            </div>

            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Correo</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Teléfono</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser?.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Rol asignado</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedUser?.role ?? '—'}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {permissionGroups.map((group) => {
                const isCollapsed = collapsedGroups[group.id];
                return (
                  <div key={group.id} className="overflow-hidden rounded-3xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      <span>{group.label}</span>
                      <span className="text-slate-400">{isCollapsed ? '+' : '−'}</span>
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-3 border-t border-slate-200 bg-white px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {group.permissions.map((permission) => (
                            <span key={permission} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      <EditUserModal user={selectedUser} open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveUser} />
    </div>
  );
}
