import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteService from '../services/ClienteService.js';
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
import { MdErrorOutline, MdBlock, MdCheckCircle, MdHourglassEmpty } from 'react-icons/md';
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [roleId, setRoleId] = useState('');

  // Fecha máxima permitida para ser mayor de edad (18 años atrás desde hoy)
  const today = new Date();
  const maxAdultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

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

  // Validar un campo
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

  // Validar formulario completo
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

  // Verificar documento duplicado
  useEffect(() => {
    const docClean = (form.documento || '').trim();
    const docLegalErr = validateDocumento(docClean, form.tipoDocumento);

    if (!docClean || docLegalErr) {
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
  }, [form.documento, form.tipoDocumento]);

  // Cambios en inputs
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

  const handleClose = () => {
    navigate('/clients', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setGeneralError('Por favor corrige los errores resaltados antes de registrar.');
      }
      return;
    }

    if (docError) {
      setGeneralError(docError);
      return;
    }

    if (docVerifying) return;

    setLoading(true);

    try {
      const { nombre, apellido } = parseNombreCompleto(form.nombreCompleto);
      const ageCheck = validateFechaNacimientoYEdad(form.fechaNacimiento);
      const normTipo = normalizeTipoDocumento(form.tipoDocumento);
      const normDoc = normalizeDocumento(form.documento, normTipo);

      const payload = {
        ...form,
        tipoDocumento: normTipo,
        documento: normDoc,
        nombre: nombre || form.nombreCompleto.trim(),
        apellido: apellido || '',
        nombreCompleto: form.nombreCompleto.trim(),
        fechaNacimiento: form.fechaNacimiento,
        edad: ageCheck.edad,
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

      setGeneralError('Error al crear cliente: ' + mensaje);
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

  const getInputStyle = (fieldName) => {
    const hasError = (touched[fieldName] && Boolean(errors[fieldName])) || (fieldName === 'documento' && Boolean(docError));
    return {
      width: '100%',
      height: 42,
      borderRadius: 12,
      border: hasError
        ? '1.5px solid #ef4444'
        : fieldName === 'documento' && docAvailable && form.documento.trim().length >= 5
        ? '1.5px solid #22c55e'
        : '1px solid rgba(17, 17, 17, 0.12)',
      outline: 'none',
      padding: '0 14px',
      fontSize: 14,
      color: '#1b1b1b',
      background: hasError ? '#fef2f2' : '#f8f9fa',
      boxSizing: 'border-box',
      boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
      transition: 'border-color 0.18s, box-shadow 0.18s, background-color 0.18s',
    };
  };

  const isMinor = form.edad && form.edad.includes('Menor de edad');
  const isAdult = form.edad && !isMinor && form.fechaNacimiento;

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
              {/* FILA 1: Tipo de documento & Documento */}
              <div>
                <label style={labelStyle}>
                  Tipo de documento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
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
                  Documento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  name="documento"
                  placeholder="Número de documento"
                  value={form.documento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={getInputStyle('documento')}
                />
                {docVerifying ? (
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MdHourglassEmpty style={{ fontSize: 13 }} /> Verificando disponibilidad...
                  </span>
                ) : touched.documento && errors.documento ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, color: '#dc2626', fontSize: 12, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 14 }} />
                    <span>{errors.documento}</span>
                  </div>
                ) : docError ? (
                  <span style={{ fontSize: 11, color: '#ef4444', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    <MdErrorOutline style={{ fontSize: 13 }} /> {docError}
                  </span>
                ) : docAvailable && form.documento.trim().length >= 5 ? (
                  <span style={{ fontSize: 11, color: '#16a34a', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    <MdCheckCircle style={{ fontSize: 13 }} /> Documento disponible
                  </span>
                ) : null}
              </div>

              {/* FILA 2: Nombre completo & Correo electrónico */}
              <div>
                <label style={labelStyle}>
                  Nombre completo <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  name="nombreCompleto"
                  placeholder="Ej. Juan Carlos Pérez Gómez"
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
                  Correo electrónico <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
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
                  Fecha de nacimiento <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
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
                  Teléfono <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
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
                  Dirección <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
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
              disabled={loading || Boolean(isMinor) || docVerifying}
              title={isMinor ? 'No se permite registrar menores de edad' : 'Registrar cliente'}
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
                cursor: isMinor || loading ? 'not-allowed' : 'pointer',
                boxShadow: isMinor
                  ? 'none'
                  : '0 4px 14px rgba(249, 115, 22, 0.35)',
                transition: 'all 0.15s ease',
                opacity: isMinor ? 0.65 : 1,
              }}
            >
              {loading ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
