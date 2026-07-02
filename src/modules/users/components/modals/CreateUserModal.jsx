import { useEffect, useState } from "react";
import { createUser } from "../../services/userStorage";
import { getRoles } from "../../../roles/services/roleStorage";

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}) {
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    if (open) {
      const availableRoles = getRoles();

      setRoles(availableRoles);

      setForm({
        name: "",
        email: "",
        phone: "",
        role: availableRoles[0]?.name || "",
        status: "active",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createUser(form);

    onCreated();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 24px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ff9a2f' }}>
              Nuevo usuario
            </p>
            <h2 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
              Crear usuario
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', flexShrink: 0, padding: 4, fontSize: 22 }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d4f5c', marginBottom: 6 }}>
              Nombre
            </label>

            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', padding: '0 16px', fontSize: 14, outline: 'none', background: '#f8f9fa' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d4f5c', marginBottom: 6 }}>
              Correo
            </label>

            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', padding: '0 16px', fontSize: 14, outline: 'none', background: '#f8f9fa' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d4f5c', marginBottom: 6 }}>
              Teléfono
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', padding: '0 16px', fontSize: 14, outline: 'none', background: '#f8f9fa' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d4f5c', marginBottom: 6 }}>
                Rol
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', padding: '0 16px', fontSize: 14, outline: 'none', background: '#f8f9fa' }}
              >
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.name}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d4f5c', marginBottom: 6 }}>
                Estado
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', padding: '0 16px', fontSize: 14, outline: 'none', background: '#f8f9fa' }}
              >
                <option value="active">
                  Activo
                </option>

                <option value="inactive">
                  Inactivo
                </option>
              </select>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8, borderTop: '1px solid rgba(17, 17, 17, 0.08)', marginTop: 8 }}>

            <button
              type="button"
              onClick={onClose}
              style={{ height: 44, borderRadius: 14, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 15, fontWeight: 500, cursor: 'pointer', padding: '0 24px' }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{ height: 44, borderRadius: 14, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: '0 24px', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
            >
              Crear usuario
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}