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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-100"
        style={{ maxWidth: 'min(960px, calc(100% - 40px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-7 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Editar Vehículo' : 'Detalles del Vehículo'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isEditing ? 'Modifica los datos del vehículo' : 'Información completa del vehículo seleccionado'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold hover:shadow-lg transition"
                >
                  Guardar
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-1"
              aria-label="Cerrar"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
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
                    <select
                      value={editFormData.color}
                      onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
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
                      <option value="Ejecutivo Sedan">Ejecutivo Sedan</option>
                      <option value="SUV Premium">SUV Premium</option>
                      <option value="Limusina">Limusina</option>
                      <option value="Van Ejecutiva">Van Ejecutiva</option>
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
          <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
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
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl transition"
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
