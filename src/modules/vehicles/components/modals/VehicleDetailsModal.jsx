import { useState } from 'react';
import { updateVehicle } from '../../services/vehicleStorage';

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default function VehicleDetailsModal({ vehicle, open, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(vehicle);

  const handleSave = () => {
    updateVehicle(vehicle.id, editFormData);
    onUpdate(editFormData);
    setIsEditing(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'maintenance': return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'off-duty': return 'bg-gray-50 text-gray-600 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'maintenance': return 'Mantenimiento';
      case 'off-duty': return 'Fuera de Servicio';
      default: return status;
    }
  };

  if (!open || !vehicle) return null;

  const displayVehicle = isEditing ? editFormData : vehicle;

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
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
              {isEditing ? 'Editar Vehículo' : 'Detalles del Vehículo'}
            </h2>
            <p style={{ margin: '6px 0 0', color: '#7a7680', fontSize: 14 }}>
              {isEditing ? 'Modifica los datos del vehículo' : 'Información completa del vehículo seleccionado'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                <EditIcon className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(vehicle);
                  }}
                  style={{ height: 36, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  style={{ height: 36, padding: '0 14px', borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Guardar
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', flexShrink: 0, padding: 4 }}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Photo and Basic Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={displayVehicle.photo}
                  alt={displayVehicle.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="mt-4">
                <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${getStatusStyle(displayVehicle.status)}`}>
                  {getStatusText(displayVehicle.status)}
                </span>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                  Marca y Modelo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  />
                ) : (
                  <p className="text-xl font-semibold text-slate-800">{displayVehicle.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Placa (Matrícula)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.licensePlate}
                      onChange={(e) => setEditFormData({ ...editFormData, licensePlate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl inline-block">
                      {displayVehicle.licensePlate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Año Modelo
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                    />
                  ) : (
                    <p className="text-lg text-slate-800">{displayVehicle.year}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Color Exterior
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.color}
                      onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                      placeholder="Ej: Negro, Blanco, Gris..."
                    />
                  ) : (
                    <p className="text-lg text-slate-800">{displayVehicle.color || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                    Categoría
                  </label>
                  {isEditing ? (
                    <select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="Gama baja">Gama baja</option>
                      <option value="Gama media">Gama media</option>
                      <option value="Gama alta">Gama alta</option>
                    </select>
                  ) : (
                    <p className="text-lg text-slate-800">{displayVehicle.category || 'N/A'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                  Dueño / Cliente
                </label>
                {isEditing ? (
                  <select
                    value={editFormData.owner}
                    onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  >
                    <option value="">Seleccionar Cliente</option>
                    <option value="Alexander Sterling">Alexander Sterling</option>
                    <option value="Elena Rodriguez">Elena Rodriguez</option>
                    <option value="Enterprise Logistics">Enterprise Logistics</option>
                    <option value="Premium Rides Inc.">Premium Rides Inc.</option>
                    <option value="Luxury Transport Co.">Luxury Transport Co.</option>
                  </select>
                ) : (
                  <p className="text-lg text-slate-800">{displayVehicle.owner}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '16px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
            {!isEditing ? (
              <button
                type="button"
                onClick={onClose}
                style={{ height: 40, borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '0 24px', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
              >
                Cerrar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(vehicle);
                  }}
                  style={{ height: 40, borderRadius: 12, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '0 20px' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ height: 40, borderRadius: 12, border: 0, background: '#ff9a2f', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '0 20px', boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)' }}
                >
                  Guardar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
