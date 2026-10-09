import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import ClienteService from "../services/clienteService"

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
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PrimarySubmitButton({ disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mc-btn-primary"
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

      <span>
        {disabled ? 'Registrando...' : 'Registrar Cliente'}
      </span>
    </button>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  maxLength,
  minLength,
  pattern,
  title
}) {
  return (
    <label style={{ display: 'block', width: '100%' }}>
      <div
        style={{
          color: '#6b5e52',
          fontSize: 16,
          marginBottom: 8
        }}
      >
        {label}
      </div>

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
              <option
                key={opt.value}
                value={opt.value}
              >
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
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            title={title}
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

export default function RegisterClientModal({ onSuccess, onError }) {

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
    direccion: ""

  });

  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    import("../../roles/services/roleService").then(module => {
      module.default.getAll().then(data => {
        let roles = [];
        if (Array.isArray(data)) roles = data;
        else if (data && Array.isArray(data.data)) roles = data.data;
        else if (data && data.data && Array.isArray(data.data.rows)) roles = data.data.rows;
        else if (data && Array.isArray(data.rows)) roles = data.rows;
        
        const clienteRole = roles.find(r => r.nombre && r.nombre.toLowerCase().includes('cliente'));
        if (clienteRole) setRoleId(clienteRole._id);
      }).catch(err => console.error("Error al cargar roles:", err));
    });
  }, []);


  // ==========================================
  // CAMBIAR CAMPOS
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

  };


  // ==========================================
  // REGISTRAR CLIENTE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      // Enviar al endpoint de CLIENTES
      await ClienteService.create({ ...form, rol: roleId });

      if (onSuccess) {
        onSuccess("Cliente registrado correctamente.");
      }

      navigate('/clients', {
        replace: true
      });

    } catch (error) {

      console.error(
        "Error al crear cliente:",
        error
      );

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "No se pudo registrar el cliente.";

      if (onError) {
        onError("Error al crear cliente: " + mensaje);
      } else {
        console.error("Error al crear cliente: " + mensaje);
      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div
      className="mc-modal-overlay"
    >

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-client-title"
        className="mc-modal"
      >

        {/* ================= HEADER ================= */}

        <div
          className="mc-modal-header"
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 20
            }}
          >

            <div style={{ maxWidth: 520 }}>

              <p
                className="mc-modal-subtitle"
              >
                Cliente
              </p>

              <h2
                id="register-client-title"
                className="mc-modal-title"
              >
                Registrar Nuevo Cliente
              </h2>

              <p
                className="mc-modal-desc"
              >
                Ingrese los datos para dar de alta un nuevo cliente en la plataforma.
              </p>

            </div>

            <Link
              to="/clients"
              aria-label="Cerrar"
              style={{
                color: '#7a6753',
                textDecoration: 'none',
                width: 28,
                height: 28,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CloseIcon />
            </Link>

          </div>

        </div>


        {/* ================= FORMULARIO ================= */}

        <form
          onSubmit={handleSubmit}
          className="mc-modal-body"
        >

          <div
            className="mc-modal-body"
          >

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '22px 18px'
              }}
            >

              {/* NOMBRE */}

              <Field
                label="Nombre"
                name="nombre"
                placeholder="Ej: Laura"
                value={form.nombre}
                onChange={handleChange}
                pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$"
                title="Solo letras, números y espacios"
              />


              {/* APELLIDO */}

              <Field
                label="Apellido"
                name="apellido"
                placeholder="Ej: Ramirez"
                value={form.apellido}
                onChange={handleChange}
                pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$"
                title="Solo letras, números y espacios"
              />


              {/* TIPO DOCUMENTO */}

              <Field
                label="Tipo de documento"
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                options={[
                  {
                    value: 'CC',
                    label: 'Cédula de ciudadanía'
                  },
                  {
                    value: 'CE',
                    label: 'Cédula de extranjería'
                  },
                  {
                    value: 'TI',
                    label: 'Tarjeta de identidad'
                  },
                  {
                    value: 'PAS',
                    label: 'Pasaporte'
                  }
                ]}
              />


              {/* DOCUMENTO */}

              <Field
                label="Documento"
                name="documento"
                placeholder="123456789"
                value={form.documento}
                onChange={handleChange}
                maxLength={form.tipoDocumento === 'CC' ? 10 : form.tipoDocumento === 'TI' ? 11 : form.tipoDocumento === 'CE' ? 7 : 15}
                pattern={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? "\\d+" : "^[A-Za-z0-9]+$"}
                title={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? "Solo números" : "Letras y números"}
              />


              {/* CORREO */}

              <Field
                label="Correo Electrónico"
                name="correo"
                type="email"
                placeholder="cliente@dominio.com"
                value={form.correo}
                onChange={handleChange}
              />


              {/* TELEFONO */}

              <Field
                label="Teléfono de Contacto"
                name="telefono"
                placeholder="Ej: 3000000000"
                value={form.telefono}
                onChange={handleChange}
                maxLength={10}
                minLength={10}
                pattern="\d{10}"
                title="Debe tener exactamente 10 números"
              />


              {/* DIRECCION */}

              <Field
                label="Dirección"
                name="direccion"
                placeholder="Ej: Calle 30 # 20-15"
                value={form.direccion}
                onChange={handleChange}
              />


              {/* CONTRASEÑA */}

              <Field
                label="Contraseña"
                name="password"
                type="password"
                placeholder="Contraseña de acceso"
                value={form.password}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* ================= BOTONES ================= */}

          <div
            style={{
              borderTop: `1px solid ${colors.border}`,
              padding: '20px 32px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 16
            }}
          >

            <Link
              to="/clients"
              style={{
                color: '#0d7fa8',
                textDecoration: 'none',
                fontSize: 16
              }}
            >
              Cancelar
            </Link>

            <PrimarySubmitButton
              disabled={loading}
            />

          </div>

        </form>

      </div>

    </div>

  )
}

