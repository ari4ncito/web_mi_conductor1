import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import RoleService from "../../roles/services/roleService"
import UsuarioService from "../../users/services/usuarioService"

const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(20, 45, 61, 0.78)',
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PrimarySubmitButton({ disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        minWidth: 214,
        height: 48,
        borderRadius: 16,
        border: 0,
        background: colors.accent,
        color: colors.surface,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '0 24px',
        boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)',
        fontSize: 16,
        fontWeight: 400,
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '1.6px solid rgba(255,255,255,0.9)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          lineHeight: 1,
        }}
      >
        ✓
      </span>
      <span>Registrar Cliente</span>
    </button>
  )
}

function Field({ label, name, type = "text", placeholder, value, onChange, fullWidth = false, options }) {
  return (
    <label style={{ display: 'block', width: fullWidth ? '100%' : '100%' }}>
      <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        {options ? (
          <select
            required
            name={name}
            value={value}
            onChange={onChange}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              outline: 'none',
              padding: '0 16px',
              fontSize: 16,
              color: colors.text,
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
              background: '#f8f9fa'
            }}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            required
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              outline: 'none',
              padding: '0 16px',
              fontSize: 16,
              color: colors.text,
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
              background: '#f8f9fa'
            }}
          />
        )}
      </div>
    </label>
  )
}

export default function RegisterClientModal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "CC",
    documento: "",
    correo: "",
    password: "",
    telefono: "",
    rol: "",
    estado: true,
  });

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await RoleService.getAll();
        
        let availableRoles = [];
        if (Array.isArray(response)) {
          availableRoles = response;
        } else if (Array.isArray(response?.data)) {
          availableRoles = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          availableRoles = response.data.data;
        }

        // Buscar el rol de cliente, ignorando mayúsculas/minúsculas
        const clienteRole = availableRoles.find(r => 
          r.nombre?.toLowerCase() === 'cliente' || 
          r.name?.toLowerCase() === 'cliente' ||
          r.slug?.toLowerCase() === 'cliente'
        );

        setForm(current => ({
          ...current,
          rol: clienteRole ? clienteRole._id : (availableRoles[0]?._id || "")
        }));
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };

    cargarRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: name === "estado" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UsuarioService.create(form);
      navigate('/clients', { replace: true });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      alert("Error al crear cliente: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
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
        zIndex: 30,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-client-title"
        style={{
          width: 'min(800px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: colors.surface,
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ maxWidth: 520 }}>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Cliente
              </p>
              <h2 id="register-client-title" style={{ margin: '10px 0 0', color: '#11384a', fontSize: 28, lineHeight: 1.05, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, serif' }}>
                Registrar Nuevo Cliente
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                Ingrese los datos para dar de alta un nuevo cliente en la plataforma.
              </p>
            </div>

            <Link to="/clients" aria-label="Cerrar" style={{ color: '#7a6753', textDecoration: 'none', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseIcon />
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 18px' }}>
              <Field label="Nombre" name="nombre" placeholder="Ej: John" value={form.nombre} onChange={handleChange} />
              <Field label="Apellido" name="apellido" placeholder="Ej: Doe" value={form.apellido} onChange={handleChange} />
              
              <Field 
                label="Tipo de documento" 
                name="tipoDocumento" 
                value={form.tipoDocumento} 
                onChange={handleChange}
                options={[
                  { value: 'CC', label: 'Cédula de ciudadanía' },
                  { value: 'CE', label: 'Cédula de extranjería' },
                  { value: 'TI', label: 'Tarjeta de identidad' },
                  { value: 'PAS', label: 'Pasaporte' }
                ]} 
              />
              <Field label="Documento" name="documento" placeholder="123456789" value={form.documento} onChange={handleChange} />
              
              <Field label="Correo Electrónico" name="correo" type="email" placeholder="cliente@dominio.com" value={form.correo} onChange={handleChange} />
              <Field label="Teléfono de Contacto" name="telefono" placeholder="+57 300 000 0000" value={form.telefono} onChange={handleChange} />

              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Contraseña" name="password" type="password" placeholder="Contraseña de acceso" value={form.password} onChange={handleChange} fullWidth />
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${colors.border}`, padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
            <Link to="/clients" style={{ color: '#0d7fa8', textDecoration: 'none', fontSize: 16 }}>Cancelar</Link>
            <PrimarySubmitButton disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  )
}