import { useState, useEffect } from 'react';
import { updateDriver } from '../../services/driverStorage';

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function PhotoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function EditDriverModal({ driver, open, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    photo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseCategory: '',
    licenseExpiry: '',
  });

  useEffect(() => {
    if (driver) {
      const names = driver.name.split(' ');
      setFormData({
        photo: driver.photo || '',
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: '',
        phone: '',
        licenseCategory: '',
        licenseExpiry: driver.licenseExpiry || '',
      });
    }
  }, [driver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDriver = updateDriver(driver.id, {
      name: `${formData.firstName} ${formData.lastName}`,
      photo: formData.photo,
      ...formData,
    });
    onUpdate(updatedDriver);
    onClose();
  };

  if (!open || !driver) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Editar Conductor</h2>
            <p className="text-slate-500 text-sm mt-1">
              Actualiza la información detallada del perfil.
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
          {/* Foto de Perfil */}
          <div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-24 h-24 object-cover rounded-2xl border-4 border-orange-100"
                />
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase">Foto de Perfil</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sube una foto clara para que los pasajeros identifiquen el conductor fácilmente.
                </p>
              </div>
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                NOMBRES
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="Nombres"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                APELLIDOS
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="Apellidos"
              />
            </div>
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                NÚMERO DE TELÉFONO
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="text-xs">+57</span>
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-16 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="300 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Categoría de Licencia y Vencimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                CATEGORÍA DE LICENCIA
              </label>
              <select
                value={formData.licenseCategory}
                onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              >
                <option value="">Seleccionar categoría</option>
                <option value="C1">Categoría C1</option>
                <option value="C2">Categoría C2</option>
                <option value="C3">Categoría C3</option>
                <option value="C1-C3">Categoría C1-C3</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                VENCIMIENTO DE LICENCIA
              </label>
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
