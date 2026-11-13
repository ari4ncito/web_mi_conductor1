import { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import driverService from '../../services/driverService.js';
import AuthService from '../../../auth/services/authService.js';
import CloudinaryService from '../../../../services/cloudinaryService.js';
import useModalA11y from '../../../../hooks/useModalA11y.js';
import {
  DOCUMENT_TYPE_OPTIONS,
  validateDocumento,
  validateCorreo,
  NAME_REGEX,
} from '../../../../utils/validators.js';

const CATEGORIAS_COLOMBIA = [
  { id: 'A1', nombre: 'A1', descripcion: 'Motos ≤ 125 cc' },
  { id: 'A2', nombre: 'A2', descripcion: 'Motos > 125 cc' },
  { id: 'B1', nombre: 'B1', descripcion: 'Particulares (autos, camperos)' },
  { id: 'B2', nombre: 'B2', descripcion: 'Particulares (camiones rígidos, busetas)' },
  { id: 'B3', nombre: 'B3', descripcion: 'Particulares (articulados)' },
  { id: 'C1', nombre: 'C1', descripcion: 'Público (autos, camperos, camionetas)' },
  { id: 'C2', nombre: 'C2', descripcion: 'Público (camiones, busetas, buses)' },
  { id: 'C3', nombre: 'C3', descripcion: 'Público (articulados)' },
];

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function UploadIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

const calcularEdad = (fechaStr) => {
  if (!fechaStr) return '';
  const hoy = new Date();
  const fechaNac = new Date(fechaStr + 'T00:00:00');
  if (isNaN(fechaNac.getTime())) return '';
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad >= 0 ? edad : 0;
};

export default function RegisterDriverModal({ open, onClose, onRegister }) {
  const modalRef = useModalA11y(open, onClose);

  const [form, setForm] = useState({
    tipoDocumento: 'CC',
    documento: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    telefonoEmergencia: '',
    fechaNacimiento: '',
    edad: '',
    licencia: '',
    categoriasLicencia: ['B1'],
    fechaExpedicion: '',
    fechaVencimiento: '',
    lugarExpedicion: '',
    experiencia: '',
  });

  const [fotoLicenciaFile, setFotoLicenciaFile] = useState(null);
  const [fotoLicenciaPreview, setFotoLicenciaPreview] = useState('');

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Estados de validación anticipada de identidad
  const [checkingDoc, setCheckingDoc] = useState(false);
  const [docStatus, setDocStatus] = useState(null); // 'available' | 'exists_user' | 'exists_conductor' | null
  const [userFoundInfo, setUserFoundInfo] = useState(null);
  const docAbortRef = useRef(null);

  // Dropzone para foto de licencia de conducción
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const file = acceptedFiles[0];
        setFotoLicenciaFile(file);
        setFotoLicenciaPreview(URL.createObjectURL(file));
      }
    },
  });

  // Limpiar formulario al abrir/cerrar
  useEffect(() => {
    if (!open) {
      setForm({
        tipoDocumento: 'CC',
        documento: '',
        nombreCompleto: '',
        correo: '',
        telefono: '',
        telefonoEmergencia: '',
        fechaNacimiento: '',
        edad: '',
        licencia: '',
        categoriasLicencia: ['B1'],
        fechaExpedicion: '',
        fechaVencimiento: '',
        lugarExpedicion: '',
        experiencia: '',
      });
      setFotoLicenciaFile(null);
      setFotoLicenciaPreview('');
      setErrors({});
      setTouched({});
      setServerError('');
      setDocStatus(null);
      setUserFoundInfo(null);
    }
  }, [open]);

  // Validación anticipada de documento con debounce
  useEffect(() => {
    if (!open) return;

    const docTrim = (form.documento || '').trim();
    if (!docTrim || docTrim.length < 5) {
      setDocStatus(null);
      setUserFoundInfo(null);
      return;
    }

    const docFormatError = validateDocumento(docTrim, form.tipoDocumento);
    if (docFormatError) {
      setDocStatus(null);
      setUserFoundInfo(null);
      return;
    }

    if (docAbortRef.current) {
      docAbortRef.current.abort();
    }
    const controller = new AbortController();
    docAbortRef.current = controller;

    const timer = setTimeout(async () => {
      setCheckingDoc(true);
      try {
        const res = await AuthService.checkDocument(docTrim, controller.signal, form.tipoDocumento);
        const data = res?.data || res;

        if (data?.esConductor) {
          setDocStatus('exists_conductor');
          setErrors((prev) => ({
            ...prev,
            documento: 'Este documento ya se encuentra registrado como Conductor en la plataforma.',
          }));
        } else if (data?.exists) {
          setDocStatus('exists_user');
          const usr = data.usuario || {};
          setUserFoundInfo(usr);
          // Autocompletar datos del usuario existente si los campos están vacíos
          setForm((prev) => ({
            ...prev,
            nombreCompleto: prev.nombreCompleto || usr.nombreCompleto || `${usr.nombre || ''} ${usr.apellido || ''}`.trim(),
            correo: prev.correo || usr.correo || '',
            telefono: prev.telefono || usr.telefono || '',
            fechaNacimiento: prev.fechaNacimiento || (usr.fechaNacimiento ? usr.fechaNacimiento.split('T')[0] : ''),
            edad: prev.edad || usr.edad || (usr.fechaNacimiento ? calcularEdad(usr.fechaNacimiento.split('T')[0]) : ''),
          }));
          setErrors((prev) => ({ ...prev, documento: '' }));
        } else {
          setDocStatus('available');
          setUserFoundInfo(null);
          setErrors((prev) => ({ ...prev, documento: '' }));
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Error comprobando documento:', err);
        }
      } finally {
        setCheckingDoc(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.documento, form.tipoDocumento, open]);

  // Manejo de cambios en campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'fechaNacimiento') {
        updated.edad = calcularEdad(value);
      }

      return updated;
    });

    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const toggleCategoria = (catId) => {
    setForm((prev) => {
      const existe = prev.categoriasLicencia.includes(catId);
      const nuevas = existe
        ? prev.categoriasLicencia.filter((c) => c !== catId)
        : [...prev.categoriasLicencia, catId];

      if (nuevas.length === 0) {
        setErrors((errs) => ({ ...errs, categoriasLicencia: 'Debes seleccionar al menos una categoría de licencia.' }));
      } else {
        setErrors((errs) => ({ ...errs, categoriasLicencia: '' }));
      }

      return { ...prev, categoriasLicencia: nuevas };
    });
  };

  const validateField = (name, value) => {
    let err = '';
    switch (name) {
      case 'documento':
        err = validateDocumento(value, form.tipoDocumento) || '';
        break;
      case 'nombreCompleto': {
        const trimmed = (value || '').trim();
        if (!trimmed) err = 'El nombre completo es obligatorio.';
        else if (!NAME_REGEX.test(trimmed)) err = 'Solo se permiten letras, tildes, ñ y espacios.';
        else if (trimmed.split(/\s+/).filter(Boolean).length < 2) err = 'Ingresa al menos nombre y apellido.';
        break;
      }
      case 'correo':
        err = validateCorreo(value) || '';
        break;
      case 'telefono':
        if (!value || !value.trim()) err = 'El teléfono es obligatorio.';
        else if (!/^\d{7,10}$/.test(value.trim())) err = 'Debe tener entre 7 y 10 dígitos numéricos.';
        break;
      case 'fechaNacimiento': {
        if (!value) err = 'La fecha de nacimiento es obligatoria.';
        else {
          const edad = calcularEdad(value);
          if (edad < 18) err = 'El conductor debe ser mayor de edad (mínimo 18 años).';
        }
        break;
      }
      case 'licencia':
        if (!value || !value.trim()) err = 'El número de licencia es obligatorio.';
        break;
      case 'fechaExpedicion':
        if (!value) err = 'La fecha de expedición es obligatoria.';
        break;
      case 'fechaVencimiento': {
        if (!value) err = 'La fecha de vencimiento es obligatoria.';
        else if (form.fechaExpedicion && new Date(value) <= new Date(form.fechaExpedicion)) {
          err = 'La fecha de vencimiento debe ser posterior a la fecha de expedición.';
        }
        break;
      }
      case 'experiencia':
        if (value === '' || value === null) err = 'Los años de experiencia son obligatorios.';
        else if (Number(value) < 0 || Number(value) > 60) err = 'Rango válido: 0 a 60 años.';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const validateAll = () => {
    const errs = {};
    if (docStatus === 'exists_conductor') {
      errs.documento = 'Este documento ya se encuentra registrado como Conductor en la plataforma.';
    } else {
      const dErr = validateDocumento(form.documento, form.tipoDocumento);
      if (dErr) errs.documento = dErr;
    }

    const nErr = validateField('nombreCompleto', form.nombreCompleto);
    if (nErr) errs.nombreCompleto = nErr;

    const cErr = validateField('correo', form.correo);
    if (cErr) errs.correo = cErr;

    const tErr = validateField('telefono', form.telefono);
    if (tErr) errs.telefono = tErr;

    const fErr = validateField('fechaNacimiento', form.fechaNacimiento);
    if (fErr) errs.fechaNacimiento = fErr;

    const lErr = validateField('licencia', form.licencia);
    if (lErr) errs.licencia = lErr;

    if (!form.categoriasLicencia || form.categoriasLicencia.length === 0) {
      errs.categoriasLicencia = 'Debes seleccionar al menos una categoría de licencia.';
    }

    const expErr = validateField('fechaExpedicion', form.fechaExpedicion);
    if (expErr) errs.fechaExpedicion = expErr;

    const vencErr = validateField('fechaVencimiento', form.fechaVencimiento);
    if (vencErr) errs.fechaVencimiento = vencErr;

    const exErr = validateField('experiencia', form.experiencia);
    if (exErr) errs.experiencia = exErr;

    setErrors(errs);
    setTouched({
      documento: true,
      nombreCompleto: true,
      correo: true,
      telefono: true,
      fechaNacimiento: true,
      licencia: true,
      fechaExpedicion: true,
      fechaVencimiento: true,
      experiencia: true,
    });

    return Object.values(errs).filter(Boolean).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) {
      return;
    }

    if (docStatus === 'exists_conductor') {
      setServerError('No es posible continuar: el documento ya pertenece a un conductor registrado.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Si se cargó archivo de licencia, subirlo a Cloudinary
      let fotoLicenciaUrl = '';
      if (fotoLicenciaFile) {
        try {
          const uploadRes = await CloudinaryService.uploadImage(fotoLicenciaFile);
          fotoLicenciaUrl = uploadRes?.secure_url || uploadRes?.url || '';
        } catch (uploadErr) {
          console.error('Error subiendo imagen de licencia a Cloudinary:', uploadErr);
          setServerError('Error al procesar la imagen de la licencia. Intenta nuevamente.');
          setSubmitting(false);
          return;
        }
      }

      // 2. Separar nombre completo
      const partesNombre = form.nombreCompleto.trim().split(/\s+/);
      const nombre = partesNombre[0] || '';
      const apellido = partesNombre.slice(1).join(' ') || partesNombre[0];

      const payload = {
        tipoDocumento: form.tipoDocumento,
        documento: form.documento.trim(),
        nombre,
        apellido,
        nombreCompleto: form.nombreCompleto.trim(),
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        telefonoEmergencia: (form.telefonoEmergencia || '').trim(),
        fechaNacimiento: form.fechaNacimiento,
        edad: form.edad ? Number(form.edad) : undefined,
        licencia: form.licencia.trim().toUpperCase(),
        categoriaLicencia: form.categoriasLicencia[0] || 'B1',
        categoriasLicencia: form.categoriasLicencia,
        fechaExpedicion: form.fechaExpedicion,
        fechaVencimiento: form.fechaVencimiento,
        lugarExpedicion: (form.lugarExpedicion || '').trim(),
        experiencia: Number(form.experiencia) || 0,
        fotoLicencia: fotoLicenciaUrl || undefined,
        disponible: false,
      };

      const nuevoConductor = await driverService.create(payload);

      if (onRegister) {
        onRegister(nuevoConductor);
      }
      onClose();
    } catch (err) {
      console.error('Error al registrar conductor:', err);
      const msg = err.response?.data?.message || 'No fue posible registrar el conductor.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        className="mc-modal"
        style={{ maxWidth: 840, width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-reg-driver"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* ENCABEZADO */}
        <div className="mc-modal-header border-b border-slate-100 pb-3">
          <div>
            <h2 id="modal-title-reg-driver" className="text-xl font-bold text-slate-800">
              Registrar nuevo conductor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Completa los datos de identidad y licencia del conductor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="mc-modal-close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ALERTA DE ERROR DEL SERVIDOR */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
            <span>{serverError}</span>
            <button
              type="button"
              onClick={() => setServerError('')}
              className="text-red-500 hover:text-red-700 text-sm font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* SECCIÓN 1: IDENTIFICACIÓN Y DATOS PERSONALES */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
              Identificación y Datos del Usuario
            </h3>

            {/* PRIMEROS CAMPOS: Tipo de Documento y Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de documento <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Número de documento <span className="text-red-500">*</span></span>
                  {checkingDoc && (
                    <span className="text-[10px] text-slate-400 font-normal">Verificando...</span>
                  )}
                  {!checkingDoc && docStatus === 'available' && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Disponible
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    placeholder="Ej. 1020304050"
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      errors.documento && touched.documento
                        ? 'border-red-400 bg-red-50/40'
                        : docStatus === 'available'
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-slate-200 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                  />
                </div>
                {errors.documento && touched.documento && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.documento}</p>
                )}

                {/* Banner de usuario encontrado */}
                {docStatus === 'exists_user' && (
                  <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[11px] flex items-center gap-2">
                    <span className="font-bold">✓ Usuario encontrado:</span> Se vinculará como conductor y sus datos fueron autocompletados.
                  </div>
                )}
              </div>
            </div>

            {/* Nombre completo, Correo y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej. Carlos Alberto Pérez Gómez"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.nombreCompleto && touched.nombreCompleto ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.nombreCompleto && touched.nombreCompleto && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.nombreCompleto}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="conductor@miconductor.com"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.correo && touched.correo ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.correo && touched.correo && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.correo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.telefono && touched.telefono ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.telefono && touched.telefono && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.fechaNacimiento && touched.fechaNacimiento ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.fechaNacimiento && touched.fechaNacimiento && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fechaNacimiento}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Edad calculada
                </label>
                <input
                  type="text"
                  name="edad"
                  value={form.edad ? `${form.edad} años` : ''}
                  disabled
                  placeholder="Automática"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Aviso de seguridad: Activación por correo */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
              <span className="text-amber-600 text-base leading-none">✉</span>
              <p>
                <strong>Sin contraseña manual:</strong> El conductor recibirá un correo automático con un enlace seguro y temporal para activar su cuenta y configurar su propia contraseña de acceso.
              </p>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DE LA LICENCIA DE CONDUCCIÓN */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block"></span>
              Licencia de Conducción
            </h3>

            {/* Número de Licencia y Años de Experiencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de licencia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="licencia"
                  value={form.licencia}
                  onChange={handleChange}
                  placeholder="Ej. QWE1234567"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.licencia && touched.licencia ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.licencia && touched.licencia && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.licencia}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experiencia declarada (años) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  name="experiencia"
                  value={form.experiencia}
                  onChange={handleChange}
                  placeholder="Ej. 5"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.experiencia && touched.experiencia ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.experiencia && touched.experiencia && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.experiencia}</p>
                )}
              </div>
            </div>

            {/* CATEGORÍAS MÚLTIPLES DE LICENCIA */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Categorías de licencia autorizadas en Colombia <span className="text-red-500">*</span>
                <span className="text-[11px] text-slate-400 font-normal ml-1">
                  (Selecciona una o varias categorías vigentes en el documento físico)
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIAS_COLOMBIA.map((cat) => {
                  const isSelected = form.categoriasLicencia.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategoria(cat.id)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 ring-2 ring-cyan-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{cat.nombre}</span>
                        {isSelected && <CheckIcon className="w-3.5 h-3.5 text-cyan-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                        {cat.descripcion}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.categoriasLicencia && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.categoriasLicencia}</p>
              )}
            </div>

            {/* Fechas de Expedición y Vencimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha de expedición <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaExpedicion"
                  value={form.fechaExpedicion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.fechaExpedicion && touched.fechaExpedicion ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.fechaExpedicion && touched.fechaExpedicion && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fechaExpedicion}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha de vencimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={form.fechaVencimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.fechaVencimiento && touched.fechaVencimiento ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.fechaVencimiento && touched.fechaVencimiento && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fechaVencimiento}</p>
                )}
              </div>
            </div>

            {/* DROPZONE: FOTO DE LA LICENCIA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto / Documento digital de la licencia (Opcional)
              </label>

              {fotoLicenciaPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fotoLicenciaPreview}
                        alt="Preview Licencia"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {fotoLicenciaFile?.name || 'Licencia adjunta'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {fotoLicenciaFile ? `${(fotoLicenciaFile.size / 1024).toFixed(1)} KB` : 'Listo para subir'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFotoLicenciaFile(null);
                        setFotoLicenciaPreview('');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <TrashIcon className="w-3.5 h-3.5" /> Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    isDragActive
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-700 font-semibold">
                    Arrastra aquí la foto de la licencia o haz clic para seleccionarla
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Formatos admitidos: PNG, JPG, JPEG, WEBP (hasta 5 MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || checkingDoc || docStatus === 'exists_conductor'}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 ${
                submitting || checkingDoc || docStatus === 'exists_conductor'
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
              }`}
            >
              {submitting ? 'Registrando conductor...' : 'Registrar conductor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
