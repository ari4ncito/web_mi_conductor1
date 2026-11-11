import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import driverService from '../services/driverService.js';
import AuthService from '../../auth/services/authService.js';
import CloudinaryService from '../../../services/cloudinaryService.js';
import PushAlertContainer from '../../../components/common/Toast/PushAlert.jsx';
import ChangeDriverStatusModal from '../components/modals/ChangeDriverStatusModal.jsx';
import {
  DOCUMENT_TYPE_OPTIONS,
  validateDocumento,
  validateCorreo,
  NAME_REGEX,
} from '../../../utils/validators.js';

// Lista oficial de categorías de conducción en Colombia (Ley 769 de 2002)
const CATEGORIAS_COLOMBIA = [
  { id: 'A1', nombre: 'A1', descripcion: 'Motos ≤ 125 cc' },
  { id: 'A2', nombre: 'A2', descripcion: 'Motos > 125 cc' },
  { id: 'B1', nombre: 'B1', descripcion: 'Particulares (automóviles, camperos)' },
  { id: 'B2', nombre: 'B2', descripcion: 'Particulares (camiones rígidos, busetas)' },
  { id: 'B3', nombre: 'B3', descripcion: 'Particulares (articulados)' },
  { id: 'C1', nombre: 'C1', descripcion: 'Público (autos, camperos, camionetas)' },
  { id: 'C2', nombre: 'C2', descripcion: 'Público (camiones, busetas, buses)' },
  { id: 'C3', nombre: 'C3', descripcion: 'Público (articulados)' },
];

// Íconos SVG estilizados
function ArrowLeftIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function UserIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function DocumentIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" strokeLinecap="round" />
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

function CameraIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// Componente de Campo de Formulario con Floating Label (Estilo compacto y elegante)
function FormField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = 'text',
  disabled = false,
  readOnly = false,
  required = false,
  icon = null,
  rightElement = null,
  options = null,
  min,
  max,
}) {
  const isLocked = disabled || readOnly;
  const finalLabel = typeof label === 'string' && required ? (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  ) : (
    label
  );

  return (
    <div className="relative mb-2">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        {options ? (
          <select
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isLocked}
            className={`w-full ${icon ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-20' : 'pr-3.5'} h-10 rounded-xl border ${
              error
                ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100'
                : isLocked
                ? 'border-slate-200 bg-slate-100/70 text-slate-500 cursor-not-allowed'
                : 'border-slate-200 bg-white'
            } focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-xs sm:text-[13px] font-medium text-slate-700`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={isLocked}
            min={min}
            max={max}
            className={`w-full ${icon ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-20' : 'pr-3.5'} h-10 rounded-xl border ${
              error
                ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100'
                : isLocked
                ? 'border-slate-200 bg-slate-100/70 text-slate-500 cursor-not-allowed'
                : 'border-slate-200 bg-white'
            } focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-xs sm:text-[13px] font-medium text-slate-700`}
          />
        )}

        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}

        {label && (
          <label
            className={`absolute -top-2 left-2.5 bg-white px-1 text-[9.5px] font-bold uppercase tracking-wider rounded ${
              error ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            {finalLabel}
          </label>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
}

// Dropzone para Foto / Documento de Licencia con Preview
function LicenseDropzone({
  file,
  onFileChange,
  readOnly = false,
  label = 'Documento digital de la licencia',
  onZoom,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    disabled: readOnly,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const selected = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(selected);
        onFileChange({ file: selected, name: selected.name, previewUrl });
      }
    },
  });

  const preview = file?.previewUrl || (typeof file === 'string' ? file : null);

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50 p-2">
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            onClick={() => onZoom && onZoom(preview)}
            title="Clic para ver ampliada"
          >
            <img
              src={preview}
              alt="Licencia"
              className="w-14 h-10 object-cover rounded-md border border-slate-200 group-hover:opacity-90 transition shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition">
                {file?.name || 'Licencia adjunta'}
              </p>
              <p className="text-[10px] text-slate-400">
                {file?.file ? `${(file.file.size / 1024).toFixed(1)} KB` : 'Almacenada en la plataforma'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onZoom && onZoom(preview)}
              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Ver foto
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="w-7 h-7 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition"
                title="Quitar foto"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (readOnly) {
    return (
      <div className="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-400">
        Sin documento digital adjunto
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-3 sm:p-3.5 text-center cursor-pointer transition ${
        isDragActive ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <input {...getInputProps()} />
      <UploadIcon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
      <p className="text-xs text-slate-700 font-semibold">
        Arrastra aquí la foto de la licencia o haz clic para subir
      </p>
      <p className="text-[10px] text-slate-400 mt-0.5">Formatos admitidos: PNG, JPG, JPEG, WEBP (hasta 5 MB)</p>
    </div>
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

const calcularAntiguedad = (fechaRegistro) => {
  if (!fechaRegistro) return 'Reciente';
  const inicio = new Date(fechaRegistro);
  if (isNaN(inicio.getTime())) return 'Reciente';
  const hoy = new Date();
  let anios = hoy.getFullYear() - inicio.getFullYear();
  let meses = hoy.getMonth() - inicio.getMonth();
  if (meses < 0) {
    anios--;
    meses += 12;
  }
  if (anios > 0) {
    return `${anios} ${anios === 1 ? 'año' : 'años'}${meses > 0 ? ` y ${meses} ${meses === 1 ? 'mes' : 'meses'}` : ''}`;
  }
  if (meses > 0) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const dias = Math.max(1, Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24)));
  return `${dias} ${dias === 1 ? 'día' : 'días'}`;
};

export default function DriverFormPage({ mode: propMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Determinar modo (create, edit, detail)
  const computedMode =
    propMode ||
    (() => {
      if (location.pathname.endsWith('/edit')) return 'edit';
      if (location.pathname.endsWith('/new') || location.pathname.endsWith('/register')) return 'create';
      if (id) return 'detail';
      return 'create';
    })();

  const [mode, setMode] = useState(computedMode);
  const isReadOnly = mode === 'detail';

  useEffect(() => {
    if (propMode) {
      setMode(propMode);
    } else if (location.pathname.endsWith('/edit')) {
      setMode('edit');
    } else if (location.pathname.endsWith('/new') || location.pathname.endsWith('/register')) {
      setMode('create');
    } else if (id) {
      setMode('detail');
    }
  }, [propMode, location.pathname, id]);

  // Estado de Datos Personales
  const [personalData, setPersonalData] = useState({
    tipoDocumento: 'CC',
    documento: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    telefonoEmergencia: '',
    fechaNacimiento: '',
    edad: '',
    experiencia: '', // Años de experiencia en conducción ubicado en Datos Personales
  });

  // Estado de Licencias (Soporte múltiple completo)
  const [licencias, setLicencias] = useState([
    {
      id: 1,
      numero: '',
      categorias: ['B1'],
      fechaExpedicion: '',
      fechaVencimiento: '',
      lugarExpedicion: '',
      fileObj: null,
      fotoLicencia: null,
    },
  ]);

  // Foto de perfil opcional
  const [fotoPerfilFile, setFotoPerfilFile] = useState(null); // { file, previewUrl, name }

  const [rawDriver, setRawDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [zoomImage, setZoomImage] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Alertas push
  const [alerts, setAlerts] = useState([]);
  const addAlert = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const aid = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setAlerts((prev) => [...prev, { id: aid, type, title, message, duration }]);
  }, []);
  const dismissAlert = useCallback((aid) => {
    setAlerts((prev) => prev.filter((a) => a.id !== aid));
  }, []);

  // Validación anticipada de documento
  const [checkingDoc, setCheckingDoc] = useState(false);
  const [docStatus, setDocStatus] = useState(null); // 'available' | 'exists_user' | 'exists_conductor' | null
  const docAbortRef = useRef(null);

  // Cargar datos de conductor existente en edit o detail
  useEffect(() => {
    if ((mode === 'edit' || mode === 'detail') && id) {
      setLoading(true);
      driverService
        .getById(id)
        .then((driver) => {
          setRawDriver(driver);
          const usr = driver.usuario || {};

          setPersonalData({
            tipoDocumento: usr.tipoDocumento || driver.tipoDocumento || driver.documentType || 'CC',
            documento: usr.documento || driver.documento || driver.idNumber || '',
            nombreCompleto:
              usr.nombreCompleto ||
              `${usr.nombre || driver.nombre || ''} ${usr.apellido || driver.apellido || ''}`.trim() ||
              driver.name ||
              '',
            correo: usr.correo || driver.correo || driver.email || '',
            telefono: usr.telefono || driver.telefono || driver.phone || '',
            telefonoEmergencia: driver.telefonoEmergencia || '',
            fechaNacimiento: usr.fechaNacimiento ? usr.fechaNacimiento.split('T')[0] : '',
            edad: usr.edad || (usr.fechaNacimiento ? calcularEdad(usr.fechaNacimiento.split('T')[0]) : ''),
            experiencia: driver.experiencia ?? driver.experience ?? '',
          });

          // Cargar foto de perfil existente si la tiene
          const fotoExistente = driver.fotoPerfil || usr.fotoPerfil || driver.foto || usr.foto || null;
          if (fotoExistente) {
            setFotoPerfilFile({ file: null, previewUrl: fotoExistente, name: 'Foto de perfil' });
          } else {
            setFotoPerfilFile(null);
          }

          // Poblar lista de licencias múltiples
          if (Array.isArray(driver.licencias) && driver.licencias.length > 0) {
            setLicencias(
              driver.licencias.map((l, idx) => {
                let cats = [];
                if (Array.isArray(l.categorias) && l.categorias.length > 0) cats = l.categorias;
                else if (Array.isArray(l.categoriasLicencia) && l.categoriasLicencia.length > 0) cats = l.categoriasLicencia;
                else if (l.categoria) cats = [l.categoria];
                else cats = ['B1'];

                return {
                  id: idx + 1,
                  numero: l.numero || l.licencia || '',
                  categorias: cats,
                  fechaExpedicion: l.fechaExpedicion ? l.fechaExpedicion.split('T')[0] : '',
                  fechaVencimiento: l.fechaVencimiento ? l.fechaVencimiento.split('T')[0] : '',
                  lugarExpedicion: l.lugarExpedicion || '',
                  fileObj: null,
                  fotoLicencia: l.fotoLicencia || (idx === 0 ? driver.fotoLicencia : null),
                };
              })
            );
          } else if (driver.licencia) {
            let cats = [];
            if (Array.isArray(driver.categoriasLicencia) && driver.categoriasLicencia.length > 0) {
              cats = driver.categoriasLicencia;
            } else if (driver.categoriaLicencia) {
              cats = [driver.categoriaLicencia];
            } else {
              cats = ['B1'];
            }

            setLicencias([
              {
                id: 1,
                numero: driver.licencia,
                categorias: cats,
                fechaExpedicion: driver.fechaExpedicion ? driver.fechaExpedicion.split('T')[0] : '',
                fechaVencimiento: driver.fechaVencimiento ? driver.fechaVencimiento.split('T')[0] : '',
                lugarExpedicion: driver.lugarExpedicion || '',
                fileObj: null,
                fotoLicencia: driver.fotoLicencia || null,
              },
            ]);
          }
        })
        .catch((err) => {
          console.error('Error cargando conductor:', err);
          addAlert({
            type: 'error',
            title: 'Error de carga',
            message: 'No fue posible cargar la información del conductor.',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, mode]);

  // Validación anticipada de identidad en modo creación
  useEffect(() => {
    if (mode !== 'create') return;

    const docTrim = (personalData.documento || '').trim();
    if (!docTrim || docTrim.length < 5) {
      setDocStatus(null);
      return;
    }

    const docFormatErr = validateDocumento(docTrim, personalData.tipoDocumento);
    if (docFormatErr) {
      setDocStatus(null);
      return;
    }

    if (docAbortRef.current) docAbortRef.current.abort();
    const controller = new AbortController();
    docAbortRef.current = controller;

    const timer = setTimeout(async () => {
      setCheckingDoc(true);
      try {
        const res = await AuthService.checkDocument(docTrim, controller.signal, personalData.tipoDocumento);
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
          setPersonalData((prev) => ({
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
          setErrors((prev) => ({ ...prev, documento: '' }));
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setCheckingDoc(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [personalData.documento, personalData.tipoDocumento, mode]);

  // Manejo de cambios en datos personales
  const handlePersonalChange = (field, value) => {
    setPersonalData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'fechaNacimiento') {
        updated.edad = calcularEdad(value);
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Manejo de licencias múltiples
  const handleAddLicense = () => {
    setLicencias((prev) => [
      ...prev,
      {
        id: Date.now(),
        numero: '',
        categorias: ['B1'],
        fechaExpedicion: '',
        fechaVencimiento: '',
        lugarExpedicion: '',
        fileObj: null,
        fotoLicencia: null,
      },
    ]);
  };

  const handleRemoveLicense = (index) => {
    if (licencias.length <= 1) {
      addAlert({
        type: 'warning',
        title: 'Mínimo requerido',
        message: 'El conductor debe contar con al menos una licencia registrada.',
      });
      return;
    }
    setLicencias((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLicenseFieldChange = (index, field, value) => {
    setLicencias((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleLicenseCategory = (index, catId) => {
    setLicencias((prev) => {
      const updated = [...prev];
      const actual = updated[index].categorias || [];
      const existe = actual.includes(catId);
      const nuevas = existe ? actual.filter((c) => c !== catId) : [...actual, catId];
      updated[index] = { ...updated[index], categorias: nuevas };
      return updated;
    });
  };

  // Validaciones completas de formulario
  const validateForm = () => {
    const errs = {};

    if (mode === 'create') {
      if (docStatus === 'exists_conductor') {
        errs.documento = 'El documento ya está registrado como conductor.';
      } else {
        const dErr = validateDocumento(personalData.documento, personalData.tipoDocumento);
        if (dErr) errs.documento = dErr;
      }
    }

    const nErr = personalData.nombreCompleto.trim();
    if (!nErr) errs.nombreCompleto = 'El nombre completo es obligatorio.';
    else if (!NAME_REGEX.test(nErr)) errs.nombreCompleto = 'Solo se permiten letras, tildes, ñ y espacios.';
    else if (nErr.split(/\s+/).filter(Boolean).length < 2) errs.nombreCompleto = 'Ingresa al menos nombre y apellido.';

    const cErr = validateCorreo(personalData.correo);
    if (cErr) errs.correo = cErr;

    const tErr = (personalData.telefono || '').trim();
    if (!tErr) errs.telefono = 'El teléfono móvil es obligatorio.';
    else if (!/^\d{7,10}$/.test(tErr)) errs.telefono = 'Debe tener entre 7 y 10 dígitos numéricos.';

    if (!personalData.fechaNacimiento) {
      errs.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    } else {
      const edad = calcularEdad(personalData.fechaNacimiento);
      if (edad < 18) errs.fechaNacimiento = 'El conductor debe ser mayor de edad (mínimo 18 años).';
    }

    if (personalData.experiencia === '' || personalData.experiencia === null) {
      errs.experiencia = 'Indica los años de experiencia en conducción.';
    } else if (Number(personalData.experiencia) < 0 || Number(personalData.experiencia) > 60) {
      errs.experiencia = 'Rango válido: 0 a 60 años.';
    }

    // Validar cada licencia
    for (let i = 0; i < licencias.length; i++) {
      const lic = licencias[i];
      if (!lic.numero?.trim()) {
        errs[`lic_${i}_numero`] = 'El número de licencia es obligatorio.';
      }
      if (!lic.categorias || lic.categorias.length === 0) {
        errs[`lic_${i}_categorias`] = 'Selecciona al menos una categoría autorizada.';
      }
      if (!lic.fechaExpedicion) {
        errs[`lic_${i}_fechaExpedicion`] = 'La fecha de expedición es obligatoria.';
      }
      if (!lic.fechaVencimiento) {
        errs[`lic_${i}_fechaVencimiento`] = 'La fecha de vencimiento es obligatoria.';
      } else if (lic.fechaExpedicion && new Date(lic.fechaVencimiento) <= new Date(lic.fechaExpedicion)) {
        errs[`lic_${i}_fechaVencimiento`] = 'La fecha de vencimiento debe ser posterior a la de expedición.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Envío del formulario (Creación o Edición)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addAlert({
        type: 'warning',
        title: 'Formulario incompleto',
        message: 'Por favor revisa los campos señalados antes de continuar.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadStatus('Procesando imágenes de licencias en Cloudinary...');

      // 1. Subir a Cloudinary las fotos de licencias que tengan archivo nuevo
      const licenciasFinales = [];
      for (let i = 0; i < licencias.length; i++) {
        const lic = licencias[i];
        let fotoUrl = lic.fotoLicencia || null;

        if (lic.fileObj?.file) {
          setUploadStatus(`Subiendo imagen de Licencia #${i + 1} a Cloudinary...`);
          try {
            const uploadRes = await CloudinaryService.uploadImage(lic.fileObj.file, {
              folder: 'conductores/licencias',
            });
            fotoUrl = uploadRes?.secure_url || uploadRes?.url || fotoUrl;
          } catch (uploadErr) {
            console.error('Error subiendo imagen a Cloudinary:', uploadErr);
          }
        }

        licenciasFinales.push({
          numero: lic.numero.trim().toUpperCase(),
          categoria: lic.categorias[0] || 'B1',
          categorias: lic.categorias,
          fechaExpedicion: lic.fechaExpedicion,
          fechaVencimiento: lic.fechaVencimiento,
          lugarExpedicion: (lic.lugarExpedicion || '').trim(),
          fotoLicencia: fotoUrl,
        });
      }

      // Subida de foto de perfil opcional a Cloudinary
      let fotoPerfilUrl = rawDriver?.fotoPerfil || null;
      if (fotoPerfilFile?.file) {
        setUploadStatus('Subiendo foto de perfil a Cloudinary...');
        try {
          const uploadFotoRes = await CloudinaryService.uploadImage(fotoPerfilFile.file, {
            folder: 'conductores/perfiles',
          });
          fotoPerfilUrl = uploadFotoRes?.secure_url || uploadFotoRes?.url || fotoPerfilUrl;
        } catch (uploadFotoErr) {
          console.error('Error subiendo foto de perfil a Cloudinary:', uploadFotoErr);
        }
      } else if (fotoPerfilFile?.previewUrl) {
        fotoPerfilUrl = fotoPerfilFile.previewUrl;
      } else if (fotoPerfilFile === null) {
        fotoPerfilUrl = null;
      }

      setUploadStatus('Guardando datos del conductor en la base de datos...');

      const partesNombre = personalData.nombreCompleto.trim().split(/\s+/);
      const nombre = partesNombre[0] || '';
      const apellido = partesNombre.slice(1).join(' ') || partesNombre[0];

      const payload = {
        tipoDocumento: personalData.tipoDocumento,
        documento: personalData.documento.trim(),
        nombre,
        apellido,
        nombreCompleto: personalData.nombreCompleto.trim(),
        correo: personalData.correo.trim().toLowerCase(),
        telefono: personalData.telefono.trim(),
        telefonoEmergencia: (personalData.telefonoEmergencia || '').trim(),
        fechaNacimiento: personalData.fechaNacimiento,
        edad: personalData.edad ? Number(personalData.edad) : undefined,
        experiencia: Number(personalData.experiencia) || 0, // Campo de experiencia en datos personales
        fotoPerfil: fotoPerfilUrl,
        licencias: licenciasFinales,
        licencia: licenciasFinales[0]?.numero,
        categoriaLicencia: licenciasFinales[0]?.categoria,
        categoriasLicencia: licenciasFinales[0]?.categorias,
        fechaExpedicion: licenciasFinales[0]?.fechaExpedicion,
        fechaVencimiento: licenciasFinales[0]?.fechaVencimiento,
        fotoLicencia: licenciasFinales[0]?.fotoLicencia,
      };

      if (mode === 'create') {
        payload.disponible = false;
        await driverService.create(payload);
        navigate('/drivers', {
          state: {
            successMessage: 'Conductor registrado exitosamente con activación automática por correo.',
          },
        });
      } else {
        await driverService.update(id, payload);
        navigate('/drivers', {
          state: {
            successMessage: 'Conductor y sus licencias actualizados exitosamente.',
          },
        });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Error al procesar el conductor.';
      addAlert({
        type: 'error',
        title: 'Error de operación',
        message: msg,
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  // Cambio de disponibilidad operativa desde la ficha
  const handleToggleDisponibilidad = async () => {
    if (!rawDriver) return;
    const estadoAdmin = rawDriver.estadoConductor || 'ACTIVO';

    if (estadoAdmin !== 'ACTIVO' && !rawDriver.disponible) {
      addAlert({
        type: 'warning',
        title: 'Acción bloqueada',
        message: `El conductor se encuentra en estado administrativo "${estadoAdmin}".`,
      });
      return;
    }

    try {
      const nuevaDisp = !rawDriver.disponible;
      await driverService.updateDisponibilidad(id, nuevaDisp);
      setRawDriver((prev) => ({ ...prev, disponible: nuevaDisp }));
      addAlert({
        type: 'success',
        title: nuevaDisp ? 'Conductor disponible' : 'Fuera de servicio',
        message: nuevaDisp ? 'Listo para recibir solicitudes.' : 'Conductor fuera de servicio.',
      });
    } catch (err) {
      addAlert({
        type: 'error',
        title: 'Error de disponibilidad',
        message: err.response?.data?.message || 'No fue posible cambiar la disponibilidad.',
      });
    }
  };

  const hoy = new Date();

  const initials = (() => {
    const parts = (personalData.nombreCompleto || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return 'C';
  })();

  return (
    <div className="p-5 md:p-8 w-full mx-auto">
      {/* Alertas Push */}
      <PushAlertContainer alerts={alerts} onDismiss={dismissAlert} />

      {/* ENCABEZADO SUPERIOR Y BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/drivers')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer"
            title="Volver al listado de conductores"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#11384a] tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {mode === 'create' && 'Registrar Nuevo Conductor'}
              {mode === 'edit' && `Editar Conductor: ${personalData.nombreCompleto || 'Cargando...'}`}
              {mode === 'detail' && `Detalle del Conductor: ${personalData.nombreCompleto || 'Cargando...'}`}
            </h1>
          </div>
        </div>

        {/* Solo en modo detalle mostramos acciones en cabecera */}
        {mode === 'detail' && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/drivers/${id}/edit`)}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <EditIcon className="w-3.5 h-3.5" />
              Editar Conductor
            </button>
          </div>
        )}
      </div>

      {/* ESTADO DE CARGA */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 text-sm shadow-sm">
          <div className="w-9 h-9 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Cargando datos del conductor...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* BANNER DE SUBIDA DE IMÁGENES O ESTADO */}
          {uploadStatus && (
            <div className="mb-6 p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <svg className="animate-spin w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{uploadStatus}</span>
            </div>
          )}

          {/* FICHA RESUMEN EN MODO DETALLE */}
          {mode === 'detail' && rawDriver && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Tarjeta de Disponibilidad */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Disponibilidad Operativa
                  </span>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                      rawDriver.disponible
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {rawDriver.disponible ? '✓ Disponible' : 'Fuera de servicio'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDisponibilidad}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  Cambiar
                </button>
              </div>

              {/* Tarjeta de Estado Administrativo */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estado
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        rawDriver.estadoConductor === 'ACTIVO'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : rawDriver.estadoConductor === 'RETIRADO'
                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                          : rawDriver.estadoConductor === 'FALLECIDO'
                          ? 'bg-slate-900 text-white'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {rawDriver.estadoConductor || 'ACTIVO'}
                    </span>
                    {rawDriver.motivoCambioEstado && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px]" title={rawDriver.motivoCambioEstado}>
                        ({rawDriver.motivoCambioEstado})
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  Cambiar estado
                </button>
              </div>

              {/* Tarjeta de Antigüedad vs Experiencia */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Antigüedad en Mi Conductor
                </span>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {calcularAntiguedad(rawDriver.createdAt || rawDriver.usuario?.createdAt)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Registrado desde {rawDriver.createdAt ? new Date(rawDriver.createdAt).toLocaleDateString('es-CO') : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* ESTRUCTURA MODULAR QUE OCUPA TODA LA PANTALLA */}
          <div className="flex flex-col gap-6 w-full">

            {/* SECCIÓN 1: DATOS PERSONALES Y DEL USUARIO (FULL WIDTH) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs w-full">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-base font-bold text-[#11384a]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Información Personal y del Usuario</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 ml-3.5">
                Datos de identidad, contacto y años de experiencia profesional del conductor.
              </p>

              {/* Foto de Perfil Opcional del Conductor */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 mb-6">
                <div className="relative group shrink-0">
                  {fotoPerfilFile?.previewUrl ? (
                    <img
                      src={fotoPerfilFile.previewUrl}
                      alt="Foto de perfil"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-orange-400 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-sm uppercase tracking-wider">
                      {initials}
                    </div>
                  )}

                  {!isReadOnly && (
                    <label
                      htmlFor="profile-photo-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-700 hover:text-orange-600 hover:border-orange-400 cursor-pointer transition"
                      title={fotoPerfilFile?.previewUrl ? "Cambiar foto de perfil" : "Subir foto de perfil"}
                    >
                      <CameraIcon className="w-4 h-4" />
                    </label>
                  )}
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    disabled={isReadOnly}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFotoPerfilFile({
                          file,
                          previewUrl: URL.createObjectURL(file),
                          name: file.name,
                        });
                      }
                    }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      Foto de Perfil del Conductor
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-600">
                      Opcional
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Sube una foto del conductor para identificarlo en el Dashboard web y en la app móvil. Si no se adjunta foto, se mostrarán sus iniciales (<strong className="text-orange-600 font-bold">{initials}</strong>).
                  </p>

                  {!isReadOnly && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3">
                      <label
                        htmlFor="profile-photo-upload"
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 text-xs font-semibold cursor-pointer transition shadow-2xs"
                      >
                        {fotoPerfilFile?.previewUrl ? 'Cambiar foto' : 'Seleccionar foto'}
                      </label>
                      {fotoPerfilFile?.previewUrl && (
                        <button
                          type="button"
                          onClick={() => setFotoPerfilFile(null)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer transition"
                        >
                          Quitar foto
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Fila 1: Identificación y Nombre (3 columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <FormField
                  label="Tipo de documento"
                  required
                  options={DOCUMENT_TYPE_OPTIONS}
                  value={personalData.tipoDocumento}
                  onChange={(e) => handlePersonalChange('tipoDocumento', e.target.value)}
                  disabled={isReadOnly || mode === 'edit'}
                  readOnly={isReadOnly || mode === 'edit'}
                  error={errors.tipoDocumento}
                  rightElement={mode !== 'create' ? <LockIcon className="text-slate-400 mr-2" /> : null}
                />

                <div>
                  <FormField
                    label="Número de documento"
                    required
                    placeholder="Ej. 1020304050"
                    value={personalData.documento}
                    onChange={(e) => handlePersonalChange('documento', e.target.value)}
                    disabled={isReadOnly || mode === 'edit'}
                    readOnly={isReadOnly || mode === 'edit'}
                    error={errors.documento}
                    rightElement={
                      mode === 'create' ? (
                        checkingDoc ? (
                          <span className="text-[10px] text-slate-400 mr-2">Verificando...</span>
                        ) : docStatus === 'available' ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mr-2">
                            <CheckIcon className="w-3 h-3" /> Libre
                          </span>
                        ) : null
                      ) : (
                        <LockIcon className="text-slate-400 mr-2" />
                      )
                    }
                  />
                  {mode === 'create' && docStatus === 'exists_user' && (
                    <p className="text-xs text-blue-600 mt-1 font-medium bg-blue-50 p-2 rounded-xl border border-blue-200">
                      ✓ Usuario encontrado en la plataforma: datos autocompletados.
                    </p>
                  )}
                </div>

                <FormField
                  label="Nombre completo"
                  required
                  placeholder="Ej. Carlos Alberto Pérez Gómez"
                  value={personalData.nombreCompleto}
                  onChange={(e) => handlePersonalChange('nombreCompleto', e.target.value)}
                  readOnly={isReadOnly}
                  error={errors.nombreCompleto}
                />
              </div>

              {/* Fila 2: Medios de Contacto (3 columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <FormField
                  label="Correo electrónico"
                  type="email"
                  required
                  placeholder="conductor@miconductor.com"
                  value={personalData.correo}
                  onChange={(e) => handlePersonalChange('correo', e.target.value)}
                  readOnly={isReadOnly}
                  error={errors.correo}
                />

                <FormField
                  label="Teléfono móvil principal"
                  required
                  placeholder="3001234567"
                  value={personalData.telefono}
                  onChange={(e) => handlePersonalChange('telefono', e.target.value)}
                  readOnly={isReadOnly}
                  error={errors.telefono}
                />

                <FormField
                  label="Teléfono de contacto de emergencia"
                  placeholder="Ej. 3109876543 (Familiar o acudiente)"
                  value={personalData.telefonoEmergencia}
                  onChange={(e) => handlePersonalChange('telefonoEmergencia', e.target.value)}
                  readOnly={isReadOnly}
                />
              </div>

              {/* Fila 3: Fecha de Nacimiento, Edad y Experiencia (3 columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                <FormField
                  label="Fecha de nacimiento"
                  type="date"
                  required
                  value={personalData.fechaNacimiento}
                  onChange={(e) => handlePersonalChange('fechaNacimiento', e.target.value)}
                  readOnly={isReadOnly}
                  error={errors.fechaNacimiento}
                />

                <FormField
                  label="Edad calculada"
                  value={personalData.edad ? `${personalData.edad} años` : ''}
                  readOnly
                  disabled
                  placeholder="Automática"
                />

                <FormField
                  label="Experiencia profesional (años)"
                  type="number"
                  min="0"
                  max="60"
                  required
                  placeholder="Ej. 5"
                  value={personalData.experiencia}
                  onChange={(e) => handlePersonalChange('experiencia', e.target.value)}
                  readOnly={isReadOnly}
                  error={errors.experiencia}
                />
              </div>

              {/* Nota de activación sin contraseña */}
              {mode === 'create' && (
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-800 flex items-start gap-2.5">
                  <span className="text-amber-600 text-sm leading-none shrink-0 mt-0.5">✉</span>
                  <p>
                    <strong>Seguridad sin contraseña manual:</strong> El conductor recibirá automáticamente un correo con enlace seguro para activar su cuenta y configurar su propia contraseña de acceso.
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN 2: LICENCIAS DE CONDUCCIÓN (FULL WIDTH) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-cyan-600 rounded-full" />
                  <h2 className="text-base font-bold text-[#11384a]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Licencias de Conducción</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
                    {licencias.length} {licencias.length === 1 ? 'licencia' : 'licencias'}
                  </span>
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleAddLicense}
                    className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Agregar otra licencia</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-6 ml-3.5">
                Licencias vigentes y categorías autorizadas para conducir en Colombia.
              </p>

              {/* LISTA DE TARJETAS DE LICENCIAS (FULL WIDTH) */}
              <div className="space-y-6">
                {licencias.map((lic, index) => {
                  const diasParaVencer = lic.fechaVencimiento
                    ? Math.ceil((new Date(lic.fechaVencimiento) - hoy) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div
                      key={lic.id || index}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-slate-300 transition"
                    >
                      {/* Header de la tarjeta de licencia */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            {index === 0 ? 'Licencia Principal' : `Licencia #${index + 1}`}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              ★ Principal
                            </span>
                          )}
                          {diasParaVencer !== null && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                diasParaVencer <= 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : diasParaVencer <= 30
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {diasParaVencer <= 0 ? 'Expirada' : `${diasParaVencer}d vigentes`}
                            </span>
                          )}
                        </div>

                        {!isReadOnly && licencias.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLicense(index)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 transition cursor-pointer"
                          >
                            <TrashIcon className="w-3 h-3" />
                            <span>Quitar</span>
                          </button>
                        )}
                      </div>

                      {/* Campos de la Licencia: 4 columnas en desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <FormField
                          label="Número de licencia"
                          required
                          placeholder="Ej. QWE1234567"
                          value={lic.numero}
                          onChange={(e) => handleLicenseFieldChange(index, 'numero', e.target.value)}
                          readOnly={isReadOnly}
                          error={errors[`lic_${index}_numero`]}
                        />

                        <FormField
                          label="Organismo / Secretaría de expedición"
                          placeholder="Ej. Movilidad de Bogotá"
                          value={lic.lugarExpedicion}
                          onChange={(e) => handleLicenseFieldChange(index, 'lugarExpedicion', e.target.value)}
                          readOnly={isReadOnly}
                        />

                        <FormField
                          label="Fecha de expedición"
                          type="date"
                          required
                          value={lic.fechaExpedicion}
                          onChange={(e) => handleLicenseFieldChange(index, 'fechaExpedicion', e.target.value)}
                          readOnly={isReadOnly}
                          error={errors[`lic_${index}_fechaExpedicion`]}
                        />

                        <FormField
                          label="Fecha de vencimiento"
                          type="date"
                          required
                          value={lic.fechaVencimiento}
                          onChange={(e) => handleLicenseFieldChange(index, 'fechaVencimiento', e.target.value)}
                          readOnly={isReadOnly}
                          error={errors[`lic_${index}_fechaVencimiento`]}
                        />
                      </div>

                      {/* Categorías Autorizadas: 4 columnas con espacio amplio */}
                      <div className="mb-4">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                          Categorías autorizadas en Colombia <span className="text-red-500">*</span>{' '}
                          <span className="text-slate-400 font-normal lowercase">(selecciona una o varias categorías vigentes en el documento físico)</span>
                        </label>

                        {isReadOnly ? (
                          <div className="flex flex-wrap gap-2">
                            {lic.categorias.map((c) => (
                              <span
                                key={c}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                            {CATEGORIAS_COLOMBIA.map((cat) => {
                              const isSelected = lic.categorias?.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => toggleLicenseCategory(index, cat.id)}
                                  className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 ring-2 ring-cyan-400/30'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-slate-900">{cat.nombre}</span>
                                    {isSelected && <CheckIcon className="w-4 h-4 text-cyan-600" />}
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                                    {cat.descripcion}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {errors[`lic_${index}_categorias`] && (
                          <p className="text-xs text-red-500 mt-1 ml-1">{errors[`lic_${index}_categorias`]}</p>
                        )}
                      </div>

                      {/* Foto o documento digital */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Documento digital o foto de la licencia
                        </label>
                        <LicenseDropzone
                          file={lic.fileObj || lic.fotoLicencia}
                          readOnly={isReadOnly}
                          onFileChange={(newFile) => handleLicenseFieldChange(index, 'fileObj', newFile)}
                          onZoom={(imgUrl) => setZoomImage(imgUrl)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BARRA INFERIOR DE ACCIÓN (Idéntica a Vehículos) */}
          {!isReadOnly && (
            <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/drivers')}
                className="px-6 h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || (mode === 'create' && (checkingDoc || docStatus === 'exists_conductor'))}
                className={`px-8 h-12 rounded-xl border-0 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  isSubmitting || (mode === 'create' && (checkingDoc || docStatus === 'exists_conductor'))
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#0e3b43] hover:bg-[#155662] shadow-[0_4px_14px_rgba(14,59,67,0.3)]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Guardando conductor...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{mode === 'create' ? 'Registrar Conductor' : 'Guardar Cambios'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}

      {/* MODAL ZOOM DE IMÁGENES */}
      {zoomImage && (
        <div className="mc-modal-overlay" onClick={() => setZoomImage(null)} style={{ zIndex: 9999 }}>
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-white rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/75 text-white flex items-center justify-center hover:bg-slate-900 transition"
            >
              ✕
            </button>
            <img src={zoomImage} alt="Licencia ampliada" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* MODAL DE CAMBIO DE ESTADO ADMINISTRATIVO */}
      {showStatusModal && rawDriver && (
        <ChangeDriverStatusModal
          driver={rawDriver}
          open={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onConfirm={async ({ estadoConductor, motivo }) => {
            try {
              const updated = await driverService.updateEstadoAdministrativo(id, {
                estadoConductor,
                motivo,
              });
              setRawDriver((prev) => ({ ...prev, ...updated }));
              setShowStatusModal(false);
              addAlert({
                type: 'success',
                title: 'Estado actualizado',
                message: `El estado del conductor ahora es "${estadoConductor}".`,
              });
            } catch (err) {
              addAlert({
                type: 'error',
                title: 'Error de cambio de estado',
                message: err.response?.data?.message || 'No fue posible actualizar el estado.',
              });
            }
          }}
        />
      )}
    </div>
  );
}

