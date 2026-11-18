import { useState } from 'react';
import useModalA11y from '../../../../hooks/useModalA11y.js';

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DocumentIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

export default function ViewLicensesModal({ driver, open, onClose }) {
  const modalRef = useModalA11y(open, onClose);
  const [zoomImg, setZoomImg] = useState(null);

  if (!open || !driver) return null;

  const usr = driver.usuario || {};
  const nombreCompleto =
    usr.nombreCompleto ||
    `${usr.nombre || driver.nombre || ''} ${usr.apellido || driver.apellido || ''}`.trim() ||
    driver.name ||
    'Conductor';

  const tipoDoc = usr.tipoDocumento || driver.tipoDocumento || 'CC';
  const doc = usr.documento || driver.documento || 'N/A';

  // Consolidar lista de licencias
  let listaLicencias = [];
  if (Array.isArray(driver.licencias) && driver.licencias.length > 0) {
    listaLicencias = driver.licencias;
  } else if (driver.licencia) {
    let cats = [];
    if (Array.isArray(driver.categoriasLicencia) && driver.categoriasLicencia.length > 0) {
      cats = driver.categoriasLicencia;
    } else if (driver.categoriaLicencia) {
      cats = [driver.categoriaLicencia];
    } else {
      cats = ['B1'];
    }

    listaLicencias = [
      {
        numero: driver.licencia,
        categoria: driver.categoriaLicencia || cats[0] || 'B1',
        categorias: cats,
        fechaExpedicion: driver.fechaExpedicion,
        fechaVencimiento: driver.fechaVencimiento,
        lugarExpedicion: driver.lugarExpedicion || '',
        fotoLicencia: driver.fotoLicencia || null,
      },
    ];
  }

  const hoy = new Date();

  return (
    <>
      <div className="mc-modal-overlay" onClick={onClose}>
        <div
          className="mc-modal"
          style={{ maxWidth: 760, width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-view-licenses"
          ref={modalRef}
          tabIndex={-1}
        >
          {/* ENCABEZADO */}
          <div className="mc-modal-header border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <DocumentIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="modal-title-view-licenses" className="text-lg font-bold text-[#11384a]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    Licencias de Conducción
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
                    {listaLicencias.length} {listaLicencias.length === 1 ? 'licencia' : 'licencias'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conductor: <strong className="text-slate-700">{nombreCompleto}</strong> ({tipoDoc} {doc})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="mc-modal-close"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* LISTA DE LICENCIAS */}
          <div className="px-6 py-5 space-y-4">
            {listaLicencias.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay licencias registradas para este conductor.
              </div>
            ) : (
              listaLicencias.map((lic, index) => {
                const numero = lic.numero || lic.licencia || 'N/A';

                let cats = [];
                if (Array.isArray(lic.categorias) && lic.categorias.length > 0) cats = lic.categorias;
                else if (Array.isArray(lic.categoriasLicencia) && lic.categoriasLicencia.length > 0) cats = lic.categoriasLicencia;
                else if (lic.categoria) cats = [lic.categoria];
                else cats = ['B1'];

                const fechaVenc = lic.fechaVencimiento ? new Date(lic.fechaVencimiento) : null;
                const diasParaVencer = fechaVenc ? Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24)) : null;

                const foto = lic.fotoLicencia || (index === 0 ? driver.fotoLicencia : null);

                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition"
                  >
                    {/* Header de la tarjeta */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {index === 0 ? 'Licencia Principal' : `Licencia #${index + 1}`}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ★ Principal
                          </span>
                        )}
                      </div>

                      {/* Estado de vigencia */}
                      <div>
                        {diasParaVencer === null ? (
                          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                            Sin vigencia
                          </span>
                        ) : diasParaVencer <= 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                            ✕ Vencida hace {Math.abs(diasParaVencer)} días
                          </span>
                        ) : diasParaVencer <= 30 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ⚠️ Vence en {diasParaVencer} días
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Válida ({diasParaVencer}d vigentes)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Datos de la licencia */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-slate-400 font-medium block text-[10.5px]">NÚMERO DE LICENCIA</span>
                        <span className="text-slate-900 font-bold text-sm tracking-wide">{numero}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[10.5px]">CATEGORÍAS AUTORIZADAS</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cats.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[10.5px]">FECHA DE EXPEDICIÓN</span>
                        <span className="text-slate-700 font-medium">{formatearFecha(lic.fechaExpedicion)}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[10.5px]">FECHA DE VENCIMIENTO</span>
                        <span className="text-slate-800 font-bold">{formatearFecha(lic.fechaVencimiento)}</span>
                      </div>
                    </div>

                    {/* Lugar de expedición si existe */}
                    {lic.lugarExpedicion && (
                      <div className="text-xs mb-2 text-slate-500">
                        <span className="text-slate-400 font-medium mr-1 text-[10.5px]">SECRETARÍA / ORGANISMO:</span>
                        <span className="font-medium text-slate-700">{lic.lugarExpedicion}</span>
                      </div>
                    )}

                    {/* Foto de la licencia si existe */}
                    {foto && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-3">
                        <img
                          src={foto}
                          alt={`Licencia ${numero}`}
                          className="w-20 h-14 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                          onClick={() => setZoomImg(foto)}
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-700">Documento digital adjunto</p>
                          <button
                            type="button"
                            onClick={() => setZoomImg(foto)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline mt-0.5"
                          >
                            Ver documento completo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* PIE */}
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

      {/* ZOOM MODAL */}
      {zoomImg && (
        <div className="mc-modal-overlay" onClick={() => setZoomImg(null)} style={{ zIndex: 9999 }}>
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomImg(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition"
            >
              ✕
            </button>
            <img
              src={zoomImg}
              alt="Licencia de conducción"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

