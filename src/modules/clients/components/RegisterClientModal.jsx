import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteService from '../services/clienteService.js';

function parseNombreCompleto(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { nombre: '', apellido: '' };
  if (parts.length === 1) return { nombre: parts[0], apellido: '' };
  if (parts.length === 2) return { nombre: parts[0], apellido: parts[1] };
  if (parts.length === 3) return { nombre: parts[0], apellido: `${parts[1]} ${parts[2]}` };
  const mid = Math.floor(parts.length / 2);
  return {
    nombre: parts.slice(0, mid).join(' '),
    apellido: parts.slice(mid).join(' '),
  };
}

function calcularEdad(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return '';
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  return edad >= 0 && edad < 130 ? `${edad} años` : '';
}

export default function RegisterClientModal({ onSuccess, onError }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [docVerifying, setDocVerifying] = useState(false);
  const [docError, setDocError] = useState('');
  const [docAvailable, setDocAvailable] = useState(false);

  const [form, setForm] = useState({
    tipoDocumento: 'CC',
    documento: '',
    nombreCompleto: '',
    correo: '',
    fechaNacimiento: '',
    edad: '',
    telefono: '',
    direccion: '',
  });

  const [roleId, setRoleId] = useState('');

  // Cargar rol CLIENTE
  useEffect(() => {
    import('../../roles/services/roleService')
      .then((module) => {
        module.default
          .getAll()
          .then((data) => {
            let roles = [];
            if (Array.isArray(data)) roles = data;
            else if (data && Array.isArray(data.data)) roles = data.data;
            else if (data?.data && Array.isArray(data.data.rows)) roles = data.data.rows;
            else if (data && Array.isArray(data.rows)) roles = data.rows;

            const clienteRole = roles.find(
              (r) => r.nombre && r.nombre.toLowerCase().includes('cliente')
            );
            if (clienteRole) setRoleId(clienteRole._id);
          })
          .catch((err) => console.error('Error al cargar roles:', err));
      })
      .catch(() => {});
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/clients', { replace: true });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Verificar documento duplicado
  useEffect(() => {
    const docClean = (form.documento || '').trim();
    if (!docClean || docClean.length < 5) {
      setDocError('');
      setDocAvailable(false);
      setDocVerifying(false);
      return;
    }

    setDocVerifying(true);
    setDocError('');
    setDocAvailable(false);

    const timer = setTimeout(async () => {
      try {
        const res = await ClienteService.verificarDocumento(docClean);
        const data = res?.data || res;
        if (data?.existe) {
          setDocError(`El documento ${docClean} ya se encuentra registrado.`);
          setDocAvailable(false);
        } else {
          setDocError('');
          setDocAvailable(true);
        }
      } catch (err) {
        console.error('Error al verificar documento:', err);
      } finally {
        setDocVerifying(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [form.documento]);

  // Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fechaNacimiento') {
      const edadCalc = calcularEdad(value);
      setForm((prev) => ({
        ...prev,
        fechaNacimiento: value,
        edad: edadCalc,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    navigate('/clients', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (docError) {
      if (onError) onError(docError);
      return;
    }

    if (docVerifying) return;

    setLoading(true);

    try {
      const { nombre, apellido } = parseNombreCompleto(form.nombreCompleto);

      const payload = {
        ...form,
        nombre: nombre || form.nombreCompleto.trim(),
        apellido: apellido || '',
        nombreCompleto: form.nombreCompleto.trim(),
        password: (form.documento || '').trim(),
        rol: roleId,
      };

      await ClienteService.create(payload);

      if (onSuccess) {
        onSuccess('Cliente registrado correctamente.');
      }

      navigate('/clients', { replace: true });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'No se pudo registrar el cliente.';

      if (onError) {
        onError('Error al crear cliente: ' + mensaje);
      }
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#3d4f5c',
    marginBottom: 6,
  };

  const inputStyle = {
    width: '100%',
    height: 42,
    borderRadius: 12,
    border: '1px solid rgba(17, 17, 17, 0.12)',
    outline: 'none',
    padding: '0 14px',
    fontSize: 14,
    color: '#1b1b1b',
    background: '#f8f9fa',
    boxSizing: 'border-box',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  };

  const docBorderColor = docError
    ? '#ef4444'
    : docAvailable && form.documento.trim().length >= 5
    ? '#22c55e'
    : 'rgba(17, 17, 17, 0.12)';

  return (
    <div
      className="mc-modal-overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-client-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(760px, calc(100% - 24px))',
          backgroundColor: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px 16px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <h2
            id="register-client-title"
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: '#11384a',
            }}
          >
            Registrar cliente
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1e293b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
          >
            ✕
          </button>
        </div>

        {/* ================= FORMULARIO ================= */}
        <form onSubmit={handleSubmit} style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '22px 28px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                columnGap: 20,
                rowGap: 14,
              }}
            >
              {/* FILA 1: Tipo de documento & Documento */}
              <div>
                <label style={labelStyle}>
                  Tipo de documento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  required
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Documento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  name="documento"
                  placeholder="Número de documento"
                  value={form.documento}
                  onChange={handleChange}
                  maxLength={form.tipoDocumento === 'CC' ? 10 : form.tipoDocumento === 'TI' ? 11 : form.tipoDocumento === 'CE' ? 7 : 15}
                  pattern={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? '\\d+' : '^[A-Za-z0-9]+$'}
                  title={form.tipoDocumento === 'CC' || form.tipoDocumento === 'TI' ? 'Solo números' : 'Letras y números'}
                  style={{
                    ...inputStyle,
                    borderColor: docBorderColor,
                  }}
                />
                {docVerifying ? (
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                    ⏳ Verificando documento...
                  </span>
                ) : docError ? (
                  <span style={{ fontSize: 11, color: '#ef4444', marginTop: 4, display: 'block', fontWeight: 500 }}>
                    ⚠ {docError}
                  </span>
                ) : docAvailable && form.documento.trim().length >= 5 ? (
                  <span style={{ fontSize: 11, color: '#16a34a', marginTop: 4, display: 'block', fontWeight: 500 }}>
                    ✓ Documento disponible
                  </span>
                ) : null}
              </div>

              {/* FILA 2: Nombre completo & Correo electrónico */}
              <div>
                <label style={labelStyle}>
                  Nombre completo <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  name="nombreCompleto"
                  placeholder="Ej. Juan Carlos Pérez Gómez"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$"
                  title="Solo letras y espacios"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Correo electrónico <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  type="email"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  value={form.correo}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* FILA 3: Fecha de nacimiento & Edad */}
              <div>
                <label style={labelStyle}>
                  Fecha de nacimiento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  type="date"
                  name="fechaNacimiento"
                  placeholder="dd/mm/aaaa"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    ...inputStyle,
                    color: form.fechaNacimiento ? '#1b1b1b' : '#94a3b8',
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Edad</label>
                <input
                  readOnly
                  disabled
                  name="edad"
                  placeholder="Se calcula automáticamente"
                  value={form.edad}
                  style={{
                    ...inputStyle,
                    background: '#f1f5f9',
                    color: '#475569',
                    cursor: 'default',
                  }}
                />
              </div>

              {/* FILA 4: Teléfono & Dirección */}
              <div>
                <label style={labelStyle}>
                  Teléfono <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  type="tel"
                  name="telefono"
                  placeholder="Ej. 3001234567"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength={10}
                  minLength={10}
                  pattern="\d{10}"
                  title="Debe tener exactamente 10 números"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Dirección</label>
                <input
                  name="direccion"
                  placeholder="Ej. Calle 30 # 20-15"
                  value={form.direccion}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* AVISO INFORMATIVO DE SEGURIDAD (FIGMA STANDARD) */}
            <div
              style={{
                marginTop: 16,
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ color: '#2563eb', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  color: '#1e40af',
                  lineHeight: 1.35,
                }}
              >
                Por seguridad, la contraseña se establecerá mediante un enlace de activación seguro enviado automáticamente al correo del usuario.
              </p>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div
            style={{
              padding: '14px 28px 20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || !!docError || docVerifying}
              style={{
                height: 42,
                padding: '0 28px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #fb923c, #f97316)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading || !!docError || docVerifying ? 'not-allowed' : 'pointer',
                opacity: loading || !!docError || docVerifying ? 0.6 : 1,
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? 'Registrando...' : 'Registrar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
