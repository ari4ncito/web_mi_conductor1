import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import VehiculoService from '../services/VehiculoService';
import ClienteService from '../../clients/services/ClienteService';
import CloudinaryService from '../../../services/cloudinaryService';
import { VEHICLE_BRANDS_MODELS, VEHICLE_COLORS, VEHICLE_TYPES } from '../data/vehicleData';
import DynamicSelectField from '../components/DynamicSelectField';

// Icons
function ArrowLeftIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CameraIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DocumentIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AttachIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function EditIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// Dropzone for Single Document (Tarjeta de Propiedad) — con preview de imagen
function DocumentDropzone({ label, file, onFileChange, readOnly = false, required = false, error = null }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: readOnly,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const selected = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(selected);
        onFileChange({ file: selected, name: selected.name, previewUrl });
      }
    }
  });

  const finalLabel = (typeof label === 'string' && required)
    ? <>{label} <span className="text-red-500">*</span></>
    : label;

  const preview = file?.previewUrl || (typeof file === 'string' ? file : null);

  return (
    <div>
      {/* Si hay preview, mostrar la imagen */}
      {preview ? (
        <div className={`relative rounded-2xl overflow-hidden border ${
          error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
        } shadow-xs transition`}>
          <img
            src={preview}
            alt={label}
            className="w-full h-auto max-h-72 object-contain bg-slate-50"
          />
          {/* Overlay con controles */}
          {!readOnly && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <DocumentIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{finalLabel}</p>
                  <p className="text-[10px] text-white/70 truncate">{file?.name || 'Imagen cargada'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
                  className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer"
                  title="Quitar documento"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
                <div
                  {...getRootProps()}
                  className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <AttachIcon className="w-3.5 h-3.5" />
                  Cambiar
                </div>
              </div>
            </div>
          )}
          {readOnly && (
            <div className="absolute top-2 right-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-emerald-500/90 text-white shadow-sm">
                ✓ Adjuntado
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Sin archivo: mostrar dropzone vacío */
        <div
          {...(!readOnly ? getRootProps() : {})}
          className={`p-6 border-2 border-dashed rounded-2xl transition text-center ${
            error
              ? 'border-red-400 bg-red-50/30'
              : isDragActive
                ? 'border-orange-500 bg-orange-50/50'
                : readOnly
                  ? 'border-slate-200 bg-slate-50 cursor-default'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-orange-50/20 hover:border-orange-300 cursor-pointer'
          }`}
        >
          {!readOnly && <input {...getInputProps()} />}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400">
              <DocumentIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{finalLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {readOnly ? 'No adjuntado' : 'Arrastra o haz clic para subir (JPG, PNG, WEBP)'}
              </p>
            </div>
          </div>
        </div>
      )}
      {error && typeof error === 'string' && (
        <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
}

// Dropzone multi-foto: un solo dropzone para subir hasta 3 fotos con galería de thumbnails
function MultiPhotoDropzone({ photos = [], onPhotosChange, readOnly = false, maxPhotos = 3 }) {
  const currentCount = photos.filter(Boolean).length;
  const canAddMore = currentCount < maxPhotos;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    disabled: readOnly || !canAddMore,
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const newPhotos = [...photos];
      for (const f of acceptedFiles) {
        // Buscar el primer slot vacío
        const emptyIdx = newPhotos.findIndex((p) => !p);
        if (emptyIdx === -1 && newPhotos.length >= maxPhotos) break;
        const photoObj = { file: f, previewUrl: URL.createObjectURL(f) };
        if (emptyIdx !== -1) {
          newPhotos[emptyIdx] = photoObj;
        } else if (newPhotos.length < maxPhotos) {
          newPhotos.push(photoObj);
        }
      }
      // Rellenar slots vacíos hasta maxPhotos
      while (newPhotos.length < maxPhotos) newPhotos.push(null);
      onPhotosChange(newPhotos.slice(0, maxPhotos));
    }
  });

  const handleRemove = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    onPhotosChange(newPhotos);
  };

  const getPreview = (photo) => photo?.previewUrl || (typeof photo === 'string' ? photo : null);

  return (
    <div className="space-y-4">
      {/* Galería de thumbnails */}
      {currentCount > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, i) => {
            const preview = getPreview(photo);
            if (!preview) return null;
            return (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-xs aspect-4/3 bg-slate-50">
                <img
                  src={preview}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {!readOnly && (
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition cursor-pointer shadow-lg"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      Quitar
                    </button>
                  </div>
                )}
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-white/90 text-slate-600 px-1.5 py-0.5 rounded-md shadow-sm">
                  Foto {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Dropzone para agregar fotos */}
      {!readOnly && canAddMore && (
        <div
          {...getRootProps()}
          className={`p-5 border-2 border-dashed rounded-2xl transition text-center cursor-pointer ${
            isDragActive
              ? 'border-orange-500 bg-orange-50/50'
              : 'border-slate-200 bg-slate-50/50 hover:bg-orange-50/20 hover:border-orange-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400">
              <CameraIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">
                {currentCount === 0 ? 'Arrastra o haz clic para subir fotos' : 'Agregar más fotos'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentCount} de {maxPhotos} fotos • JPG, PNG o WEBP
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje en modo lectura si no hay fotos */}
      {readOnly && currentCount === 0 && (
        <div className="p-5 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl text-center">
          <p className="text-xs text-slate-400 font-medium">Sin fotos del vehículo</p>
        </div>
      )}

      {/* Barra de estado */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxPhotos }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition ${
                getPreview(photos[i]) ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-[11px] font-bold ${
          currentCount === maxPhotos ? 'text-emerald-600' : 'text-slate-400'
        }`}>
          {currentCount}/{maxPhotos} fotos
        </span>
      </div>
    </div>
  );
}

// Reusable Input Field
function FormField({ label, icon, type = "text", value, onChange, onBlur, placeholder, options, error, readOnly = false, min, max, required = false, rightElement }) {
  // MAGIA: Si es requerido y el label es texto, le agregamos el asterisco automáticamente
  const finalLabel = (typeof label === 'string' && required)
    ? <>{label} <span className="text-red-500">*</span></>
    : label;

  return (
    <div className="mb-4">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        {readOnly ? (
          <div className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 min-h-[46px] flex items-center`}>
            {value ? String(value) : <span className="text-slate-400 font-normal italic">No especificado</span>}
          </div>
        ) : type === 'select' ? (
          <select
            value={value}
            onChange={onChange}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-8 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-200 bg-white'
              } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm font-medium text-slate-700 appearance-none`}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
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
            min={min}
            max={max}
            step="1"
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${rightElement ? 'pr-24' : 'pr-4'} py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-200 bg-white'
              } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm font-medium text-slate-700`}
          />
        )}

        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}

        {label && (
          <label className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${error ? 'text-red-500' : 'text-slate-500'
            }`}>
            {finalLabel} {/* <-- AQUÍ USAMOS LA MAGIA */}
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default function VehicleFormPage({ mode: propMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Determine mode
  const computedMode = propMode || (() => {
    if (location.pathname.endsWith('/edit')) return 'edit';
    if (location.pathname.endsWith('/new') || location.pathname.endsWith('/register')) return 'create';
    if (id) return 'detail';
    return 'create';
  })();

  const [mode, setMode] = useState(computedMode);
  const isReadOnly = mode === 'detail';

  // State with updated fields
  const [formData, setFormData] = useState({
    cliente: '',
    marca: '',
    modelo: '',
    placa: '',
    anio: '',
    color: '',
    tipoVehiculo: '',
    fechaVencimientoSoat: '',
    fechaVencimientoTecnomecanica: '',
  });

  // Files state
  const [tarjetaPropiedadFile, setTarjetaPropiedadFile] = useState(null);
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [foto3, setFoto3] = useState(null);

  const [rawVehicle, setRawVehicle] = useState(location.state?.vehicle || null);
  const [clientesList, setClientesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);

  const [placaChecking, setPlacaChecking] = useState(false);
  const [placaCheckResult, setPlacaCheckResult] = useState(null);
  const [isSoldTransfer, setIsSoldTransfer] = useState(false);

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

  // Load clients
  useEffect(() => {
    ClienteService.getAll()
      .then((data) => {
        let clientesData = [];
        if (Array.isArray(data)) clientesData = data;
        else if (data && Array.isArray(data.data)) clientesData = data.data;
        else if (data && data.data && Array.isArray(data.data.rows)) clientesData = data.data.rows;
        else if (data && Array.isArray(data.rows)) clientesData = data.rows;
        else if (data && Array.isArray(data.clientes)) clientesData = data.clientes;

        setClientesList(clientesData);
      })
      .catch((err) => console.error("Error al cargar clientes", err));
  }, []);

  // Populate vehicle data
  useEffect(() => {
    if (id) {
      const populateData = (veh) => {
        setRawVehicle(veh);
        setFormData({
          cliente: veh.cliente?._id || veh.cliente || '',
          marca: veh.marca || '',
          modelo: veh.modelo || '',
          placa: veh.placa || '',
          anio: veh.anio || '',
          color: veh.color || '',
          tipoVehiculo: veh.tipoVehiculo || '',
          fechaVencimientoSoat: veh.fechaVencimientoSoat
            ? veh.fechaVencimientoSoat.split('T')[0]
            : veh.certificadoSoat
              ? ''
              : '',
          fechaVencimientoTecnomecanica: veh.fechaVencimientoTecnomecanica
            ? veh.fechaVencimientoTecnomecanica.split('T')[0]
            : veh.fechaRevisionTecnicoMecanica
              ? veh.fechaRevisionTecnicoMecanica.split('T')[0]
              : '',
        });

        if (veh.tarjetaPropiedad || veh.tarjetaCirculacion) {
          setTarjetaPropiedadFile({ name: 'tarjeta_propiedad.jpg', previewUrl: veh.tarjetaPropiedad || veh.tarjetaCirculacion });
        }
        if (veh.foto1 || veh.foto) {
          setFoto1({ previewUrl: veh.foto1 || veh.foto });
        }
        if (veh.foto2 || (veh.fotos && veh.fotos[1])) {
          setFoto2({ previewUrl: veh.foto2 || veh.fotos[1] });
        }
        if (veh.foto3 || (veh.fotos && veh.fotos[2])) {
          setFoto3({ previewUrl: veh.foto3 || veh.fotos[2] });
        }
      };

      if (location.state?.vehicle && location.state.vehicle._id === id) {
        populateData(location.state.vehicle);
      } else {
        setLoading(true);
        VehiculoService.getById(id)
          .then((res) => {
            const veh = res.data || res;
            populateData(veh);
          })
          .catch((err) => {
            console.error('Error al obtener vehículo:', err);
            setError('No se pudo encontrar la información del vehículo.');
          })
          .finally(() => setLoading(false));
      }
    }
  }, [id, location.state]);

  const todayStr = new Date().toISOString().split('T')[0];

  const brandNames = Object.keys(VEHICLE_BRANDS_MODELS);
  const isKnownBrand = Boolean(
    formData.marca &&
    brandNames.some((b) => b.toLowerCase() === formData.marca.toLowerCase())
  );
  const matchedBrandKey = isKnownBrand
    ? brandNames.find((b) => b.toLowerCase() === formData.marca.toLowerCase())
    : null;
  const currentModels = matchedBrandKey ? (VEHICLE_BRANDS_MODELS[matchedBrandKey] || []) : [];

  const handleMarcaChange = (newMarca) => {
    const matched = brandNames.find((b) => b.toLowerCase() === (newMarca || '').toLowerCase());
    const modelsForNewBrand = matched ? VEHICLE_BRANDS_MODELS[matched] : [];
    const modelBelongs = modelsForNewBrand.some((m) => m.toLowerCase() === (formData.modelo || '').toLowerCase());
    setFormData((prev) => ({
      ...prev,
      marca: newMarca,
      modelo: modelBelongs ? prev.modelo : '',
    }));
  };

  const handleCheckPlaca = async (customPlaca) => {
    const p = (customPlaca !== undefined ? customPlaca : formData.placa || '').trim().toUpperCase();
    if (!p || p.length < 5 || isReadOnly || mode !== 'create') return;

    try {
      setPlacaChecking(true);
      setError(null);
      const res = await VehiculoService.verificarPlaca(p);
      const data = res.data || res;

      if (data.existe) {
        if (data.estadoVehiculo === 'vendido') {
          setPlacaCheckResult({
            type: 'sold',
            message: data.mensaje || 'Vehículo vendido previamente. Puedes registrarlo como nuevo dueño.',
            vehiculo: data.vehiculo,
          });
          setIsSoldTransfer(true);
          if (data.vehiculo) {
            setFormData((prev) => ({
              ...prev,
              marca: data.vehiculo.marca || prev.marca,
              modelo: data.vehiculo.modelo || prev.modelo,
              anio: data.vehiculo.anio ? String(data.vehiculo.anio) : prev.anio,
              color: data.vehiculo.color || prev.color,
              tipoVehiculo: data.vehiculo.tipoVehiculo || prev.tipoVehiculo,
              numeroChasis: data.vehiculo.numeroChasis || prev.numeroChasis,
            }));
          }
        } else {
          setPlacaCheckResult({
            type: 'blocked',
            message: data.mensaje || 'Lo sentimos, el vehículo ya se encuentra registrado en la plataforma y está activo con otro conductor. Por favor, comunícate con la persona para que le dé de baja a su vehículo.',
            vehiculo: data.vehiculo,
          });
          setIsSoldTransfer(false);
        }
      } else {
        setPlacaCheckResult({
          type: 'available',
          message: 'La placa está disponible para nuevo registro.',
        });
        setIsSoldTransfer(false);
      }
    } catch (err) {
      console.error('Error al verificar placa:', err);
    } finally {
      setPlacaChecking(false);
    }
  };

  const placaError =
    !isReadOnly && formData.placa && !/^[a-zA-Z]{3}[0-9]{3}$/.test(formData.placa)
      ? "La placa debe tener 3 letras y 3 números (ej. ABC123)."
      : null;

  const soatDateError = (() => {
    if (isReadOnly || !formData.fechaVencimientoSoat) return null;
    const parts = formData.fechaVencimientoSoat.split('-');
    if (parts.length === 3) {
      const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      dt.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (dt < now) return "No se permiten fechas pasadas. El SOAT no puede estar vencido.";
    }
    return null;
  })();

  const tecnomecanicaDateError = (() => {
    if (isReadOnly || !formData.fechaVencimientoTecnomecanica) return null;
    const parts = formData.fechaVencimientoTecnomecanica.split('-');
    if (parts.length === 3) {
      const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      dt.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (dt < now) return "No se permiten fechas pasadas. La tecnomecánica no puede estar vencida.";
    }
    return null;
  })();

  const anioError = (() => {
    if (isReadOnly || !formData.anio) return null;
    const numero = Number(formData.anio);
    const anioActual = new Date().getFullYear();
    if (numero < 1900) return "El año no puede ser menor a 1900.";
    if (numero > anioActual + 1) return `El año no puede ser mayor a ${anioActual + 1}.`;
    return null;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnly) return;

    setHasSubmitted(true);

    // 1. Validar si la placa está bloqueada por estar activa con otro conductor
    if (mode === 'create' && placaCheckResult?.type === 'blocked') {
      setError(
        placaCheckResult.message ||
        "Lo sentimos, el vehículo ya se encuentra registrado en la plataforma y está activo con otro conductor. Por favor, comunícate con la persona para que le dé de baja a su vehículo."
      );
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // 2. Comprobar campos obligatorios base
    const hasEmptyRequired =
      !formData.cliente ||
      !formData.marca ||
      !formData.modelo ||
      !formData.placa ||
      !formData.anio ||
      !formData.color ||
      !formData.tipoVehiculo ||
      !formData.fechaVencimientoSoat ||
      !formData.fechaVencimientoTecnomecanica ||
      (!tarjetaPropiedadFile && !rawVehicle?.tarjetaPropiedad);

    // 3. En edición: todos los campos son estrictamente obligatorios (incluyendo foto del vehículo)
    const hasPhoto = Boolean(
      foto1?.file ||
      foto1?.previewUrl ||
      foto2?.file ||
      foto2?.previewUrl ||
      foto3?.file ||
      foto3?.previewUrl ||
      rawVehicle?.foto1 ||
      rawVehicle?.foto
    );

    if (mode === 'edit' && !hasPhoto) {
      setError("En la edición del vehículo, todos los campos son obligatorios. Debes adjuntar al menos una foto del vehículo.");
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    if (
      hasEmptyRequired ||
      placaError ||
      soatDateError ||
      tecnomecanicaDateError ||
      anioError
    ) {
      setError(
        mode === 'edit'
          ? "En la edición del vehículo, todos los campos son obligatorios. Por favor completa los campos resaltados en rojo."
          : "Por favor completa todos los campos obligatorios resaltados en rojo."
      );
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1. Subida de imágenes a Cloudinary
      setUploadStatus('Subiendo imágenes a Cloudinary...');

      let finalTarjeta = rawVehicle?.tarjetaPropiedad || null;
      if (tarjetaPropiedadFile?.file) {
        setUploadStatus('Subiendo tarjeta de propiedad a Cloudinary...');
        const res = await CloudinaryService.uploadImage(tarjetaPropiedadFile.file, {
          folder: 'vehiculos/documentos'
        });
        finalTarjeta = res.secure_url;
      } else if (typeof tarjetaPropiedadFile?.previewUrl === 'string' && tarjetaPropiedadFile.previewUrl.startsWith('http')) {
        finalTarjeta = tarjetaPropiedadFile.previewUrl;
      }

      let finalFoto1 = rawVehicle?.foto1 || rawVehicle?.foto || null;
      if (foto1?.file) {
        setUploadStatus('Subiendo foto 1 a Cloudinary...');
        const res = await CloudinaryService.uploadImage(foto1.file, {
          folder: 'vehiculos/fotos'
        });
        finalFoto1 = res.secure_url;
      } else if (typeof foto1?.previewUrl === 'string' && foto1.previewUrl.startsWith('http')) {
        finalFoto1 = foto1.previewUrl;
      }

      let finalFoto2 = rawVehicle?.foto2 || null;
      if (foto2?.file) {
        setUploadStatus('Subiendo foto 2 a Cloudinary...');
        const res = await CloudinaryService.uploadImage(foto2.file, {
          folder: 'vehiculos/fotos'
        });
        finalFoto2 = res.secure_url;
      } else if (typeof foto2?.previewUrl === 'string' && foto2.previewUrl.startsWith('http')) {
        finalFoto2 = foto2.previewUrl;
      }

      let finalFoto3 = rawVehicle?.foto3 || null;
      if (foto3?.file) {
        setUploadStatus('Subiendo foto 3 a Cloudinary...');
        const res = await CloudinaryService.uploadImage(foto3.file, {
          folder: 'vehiculos/fotos'
        });
        finalFoto3 = res.secure_url;
      } else if (typeof foto3?.previewUrl === 'string' && foto3.previewUrl.startsWith('http')) {
        finalFoto3 = foto3.previewUrl;
      }

      const allFotos = [finalFoto1, finalFoto2, finalFoto3].filter(Boolean);

      setUploadStatus('Guardando datos del vehículo...');

      const payload = {
        ...formData,
        anio: Number(formData.anio) || new Date().getFullYear(),
        numeroPuertas: 4,
        numeroChasis: rawVehicle?.numeroChasis || `VIN-${Date.now()}`,
        tipoCombustible: rawVehicle?.tipoCombustible || 'Gasolina',
        estadoSeguro: rawVehicle?.estadoSeguro || 'Activo',
        companiaAseguradora: rawVehicle?.companiaAseguradora || 'N/A',
        fechaVencimientoSoat: formData.fechaVencimientoSoat
          ? new Date(formData.fechaVencimientoSoat).toISOString()
          : null,
        fechaVencimientoTecnomecanica: formData.fechaVencimientoTecnomecanica
          ? new Date(formData.fechaVencimientoTecnomecanica).toISOString()
          : null,
        fechaRevisionTecnicoMecanica: formData.fechaVencimientoTecnomecanica
          ? new Date(formData.fechaVencimientoTecnomecanica).toISOString()
          : null,
        tarjetaPropiedad: finalTarjeta,
        foto1: finalFoto1,
        foto2: finalFoto2,
        foto3: finalFoto3,
        foto: finalFoto1 || (allFotos.length > 0 ? allFotos[0] : null),
        fotos: allFotos,
        ...(mode === 'create' ? { estado: true } : {})
      };

      if (mode === 'create') {
        await VehiculoService.create(payload);
        navigate('/vehicles', {
          state: { successMessage: 'Vehículo registrado exitosamente con imágenes en Cloudinary.' }
        });
      } else {
        await VehiculoService.update(id, payload);
        navigate('/vehicles', {
          state: { successMessage: 'Vehículo actualizado exitosamente con imágenes en Cloudinary.' }
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un error al procesar el vehículo. Por favor revisa los datos."
      );
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  const selectedClienteObj = clientesList.find(
    (c) => c._id === formData.cliente || c._id === rawVehicle?.cliente?._id
  );

  const clienteDisplayName = selectedClienteObj?.usuario
    ? `${selectedClienteObj.usuario.nombre} ${selectedClienteObj.usuario.apellido}`
    : selectedClienteObj?.nombre || rawVehicle?.cliente?.usuario
      ? `${rawVehicle.cliente.usuario.nombre} ${rawVehicle.cliente.usuario.apellido}`
      : rawVehicle?.cliente?.nombre || 'Sin cliente asignado';


  // Permite escribir cualquier número libremente
  const handleAnioChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, anio: value }));
  };

  // Valida cuando el usuario hace clic fuera del campo (o pasa al siguiente)
  const handleAnioBlur = () => {
    if (formData.anio === '') return;

    const numero = Number(formData.anio);
    const anioActual = new Date().getFullYear();

    if (numero < 1900) {
      // Si es menor a 1900, lo forzamos al mínimo
      setFormData((prev) => ({ ...prev, anio: 1900 }));
    } else if (numero > anioActual + 1) {
      // Si es mayor al año actual + 1, lo forzamos al máximo
      setFormData((prev) => ({ ...prev, anio: anioActual + 1 }));
    }
  };


  return (
    <div className="p-6 md:p-8 mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Módulo de Vehículos
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${mode === 'create'
                ? 'bg-orange-100 text-orange-700'
                : mode === 'edit'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
                }`}>
                {mode === 'create' ? 'Nuevo Registro' : mode === 'edit' ? 'Edición' : 'Detalle'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {mode === 'create'
                ? 'Registrar Nuevo Vehículo'
                : mode === 'edit'
                  ? `Editar Vehículo ${formData.placa ? `(${formData.placa})` : ''}`
                  : `Detalle del Vehículo: ${formData.marca} ${formData.modelo}`}
            </h1>
          </div>
        </div>

       
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 shadow-xs">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Cargando información del vehículo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column (7 cols): Client, Basic Info & Expiration Dates */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Card 1: Propietario */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Dueño del Vehículo</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5 ml-3.5">
                  {isReadOnly
                    ? 'Cliente propietario asignado al vehículo'
                    : 'Selecciona el cliente al que pertenecerá este vehículo'}
                </p>

                {isReadOnly ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
                      {clienteDisplayName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{clienteDisplayName}</div>
                      {selectedClienteObj?.usuario?.correo && (
                        <div className="text-xs text-slate-500">{selectedClienteObj.usuario.correo}</div>
                      )}
                      {selectedClienteObj?.usuario?.telefono && (
                        <div className="text-xs text-slate-500">Tel: {selectedClienteObj.usuario.telefono}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <FormField
                    label="CLIENTE PROPIETARIO"
                    required
                    type="select"
                    value={formData.cliente}
                    error={hasSubmitted && !formData.cliente ? "Debes seleccionar un cliente propietario" : null}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                    options={[
                      { label: "Selecciona un cliente...", value: "" },
                      ...clientesList.map((c) => ({
                        label: c.usuario
                          ? `${c.usuario.nombre} ${c.usuario.apellido} (${c.usuario.documento || 'Sin doc'})`
                          : c.nombre || 'Cliente sin nombre',
                        value: c._id,
                      })),
                    ]}
                  />
                )}
              </div>

              {/* Card 2: Datos Básicos */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Datos Básicos del Vehículo</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Información principal de identificación del vehículo
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <DynamicSelectField
                    label="TIPO DE VEHÍCULO"
                    required
                    value={formData.tipoVehiculo}
                    readOnly={isReadOnly}
                    options={VEHICLE_TYPES}
                    error={hasSubmitted && !formData.tipoVehiculo ? "El tipo de vehículo es obligatorio" : null}
                    onChange={(val) => setFormData({ ...formData, tipoVehiculo: val })}
                    placeholder="Selecciona o busca el tipo..."
                    customPlaceholder="Escribe el tipo de vehículo (ej. Buggy, Trimoto)..."
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                  />

                  <div className="flex flex-col">
                    <FormField
                      label="PLACA"
                      required
                      value={formData.placa}
                      readOnly={isReadOnly}
                      error={hasSubmitted && !formData.placa ? "La placa es obligatoria" : placaError}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setFormData({ ...formData, placa: val });
                        setPlacaCheckResult(null);
                        setIsSoldTransfer(false);
                      }}
                      onBlur={() => {
                        if (mode === 'create' && formData.placa?.length >= 5) {
                          handleCheckPlaca(formData.placa);
                        }
                      }}
                      placeholder="Ej. ABC123"
                      rightElement={
                        mode === 'create' && !isReadOnly && formData.placa?.length >= 5 ? (
                          <button
                            type="button"
                            onClick={() => handleCheckPlaca(formData.placa)}
                            disabled={placaChecking}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {placaChecking ? 'Verificando...' : 'Verificar'}
                          </button>
                        ) : null
                      }
                      icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      }
                    />

                    {/* Alerta de bloqueo: vehículo activo con otro conductor */}
                    {placaCheckResult?.type === 'blocked' && (
                      <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                        <span className="text-base flex-shrink-0 mt-0.5">🚫</span>
                        <div>
                          <p className="font-bold text-red-900">Vehículo no disponible para registro</p>
                          <p className="mt-0.5 leading-relaxed text-red-700">{placaCheckResult.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Alerta de vehículo vendido: reactivación / traspaso */}
                    {placaCheckResult?.type === 'sold' && (
                      <div className="mb-4 p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                        <span className="text-base flex-shrink-0 mt-0.5">🏷️</span>
                        <div>
                          <p className="font-bold text-purple-950">Vehículo vendido previamente</p>
                          <p className="mt-0.5 leading-relaxed text-purple-800">
                            {placaCheckResult.message}
                          </p>
                          <p className="mt-1 font-semibold text-purple-900">
                            ✓ Datos técnicos precargados. Debes subir obligatoriamente la nueva tarjeta de propiedad y actualizar las fechas de SOAT y tecnomecánica.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Placa disponible */}
                    {placaCheckResult?.type === 'available' && (
                      <div className="mb-3 text-xs font-semibold text-emerald-600 flex items-center gap-1.5 ml-1">
                        <span>✓</span> Placa disponible para nuevo registro
                      </div>
                    )}
                  </div>


                  <DynamicSelectField
                    label="MARCA"
                    required
                    value={formData.marca}
                    readOnly={isReadOnly}
                    options={brandNames}
                    error={hasSubmitted && !formData.marca ? "La marca es obligatoria" : null}
                    onChange={handleMarcaChange}
                    placeholder="Selecciona o busca la marca..."
                    customPlaceholder="Escribe la marca personalizada (ej. Yuyutsu)..."
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    }
                  />

                  <DynamicSelectField
                    label="MODELO"
                    required
                    value={formData.modelo}
                    readOnly={isReadOnly}
                    options={currentModels}
                    forceManual={!isKnownBrand && Boolean(formData.marca)}
                    error={hasSubmitted && !formData.modelo ? "El modelo es obligatorio" : null}
                    onChange={(val) => setFormData({ ...formData, modelo: val })}
                    placeholder={
                      !formData.marca
                        ? "Primero selecciona una marca"
                        : "Selecciona o busca el modelo..."
                    }
                    customPlaceholder="Escribe el modelo del vehículo..."
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                  />


                  <FormField
                    label="AÑO"
                    required
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.anio}
                    readOnly={isReadOnly}
                    onChange={handleAnioChange} // Ahora permite escribir libremente
                    onBlur={handleAnioBlur}     // Valida y corrige al salir del campo
                    error={hasSubmitted && !formData.anio ? "El año es obligatorio" : anioError}
                    placeholder="Ej. 2023"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />

                  <DynamicSelectField
                    label="COLOR"
                    required
                    value={formData.color}
                    readOnly={isReadOnly}
                    options={VEHICLE_COLORS}
                    error={hasSubmitted && !formData.color ? "El color es obligatorio" : null}
                    onChange={(val) => setFormData({ ...formData, color: val })}
                    placeholder="Selecciona o busca el color..."
                    customPlaceholder="Escribe el color (ej. Blanco perlado, Tornasol)..."
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    }
                  />


                </div>
              </div>

              {/* Card 3: Fechas de Vencimiento */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Vigencia de Documentación</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Fechas de vencimiento legal del SOAT y de la revisión técnico-mecánica
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <FormField
                    label="FECHA DE VENCIMIENTO DEL SOAT"
                    required
                    type="date"
                    value={formData.fechaVencimientoSoat}
                    readOnly={isReadOnly}
                    min={!isReadOnly ? todayStr : undefined}
                    error={hasSubmitted && !formData.fechaVencimientoSoat ? "La fecha de vencimiento del SOAT es obligatoria" : soatDateError}
                    onChange={(e) => setFormData({ ...formData, fechaVencimientoSoat: e.target.value })}
                    icon={<CalendarIcon className="w-5 h-5" />}
                  />

                  <FormField
                    label="FECHA DE VENCIMIENTO TECNOMECÁNICA"
                    required
                    type="date"
                    value={formData.fechaVencimientoTecnomecanica}
                    readOnly={isReadOnly}
                    min={!isReadOnly ? todayStr : undefined}
                    error={hasSubmitted && !formData.fechaVencimientoTecnomecanica ? "La fecha de vencimiento de la tecnomecánica es obligatoria" : tecnomecanicaDateError}
                    onChange={(e) => setFormData({ ...formData, fechaVencimientoTecnomecanica: e.target.value })}
                    icon={<CalendarIcon className="w-5 h-5" />}
                  />
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Tarjeta de Propiedad & 3 Fotos */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Card 4: Tarjeta de Propiedad */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Tarjeta de Propiedad</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5 ml-3.5">
                  Documento de tránsito obligatorio del vehículo
                </p>

                <DocumentDropzone
                  label="Tarjeta de Propiedad"
                  required
                  file={tarjetaPropiedadFile}
                  onFileChange={setTarjetaPropiedadFile}
                  readOnly={isReadOnly}
                  error={hasSubmitted && !tarjetaPropiedadFile ? "La tarjeta de propiedad es obligatoria" : null}
                />
              </div>

              {/* Card 5: Fotos del Vehículo — un solo dropzone multi-foto */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    <h2 className="text-base font-bold text-slate-800">Fotos del Vehículo</h2>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Máximo 3 Fotos
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-5 ml-3.5">
                  Sube hasta 3 fotos para verificar el estado físico del carro
                </p>

                <MultiPhotoDropzone
                  photos={[foto1, foto2, foto3]}
                  onPhotosChange={([f1, f2, f3]) => {
                    setFoto1(f1 || null);
                    setFoto2(f2 || null);
                    setFoto3(f3 || null);
                  }}
                  readOnly={isReadOnly}
                  maxPhotos={3}
                />
              </div>

            </div>

          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="px-6 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
            >
              {isReadOnly ? 'Volver a Vehículos' : 'Cancelar'}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 h-12 rounded-xl border-0 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#0e3b43] hover:bg-[#155662] shadow-[0_4px_14px_rgba(14,59,67,0.3)]'
                  }`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <CheckIcon className="w-5 h-5" />
                )}
                {isSubmitting
                  ? (uploadStatus || 'Procesando...')
                  : mode === 'create'
                    ? 'Guardar Vehículo'
                    : 'Guardar Cambios'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
