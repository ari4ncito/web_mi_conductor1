export default function UserTable({ users, onSelectUser, onEditUser, onViewDetails, onDeleteUser }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', color: '#64748b' }}>
            <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Usuario</th>
            <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rol</th>
            <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estado</th>
            <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Último acceso</th>
            <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderTop: '1px solid #f1f5f9' }}>
              <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onSelectUser(user)}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#c2410c' }}>
                  {user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{user.email}</div>
                </div>
              </td>
              <td style={{ padding: '14px', color: '#334155' }}>{user.role}</td>
              <td style={{ padding: '14px' }}>
                <span style={{ background: user.status === 'active' ? '#dcfce7' : '#fef2f2', color: user.status === 'active' ? '#166534' : '#b91c1c', borderRadius: '999px', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '14px', color: '#64748b' }}>{user.lastLogin}</td>
              <td style={{ padding: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => onViewDetails(user)} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', padding: '8px 10px', cursor: 'pointer', fontWeight: 700, color: '#334155' }}>
                    Ver detalles
                  </button>
                  <button type="button" onClick={() => onEditUser(user)} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', padding: '8px 10px', cursor: 'pointer', fontWeight: 700, color: '#334155' }}>
                    Editar
                  </button>
                  <button type="button" onClick={() => onDeleteUser(user)} style={{ border: '1px solid #fecaca', borderRadius: '10px', background: '#fff1f2', padding: '8px 10px', cursor: 'pointer', fontWeight: 700, color: '#b91c1c' }}>
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
