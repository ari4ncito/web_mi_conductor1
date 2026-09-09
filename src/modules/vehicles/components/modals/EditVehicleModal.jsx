import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import VehiculoService from '../../services/VehiculoService';
import ClienteService from '../../../clients/services/ClienteService';

// Basic Icons
function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CameraIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AttachIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

// Reusable Dropzone Component
function CustomDropzone({ label, accept, isDocument = false }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: accept,
    onDrop: (acceptedFiles) => {
      console.log('Archivos soltados, pero se enviará null por ahora', acceptedFiles);
    }
  });

  if (isDocument) {
    return (
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <DocumentIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{label}</h4>
            <p className="text-xs text-slate-500">PDF, JPG o PNG</p>
          </div>
        </div>
        <div {...getRootProps()} className="cursor-pointer px-4 py-2 border border-slate-300 rounded-full flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
          <input {...getInputProps()} />
          <AttachIcon className="w-4 h-4" />
          Adjuntar
        </div>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-2xl bg-white cursor-pointer hover:bg-slate-50 transition min-h-[140px]">
      <input {...getInputProps()} />
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <CameraIcon className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-slate-700 text-center">{label}</p>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, icon, type = "text", value, onChange, placeholder, options }) {
  return (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
        {type === 'select' ? (
          <select
            value={value}
            onChange={onChange}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition text-sm font-medium text-slate-700 appearance-none"
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition text-sm font-medium text-slate-700"
          />
        )}
        {label && (
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}
      </div>
    </div>
  );
}

// Reusable Toggle Component
function ToggleField({ label, description, checked, onChange, icon }) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 leading-tight">{label}</h4>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="shrink-0 ml-4">
        <div 
          className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${checked ? 'bg-[#cba897]' : 'bg-slate-200'}`}
          onClick={() => onChange(!checked)}
        >
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5 shadow-sm' : 'shadow-sm'}`}>
            {checked && <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#8a6857]"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditVehicleModal({ open, onClose, vehicle, onUpdate }) {
  const [formData, setFormData] = useState({
    cliente: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    placa: '',
    tipoVehiculo: '',
    numeroPuertas: '',
    numeroChasis: '',
    tipoCombustible: '',
    estadoSeguro: '',
    companiaAseguradora: '',
    fechaRevisionTecnicoMecanica: '',
    gpsRastreo: false,
    airbags: false,
    frenosAbs: false,
    camaraTrasera: false,
    camaraInterior: false,
  });

  const [clientesList, setClientesList] = useState([]);

  useEffect(() => {
    if (open) {
      ClienteService.getAll().then((res) => {
        if (res && res.data) {
          const activos = res.data.filter(c => c.estado === true);
          setClientesList(activos);
        }
      }).catch(err => console.error("Error al cargar clientes", err));
    }
  }, [open]);

  useEffect(() => {
    if (vehicle && open) {
      setFormData({
        cliente: vehicle.cliente?._id || vehicle.cliente || '',
        marca: vehicle.marca || '',
        modelo: vehicle.modelo || '',
        anio: vehicle.anio || '',
        color: vehicle.color || '',
        placa: vehicle.placa || '',
        tipoVehiculo: vehicle.tipoVehiculo || '',
        numeroPuertas: vehicle.numeroPuertas || '',
        numeroChasis: vehicle.numeroChasis || '',
        tipoCombustible: vehicle.tipoCombustible || '',
        estadoSeguro: vehicle.estadoSeguro || '',
        companiaAseguradora: vehicle.companiaAseguradora || '',
        fechaRevisionTecnicoMecanica: vehicle.fechaRevisionTecnicoMecanica ? vehicle.fechaRevisionTecnicoMecanica.split('T')[0] : '',
        gpsRastreo: vehicle.gpsRastreo || false,
        airbags: vehicle.airbags || false,
        frenosAbs: vehicle.frenosAbs || false,
        camaraTrasera: vehicle.camaraTrasera || false,
        camaraInterior: vehicle.camaraInterior || false,
      });
    }
  }, [vehicle, open]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cliente) {
      setError("Debes seleccionar un cliente");
      return;
    }
    
    const payload = {
      ...formData,
      anio: Number(formData.anio) || new Date().getFullYear(),
      numeroPuertas: Number(formData.numeroPuertas) || 4,
      tarjetaCirculacion: null,
      seguro: null,
      verificacion: null,
      certificadoTecnicoMecanica: null,
      certificadoSoat: null,
      fechaRevisionTecnicoMecanica: formData.fechaRevisionTecnicoMecanica ? new Date(formData.fechaRevisionTecnicoMecanica).toISOString() : null
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await VehiculoService.update(vehicle._id, payload);
      onUpdate(vehicle._id, payload);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al actualizar el vehículo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(600px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#f4f6f8',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white flex items-center gap-4 p-5 sticky top-0 z-10 border-b border-slate-100">
          <button onClick={onClose} type="button" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition">
            <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-slate-800 m-0">Editar Vehículo</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-base font-bold text-slate-800 mb-1">Dueño del vehículo</h3>
             <p className="text-xs text-slate-500 mb-5">Asigna este vehículo a un cliente existente</p>
             <InputField
                label="CLIENTE PROPIETARIO"
                type="select"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                options={[
                  { label: "Selecciona un cliente...", value: "" },
                  ...clientesList.map(c => ({
                    label: c.usuario ? `${c.usuario.nombre} ${c.usuario.apellido}` : 'Cliente sin usuario',
                    value: c._id
                  }))
                ]}
              />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Datos básicos del vehículo</h3>
            <p className="text-xs text-slate-500 mb-5">Ingresa la información principal del vehículo</p>
            
            <InputField
              label="MARCA"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
            />
            <InputField
              label="MODELO"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            />
            <InputField
              label="AÑO"
              type="number"
              value={formData.anio}
              onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <InputField
              label="COLOR"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
            />
            <InputField
              label="PLACA"
              value={formData.placa}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
            />
            <InputField
              label="TIPO DE VEHÍCULO"
              type="select"
              value={formData.tipoVehiculo}
              onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
              options={[
                { label: "Selecciona el tipo", value: "" },
                { label: "Sedán", value: "Sedán" },
                { label: "SUV", value: "SUV" },
                { label: "Camioneta", value: "Camioneta" }
              ]}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            />
            <InputField
              label="NÚMERO DE PUERTAS"
              type="select"
              value={formData.numeroPuertas}
              onChange={(e) => setFormData({ ...formData, numeroPuertas: e.target.value })}
              options={[
                { label: "Selecciona", value: "" },
                { label: "2", value: "2" },
                { label: "4", value: "4" },
                { label: "5", value: "5" }
              ]}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>}
            />
          </div>

          <div className="flex items-center gap-2 px-2 pt-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Información técnica y de seguridad</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <InputField
              label="NÚMERO DE CHASIS / VIN"
              value={formData.numeroChasis}
              onChange={(e) => setFormData({ ...formData, numeroChasis: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>}
            />
            <InputField
              label="TIPO DE COMBUSTIBLE"
              type="select"
              value={formData.tipoCombustible}
              onChange={(e) => setFormData({ ...formData, tipoCombustible: e.target.value })}
              options={[
                { label: "Selecciona el combustible", value: "" },
                { label: "Gasolina", value: "Gasolina" },
                { label: "Diésel", value: "Diesel" },
                { label: "Eléctrico", value: "Electrico" },
                { label: "Híbrido", value: "Hibrido" }
              ]}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <InputField
              label="ESTADO DEL SEGURO"
              type="select"
              value={formData.estadoSeguro}
              onChange={(e) => setFormData({ ...formData, estadoSeguro: e.target.value })}
              options={[
                { label: "Selecciona el estado", value: "" },
                { label: "Activo", value: "Activo" },
                { label: "Vencido", value: "Vencido" }
              ]}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <InputField
              label="COMPAÑÍA ASEGURADORA"
              value={formData.companiaAseguradora}
              onChange={(e) => setFormData({ ...formData, companiaAseguradora: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />
            <InputField
              label="FECHA DE REVISIÓN TÉCNICO-MECÁNICA"
              type="date"
              value={formData.fechaRevisionTecnicoMecanica}
              onChange={(e) => setFormData({ ...formData, fechaRevisionTecnicoMecanica: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />

            <ToggleField
              label="GPS / Rastreo"
              description="El vehículo cuenta con sistema de rastreo"
              checked={formData.gpsRastreo}
              onChange={(val) => setFormData({ ...formData, gpsRastreo: val })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <ToggleField
              label="Airbags"
              description="Cuenta con sistema de airbags"
              checked={formData.airbags}
              onChange={(val) => setFormData({ ...formData, airbags: val })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            />
            <ToggleField
              label="Frenos ABS"
              description="Cuenta con sistema de frenos ABS"
              checked={formData.frenosAbs}
              onChange={(val) => setFormData({ ...formData, frenosAbs: val })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <ToggleField
              label="Cámara trasera"
              description="Cuenta con cámara de reversa"
              checked={formData.camaraTrasera}
              onChange={(val) => setFormData({ ...formData, camaraTrasera: val })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
            />
            <ToggleField
              label="Cámara interior"
              description="Cuenta con cámara dentro del vehículo"
              checked={formData.camaraInterior}
              onChange={(val) => setFormData({ ...formData, camaraInterior: val })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
            />
          </div>

          <div className="flex items-center gap-2 px-2 pt-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Documentos del vehículo</h3>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <CustomDropzone label="Tarjeta de Circulación" accept={{'image/*': ['.png', '.jpg', '.jpeg']}} />
              <CustomDropzone label="Seguro" accept={{'image/*': ['.png', '.jpg', '.jpeg']}} />
              <CustomDropzone label="Verificación" accept={{'image/*': ['.png', '.jpg', '.jpeg']}} />
            </div>

            <CustomDropzone label="Certificado técnico-mecánica" isDocument={true} />
            <CustomDropzone label="Certificado SOAT" isDocument={true} />
          </div>

          <div className="h-4"></div>

          <div className="sticky bottom-0 bg-[#f4f6f8] pt-4 pb-6 border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-14 rounded-full border-0 text-white text-[15px] font-bold cursor-pointer transition shadow-[0_8px_20px_rgba(14,59,67,0.25)] ${isSubmitting ? 'bg-slate-400' : 'bg-[#0e3b43] hover:bg-[#155662]'}`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}