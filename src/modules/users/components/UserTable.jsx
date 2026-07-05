const headerStyle = { padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' };
const cellStyle = { padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' };

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M9 7V5.5h6V7M8 7l.8 12h6.4L16 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function BaseIconButton({ children, title, onClick, color = '#111111' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        border: '1px solid rgba(17, 17, 17, 0.08)',
        background: '#ffffff',
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(18, 39, 52, 0.04)',
      }}
    >
      {children}
    </button>
  )
}

export default function UserTable({
  users,
  onViewDetails,
  onEditUser,
  onDeleteUser,
}) {
  return (
    <div style={{ background: '#edf3fa' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>

          <thead>
            <tr>
              <th style={headerStyle}>Usuario</th>
              <th style={headerStyle}>Rol</th>
              <th style={headerStyle}>Estado</th>
              <th style={headerStyle}>Último acceso</th>
              <th style={headerStyle}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#667085', fontSize: 16 }}>
                  No existen usuarios registrados.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const initials = user.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("");

                return (
                  <tr key={user.id} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #fb923c, #ea580c)', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textTransform: 'uppercase' }}>
                          {initials}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2 }}>{user.name}</div>
                          <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, marginTop: 2 }}>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 20, background: '#f1f5f9', color: '#334155', fontSize: 14, fontWeight: 500 }}>
                        {user.role}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        background: user.status === 'active' ? '#d1fae5' : '#fee2e2',
                        color: user.status === 'active' ? '#065f46' : '#991b1b',
                      }}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td style={cellStyle}>{user.lastLogin}</td>

                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <BaseIconButton title="Ver detalle" onClick={() => onViewDetails(user)}>
                          <EyeIcon />
                        </BaseIconButton>
                        <BaseIconButton title="Editar" onClick={() => onEditUser(user)}>
                          <PencilIcon />
                        </BaseIconButton>
                        <BaseIconButton title="Eliminar" onClick={() => onDeleteUser(user)} color="#c64a4a">
                          <TrashIcon />
                        </BaseIconButton>
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