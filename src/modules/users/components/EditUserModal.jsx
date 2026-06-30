import { useEffect, useState } from 'react';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalStyle = {
  width: '100%',
  maxWidth: '560px',
  background: '#fff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.2)',
};

export default function EditUserModal({ user, open, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Operador', status: 'active' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Operador',
        status: user.status || 'active',
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...user, ...form });
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <p style={{ margin: 0, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Editar usuario</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem', color: '#0f172a' }}>{user.name}</h3>
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }} />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Correo</label>
            <input name="email" value={form.email} onChange={handleChange} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px' }} />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Rol</label>
            <select name="role" value={form.role} onChange={handleChange} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px', background: '#fff' }}>
              <option value="Administrador">Administrador</option>
              <option value="Operador">Operador</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Estado</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['active', 'inactive'].map((option) => {
                const selected = form.status === option;
                return (
                  <button type="button" key={option} onClick={() => setForm((current) => ({ ...current, status: option }))} style={{ border: selected ? '1px solid #f97316' : '1px solid #e2e8f0', background: selected ? '#fff7ed' : '#fff', color: selected ? '#c2410c' : '#334155', borderRadius: '999px', padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>
                    {option === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ border: 'none', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', background: '#f97316', color: '#fff' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
