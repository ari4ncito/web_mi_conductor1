import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiArrowRight, FiZoomIn, FiZoomOut, FiRotateCcw, FiX } from 'react-icons/fi';
import VehiculoService from '../../vehicles/services/VehiculoService.js';

function TarjetaZoomModal({ src, title, onClose }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Top Toolbar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between bg-slate-900/90 border border-slate-700/80 text-white px-4 py-2.5 rounded-2xl mb-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold truncate">{title || 'Tarjeta de Propiedad'}</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white transition cursor-pointer"
            title="Alejar"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer flex items-center gap-1"
            title="Restablecer tamaño"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            <span>100%</span>
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white transition cursor-pointer"
            title="Acercar"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/15 mx-1" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition cursor-pointer"
            title="Cerrar (Esc)"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Viewport */}
      <div
        className="relative w-full max-w-4xl h-[75vh] overflow-auto rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          e.preventDefault();
          if (e.deltaY < 0) zoomIn();
          else zoomOut();
        }}
      >
        <img
          src={src}
          alt={title || 'Tarjeta de Propiedad'}
          onClick={() => setScale((s) => (s < 2 ? s + 0.5 : 1))}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.18s ease-out',
          }}
          className={`max-w-full max-h-full object-contain select-none rounded-lg shadow-2xl ${
            scale < 2 ? 'cursor-zoom-in' : 'cursor-zoom-out'
          }`}
        />
      </div>

      <p className="text-xs text-slate-300 mt-2.5 font-medium">
        Haz clic sobre la imagen o usa la rueda del mouse / botones superiores para hacer zoom
      </p>
    </div>
  );
}

// Helper to calculate document status
function getDocumentStatus(dateStr) {
  if (!dateStr) {
    return {
      status: 'none',
      label: 'Sin registrar',
      dateText: 'Fecha no registrada',
      color: 'slate',
      isExpired: false,
      isWarning: false
    };
  }

  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) {
    return {
      status: 'none',
      label: 'Inválida',
      dateText: 'Fecha no válida',
      color: 'slate',
      isExpired: false,
      isWarning: false
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const year = targetDate.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;

  if (diffDays < 0) {
    const expiredDays = Math.abs(diffDays);
    return {
      status: 'expired',
      label: `Vencido (hace ${expiredDays} día${expiredDays === 1 ? '' : 's'})`,
      dateText: dateFormatted,
      color: 'red',
      isExpired: true,
      isWarning: false
    };
  } else if (diffDays <= 30) {
    return {
      status: 'warning',
      label: `Vence en ${diffDays} día${diffDays === 1 ? '' : 's'}`,
      dateText: dateFormatted,
      color: 'amber',
      isExpired: false,
      isWarning: true
    };
  } else {
    return {
      status: 'valid',
      label: 'Vigente',
      dateText: dateFormatted,
      color: 'emerald',
      isExpired: false,
      isWarning: false
    };
  }
}

function StatusPill({ statusInfo }) {
  if (statusInfo.color === 'red') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
        <span>{statusInfo.label}</span>
      </span>
    );
  }

  if (statusInfo.color === 'amber') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
        <span>{statusInfo.label}</span>
      </span>
    );
  }

  if (statusInfo.color === 'emerald') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
        <span>{statusInfo.label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shrink-0">
      {statusInfo.label}
    </span>
  );
}

