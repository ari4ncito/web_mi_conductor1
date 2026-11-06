import { useState, useEffect, useRef } from 'react';

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

export default function ClientFormModal({
  title,
  client,
  readOnly = false,
  submitLabel = 'Guardar cambios',
  closeLabel = 'Cancelar',
  onClose,
  onSubmit,
}) {
  const modalRef = useRef(null);

  const getNombreCompleto = (c) => {
    if (!c) return '';
    if (c.nombreCompleto) return c.nombreCompleto;
    const n = c.nombre || c.usuario?.nombre || '';
    const a = c.apellido || c.usuario?.apellido || '';
    return `${n} ${a}`.trim();
  };

  const [form, setForm] = useState({
    tipoDocumento: client?.tipoDocumento || client?.usuario?.tipoDocumento || 'CC',
    documento: client?.documento || client?.usuario?.documento || '',
    nombreCompleto: getNombreCompleto(client),
    correo: client?.correo || client?.usuario?.correo || '',
    fechaNacimiento: client?.fechaNacimiento ? String(client.fechaNacimiento).split('T')[0] : '',
    edad: client?.edad || calcularEdad(client?.fechaNacimiento),
    telefono: client?.telefono || client?.usuario?.telefono || '',
    direccion: client?.direccion || '',
    estado: client?.estado ?? true,
  });

  useEffect(() => {
    if (client) {
      const fechaNac = client.fechaNacimiento ? String(client.fechaNacimiento).split('T')[0] : '';
      setForm({
        tipoDocumento: client.tipoDocumento || client.usuario?.tipoDocumento || 'CC',
        documento: client.documento || client.usuario?.documento || '',
        nombreCompleto: getNombreCompleto(client),
        correo: client.correo || client.usuario?.correo || '',
        fechaNacimiento: fechaNac,
        edad: client.edad || calcularEdad(fechaNac),
        telefono: client.telefono || client.usuario?.telefono || '',
        direccion: client.direccion || '',
        estado: client.estado ?? true,
      });
    }
  }, [client]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) {
      onClose?.();
      return;
    }

    const { nombre, apellido } = parseNombreCompleto(form.nombreCompleto);

    const payload = {
      ...client,
      ...form,
      nombre: nombre || form.nombreCompleto.trim(),
      apellido: apellido || '',
      nombreCompleto: form.nombreCompleto.trim(),
    };

    if (onSubmit) {
      onSubmit(payload);
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
    background: readOnly ? '#f8fafc' : '#f8f9fa',
    boxSizing: 'border-box',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  };

  const modalTitle = readOnly
    ? 'Detalle del cliente'
    : title && title.toLowerCase().includes('editar')
    ? 'Editar cliente'
    : title || 'Editar cliente';

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
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
        aria-labelledby="client-form-title"
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
            id="client-form-title"
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: '#11384a',
            }}
          >
            {modalTitle}
          </h2>

          <button
            type="button"
            onClick={onClose}
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
                  Tipo de documento {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <select
                  disabled={readOnly}
                  required={!readOnly}
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
                  Documento {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  required={!readOnly}
                  name="documento"
                  placeholder="Número de documento"
                  value={form.documento}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* FILA 2: Nombre completo & Correo electrónico */}
              <div>
                <label style={labelStyle}>
                  Nombre completo {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  required={!readOnly}
                  name="nombreCompleto"
                  placeholder="Ej. Juan Carlos Pérez Gómez"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Correo electrónico {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  required={!readOnly}
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
                  Fecha de nacimiento {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
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
                  Teléfono {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  required={!readOnly}
                  type="tel"
                  name="telefono"
                  placeholder="Ej. 3001234567"
                  value={form.telefono}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Dirección</label>
                <input
                  readOnly={readOnly}
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
                {readOnly
                  ? 'Toda la información del cliente se muestra en modo de solo lectura.'
                  : 'Por seguridad, la contraseña se establecerá mediante un enlace de activación seguro enviado automáticamente al correo del usuario.'}
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
              onClick={onClose}
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
              {closeLabel}
            </button>

            {!readOnly && (
              <button
                type="submit"
                style={{
                  height: 42,
                  padding: '0 28px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #fb923c, #f97316)',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.15s ease',
                }}
              >
                {submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
