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
  title,
  required = true,
  helperText,
  status,
}) {
  const borderColor =
    status === 'error'
      ? '#ef4444'
      : status === 'success'
      ? '#22c55e'
      : 'rgba(17, 17, 17, 0.08)'

  return (
    <label style={{ display: 'block', width: '100%' }}>
      <div
        style={{
          color: '#3d4f5c',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span>{label}</span>
        {required && <span className="text-red-500" style={{ color: '#ef4444' }}>*</span>}
      </div>

      <div style={{ position: 'relative' }}>
        {options ? (
          <select
            required={required}
            name={name}
            value={value}
            onChange={onChange}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 12,
              border: `1px solid ${borderColor}`,
              outline: 'none',
              padding: '0 14px',
              fontSize: 14,
              color: '#1b1b1b',
              boxSizing: 'border-box',
              background: '#f8f9fa',
              transition: 'border-color 0.2s, box-shadow 0.2s',
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
            required={required}
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
              height: 44,
              borderRadius: 12,
              border: `1px solid ${borderColor}`,
              outline: 'none',
              padding: '0 14px',
              fontSize: 14,
              color: '#1b1b1b',
              boxSizing: 'border-box',
              background: '#f8f9fa',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        )}
      </div>

      {helperText ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: status === 'error' ? '#ef4444' : status === 'success' ? '#16a34a' : '#64748b',
          }}
        >
          {helperText}
        </div>
      ) : null}
    </label>
  )
}

