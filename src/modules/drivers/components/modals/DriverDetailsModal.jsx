import { useState } from 'react';
import EditDriverModal from './EditDriverModal.jsx';
import useModalA11y from '../../../../hooks/useModalA11y.js';

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function EditIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const fechaObj = new Date(fecha);
  if (Number.isNaN(fechaObj.getTime())) return 'N/A';
  return fechaObj.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const calcularAntiguedad = (fechaRegistro) => {
  if (!fechaRegistro) return 'Reciente';
  const inicio = new Date(fechaRegistro);
  if (isNaN(inicio.getTime())) return 'Reciente';
  const hoy = new Date();

  let anios = hoy.getFullYear() - inicio.getFullYear();
  let meses = hoy.getMonth() - inicio.getMonth();

  if (meses < 0) {
    anios--;
    meses += 12;
  }

  if (anios > 0) {
    return `${anios} ${anios === 1 ? 'año' : 'años'}${meses > 0 ? ` y ${meses} ${meses === 1 ? 'mes' : 'meses'}` : ''}`;
  }
  if (meses > 0) {
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }

  const dias = Math.max(1, Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24)));
  return `${dias} ${dias === 1 ? 'día' : 'días'}`;
};

export default function DriverDetailsModal({ driver, open, onClose, onUpdate }) {
  const modalRef = useModalA11y(open, onClose);
  const [showEditModal, setShowEditModal] = useState(false);
  const [verFotoAmpliada, setVerFotoAmpliada] = useState(false);

  if (!open || !driver) return null;

  const usr = driver.usuario || {};
  const nombreCompleto =
    usr.nombreCompleto ||
    `${usr.nombre || driver.nombre || ''} ${usr.apellido || driver.apellido || ''}`.trim() ||
    driver.name ||
    'Conductor';

  const tipoDocumento = usr.tipoDocumento || driver.tipoDocumento || driver.documentType || 'CC';
  const documento = usr.documento || driver.documento || driver.idNumber || 'N/A';
  const correo = usr.correo || driver.correo || driver.email || 'N/A';
  const telefono = usr.telefono || driver.telefono || driver.phone || 'N/A';
  const telefonoEmergencia = driver.telefonoEmergencia || 'No registrado';

  const licencia = driver.licencia || driver.license || driver.licencias?.[0]?.numero || 'N/A';

  // Categorías de licencia
  let categorias = [];
  if (Array.isArray(driver.categoriasLicencia) && driver.categoriasLicencia.length > 0) {
    categorias = driver.categoriasLicencia;
  } else if (driver.categoriaLicencia) {
    categorias = [driver.categoriaLicencia];
  } else if (Array.isArray(driver.licencias) && driver.licencias.length > 0) {
    categorias = driver.licencias.map((l) => l.categoria || l.categoriaLicencia).filter(Boolean);
  }
  if (categorias.length === 0) categorias = ['B1'];

  const fechaExpedicion = driver.fechaExpedicion || driver.licenseIssueDate || driver.licencias?.[0]?.fechaExpedicion;
  const fechaVencimiento = driver.fechaVencimiento || driver.licenseExpiry || driver.licencias?.[0]?.fechaVencimiento;
  const experienciaDeclarada = driver.experiencia ?? driver.experience ?? 0;
  const antiguedadPlataforma = calcularAntiguedad(driver.createdAt || usr.createdAt);

  const disponible = Boolean(driver.disponible ?? driver.available);
  const estadoAdmin = driver.estadoConductor || (driver.estado === false ? 'INACTIVO' : 'ACTIVO');

  // Estado de vencimiento de licencia
  const hoy = new Date();
  const fechaVenc = fechaVencimiento ? new Date(fechaVencimiento) : null;
  const diasParaVencer = fechaVenc ? Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24)) : null;

  return (
    <>
      <div className="mc-modal-overlay" onClick={onClose}>
        <div
          className="mc-modal"
          style={{ maxWidth: 840, width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-driver-details"
          ref={modalRef}
          tabIndex={-1}
        >
          {/* ENCABEZADO */}
          <div className="mc-modal-header border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg shadow-xs">
                {nombreCompleto.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="modal-title-driver-details"
                    className="text-xl font-bold text-[#11384a]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {nombreCompleto}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {tipoDocumento} {documento}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detalle integral del conductor y estado operativo en la plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <EditIcon className="w-3.5 h-3.5" />
                Editar Información
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="mc-modal-close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* ESTADOS Y DISPONIBILIDAD OPERATIVA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ESTADO
                  </span>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      estadoAdmin === 'ACTIVO'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : estadoAdmin === 'RETIRADO'
                        ? 'bg-slate-200 text-slate-800 border border-slate-300'
                        : estadoAdmin === 'FALLECIDO'
                        ? 'bg-slate-900 text-white'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {estadoAdmin}
                  </span>
                </div>
                {driver.motivoCambioEstado && (
                  <span className="text-[11px] text-slate-500 max-w-[180px] text-right truncate" title={driver.motivoCambioEstado}>
                    Motivo: {driver.motivoCambioEstado}
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    DISPONIBILIDAD OPERATIVA
                  </span>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      disponible
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {disponible ? '✓ Disponible para servicios' : 'Fuera de servicio'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {disponible ? 'Listo para despachos' : 'No recibe solicitudes'}
                </span>
              </div>
            </div>

            {/* SECCIÓN 1: DATOS PERSONALES Y CONTACTO */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Datos Personales y de Contacto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">DOCUMENTO</span>
                  <span className="text-slate-800 font-bold">{tipoDocumento} {documento}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">CORREO ELECTRÓNICO</span>
                  <span className="text-slate-800 font-semibold">{correo}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">TELÉFONO MÓVIL</span>
                  <span className="text-slate-800 font-semibold">{telefono}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">TELÉFONO EMERGENCIA</span>
                  <span className="text-slate-700">{telefonoEmergencia}</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: LICENCIA DE CONDUCCIÓN */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                Licencia de Conducción
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-3">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">NÚMERO DE LICENCIA</span>
                  <span className="text-slate-800 font-bold text-sm tracking-wide">{licencia}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">CATEGORÍAS AUTORIZADAS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {categorias.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold text-[11px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">VIGENCIA DE LICENCIA</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-800 font-bold">
                      {formatearFecha(fechaVencimiento)}
                    </span>
                    {diasParaVencer !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          diasParaVencer <= 0
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : diasParaVencer <= 30
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {diasParaVencer <= 0 ? 'Vencida' : `${diasParaVencer}d vigentes`}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Expedida: {formatearFecha(fechaExpedicion)}
                  </span>
                </div>
              </div>

              {/* FOTO DE LA LICENCIA */}
              {driver.fotoLicencia && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    DOCUMENTO DIGITAL DE LA LICENCIA
                  </span>
                  <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
                    onClick={() => setVerFotoAmpliada(true)}
                  >
                    <img
                      src={driver.fotoLicencia}
                      alt="Licencia de conducción"
                      className="w-48 h-28 object-cover group-hover:opacity-90 transition"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                      🔍 Ver ampliada
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 3: DIFERENCIACIÓN DE EXPERIENCIA Y ANTIGÜEDAD */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                Trayectoria y Tiempos de Experiencia
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Experiencia profesional declarada */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/40 border border-teal-200/80">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    EXPERIENCIA PROFESIONAL DECLARADA
                  </span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-extrabold text-teal-900">
                      {experienciaDeclarada}
                    </span>
                    <span className="text-xs font-bold text-teal-700">
                      {experienciaDeclarada === 1 ? 'año conduciendo' : 'años conduciendo'}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-600/90 mt-1">
                    Años acumulados de conducción profesional declarados en la licencia de tránsito.
                  </p>
                </div>

                {/* 2. Antigüedad en Mi Conductor */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50/40 border border-cyan-200/80">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider block">
                    ANTIGÜEDAD EN MI CONDUCTOR
                  </span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl font-extrabold text-cyan-900">
                      {antiguedadPlataforma}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-600/90 mt-1">
                    Tiempo de servicio activo como conductor registrado en la plataforma Mi Conductor (desde {formatearFecha(driver.createdAt || usr.createdAt)}).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PIE DE MODAL */}
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/50 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR CONDUCTOR */}
      {showEditModal && (
        <EditDriverModal
          driver={driver}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updated) => {
            if (onUpdate) onUpdate(updated);
            setShowEditModal(false);
          }}
        />
      )}

      {/* MODAL ZOOM FOTO DE LICENCIA */}
      {verFotoAmpliada && driver.fotoLicencia && (
        <div className="mc-modal-overlay" onClick={() => setVerFotoAmpliada(false)} style={{ zIndex: 9999 }}>
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setVerFotoAmpliada(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition"
            >
              ✕
            </button>
            <img
              src={driver.fotoLicencia}
              alt="Licencia de conducción ampliada"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
