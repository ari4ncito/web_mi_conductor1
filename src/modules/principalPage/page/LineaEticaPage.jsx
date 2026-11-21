import { useState } from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

const TIPOS_REPORTE = [
  'Comportamiento inadecuado del conductor',
  'Incumplimiento de las condiciones del servicio',
  'Irregularidades durante el traslado del vehículo',
  'Uso indebido de información personal',
  'Suplantación de identidad o falsedad',
  'Presunta conducta fraudulenta o cobros no autorizados',
  'Posible acto de corrupción o soborno',
  'Situación que comprometa la seguridad del cliente o del vehículo',
  'Otra conducta contraria a la ética y políticas de Go Driver',
];

export default function LineaEticaPage() {
  const [formData, setFormData] = useState({
    esAnonimo: false,
    nombre: '',
    correo: '',
    telefono: '',
    tipoReporte: '',
    fechaIncidente: '',
    descripcion: '',
    autorizacionDatos: false,
  });

  const [archivos, setArchivos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submittedStatus, setSubmittedStatus] = useState(null); // 'success' | 'info'
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + archivos.length > 5) {
      setErrors((prev) => ({ ...prev, archivos: 'Puedes adjuntar un máximo de 5 archivos/fotografías.' }));
      return;
    }
    setArchivos((prev) => [...prev, ...files].slice(0, 5));
    setErrors((prev) => ({ ...prev, archivos: null }));
  };

  const handleRemoveFile = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipoReporte) {
      newErrors.tipoReporte = 'Seleccione el tipo de reporte.';
    }

    if (!formData.fechaIncidente) {
      newErrors.fechaIncidente = 'Indique la fecha aproximada en que ocurrió la situación.';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Ingrese una descripción detallada de los hechos observados.';
    } else if (formData.descripcion.trim().length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres para permitir una adecuada revisión.';
    }

    if (!formData.esAnonimo) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'Ingrese su nombre o marque la casilla de reporte anónimo.';
      }
      if (!formData.correo.trim()) {
        newErrors.correo = 'Ingrese un correo electrónico para dar trámite a su reporte.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        newErrors.correo = 'Ingrese un correo electrónico válido.';
      }

      if (!formData.autorizacionDatos) {
        newErrors.autorizacionDatos = 'Debe autorizar el tratamiento de sus datos de contacto para la gestión del reporte.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    // Como no existe un backend específico de reportes de línea ética implementado,
    // se deja claramente identificado como integración pendiente sin falsear que se envió a un servidor.
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedStatus('info_ready');
    }, 600);
  };

  return (
    <LegalPageLayout
      title="Línea Ética y Canal de Transparencia"
      subtitle="Canal institucional para la recepción, revisión y seguimiento de irregularidades o conductas contrarias a los principios de Go Driver."
      lastUpdated="20 de noviembre de 2026"
    >
      <div className="space-y-10 text-sm sm:text-base leading-relaxed">

        {/* Alerta de Emergencias */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-900 text-xs sm:text-sm">
          <strong>IMPORTANTE:</strong> La Línea Ética <u>no constituye un canal de atención de emergencias vitales</u> ni reemplaza
          a las autoridades competentes. Si se encuentra frente a una urgencia en curso, comuníquese de inmediato a la Línea Nacional
          de Emergencias <strong>123</strong> o a la Policía Nacional.
        </div>

        {/* 1. Objetivo y Principios */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            1. Propósito de la Línea Ética
          </h2>
          <p>
            Go Driver pone a disposición de clientes, conductores, colaboradores y terceros este canal voluntario de comunicación
            para prevenir, detectar y corregir comportamientos o situaciones irregulares que atenten contra la seguridad de las
            personas, la integridad de los vehículos, la transparencia operativa o las políticas de servicio de <strong>Mi Conductor</strong>.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 italic">
            Nota de transparencia: Este canal opera como un mecanismo interno de autorregulación y buena fe empresarial. Su habilitación
            no implica la obligatoriedad formal de un Programa de Transparencia y Ética Empresarial (PTEE) supervisado por la
            Superintendencia de Sociedades, salvo determinación legal posterior.
          </p>
        </section>

        {/* 2. Situaciones Reportables */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            2. Hechos o Situaciones que Pueden Reportarse
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
            {TIPOS_REPORTE.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Confidencialidad y Protección */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            3. Confidencialidad y Tratamiento Responsable
          </h2>
          <p>
            Toda información provista será tratada bajo estricta reserva por el personal autorizado de Go Driver.
            Los usuarios pueden optar por reportes con datos de contacto o de forma anónima. No obstante, por responsabilidad y
            transparencia jurídica, no se promete un anonimato absoluto en aquellos casos en que un mandamiento judicial o requerimiento
            de autoridad pública competente exija legalmente el suministro de información.
          </p>
        </section>

        {/* 4. Formulario de Reporte */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
              4. Formulario de Presentación de Reportes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Diligencie los campos a continuación para someter su situación a estudio por parte de la administración.
            </p>
          </div>

          {submittedStatus === 'info_ready' ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 sm:p-8 space-y-4 text-emerald-950 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold">Reporte Preparado Correctamente</h3>
              </div>
              <p className="text-sm">
                Hemos validado los datos de su reporte sobre: <strong>{formData.tipoReporte}</strong>.
              </p>
              <div className="bg-white/80 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-slate-700">
                <p>
                  <strong>Canal directo de radicación oficial:</strong> Actualmente la base de datos de denuncias web se encuentra en
                  <strong> [INTEGRACIÓN TÉCNICA PENDIENTE EN BACKEND]</strong>.
                </p>
                <p>
                  Para garantizar la atención inmediata de este reporte, puede remitir el resumen o soporte directamente a nuestro
                  canal verificado: <strong>juandavidriveracastillo@gmail.com</strong> o llamar al <strong>314 543 9798</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedStatus(null);
                  setFormData({
                    esAnonimo: false,
                    nombre: '',
                    correo: '',
                    telefono: '',
                    tipoReporte: '',
                    fechaIncidente: '',
                    descripcion: '',
                    autorizacionDatos: false,
                  });
                  setArchivos([]);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                Diligenciar otro reporte
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
              
              {/* Opción Anónima */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <input
                  id="esAnonimo"
                  name="esAnonimo"
                  type="checkbox"
                  checked={formData.esAnonimo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <label htmlFor="esAnonimo" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  Deseo presentar este reporte de manera anónima (sin registrar nombre ni correo)
                </label>
              </div>

              {/* Datos de contacto (si no es anónimo) */}
              {!formData.esAnonimo && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingrese sus nombres y apellidos"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                    />
                    {errors.nombre && <p className="text-[11px] text-red-600 mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico de contacto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      placeholder="ejemplo@correo.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                    />
                    {errors.correo && <p className="text-[11px] text-red-600 mt-1">{errors.correo}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono de contacto (Opcional)
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Número de celular para contacto"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Tipo y fecha del acontecimiento */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de situación o irregularidad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipoReporte"
                    value={formData.tipoReporte}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Seleccione una categoría --</option>
                    {TIPOS_REPORTE.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.tipoReporte && <p className="text-[11px] text-red-600 mt-1">{errors.tipoReporte}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha aproximada del hecho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fechaIncidente"
                    value={formData.fechaIncidente}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                  />
                  {errors.fechaIncidente && <p className="text-[11px] text-red-600 mt-1">{errors.fechaIncidente}</p>}
                </div>
              </div>

              {/* Descripción detallada */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción detallada de la situación <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="descripcion"
                  rows={5}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describa los hechos ocurridos, personas involucradas, vehículos, lugar y cualquier detalle relevante para la investigación..."
                  className="w-full text-xs sm:text-sm p-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                  <span>Mínimo 20 caracteres</span>
                  <span>{formData.descripcion.length} caracteres</span>
                </div>
                {errors.descripcion && <p className="text-[11px] text-red-600 mt-1">{errors.descripcion}</p>}
              </div>

              {/* Adjuntos y Evidencias */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adjuntar fotografías u otras evidencias (Opcional, máx. 5 archivos)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {errors.archivos && <p className="text-[11px] text-red-600 mt-1">{errors.archivos}</p>}

                {archivos.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {archivos.map((file, i) => (
                      <li key={i} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Casilla de Autorización de Datos */}
              {!formData.esAnonimo && (
                <div>
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="autorizacionDatos"
                      checked={formData.autorizacionDatos}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-0.5 text-primary rounded border-slate-300 focus:ring-primary"
                    />
                    <span>
                      Autorizo a Go Driver para el tratamiento de mis datos de contacto con la finalidad exclusiva de
                      investigar los hechos reportados y comunicarme el trámite o resultado, de conformidad con la{' '}
                      <a href="/politica-privacidad" className="text-primary underline">Política de Privacidad de datos</a>.
                    </span>
                  </label>
                  {errors.autorizacionDatos && <p className="text-[11px] text-red-600 mt-1">{errors.autorizacionDatos}</p>}
                </div>
              )}

              {/* Botón de Enviar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent/90 transition-colors text-white font-bold text-sm rounded-full shadow-md cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Validando reporte...' : 'Enviar Reporte a la Línea Ética'}
                </button>
              </div>

            </form>
          )}
        </section>

        {/* 5. Gestión del Reporte */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            5. Recepción, Evaluación y Seguimiento de Reportes
          </h2>
          <p>
            Al recibir un reporte, el personal directivo o el comité designado por Go Driver adelantará las siguientes fases:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 text-slate-700">
            <li><strong>Recepción y registro:</strong> Asignación de código interno y confirmación de recepción si se suministró correo.</li>
            <li><strong>Evaluación preliminar:</strong> Verificación de la plausibilidad y gravedad de los hechos reportados.</li>
            <li><strong>Indagación interna:</strong> Cotejo de las evidencias fotográficas del servicio, registro de novedades y testimonios.</li>
            <li><strong>Medidas correctivas:</strong> Adopción de decisiones administrativas o disciplinarias según corresponda.</li>
          </ol>
        </section>

      </div>
    </LegalPageLayout>
  );
}
