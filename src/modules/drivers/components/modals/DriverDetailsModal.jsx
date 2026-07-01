import { useState } from 'react';
import EditDriverModal from './EditDriverModal';

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function DriverDetailsModal({ driver, open, onClose, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!open || !driver) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-orange-100">
                  <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{driver.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                      Verificado
                    </span>
                    <span className="text-xs text-slate-500">Desde Febrero 2022</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar Información
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Secciones de información */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Información Personal */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-700">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Información Personal</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">NOMBRE COMPLETO</p>
                    <p className="text-sm text-slate-800 font-medium">{driver.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">DOCUMENTO DE IDENTIDAD</p>
                    <p className="text-sm text-slate-800 font-medium">ID-08765410-X</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">CORREO ELECTRÓNICO</p>
                    <p className="text-sm text-slate-800 font-medium">j.vance@ejemplo-conductor.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">TELÉFONO</p>
                    <p className="text-sm text-slate-800 font-medium">+1 502 3456 789</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">UBICACIÓN</p>
                    <p className="text-sm text-slate-800 font-medium">Ciudad de Guatemala, Guatemala</p>
                  </div>
                </div>
              </div>

              {/* Información de Licencia */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Información de Licencia</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">NÚMERO DE LICENCIA</p>
                    <p className="text-sm text-slate-800 font-medium">{driver.license}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">CATEGORÍA</p>
                    <p className="text-sm text-slate-800 font-medium">Clase B / Profesional</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">FECHA DE VENCIMIENTO</p>
                    <p className="text-sm text-slate-800 font-medium">{driver.licenseExpiry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">LUGAR DE EXPEDICIÓN</p>
                    <p className="text-sm text-slate-800 font-medium">14 de Mayo, 2008</p>
                  </div>
                </div>
              </div>

              {/* Vehículo Asignado */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-700">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4.5 14.5h15l-1.3-5.4a1.7 1.7 0 0 0-1.65-1.3H7.45c-.8 0-1.5.52-1.72 1.28L4.5 14.5Z" />
                      <path d="M6.4 14.5v2.4M17.6 14.5v2.4" />
                      <path d="M8 10.3h8" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Vehículo Asignado</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">VEHÍCULO</p>
                    <p className="text-sm text-slate-800 font-medium">Mercedes-Benz S-Class</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">PLACA</p>
                    <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                      ABC-1234
                    </p>
                  </div>
                  <div className="w-full h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"
                      alt="Vehículo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas de Desempeño */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Estadísticas de Desempeño</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-3xl p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-200 mb-2">Total viajes completados</p>
                  <p className="text-4xl font-bold">{driver.trips.toLocaleString()}</p>
                </div>
                <div className="bg-slate-100 rounded-3xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tasa de viajes completados</p>
                  <p className="text-3xl font-bold text-slate-800">96.4%</p>
                </div>
                <div className="bg-slate-100 rounded-3xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Calificación promedio</p>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-3xl font-bold text-slate-800">{driver.performance.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-3xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Ingresos totales (mes)</p>
                  <p className="text-3xl font-bold text-slate-800">€4,250</p>
                </div>
              </div>
            </div>

            {/* Secciones inferiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Viajes Recientes */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Viajes Recientes</h3>
                  <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition">Ver todos el historial</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Aeropuerto Adolfo Suárez</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">€45.20</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Hotel Wellington Madrid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">€28.90</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recordatorios */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6">Recordatorios</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-pink-800">Renuegar Papeles Vehículo</p>
                        <p className="text-xs text-pink-600 mt-1">Fecha límite: 15 de Octubre, 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-200 rounded-full flex items-center justify-center text-cyan-700 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-cyan-800">Actualización de Perfil</p>
                        <p className="text-xs text-cyan-600 mt-1">Actualizar foto del conductor</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 border border-orange-200 text-orange-600 text-xs font-semibold rounded-2xl hover:bg-orange-50 transition">
                  + Añadir hora de gestión
                </button>
              </div>

              {/* Espacio vacío para equilibrio */}
              <div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Editar dentro de Detalle */}
      <EditDriverModal
        driver={driver}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(updatedDriver) => {
          onUpdate(updatedDriver);
        }}
      />
    </>
  );
}
