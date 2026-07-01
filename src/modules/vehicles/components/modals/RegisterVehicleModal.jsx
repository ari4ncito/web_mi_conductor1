import { useState } from 'react';
import { createVehicle } from '../../services/vehicleStorage';

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

export default function RegisterVehicleModal({ open, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    licensePlate: '',
    color: '',
    year: new Date().getFullYear(),
    category: '',
    owner: '',
    status: 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = createVehicle(formData);
    onRegister(newVehicle);
    onClose();
    setFormData({
      name: '',
      licensePlate: '',
      color: '',
      year: new Date().getFullYear(),
      category: '',
      owner: '',
      status: 'active',
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Registrar Nuevo Vehículo</h2>
            <p className="text-slate-500 text-sm mt-1">
              Ingresa los detalles técnicos y operativos para añadir un vehículo a tu flota empresarial.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  Estado Inicial: Activo
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
                Requerido (1-3)
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
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Descartar Cambios
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl transition"
            >
              Guardar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
