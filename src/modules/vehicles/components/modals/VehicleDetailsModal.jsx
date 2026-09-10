import { useState } from 'react';

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function FieldView({ label, value, type = "text" }) {
  if (type === "boolean") {
    return (
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
          {label}
        </label>
        <div className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg inline-block">
          {value ? 'Sí' : 'No'}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
        {label}
      </label>
      <div className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
        {value || <span className="text-slate-400 italic">No especificado</span>}
      </div>
    </div>
  );
}

export default function VehicleDetailsModal({ vehicle, open, onClose }) {
  if (!open || !vehicle) return null;

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
          width: 'min(700px, calc(100% - 40px))',
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
        {/* Header */}
        <div className="bg-white flex items-center justify-between p-5 sticky top-0 z-10 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 m-0">Detalles del Vehículo</h2>
            <p className="text-xs text-slate-500 mt-1">Información completa del vehículo</p>
          </div>
          <button onClick={onClose} type="button" className="p-2 rounded-full hover:bg-slate-100 transition">
            <CloseIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-base font-bold text-slate-800 mb-4">Dueño del vehículo</h3>
             <FieldView label="CLIENTE PROPIETARIO" value={vehicle.cliente?.usuario ? `${vehicle.cliente.usuario.nombre} ${vehicle.cliente.usuario.apellido}` : vehicle.cliente?.nombre || 'Cliente sin asignar'} />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4">Datos básicos del vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FieldView label="MARCA" value={vehicle.marca} />
              <FieldView label="MODELO" value={vehicle.modelo} />
              <FieldView label="AÑO" value={vehicle.anio} />
              <FieldView label="COLOR" value={vehicle.color} />
              <FieldView label="PLACA" value={vehicle.placa} />
              <FieldView label="TIPO DE VEHÍCULO" value={vehicle.tipoVehiculo} />
              <FieldView label="NÚMERO DE PUERTAS" value={vehicle.numeroPuertas} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4">Información técnica y de seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FieldView label="NÚMERO DE CHASIS / VIN" value={vehicle.numeroChasis} />
              <FieldView label="TIPO DE COMBUSTIBLE" value={vehicle.tipoCombustible} />
              <FieldView label="ESTADO DEL SEGURO" value={vehicle.estadoSeguro} />
              <FieldView label="COMPAÑÍA ASEGURADORA" value={vehicle.companiaAseguradora} />
              <FieldView 
                label="FECHA DE REVISIÓN TÉCNICO-MECÁNICA" 
                value={vehicle.fechaRevisionTecnicoMecanica ? vehicle.fechaRevisionTecnicoMecanica.split('T')[0] : ''} 
              />
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-4">
              <FieldView label="GPS / RASTREO" value={vehicle.gpsRastreo} type="boolean" />
              <FieldView label="AIRBAGS" value={vehicle.airbags} type="boolean" />
              <FieldView label="FRENOS ABS" value={vehicle.frenosAbs} type="boolean" />
              <FieldView label="CÁMARA TRASERA" value={vehicle.camaraTrasera} type="boolean" />
              <FieldView label="CÁMARA INTERIOR" value={vehicle.camaraInterior} type="boolean" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4">Documentos del vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldView label="TARJETA DE CIRCULACIÓN" value={vehicle.tarjetaCirculacion ? "Adjuntado" : "No adjuntado"} />
              <FieldView label="SEGURO" value={vehicle.seguro ? "Adjuntado" : "No adjuntado"} />
              <FieldView label="VERIFICACIÓN" value={vehicle.verificacion ? "Adjuntado" : "No adjuntado"} />
              <FieldView label="CERTIFICADO TÉCNICO-MECÁNICA" value={vehicle.certificadoTecnicoMecanica ? "Adjuntado" : "No adjuntado"} />
              <FieldView label="CERTIFICADO SOAT" value={vehicle.certificadoSoat ? "Adjuntado" : "No adjuntado"} />
            </div>
          </div>

        </div>
        
        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-[#f4f6f8] pt-4 pb-6 px-6 border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] text-right">
          <button
            onClick={onClose}
            className="px-8 h-12 rounded-full border-0 bg-slate-800 text-white text-[15px] font-bold cursor-pointer transition hover:bg-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.25)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
