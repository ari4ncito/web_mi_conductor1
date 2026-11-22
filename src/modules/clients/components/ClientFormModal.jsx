import { useState, useEffect, useRef } from 'react';
import {
  validateDocumento,
  validateCorreo,
  validateNombreCompleto,
  validateTelefono,
  validateDireccion,
  validateFechaNacimientoYEdad,
  validateTipoDocumentoCliente,
  normalizeTipoDocumento,
  normalizeDocumento,
} from '../utils/clientValidators.js';
import { MdErrorOutline, MdBlock } from 'react-icons/md';

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

export default function ClientFormModal({
  title,
  client,
  readOnly = false,
  submitLabel = 'Guardar Cambios',
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

  const getInitialFechaNac = () => {
    if (!client?.fechaNacimiento) return '';
    return String(client.fechaNacimiento).split('T')[0];
  };

  const initialFecha = getInitialFechaNac();
  const initialAgeCheck = validateFechaNacimientoYEdad(initialFecha);

  const [form, setForm] = useState({
    tipoDocumento: client?.tipoDocumento || client?.usuario?.tipoDocumento || 'CC',
    documento: client?.documento || client?.usuario?.documento || '',
    nombreCompleto: getNombreCompleto(client),
    correo: client?.correo || client?.usuario?.correo || '',
    fechaNacimiento: initialFecha,
    edad: initialAgeCheck.edad !== null ? `${initialAgeCheck.edad} años` : (client?.edad ? `${client.edad} años` : ''),
    telefono: client?.telefono || client?.usuario?.telefono || '',
    direccion: client?.direccion || client?.usuario?.direccion || '',
    foto: client?.foto || client?.usuario?.foto || client?.avatar || '',
    estado: client?.estado ?? true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Fecha máxima permitida para ser mayor de edad (18 años atrás desde hoy)
  const today = new Date();
  const maxAdultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    if (client) {
      const fechaNac = client.fechaNacimiento ? String(client.fechaNacimiento).split('T')[0] : '';
      const ageCheck = validateFechaNacimientoYEdad(fechaNac);
      setForm({
        tipoDocumento: client.tipoDocumento || client.usuario?.tipoDocumento || 'CC',
        documento: client.documento || client.usuario?.documento || '',
        nombreCompleto: getNombreCompleto(client),
        correo: client.correo || client.usuario?.correo || '',
        fechaNacimiento: fechaNac,
        edad: ageCheck.edad !== null ? `${ageCheck.edad} años` : (client.edad ? `${client.edad} años` : ''),
        telefono: client.telefono || client.usuario?.telefono || '',
        direccion: client.direccion || client.usuario?.direccion || '',
        foto: client.foto || client.usuario?.foto || client.avatar || '',
        estado: client.estado ?? true,
      });
      setErrors({});
      setTouched({});
      setGeneralError('');
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

  // Función de validación por campo individual
  const validateField = (fieldName, value, currentForm = form) => {
    switch (fieldName) {
      case 'tipoDocumento':
        return validateTipoDocumentoCliente(value);
      case 'documento':
        return validateDocumento(value, currentForm.tipoDocumento);
      case 'nombreCompleto':
        return validateNombreCompleto(value);
      case 'correo':
        return validateCorreo(value);
      case 'fechaNacimiento': {
        const check = validateFechaNacimientoYEdad(value);
        return check.error;
      }
      case 'telefono':
        return validateTelefono(value);
      case 'direccion':
        return validateDireccion(value);
      default:
        return '';
    }
  };

  // Validar todo el formulario completo
  const validateAll = (data = form) => {
    const newErrors = {};

    const tipoDocErr = validateTipoDocumentoCliente(data.tipoDocumento);
    if (tipoDocErr) newErrors.tipoDocumento = tipoDocErr;

    const docErr = validateDocumento(data.documento, data.tipoDocumento);
    if (docErr) newErrors.documento = docErr;

    const nameErr = validateNombreCompleto(data.nombreCompleto);
    if (nameErr) newErrors.nombreCompleto = nameErr;

    const emailErr = validateCorreo(data.correo);
    if (emailErr) newErrors.correo = emailErr;

    const ageCheck = validateFechaNacimientoYEdad(data.fechaNacimiento);
    if (ageCheck.error) {
      newErrors.fechaNacimiento = ageCheck.error;
    }

    const telErr = validateTelefono(data.telefono);
    if (telErr) newErrors.telefono = telErr;

    const dirErr = validateDireccion(data.direccion);
    if (dirErr) newErrors.direccion = dirErr;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeneralError('');

    if (name === 'fechaNacimiento') {
      const ageCheck = validateFechaNacimientoYEdad(value);
      let edadDisplay = '';
      if (ageCheck.edad !== null) {
        edadDisplay = ageCheck.esMayorDeEdad
          ? `${ageCheck.edad} años`
          : `${ageCheck.edad} años (Menor de edad)`;
      }

      const updatedForm = {
        ...form,
        fechaNacimiento: value,
        edad: edadDisplay,
      };
      setForm(updatedForm);

      if (touched.fechaNacimiento) {
        setErrors((prev) => ({
          ...prev,
          fechaNacimiento: ageCheck.error,
        }));
      }
    } else if (name === 'tipoDocumento') {
      const updatedForm = { ...form, tipoDocumento: value };
      setForm(updatedForm);

      if (touched.tipoDocumento || touched.documento) {
        setErrors((prev) => ({
          ...prev,
          tipoDocumento: validateTipoDocumentoCliente(value),
          documento: form.documento ? validateDocumento(form.documento, value) : prev.documento,
        }));
      }
    } else {
      const updatedForm = { ...form, [name]: value };
      setForm(updatedForm);

      if (touched[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value, updatedForm),
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value, form);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) {
      onClose?.();
      return;
    }

    // Marcar todos los campos como tocados
    const allTouched = {
      tipoDocumento: true,
      documento: true,
      nombreCompleto: true,
      correo: true,
      fechaNacimiento: true,
      telefono: true,
      direccion: true,
    };
    setTouched(allTouched);

    const formErrors = validateAll(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      if (formErrors.fechaNacimiento && formErrors.fechaNacimiento.includes('menor de edad')) {
        setGeneralError('Acción no permitida: el cliente debe ser mayor de edad (mínimo 18 años).');
      } else {
        setGeneralError('Por favor corrige los errores resaltados antes de guardar.');
      }
      return;
    }

    const { nombre, apellido } = parseNombreCompleto(form.nombreCompleto);
    const ageCheck = validateFechaNacimientoYEdad(form.fechaNacimiento);
    const normTipo = normalizeTipoDocumento(form.tipoDocumento);
    const normDoc = normalizeDocumento(form.documento, normTipo);

    const payload = {
      ...client,
      ...form,
      tipoDocumento: normTipo,
      documento: normDoc,
      nombre: nombre || form.nombreCompleto.trim(),
      apellido: apellido || '',
      nombreCompleto: form.nombreCompleto.trim(),
      fechaNacimiento: form.fechaNacimiento,
      edad: ageCheck.edad,
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

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && Boolean(errors[fieldName]);
    return {
      width: '100%',
      height: 42,
      borderRadius: 12,
      border: hasError ? '1.5px solid #ef4444' : '1px solid rgba(17, 17, 17, 0.12)',
      outline: 'none',
      padding: '0 14px',
      fontSize: 14,
      color: '#1b1b1b',
      background: hasError ? '#fef2f2' : readOnly ? '#f8fafc' : '#f8f9fa',
      boxSizing: 'border-box',
      boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
      transition: 'border-color 0.18s, box-shadow 0.18s, background-color 0.18s',
    };
  };

  const modalTitle = readOnly
    ? 'Detalle del cliente'
    : title && title.toLowerCase().includes('editar')
    ? 'Editar cliente'
    : title || 'Editar cliente';

  const isMinor = form.edad && form.edad.includes('Menor de edad');
  const isAdult = form.edad && !isMinor && form.fechaNacimiento;

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
          maxHeight: '92vh',
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
        <form onSubmit={handleSubmit} noValidate style={{ margin: 0, padding: 0, overflowY: 'auto' }}>
          <div style={{ padding: '22px 28px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                columnGap: 20,
                rowGap: 16,
              }}
            >
              {/* SECCIÓN FOTO DE PERFIL DEL CLIENTE */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 18px',
                  background: '#f8fafc',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  marginBottom: 2,
                }}
              >
                <div
                  onClick={() => { if (form.foto) setShowPhotoModal(true); }}
                  title={form.foto ? 'Click para ampliar foto' : 'Cliente sin foto'}
                  style={{
                    position: 'relative',
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: form.foto ? 'pointer' : 'default',
                    border: '2px solid #ffffff',
                    outline: form.foto ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e2e8f0',
                    flexShrink: 0,
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (form.foto) e.currentTarget.style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (form.foto) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {form.foto ? (
                    <img
                      src={form.foto}
                      alt={form.nombreCompleto || 'Cliente'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #fb923c, #ea580c)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {(form.nombreCompleto || 'CL').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      Foto de perfil
                    </span>
                    {form.foto ? (
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: '#ffedd5',
                          color: '#c2410c',
                          fontWeight: 600,
                        }}
                      >
                        Subida desde la app móvil
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 500,
                        }}
                      >
                        Sin foto asignada
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {form.foto
                      ? 'Haz clic sobre la foto para verla ampliada en alta resolución.'
                      : 'El cliente puede elegir o cambiar su foto directamente desde la aplicación móvil.'}
                  </span>
                </div>
              </div>

              {/* FILA 1: Tipo de documento & Documento */}
              <div>
                <label style={labelStyle}>
                  Tipo de documento {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <select
                  disabled={readOnly}
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('tipoDocumento')}
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                  <option value="PAS">Pasaporte</option>
                  <option value="TI" disabled>Tarjeta de identidad (Solo menores de edad — No permitido)</option>
                </select>
                {touched.tipoDocumento && errors.tipoDocumento && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.tipoDocumento}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Documento {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  name="documento"
                  placeholder="Número de documento"
                  value={form.documento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('documento')}
                />
                {touched.documento && errors.documento && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.documento}</span>
                  </div>
                )}
              </div>

              {/* FILA 2: Nombre completo & Correo electrónico */}
              <div>
                <label style={labelStyle}>
                  Nombre completo {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  name="nombreCompleto"
                  placeholder="Ej. Alejandro Moreno Gómez"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('nombreCompleto')}
                />
                {touched.nombreCompleto && errors.nombreCompleto && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.nombreCompleto}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Correo electrónico {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  type="email"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  value={form.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('correo')}
                />
                {touched.correo && errors.correo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.correo}</span>
                  </div>
                )}
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
                  onBlur={handleBlur}
                  max={maxAdultDate}
                  style={{
                    ...getInputStyle('fechaNacimiento'),
                    color: form.fechaNacimiento ? '#1b1b1b' : '#94a3b8',
                  }}
                />
                {touched.fechaNacimiento && errors.fechaNacimiento && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
                    <MdBlock style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }} />
                    <span>{errors.fechaNacimiento}</span>
                  </div>
                )}
                {!errors.fechaNacimiento && (
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 3, display: 'block' }}>
                    Requisito legal: Mayor de edad (18 años o más).
                  </span>
                )}
              </div>

              <div>
                <label style={labelStyle}>Edad</label>
                <div style={{ position: 'relative' }}>
                  <input
                    readOnly
                    disabled
                    name="edad"
                    placeholder="Se calcula automáticamente"
                    value={form.edad}
                    style={{
                      ...getInputStyle('edad'),
                      background: isMinor ? '#fee2e2' : isAdult ? '#ecfdf5' : '#f1f5f9',
                      border: isMinor ? '1.5px solid #ef4444' : isAdult ? '1.5px solid #10b981' : '1px solid rgba(17, 17, 17, 0.12)',
                      color: isMinor ? '#991b1b' : isAdult ? '#065f46' : '#475569',
                      fontWeight: isMinor || isAdult ? 600 : 400,
                      cursor: 'default',
                    }}
                  />
                  {isMinor && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 9,
                        background: '#dc2626',
                        color: '#ffffff',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      No permitido
                    </span>
                  )}
                  {isAdult && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 9,
                        background: '#10b981',
                        color: '#ffffff',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Válido
                    </span>
                  )}
                </div>
              </div>

              {/* FILA 4: Teléfono & Dirección */}
              <div>
                <label style={labelStyle}>
                  Teléfono {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  type="tel"
                  name="telefono"
                  placeholder="Ej. 3001234567"
                  value={form.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('telefono')}
                />
                {touched.telefono && errors.telefono && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.telefono}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Dirección {!readOnly && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  readOnly={readOnly}
                  name="direccion"
                  placeholder="Ej. Calle 30 # 20-15"
                  value={form.direccion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('direccion')}
                />
                {touched.direccion && errors.direccion && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AVISO DE ERROR GENERAL */}
            {generalError && (
              <div
                style={{
                  marginTop: 14,
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#b91c1c',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <MdBlock style={{ fontSize: 16, flexShrink: 0 }} />
                <span>{generalError}</span>
              </div>
            )}

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
                disabled={Boolean(isMinor)}
                title={isMinor ? 'No se permite registrar menores de edad' : submitLabel}
                style={{
                  height: 42,
                  padding: '0 28px',
                  borderRadius: 12,
                  border: 'none',
                  background: isMinor
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, #fb923c, #f97316)',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isMinor ? 'not-allowed' : 'pointer',
                  boxShadow: isMinor
                    ? 'none'
                    : '0 4px 14px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.15s ease',
                  opacity: isMinor ? 0.65 : 1,
                }}
              >
                {submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>

      {showPhotoModal && form.foto && (
        <div
          onClick={() => setShowPhotoModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(11, 23, 33, 0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {form.nombreCompleto || 'Foto de Perfil'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #f8fafc 0%, #edf2f7 100%)',
              }}
            >
              <div
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.25), 0 0 0 4px #ffffff, 0 0 0 7px #ea580c',
                  backgroundColor: '#ffffff',
                }}
              >
                <img
                  src={form.foto}
                  alt={form.nombreCompleto || 'Foto ampliada'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