export default function RegisterClientModal({ onSuccess, onError }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [docVerifying, setDocVerifying] = useState(false);
  const [docError, setDocError] = useState("");
  const [docAvailable, setDocAvailable] = useState(false);
  const [docAlert, setDocAlert] = useState("");

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
  // VERIFICAR DISPONIBILIDAD DE DOCUMENTO
  // ==========================================
  useEffect(() => {
    const docClean = (form.documento || "").trim();
    if (!docClean || docClean.length < 5) {
      setDocError("");
      setDocAvailable(false);
      setDocVerifying(false);
      return;
    }

    setDocVerifying(true);
    setDocError("");
    setDocAvailable(false);

    const timer = setTimeout(async () => {
      try {
        const res = await ClienteService.verificarDocumento(docClean);
        const data = res?.data || res;
        if (data?.existe) {
          const docExistente = docClean;
          setDocAlert(`¡El usuario ya existe! El documento ${docExistente} ya se encuentra registrado en el sistema. Los campos han sido limpiados.`);
          setForm({
            nombre: "",
            apellido: "",
            tipoDocumento: "CC",
            documento: "",
            correo: "",
            password: "",
            telefono: "",
            direccion: ""
          });
          setDocError("Ya existe un usuario registrado con este documento.");
          setDocAvailable(false);
          if (onError) {
            onError(`El documento ${docExistente} ya está registrado en el sistema.`);
          }
        } else {
          setDocError("");
          setDocAvailable(true);
        }
      } catch (err) {
        console.error("Error al verificar documento:", err);
      } finally {
        setDocVerifying(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [form.documento]);

  // ==========================================
  // CAMBIAR CAMPOS
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "documento" && docAlert) {
      setDocAlert("");
    }

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

    if (docError) {
      if (onError) onError(docError);
      return;
    }

    if (docVerifying) {
      return;
    }

    setLoading(true);

    try {

      // Asignar el número de documento como contraseña inicial
      const payload = {
        ...form,
        password: (form.documento || "").trim(),
        rol: roleId
      };

      await ClienteService.create(payload);

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
              className="mc-modal-close"
              style={{ textDecoration: 'none' }}
            >
              <CloseIcon />
            </Link>

          </div>

        </div>


        {/* ================= FORMULARIO ================= */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflowY: 'hidden'
          }}
        >

          <div
            className="mc-modal-body"
            style={{
              padding: '24px 32px',
              overflowY: 'auto'
            }}
          >
            {/* ALERTA DE USUARIO EXISTENTE / CAMPOS LIMPIADOS */}
            {docAlert && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>
                      {docAlert}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDocAlert("")}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 16,
                    color: '#991b1b',
                    cursor: 'pointer',
                    fontWeight: 700,
                    padding: '0 4px',
                  }}
                  title="Cerrar aviso"
                >
                  ✕
                </button>
              </div>
            )}

            <p
              style={{
                fontSize: 12.5,
                color: '#64748b',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>Los campos marcados con</span>
              <span className="text-red-500" style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              <span>son obligatorios.</span>
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '20px 24px'
              }}
            >

              {/* 1. TIPO DOCUMENTO (DE PRIMEROS) */}

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


              {/* 2. DOCUMENTO (DE PRIMEROS) */}

              <Field
                label="Documento"
                name="documento"
                placeholder="123456789"
                value={form.documento}
                onChange={handleChange}
                maxLength={form.tipoDocumento === 'CC' ? 10 : form.tipoDocumento === 'TI' ? 11 : form.tipoDocumento === 'CE' ? 7 : 15}
                pattern={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? "\\d+" : "^[A-Za-z0-9]+$"}
                title={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? "Solo números" : "Letras y números"}
                status={
                  docError ? 'error'
                  : docAvailable && form.documento.trim().length >= 5 ? 'success'
                  : undefined
                }
                helperText={
                  docVerifying
                    ? '⏳ Verificando documento...'
                    : docError
                    ? `⚠ ${docError}`
                    : docAvailable && form.documento.trim().length >= 5
                    ? '✓ Documento disponible'
                    : undefined
                }
              />


              {/* 3. NOMBRE */}

              <Field
                label="Nombres"
                name="nombre"
                placeholder="Ej: Laura"
                value={form.nombre}
                onChange={handleChange}
                pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$"
                title="Solo letras, números y espacios"
              />


              {/* 4. APELLIDO */}

              <Field
                label="Apellidos"
                name="apellido"
                placeholder="Ej: Ramirez"
                value={form.apellido}
                onChange={handleChange}
                pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$"
                title="Solo letras, números y espacios"
              />


              {/* 5. CORREO */}

              <Field
                label="Correo Electrónico"
                name="correo"
                type="email"
                placeholder="cliente@dominio.com"
                value={form.correo}
                onChange={handleChange}
              />


              {/* 6. TELEFONO */}

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


              {/* 7. DIRECCION (OCUPA AMBAS COLUMNAS) */}

              <div style={{ gridColumn: '1 / -1' }}>
                <Field
                  label="Dirección"
                  name="direccion"
                  placeholder="Ej: Calle 30 # 20-15"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>


              {/* ALERTA CORREO ELECTRÓNICO PARA CREDENCIALES */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>📧</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                      Correo electrónico obligatorio para credenciales de acceso
                    </span>
                    <p style={{ fontSize: 12.5, color: '#b45309', marginTop: 3, marginBottom: 0 }}>
                      El correo electrónico debe existir y ser válido, ya que allí el cliente recibirá la bienvenida y sus credenciales de acceso al sistema (usuario y contraseña).
                    </p>
                  </div>
                </div>
              </div>


              {/* CONTRASEÑA AUTOMÁTICA - INFO */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🔑</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>
                      Contraseña inicial automática
                    </span>
                    <p style={{ fontSize: 12.5, color: '#0369a1', marginTop: 3, marginBottom: 0 }}>
                      La contraseña inicial del cliente será su número de documento. Podrá cambiarla desde su perfil al iniciar sesión.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>


          {/* ================= BOTONES ================= */}

          <div className="mc-modal-footer">
            <Link
              to="/clients"
              className="mc-btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Cancelar
            </Link>

            <PrimarySubmitButton
              disabled={loading || !!docError || docVerifying}
            />
          </div>

        </form>

      </div>

    </div>

  )
}

