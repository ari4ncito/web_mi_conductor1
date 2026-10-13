import { useState, useEffect } from 'react';
import driverService from '../../services/driverService.js';

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

const formatearFechaInput = (fecha) => {
  if (!fecha) {
    return '';
  }

  return String(fecha).split('T')[0];
};

export default function EditDriverModal({
  driver,
  open,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    documento: '',
    correo: '',
    telefono: '',
    experiencia: '',
  });

  const [licencias, setLicencias] = useState([
    {
      numero: '',
      categoria: '',
      fechaExpedicion: '',
      fechaVencimiento: '',
      lugarExpedicion: '',
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driver) {
      return;
    }

    const usuario = driver.usuario || {};

    setFormData({
      nombre:
        usuario.nombre ||
        driver.nombre ||
        '',

      apellido:
        usuario.apellido ||
        driver.apellido ||
        '',

      tipoDocumento:
        usuario.tipoDocumento ||
        driver.tipoDocumento ||
        driver.documentType ||
        'CC',

      documento:
        usuario.documento ||
        driver.documento ||
        driver.idNumber ||
        '',

      correo:
        usuario.correo ||
        driver.correo ||
        driver.email ||
        '',

      telefono:
        usuario.telefono ||
        driver.telefono ||
        driver.phone ||
        '',

      experiencia:
        driver.experiencia ??
        driver.experience ??
        '',
    });

    if (Array.isArray(driver.licencias) && driver.licencias.length > 0) {
      setLicencias(
        driver.licencias.map((lic) => ({
          numero: lic.numero || lic.licencia || '',
          categoria: (lic.categoria || lic.categoriaLicencia || '').toUpperCase(),
          fechaExpedicion: formatearFechaInput(lic.fechaExpedicion),
          fechaVencimiento: formatearFechaInput(lic.fechaVencimiento),
          lugarExpedicion: lic.lugarExpedicion || '',
        }))
      );
    } else {
      setLicencias([
        {
          numero: driver.licencia || driver.license || '',
          categoria: (driver.categoriaLicencia || driver.licenseCategory || '').toUpperCase(),
          fechaExpedicion: formatearFechaInput(
            driver.fechaExpedicion || driver.licenseIssueDate
          ),
          fechaVencimiento: formatearFechaInput(
            driver.fechaVencimiento || driver.licenseExpiry
          ),
          lugarExpedicion: driver.lugarExpedicion || '',
        },
      ]);
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicenseChange = (index, field, value) => {
    setLicencias((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddLicense = () => {
    setLicencias((prev) => [
      ...prev,
      {
        numero: '',
        categoria: '',
        fechaExpedicion: '',
        fechaVencimiento: '',
        lugarExpedicion: '',
      },
    ]);
  };

  const handleRemoveLicense = (index) => {
    if (licencias.length <= 1) {
      alert('El conductor debe tener al menos una licencia.');
      return;
    }
    setLicencias((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driver?._id && !driver?.id) {
      console.error(
        'No se encontró el ID del conductor:',
        driver
      );

      alert(
        'No se encontró el conductor que se desea actualizar.'
      );

      return;
    }

    /*
     * Validar licencias
     */
    for (let i = 0; i < licencias.length; i++) {
      const lic = licencias[i];
      if (!lic.numero?.trim()) {
        alert(`Por favor ingresa el número de la licencia #${i + 1}.`);
        return;
      }
      if (!lic.categoria?.trim()) {
        alert(`Por favor selecciona la categoría de la licencia #${i + 1}.`);
        return;
      }

      if (lic.fechaExpedicion && lic.fechaVencimiento) {
        const fechaExpedicion = new Date(lic.fechaExpedicion);
        const fechaVencimiento = new Date(lic.fechaVencimiento);

        if (fechaVencimiento <= fechaExpedicion) {
          alert(
            `En la licencia #${i + 1}, la fecha de vencimiento debe ser posterior a la fecha de expedición.`
          );
          return;
        }
      }
    }

    /*
     * Validar experiencia
     */
    if (
      formData.experiencia !== '' &&
      Number(formData.experiencia) < 0
    ) {
      alert(
        'La experiencia no puede ser negativa.'
      );

      return;
    }

    const driverId =
      driver._id ||
      driver.id;

    try {
      setLoading(true);

      const firstLicense = licencias[0] || {};

      const data = {
        nombre:
          formData.nombre.trim(),

        apellido:
          formData.apellido.trim(),

        tipoDocumento:
          formData.tipoDocumento.trim(),

        documento:
          formData.documento.trim(),

        correo:
          formData.correo.trim().toLowerCase(),

        telefono:
          formData.telefono.trim(),

        licencia:
          firstLicense.numero?.trim() || '',

        categoriaLicencia:
          (firstLicense.categoria || '').trim().toUpperCase(),

        fechaExpedicion:
          firstLicense.fechaExpedicion || null,

        fechaVencimiento:
          firstLicense.fechaVencimiento || null,

        licencias: licencias.map((lic) => ({
          numero: lic.numero.trim(),
          categoria: lic.categoria.trim().toUpperCase(),
          fechaExpedicion: lic.fechaExpedicion,
          fechaVencimiento: lic.fechaVencimiento,
          lugarExpedicion: (lic.lugarExpedicion || '').trim(),
        })),

        experiencia:
          formData.experiencia === ''
            ? 0
            : Number(formData.experiencia),
      };

      console.log(
        'Actualizando conductor:',
        driverId
      );

      console.log(
        'Datos enviados:',
        data
      );

      const updatedDriver =
        await driverService.update(
          driverId,
          data
        );

      console.log(
        'Conductor actualizado:',
        updatedDriver
      );

      onUpdate(updatedDriver);

      onClose();

    } catch (error) {

      console.error(
        'Error actualizando conductor:',
        error
      );

      console.error(
        'Respuesta del servidor:',
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'No se pudo actualizar el conductor.'
      );

    } finally {
      setLoading(false);
    }
  };

  if (!open || !driver) {
    return null;
  }

  const driverName =
    `${formData.nombre} ${formData.apellido}`.trim() ||
    'Conductor';

  return (
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
              Editar Conductor
            </h2>

            <p
              className="mc-modal-desc"
            >
              Actualiza la información detallada del
              perfil.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >

          {/* NOMBRES Y APELLIDOS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                NOMBRES
              </label>

              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
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
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="Apellidos"
              />

            </div>

          </div>

          {/* DOCUMENTO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                TIPO DE DOCUMENTO
              </label>

              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              >
                <option value="CC">
                  Cédula de Ciudadanía
                </option>

                <option value="CE">
                  Cédula de Extranjería
                </option>

                <option value="PASAPORTE">
                  Pasaporte
                </option>
              </select>

            </div>

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                NÚMERO DE DOCUMENTO
              </label>

              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="Número de documento"
              />

            </div>

          </div>

          {/* CORREO Y TELÉFONO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                CORREO ELECTRÓNICO
              </label>

              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="correo@ejemplo.com"
              />

            </div>

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                NÚMERO DE TELÉFONO
              </label>

              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                placeholder="300 123 4567"
              />

            </div>

          </div>

          {/* INFORMACIÓN DE LICENCIA */}

          <div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 flex-shrink-0">

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
                    <line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                    />
                    <line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                    />
                  </svg>

                </div>

                <div>

                  <h3 className="text-sm font-bold text-slate-800">
                    Información de Licencia
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Datos de la licencia de conducción ({licencias.length} {licencias.length === 1 ? 'licencia registrada' : 'licencias registradas'}).
                  </p>

                </div>

              </div>

              {/* BOTÓN AGREGAR LICENCIA */}
              <button
                type="button"
                onClick={handleAddLicense}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors shadow-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Agregar Licencia
              </button>

            </div>

            {/* LISTA DINÁMICA DE LICENCIAS */}
            <div className="space-y-4">
              {licencias.map((lic, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 transition-all"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold">
                        {index + 1}
                      </span>
                      {index === 0 ? 'Licencia Principal' : `Licencia Adicional #${index + 1}`}
                    </span>

                    {licencias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLicense(index)}
                        title="Eliminar esta licencia"
                        className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition inline-flex items-center gap-1"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NÚMERO DE LICENCIA */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                        NÚMERO DE LICENCIA
                      </label>
                      <input
                        type="text"
                        value={lic.numero}
                        onChange={(e) => handleLicenseChange(index, 'numero', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                        placeholder="Número de licencia"
                      />
                    </div>

                    {/* CATEGORÍA */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                        CATEGORÍA DE LICENCIA
                      </label>
                      <select
                        value={lic.categoria}
                        onChange={(e) => handleLicenseChange(index, 'categoria', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="A1">Categoría A1</option>
                        <option value="A2">Categoría A2</option>
                        <option value="B1">Categoría B1</option>
                        <option value="B2">Categoría B2</option>
                        <option value="B3">Categoría B3</option>
                        <option value="C1">Categoría C1</option>
                        <option value="C2">Categoría C2</option>
                        <option value="C3">Categoría C3</option>
                      </select>
                    </div>

                    {/* FECHA EXPEDICIÓN */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                        FECHA DE EXPEDICIÓN
                      </label>
                      <input
                        type="date"
                        value={lic.fechaExpedicion}
                        onChange={(e) => handleLicenseChange(index, 'fechaExpedicion', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                      />
                    </div>

                    {/* FECHA VENCIMIENTO */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                        FECHA DE VENCIMIENTO
                      </label>
                      <input
                        type="date"
                        value={lic.fechaVencimiento}
                        onChange={(e) => handleLicenseChange(index, 'fechaVencimiento', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* EXPERIENCIA */}

          <div>

            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              AÑOS DE EXPERIENCIA
            </label>

            <input
              type="number"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              placeholder="Ej. 5"
            />

          </div>

          {/* FOOTER */}

          <div
            className="mc-modal-footer"
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mc-btn-secondary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="mc-btn-primary"
            >
              {loading
                ? 'Guardando...'
                : 'Guardar Cambios'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
