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
    licencia: '',
    categoriaLicencia: '',
    fechaExpedicion: '',
    fechaVencimiento: '',
    experiencia: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driver) {
      return;
    }

    /*
     * El backend devuelve los datos personales dentro de:
     *
     * driver.usuario
     *
     * y los datos propios del conductor directamente:
     *
     * driver.licencia
     * driver.categoriaLicencia
     * driver.fechaExpedicion
     * driver.fechaVencimiento
     * driver.experiencia
     */

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

      licencia:
        driver.licencia ||
        driver.license ||
        '',

      categoriaLicencia:
        driver.categoriaLicencia ||
        driver.licenseCategory ||
        '',

      fechaExpedicion:
        formatearFechaInput(
          driver.fechaExpedicion ||
          driver.licenseIssueDate
        ),

      fechaVencimiento:
        formatearFechaInput(
          driver.fechaVencimiento ||
          driver.licenseExpiry
        ),

      experiencia:
        driver.experiencia ??
        driver.experience ??
        '',
    });
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
     * Validar fechas
     */
    if (
      formData.fechaExpedicion &&
      formData.fechaVencimiento
    ) {
      const fechaExpedicion =
        new Date(formData.fechaExpedicion);

      const fechaVencimiento =
        new Date(formData.fechaVencimiento);

      if (
        fechaVencimiento <= fechaExpedicion
      ) {
        alert(
          'La fecha de vencimiento debe ser posterior a la fecha de expedición.'
        );

        return;
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

      /*
       * Estos son exactamente los nombres
       * que espera el backend.
       */
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
          formData.licencia.trim(),

        categoriaLicencia:
          formData.categoriaLicencia
            .trim()
            .toUpperCase(),

        fechaExpedicion:
          formData.fechaExpedicion,

        fechaVencimiento:
          formData.fechaVencimiento,

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
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
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
          boxShadow:
            '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border:
            '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            padding: '28px 32px 24px',
            borderBottom:
              '1px solid rgba(17, 17, 17, 0.08)',
          }}
        >
          <div>

            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: '#11384a',
                lineHeight: 1.2,
              }}
            >
              Editar Conductor
            </h2>

            <p
              style={{
                margin: '6px 0 0',
                color: '#7a7680',
                fontSize: 14,
              }}
            >
              Actualiza la información detallada del
              perfil.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 4,
            }}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px 32px',
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

            <div className="flex items-center gap-3 mb-5">

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
                  Datos de la licencia de conducción.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NÚMERO DE LICENCIA */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  NÚMERO DE LICENCIA
                </label>

                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                  placeholder="Número de licencia"
                />

              </div>

              {/* CATEGORÍA */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  CATEGORÍA DE LICENCIA
                </label>

                <select
                  name="categoriaLicencia"
                  value={formData.categoriaLicencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                >
                  <option value="">
                    Seleccionar categoría
                  </option>

                  <option value="A1">
                    Categoría A1
                  </option>

                  <option value="A2">
                    Categoría A2
                  </option>

                  <option value="B1">
                    Categoría B1
                  </option>

                  <option value="B2">
                    Categoría B2
                  </option>

                  <option value="B3">
                    Categoría B3
                  </option>

                  <option value="C1">
                    Categoría C1
                  </option>

                  <option value="C2">
                    Categoría C2
                  </option>

                  <option value="C3">
                    Categoría C3
                  </option>

                </select>

              </div>

              {/* FECHA EXPEDICIÓN */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  FECHA DE EXPEDICIÓN
                </label>

                <input
                  type="date"
                  name="fechaExpedicion"
                  value={formData.fechaExpedicion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                />

              </div>

              {/* FECHA VENCIMIENTO */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  FECHA DE VENCIMIENTO
                </label>

                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
                />

              </div>

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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 0 0',
              borderTop:
                '1px solid rgba(17, 17, 17, 0.08)',
            }}
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                border:
                  '1px solid rgba(17, 17, 17, 0.08)',
                background: '#ffffff',
                color: '#1b1b1b',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                border: 0,
                background: '#ff9a2f',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                boxShadow:
                  '0 8px 16px rgba(255, 154, 47, 0.28)',
                opacity: loading ? 0.7 : 1,
              }}
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