export default function ClientVehiclesModal({ client, onClose }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoomTarjeta, setZoomTarjeta] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError('');

        const clientId = client?._id;
        let clientVehicles = [];

        // Try getByCliente first
        try {
          const res = await VehiculoService.getByCliente(clientId);
          const data = res?.data || res;
          if (Array.isArray(data)) clientVehicles = data;
          else if (data && Array.isArray(data.vehiculos)) clientVehicles = data.vehiculos;
        } catch {
          // Fallback to getAll
          const allRes = await VehiculoService.getAll();
          const allData = allRes?.data || allRes;
          const list = Array.isArray(allData) ? allData : (allData?.vehiculos || allData?.rows || []);
          clientVehicles = list.filter((v) => {
            const vClientId = v.cliente?._id || v.cliente;
            return vClientId === clientId;
          });
        }

        setVehicles(clientVehicles);
      } catch (err) {
        console.error("Error al cargar los vehículos:", err);
        setError("No se pudieron cargar los vehículos de este cliente.");
      } finally {
        setLoading(false);
      }
    };

    if (client) {
      fetchVehicles();
    }
  }, [client]);

  const nombreCompleto =
    `${client?.usuario?.nombre || client?.nombre || ''} ${client?.usuario?.apellido || client?.apellido || ''}`.trim() ||
    'el cliente';

  const hasAnyExpired = vehicles.some((v) => {
    const soat = getDocumentStatus(v.fechaVencimientoSoat || v.certificadoSoat);
    const tecno = getDocumentStatus(v.fechaVencimientoTecnomecanica || v.fechaRevisionTecnicoMecanica);
    return soat.isExpired || tecno.isExpired;
  });

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{ maxWidth: 820 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">
              Vehículos
            </p>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              <h2 className="mc-modal-title" style={{ marginTop: 0 }}>
                Vehículos de {nombreCompleto}
              </h2>
              {hasAnyExpired && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                  <FiAlertTriangle size={12} className="shrink-0" />
                  <span>Documentación Vencida</span>
                </span>
              )}
            </div>
            <p className="mc-modal-desc" style={{ marginTop: 6 }}>
              Estado de vigencia de SOAT, Tecnomecánica y Tarjeta de Propiedad.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
            className="mc-modal-close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="mc-modal-body space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-9 h-9 border-3 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Cargando vehículos...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 p-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-700">Sin vehículos registrados</h3>
              <p className="text-xs text-slate-400 mt-1">Este cliente actualmente no tiene ningún vehículo asociado.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {vehicles.map((v) => {
                const soat = getDocumentStatus(v.fechaVencimientoSoat || v.certificadoSoat);
                const tecno = getDocumentStatus(v.fechaVencimientoTecnomecanica || v.fechaRevisionTecnicoMecanica);
                const tarjetaUrl = v.tarjetaPropiedad || v.tarjetaCirculacion || null;
                const hasTarjeta = Boolean(tarjetaUrl);

                const hasCriticalAlert = soat.isExpired || tecno.isExpired;

                return (
                  <div
                    key={v._id}
                    className={`rounded-2xl border transition p-5 ${
                      hasCriticalAlert
                        ? 'border-red-300 bg-red-50/20 shadow-xs ring-1 ring-red-200'
                        : 'border-slate-200/90 bg-white shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {/* Header of Vehicle Card */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.foto || v.foto1 || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop'}
                          alt={`${v.marca} ${v.modelo}`}
                          className="w-13 h-11 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 leading-tight">
                              {v.marca} {v.modelo}
                            </h3>
                            {v.anio && (
                              <span className="text-xs font-semibold text-slate-400">
                                ({v.anio})
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {v.tipoVehiculo || 'Vehículo'} {v.color ? `• Color ${v.color}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                          {v.placa || 'SIN PLACA'}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            v.estado !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {v.estado !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Critical Alerts */}
                    {hasCriticalAlert && (
                      <div className="mt-3 p-3 rounded-xl bg-red-100/80 border border-red-200 text-red-800 text-xs font-bold flex flex-wrap items-center gap-3">
                        <FiAlertTriangle size={16} className="text-red-600 shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {soat.isExpired && (
                            <span className="bg-red-200/90 text-red-900 px-2 py-0.5 rounded-md">
                              SOAT VENCIDO ({soat.dateText})
                            </span>
                          )}
                          {tecno.isExpired && (
                            <span className="bg-red-200/90 text-red-900 px-2 py-0.5 rounded-md">
                              TECNOMECÁNICA VENCIDA ({tecno.dateText})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expiration Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
                      {/* SOAT Card */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 min-h-[110px] transition ${
                        soat.isExpired
                          ? 'bg-red-50/70 border-red-200'
                          : soat.isWarning
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            SOAT
                          </div>
                          <div className="text-base font-extrabold text-slate-900 tracking-tight">
                            {soat.dateText}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">Estado:</span>
                          <StatusPill statusInfo={soat} />
                        </div>
                      </div>

                      {/* Tecnomecánica Card */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 min-h-[110px] transition ${
                        tecno.isExpired
                          ? 'bg-red-50/70 border-red-200'
                          : tecno.isWarning
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Tecnomecánica
                          </div>
                          <div className="text-base font-extrabold text-slate-900 tracking-tight">
                            {tecno.dateText}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">Estado:</span>
                          <StatusPill statusInfo={tecno} />
                        </div>
                      </div>

                      {/* Tarjeta de Propiedad Card */}
                      <div className="p-4 rounded-xl border bg-slate-50/80 border-slate-200/80 flex flex-col justify-between gap-3 min-h-[110px]">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              Tarjeta Propiedad
                            </div>
                            {hasTarjeta && (
                              <button
                                type="button"
                                onClick={() =>
                                  setZoomTarjeta({
                                    src: tarjetaUrl,
                                    title: `Tarjeta de Propiedad • ${v.marca || ''} ${v.modelo || ''} (${v.placa || 'SIN PLACA'})`,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 transition cursor-pointer"
                                title="Visualizar y hacer zoom a la Tarjeta de Propiedad"
                              >
                                <FiZoomIn size={12} className="shrink-0" />
                                <span>Ver / Zoom</span>
                              </button>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-slate-800 truncate">
                            {hasTarjeta ? 'Documento disponible' : 'Sin documento adjunto'}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">Estado:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            hasTarjeta
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {hasTarjeta ? 'Cargada' : 'No cargada'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-100">
                      <Link
                        to={`/vehicles/${v._id}`}
                        onClick={onClose}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1.5 transition no-underline"
                      >
                        <span>Ver detalle completo del vehículo</span>
                        <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mc-modal-footer">
          <button
            onClick={onClose}
            type="button"
            className="mc-btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>

      {zoomTarjeta && (
        <TarjetaZoomModal
          src={zoomTarjeta.src}
          title={zoomTarjeta.title}
          onClose={() => setZoomTarjeta(null)}
        />
      )}
    </div>
  );
}
