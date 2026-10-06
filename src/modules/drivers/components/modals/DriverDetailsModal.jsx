import { useState } from 'react';
import EditDriverModal from './EditDriverModal';

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const formatearFecha = (fecha) => {
  if (!fecha) {
    return 'N/A';
  }

  const fechaObj = new Date(fecha);

  if (Number.isNaN(fechaObj.getTime())) {
    return 'N/A';
  }

  return fechaObj.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function DriverDetailsModal({
  driver,
  open,
  onClose,
  onUpdate,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!open || !driver) {
    return null;
  }

  /*
   * El backend devuelve:
   *
   * {
   *   _id,
   *   usuario: {
   *     nombre,
   *     apellido,
   *     tipoDocumento,
   *     documento,
   *     correo,
   *     telefono,
   *     estado
   *   },
   *   licencia,
   *   categoriaLicencia,
   *   fechaExpedicion,
   *   fechaVencimiento,
   *   experiencia,
   *   disponible
   * }
   *
   * También dejamos compatibilidad con el formato anterior
   * que utilizaba el frontend.
   */

  const usuario = driver.usuario || {};

  const nombre =
    usuario.nombre ||
    driver.nombre ||
    '';

  const apellido =
    usuario.apellido ||
    driver.apellido ||
    '';

  const nombreCompleto =
    `${nombre} ${apellido}`.trim() ||
    driver.name ||
    'Sin nombre';

  const tipoDocumento =
    usuario.tipoDocumento ||
    driver.tipoDocumento ||
    driver.documentType ||
    'N/A';

  const documento =
    usuario.documento ||
    driver.documento ||
    driver.idNumber ||
    'N/A';

  const correo =
    usuario.correo ||
    driver.correo ||
    driver.email ||
    'N/A';

  const telefono =
    usuario.telefono ||
    driver.telefono ||
    driver.phone ||
    'N/A';

  const licencia =
    driver.licencia ||
    driver.license ||
    'N/A';

  const categoriaLicencia =
    driver.categoriaLicencia ||
    driver.licenseCategory ||
    'N/A';

  const fechaExpedicion =
    driver.fechaExpedicion ||
    driver.licenseIssueDate;

  const fechaVencimiento =
    driver.fechaVencimiento ||
    driver.licenseExpiry;

  const experiencia =
    driver.experiencia ??
    driver.experience ??
    null;

  const disponible =
    driver.disponible ??
    driver.available ??
    false;

  const estadoUsuario =
    usuario.estado ??
    driver.estado ??
    true;

  const estadoConductor =
    estadoUsuario
      ? 'Activo'
      : 'Inactivo';

  const estadoDisponibilidad =
    disponible
      ? 'Disponible'
      : 'No disponible';

  return (
    <>
      <div
        className="mc-modal-overlay"
        onClick={onClose}
      >
        <div
          className="mc-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div
            className="mc-modal-header"
          >
            <div>
              <h2
                className="mc-modal-title"
              >
                {nombreCompleto}
              </h2>

              <p
                className="mc-modal-desc"
              >
                Detalles completos del conductor.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="mc-btn-primary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>

                Editar Información
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="mc-modal-close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* INFORMACIÓN PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* INFORMACIÓN PERSONAL */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-700">

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                    </svg>

                  </div>

                  <h3 className="text-sm font-bold text-slate-800">
                    Información Personal
                  </h3>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      NOMBRE COMPLETO
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {nombreCompleto}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      TIPO DE DOCUMENTO
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {tipoDocumento}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      DOCUMENTO DE IDENTIDAD
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {documento}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      CORREO ELECTRÓNICO
                    </p>

                    <p className="text-sm text-slate-800 font-medium break-words">
                      {correo}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      TELÉFONO
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {telefono}
                    </p>
                  </div>

                </div>
              </div>

              {/* INFORMACIÓN DE LICENCIA */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>

                  </div>

                  <h3 className="text-sm font-bold text-slate-800">
                    Información de Licencia
                  </h3>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      NÚMERO DE LICENCIA
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {licencia}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      CATEGORÍA
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {categoriaLicencia}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      FECHA DE EXPEDICIÓN
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {formatearFecha(fechaExpedicion)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      FECHA DE VENCIMIENTO
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {formatearFecha(fechaVencimiento)}
                    </p>
                  </div>

                </div>
              </div>

              {/* ESTADO DEL CONDUCTOR */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-700">

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4.5 14.5h15l-1.3-5.4a1.7 1.7 0 0 0-1.65-1.3H7.45c-.8 0-1.5.52-1.72 1.28L4.5 14.5Z" />
                      <path d="M6.4 14.5v2.4M17.6 14.5v2.4" />
                      <path d="M8 10.3h8" />
                    </svg>

                  </div>

                  <h3 className="text-sm font-bold text-slate-800">
                    Estado del Conductor
                  </h3>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      ESTADO
                    </p>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        estadoUsuario
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {estadoConductor}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      DISPONIBILIDAD
                    </p>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        disponible
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {estadoDisponibilidad}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      EXPERIENCIA
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      {experiencia !== null
                        ? `${experiencia} ${
                            experiencia === 1
                              ? 'año'
                              : 'años'
                          }`
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      VEHÍCULO ASIGNADO
                    </p>

                    <p className="text-sm text-slate-800 font-medium">
                      No hay vehículo asignado
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* ESTADÍSTICAS DE DESEMPEÑO */}
            <div>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Estadísticas de Desempeño
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-3xl p-6 text-white">

                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-200 mb-2">
                    Experiencia registrada
                  </p>

                  <p className="text-4xl font-bold">
                    {experiencia !== null
                      ? experiencia
                      : '—'}
                  </p>

                  <p className="text-xs text-teal-200 mt-1">
                    años de experiencia
                  </p>

                </div>

                <div className="bg-slate-100 rounded-3xl p-6">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Viajes completados
                  </p>

                  <p className="text-3xl font-bold text-slate-800">
                    No disponible
                  </p>

                </div>

                <div className="bg-slate-100 rounded-3xl p-6">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Calificación promedio
                  </p>

                  <div className="flex items-center gap-1">

                    <span className="text-amber-500">
                      ★
                    </span>

                    <span className="text-3xl font-bold text-slate-800">
                      N/A
                    </span>

                  </div>

                </div>

                <div className="bg-slate-100 rounded-3xl p-6">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Ingresos totales
                  </p>

                  <p className="text-3xl font-bold text-slate-800">
                    No disponible
                  </p>

                </div>

              </div>
            </div>

            {/* INFORMACIÓN ADICIONAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* DATOS DEL REGISTRO */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <div className="flex items-center justify-between mb-6">

                  <h3 className="text-sm font-bold text-slate-800">
                    Datos del Registro
                  </h3>

                </div>

                <div className="space-y-4">

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">

                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>

                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-semibold text-slate-800">
                        Usuario registrado
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Datos personales asociados
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">

                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>

                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-semibold text-slate-800">
                        Licencia registrada
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {licencia}
                      </p>

                    </div>

                  </div>

                </div>
              </div>

              {/* RECORDATORIOS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <h3 className="text-sm font-bold text-slate-800 mb-6">
                  Información de Licencia
                </h3>

                <div className="space-y-3">

                  <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100">

                    <div className="flex items-start gap-3">

                      <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 flex-shrink-0">

                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-pink-800">
                          Vencimiento de licencia
                        </p>

                        <p className="text-xs text-pink-600 mt-1">
                          {formatearFecha(fechaVencimiento)}
                        </p>

                      </div>

                    </div>
                  </div>

                  <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">

                    <div className="flex items-start gap-3">

                      <div className="w-6 h-6 bg-cyan-200 rounded-full flex items-center justify-center text-cyan-700 flex-shrink-0">

                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-cyan-800">
                          Categoría de licencia
                        </p>

                        <p className="text-xs text-cyan-600 mt-1">
                          {categoriaLicencia}
                        </p>

                      </div>

                    </div>
                  </div>

                </div>

              </div>

              {/* VEHÍCULO */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                <h3 className="text-sm font-bold text-slate-800 mb-6">
                  Vehículo Asignado
                </h3>

                <div className="w-full h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">

                  <div className="text-center">

                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto text-cyan-700"
                    >
                      <path d="M4.5 14.5h15l-1.3-5.4a1.7 1.7 0 0 0-1.65-1.3H7.45c-.8 0-1.5.52-1.72 1.28L4.5 14.5Z" />
                      <path d="M6.4 14.5v2.4M17.6 14.5v2.4" />
                      <path d="M8 10.3h8" />
                    </svg>

                    <p className="text-xs font-semibold text-cyan-800 mt-2">
                      Sin vehículo asignado
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* MODAL DE EDITAR */}
      <EditDriverModal
        driver={driver}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(updatedDriver) => {
          onUpdate(updatedDriver);
          setShowEditModal(false);
        }}
      />
    </>
  );
}

