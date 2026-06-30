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
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ margin: 0, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Administración / Configuración</p>
          <h1 style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>Gestión de Usuarios</h1>
        </div>
        <button type="button" style={{ border: 'none', borderRadius: '999px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', padding: '12px 18px', cursor: 'pointer', fontWeight: 700 }}>
          + Nuevo usuario
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '20px', alignItems: 'start' }}>
        <div style={{ borderRadius: '24px', background: '#fff', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Usuarios</h2>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar usuario" style={{ width: '240px', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '10px 12px', outline: 'none' }} />
          </div>
          <UserTable users={filteredUsers} onSelectUser={setSelectedUser} onEditUser={handleEditUser} onViewDetails={handleViewDetails} onDeleteUser={handleDeleteUser} />
        </div>

        <div style={{ borderRadius: '24px', background: '#fff', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: 0, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Ajustes de usuario</p>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{selectedUser?.name || 'Selecciona un usuario'}</h2>
          </div>

          <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Correo</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedUser?.email}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Teléfono</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedUser?.phone}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Rol</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedUser?.role}</div>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {permissionGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.id];
              return (
                <div key={group.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                  <button type="button" onClick={() => toggleGroup(group.id)} style={{ width: '100%', background: '#fff', border: 'none', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, color: '#0f172a', textAlign: 'left' }}>
                    <span>{group.label}</span>
                    <span>{isCollapsed ? '+' : '−'}</span>
                  </button>
                  {!isCollapsed && (
                    <div style={{ padding: '0 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {group.permissions.map((permission) => (
                        <span key={permission} style={{ background: '#fff7ed', color: '#c2410c', borderRadius: '999px', padding: '6px 10px', fontSize: '0.83rem' }}>
                          {permission}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EditUserModal user={selectedUser} open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveUser} />
    </div>
  );
}
