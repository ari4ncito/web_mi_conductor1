import { useState, useEffect } from 'react';
import { updateVehicle } from '../../services/vehicleStorage';

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CloudIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M17 14v-4h-2v4h-4v2h4v4h2v-4h4v-2z" />
      <path d="M3 15a4 4 0 0 1 4-4h1a5 5 0 0 1 9 1" />
    </svg>
  );
}

export default function EditVehicleModal({ vehicle, open, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    licensePlate: '',
    color: '',
    year: new Date().getFullYear(),
    category: '',
    owner: '',
    status: 'active',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        licensePlate: vehicle.licensePlate || '',
        color: vehicle.color || '',
        year: vehicle.year || new Date().getFullYear(),
        category: vehicle.category || '',
        owner: vehicle.owner || '',
        status: vehicle.status || 'active',
      });
    }
  }, [vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVehicle = updateVehicle(vehicle.id, formData);
    onUpdate(updatedVehicle);
    onClose();
  };

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
          width: 'min(960px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 24px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>Editar Vehículo</h2>
            <p style={{ margin: '6px 0 0', color: '#7a7680', fontSize: 14 }}>
              Modifica los detalles técnicos y operativos del vehículo seleccionado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', flexShrink: 0, padding: 4 }}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Marca y Modelo / Placa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Marca y Modelo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="Ej: Mercedes-Benz S-Class"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Placa (Matrícula)
              </label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="ABC-1234"
              />
            </div>
          </div>

          {/* Color Exterior / Año Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Color Exterior
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              >
                <option value="">Seleccione Color</option>
                <option value="Negro">Negro</option>
                <option value="Blanco">Blanco</option>
                <option value="Gris">Gris</option>
                <option value="Azul">Azul</option>
                <option value="Rojo">Rojo</option>
                <option value="Plata">Plata</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Año Modelo
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              />
            </div>
          </div>

          {/* Categoría / Estado Inicial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Categoría de Servicio
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Ejecutivo Sedan">Ejecutivo Sedan</option>
                <option value="SUV Premium">SUV Premium</option>
                <option value="Limusina">Limusina</option>
                <option value="Van Ejecutiva">Van Ejecutiva</option>
              </select>
            </div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  Estado: {formData.status === 'active' ? 'Activo' : formData.status === 'maintenance' ? 'Mantenimiento' : 'Fuera de Servicio'}
                </label>
              </div>
              <div className="relative">
                <div className={`w-14 h-7 rounded-full transition ${formData.status === 'active' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.status === 'active' ? 'translate-x-7' : ''}`}
                  onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'off-duty' : 'active' })}
                ></div>
              </div>
            </div>
          </div>

          {/* Dueño del Vehículo */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">
              Dueño del Vehículo / Cliente <span className="text-orange-500">⚡</span>
            </label>
            <select
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
            >
              <option value="">Seleccionar Cliente (Individual o Corporativo)</option>
              <option value="Alexander Sterling">Alexander Sterling</option>
              <option value="Elena Rodriguez">Elena Rodriguez</option>
              <option value="Enterprise Logistics">Enterprise Logistics</option>
              <option value="Premium Rides Inc.">Premium Rides Inc.</option>
              <option value="Luxury Transport Co.">Luxury Transport Co.</option>
            </select>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l1 1" />
              </svg>
              <span>Si el cliente es nuevo, puede crearlo en el módulo de Clientes.</span>
            </div>
          </div>

          {/* Gestión de Imágenes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">
                Gestión de Imágenes
              </label>
              <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                Opcional
              </span>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
                <CloudIcon className="w-6 h-6" />
              </div>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-orange-600 underline cursor-pointer">
                  Subir nuevas fotografías
                </span>{' '}
                o arrastrar y soltar aquí
              </p>
              <p className="text-xs text-slate-400">
                Archivos en formato JPEG o PNG, máximo 5MB por imagen.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, height: 48, borderRadius: 14, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              Descartar Cambios
            </button>
            <button
              type="submit"
              style={{ flex: 1, height: 48, borderRadius: 14, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}