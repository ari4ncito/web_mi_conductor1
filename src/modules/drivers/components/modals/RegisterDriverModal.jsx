import { useState } from 'react';
import { createDriver } from '../../services/driverStorage';

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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function RegisterDriverModal({ open, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    photo: '',
    fullName: '',
    idNumber: '',
    email: '',
    licenseNumber: '',
    licenseCategory: '',
    licenseExpiry: '',
    licensePlaceOfIssue: '',
    phone: '',
    emergencyPhone: '',
    location: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDriver = createDriver({
      photo: formData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      name: formData.fullName,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      emergencyPhone: formData.emergencyPhone,
      location: formData.location,
      license: formData.licenseNumber,
      licenseCategory: formData.licenseCategory,
      licenseStatus: 'Valid',
      licenseExpiry: formData.licenseExpiry,
      licensePlaceOfIssue: formData.licensePlaceOfIssue,
      currentState: 'available',
      performance: 5.0,
      trips: 0,
    });
    onRegister(newDriver);
    onClose();
    setFormData({
      photo: '',
      fullName: '',
      idNumber: '',
      email: '',
      licenseNumber: '',
      licenseCategory: '',
      licenseExpiry: '',
      licensePlaceOfIssue: '',
      phone: '',
      emergencyPhone: '',
      location: '',
    });
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fde6d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c26b00' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
              </svg>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>Registrar Nuevo Conductor</h2>
              <p style={{ margin: '6px 0 0', color: '#7a7680', fontSize: 14 }}>PORTA, ADMINISTRATIVO EN CONDUCTOR</p>
            </div>
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
          {/* Foto de Perfil */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative">
                <PhotoIcon className="w-10 h-10 text-slate-400" />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Foto de Perfil</h3>
                <p className="text-xs text-slate-500 mt-1">
                  La fotografía debe ser reciente, con fondo neutro y yamente ejecutiva para cumplir con los estándares de la plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  NÚMERO DE CÉDULA (ID)
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="000-000000-0"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  UBICACIÓN
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="Ej. Ciudad de Guatemala, Guatemala"
                />
              </div>
            </div>
          </div>

          {/* Documentación Profesional */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Documentación Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  NÚMERO DE LICENCIA
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="L-012345678"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  CATEGORÍA
                </label>
                <select
                  value={formData.licenseCategory}
                  onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                >
                  <option value="">Seleccione...</option>
                  <option value="C1">Categoría C1</option>
                  <option value="C2">Categoría C2</option>
                  <option value="C3">Categoría C3</option>
                  <option value="C1-C3">Categoría C1-C3</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  FECHA EXPIRACIÓN
                </label>
                <input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  LUGAR DE EXPEDICIÓN
                </label>
                <input
                  type="text"
                  value={formData.licensePlaceOfIssue}
                  onChange={(e) => setFormData({ ...formData, licensePlaceOfIssue: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="Ej. 14 de Mayo, 2008"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  TELÉFONO MÓVIL
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="+1 (000) 000-0000"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  TELÉFONO DE EMERGENCIA
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="+1 (000) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, height: 48, borderRadius: 14, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ flex: 1, height: 48, borderRadius: 14, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
            >
              Registrar Conductor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
