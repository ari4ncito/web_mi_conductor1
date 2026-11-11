import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import driverService from '../../services/driverService.js';
import CloudinaryService from '../../../../services/cloudinaryService.js';
import useModalA11y from '../../../../hooks/useModalA11y.js';
import {
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

function LockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

const formatearFechaInput = (fecha) => {
  if (!fecha) return '';
  return String(fecha).split('T')[0];
};

export default function EditDriverModal({ driver, open, onClose, onUpdate }) {
  const modalRef = useModalA11y(open, onClose);

  const [form, setForm] = useState({
    nombreCompleto: '',
    tipoDocumento: 'CC',
    documento: '',
    correo: '',
    telefono: '',
    telefonoEmergencia: '',
    licencia: '',
    categoriasLicencia: ['B1'],
    fechaExpedicion: '',
    fechaVencimiento: '',
    lugarExpedicion: '',
    experiencia: '',
  });

  const [fotoLicenciaActual, setFotoLicenciaActual] = useState('');
  const [fotoLicenciaFile, setFotoLicenciaFile] = useState(null);
  const [fotoLicenciaPreview, setFotoLicenciaPreview] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Dropzone para actualizar foto de licencia
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

  useEffect(() => {
    if (!driver || !open) return;

    const usr = driver.usuario || {};

    let cats = [];
    if (Array.isArray(driver.categoriasLicencia) && driver.categoriasLicencia.length > 0) {
      cats = driver.categoriasLicencia;
    } else if (driver.categoriaLicencia) {
      cats = [driver.categoriaLicencia];
    } else if (Array.isArray(driver.licencias) && driver.licencias.length > 0) {
      cats = driver.licencias.map((l) => l.categoria || l.categoriaLicencia).filter(Boolean);
    }
    if (cats.length === 0) cats = ['B1'];

    setForm({
      nombreCompleto: usr.nombreCompleto || `${usr.nombre || driver.nombre || ''} ${usr.apellido || driver.apellido || ''}`.trim() || driver.name || '',
      tipoDocumento: usr.tipoDocumento || driver.tipoDocumento || driver.documentType || 'CC',
      documento: usr.documento || driver.documento || driver.idNumber || '',
      correo: usr.correo || driver.correo || driver.email || '',
      telefono: usr.telefono || driver.telefono || driver.phone || '',
      telefonoEmergencia: driver.telefonoEmergencia || '',
      licencia: driver.licencia || driver.license || (driver.licencias?.[0]?.numero) || '',
      categoriasLicencia: [...new Set(cats)],
      fechaExpedicion: formatearFechaInput(driver.fechaExpedicion || driver.licenseIssueDate || driver.licencias?.[0]?.fechaExpedicion),
      fechaVencimiento: formatearFechaInput(driver.fechaVencimiento || driver.licenseExpiry || driver.licencias?.[0]?.fechaVencimiento),
      lugarExpedicion: driver.lugarExpedicion || driver.licencias?.[0]?.lugarExpedicion || '',
      experiencia: driver.experiencia ?? driver.experience ?? '',
    });

    setFotoLicenciaActual(driver.fotoLicencia || '');
    setFotoLicenciaFile(null);
    setFotoLicenciaPreview('');
    setErrors({});
    setServerError('');
  }, [driver, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    const nErr = validateField('nombreCompleto', form.nombreCompleto);
    if (nErr) errs.nombreCompleto = nErr;

    const cErr = validateField('correo', form.correo);
    if (cErr) errs.correo = cErr;

    const tErr = validateField('telefono', form.telefono);
    if (tErr) errs.telefono = tErr;

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
    return Object.values(errs).filter(Boolean).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) return;

    const driverId = driver?._id || driver?.id;
    if (!driverId) {
      setServerError('No se encontró el identificador del conductor.');
      return;
    }

    setSubmitting(true);

    try {
      // Subir nueva foto si se seleccionó una
      let fotoLicenciaUrl = fotoLicenciaActual;
      if (fotoLicenciaFile) {
        try {
          const uploadRes = await CloudinaryService.uploadImage(fotoLicenciaFile);
          fotoLicenciaUrl = uploadRes?.secure_url || uploadRes?.url || fotoLicenciaActual;
        } catch (uploadErr) {
          console.error('Error subiendo imagen a Cloudinary:', uploadErr);
          setServerError('Error al procesar la nueva imagen de la licencia.');
          setSubmitting(false);
          return;
        }
      }

      const partesNombre = form.nombreCompleto.trim().split(/\s+/);
      const nombre = partesNombre[0] || '';
      const apellido = partesNombre.slice(1).join(' ') || partesNombre[0];

      const payload = {
        nombre,
        apellido,
        nombreCompleto: form.nombreCompleto.trim(),
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        telefonoEmergencia: (form.telefonoEmergencia || '').trim(),
        licencia: form.licencia.trim().toUpperCase(),
        categoriaLicencia: form.categoriasLicencia[0] || 'B1',
        categoriasLicencia: form.categoriasLicencia,
        fechaExpedicion: form.fechaExpedicion,
        fechaVencimiento: form.fechaVencimiento,
        lugarExpedicion: (form.lugarExpedicion || '').trim(),
        experiencia: Number(form.experiencia) || 0,
        fotoLicencia: fotoLicenciaUrl || null,
      };

      const conductorActualizado = await driverService.update(driverId, payload);

      if (onUpdate) {
        onUpdate(conductorActualizado);
      }
      onClose();
    } catch (err) {
      console.error('Error actualizando conductor:', err);
      const msg = err.response?.data?.message || 'No fue posible actualizar el conductor.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !driver) return null;

  // Comprobar si la licencia está vencida o por vencer
  const hoy = new Date();
  const fechaVenc = form.fechaVencimiento ? new Date(form.fechaVencimiento) : null;
  const diasParaVencer = fechaVenc ? Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        className="mc-modal"
        style={{ maxWidth: 840, width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-edit-driver"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* ENCABEZADO */}
        <div className="mc-modal-header border-b border-slate-100 pb-3">
          <div>
            <h2 id="modal-title-edit-driver" className="text-xl font-bold text-slate-800">
              Editar conductor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifica la información personal, experiencia y licencia del conductor.
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

        {/* ALERTA DE ERROR */}
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

        {/* ALERTA DE VENCIMIENTO DE LICENCIA */}
        {diasParaVencer !== null && (
          <div className="mx-6 mt-3">
            {diasParaVencer <= 0 ? (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="font-bold">⚠️ Licencia vencida:</span> Esta licencia expiró hace {Math.abs(diasParaVencer)} días. El conductor no puede estar disponible operativamente.
              </div>
            ) : diasParaVencer <= 30 ? (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <span className="font-bold">⚠️ Próxima a vencer:</span> La licencia vence en {diasParaVencer} días.
              </div>
            ) : null}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* SECCIÓN 1: DATOS PERSONALES Y DOCUMENTO PROTEGIDO */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
              Identificación y Datos de Contacto
            </h3>

            {/* CAMPOS PROTEGIDOS: Tipo de Documento y Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  Tipo de documento <LockIcon className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={form.tipoDocumento}
                  disabled
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Protegido por integridad de registro.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  Número de documento <LockIcon className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={form.documento}
                  disabled
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">No editable.</span>
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
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.nombreCompleto ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.nombreCompleto && (
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
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.correo ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.correo && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.correo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono principal <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.telefono ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.telefono && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono de emergencia
                </label>
                <input
                  type="tel"
                  name="telefonoEmergencia"
                  value={form.telefonoEmergencia}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: LICENCIA Y EXPERIENCIA */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block"></span>
              Licencia de Conducción y Experiencia
            </h3>

            {/* Número y Experiencia */}
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
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.licencia ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.licencia && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.licencia}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experiencia profesional declarada (años) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  name="experiencia"
                  value={form.experiencia}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.experiencia ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.experiencia && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.experiencia}</p>
                )}
              </div>
            </div>

            {/* CATEGORÍAS MÚLTIPLES */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Categorías de licencia autorizadas en Colombia <span className="text-red-500">*</span>
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

            {/* Fechas de expedición y vencimiento */}
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
                    errors.fechaExpedicion ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.fechaExpedicion && (
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
                    errors.fechaVencimiento ? 'border-red-400' : 'border-slate-200'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                />
                {errors.fechaVencimiento && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fechaVencimiento}</p>
                )}
              </div>
            </div>

            {/* FOTO DE LICENCIA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto / Documento digital de la licencia
              </label>

              {fotoLicenciaPreview || fotoLicenciaActual ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fotoLicenciaPreview || fotoLicenciaActual}
                        alt="Licencia"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {fotoLicenciaFile ? fotoLicenciaFile.name : 'Licencia registrada'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {fotoLicenciaFile ? 'Nueva foto seleccionada' : 'Almacenada en la plataforma'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        {...getRootProps()}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-xs font-bold cursor-pointer transition"
                      >
                        <input {...getInputProps()} />
                        Reemplazar foto
                      </div>
                      {fotoLicenciaFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setFotoLicenciaFile(null);
                            setFotoLicenciaPreview('');
                          }}
                          className="px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition"
                          title="Descartar nueva foto"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
                    Arrastra aquí la nueva foto o haz clic para seleccionarla
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
              disabled={submitting}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 ${
                submitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
              }`}
            >
              {submitting ? 'Guardando cambios...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
