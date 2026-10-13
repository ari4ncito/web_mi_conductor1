import { useState } from 'react';
import driverService from '../../services/driverService.js';

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function PhotoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 14l1.586-1.586a2 2 0 012.828 0L20 14"
      />

      <circle cx="8.5" cy="7.5" r="1.5" />

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />
    </svg>
  );
}

export default function RegisterDriverModal({
  open,
  onClose,
  onRegister
}) {

  const [formData, setFormData] = useState({
    photo: '',
    fullName: '',
    idNumber: '',
    email: '',
    password: '',
    phone: '',
    emergencyPhone: '',
    experience: 0,
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
  const [error, setError] = useState('');

  if (!open) {
    return null;
  }

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

    setError('');

    // Validar licencias
    for (let i = 0; i < licencias.length; i++) {
      const lic = licencias[i];
      if (!lic.numero?.trim()) {
        setError(`Por favor ingresa el número de la licencia #${i + 1}.`);
        return;
      }
      if (!lic.categoria?.trim()) {
        setError(`Por favor selecciona la categoría de la licencia #${i + 1}.`);
        return;
      }
      if (!lic.fechaExpedicion) {
        setError(`Por favor ingresa la fecha de expedición de la licencia #${i + 1}.`);
        return;
      }
      if (!lic.fechaVencimiento) {
        setError(`Por favor ingresa la fecha de vencimiento de la licencia #${i + 1}.`);
        return;
      }
      if (new Date(lic.fechaVencimiento) <= new Date(lic.fechaExpedicion)) {
        setError(`En la licencia #${i + 1}, la fecha de vencimiento debe ser posterior a la fecha de expedición.`);
        return;
      }
    }

    setLoading(true);

    try {
      // Separar nombre y apellido
      const partesNombre = formData.fullName.trim().split(/\s+/);
      const nombre = partesNombre.shift() || '';
      const apellido = partesNombre.join(' ');

      const firstLicense = licencias[0] || {};

      const datosConductor = {
        nombre,
        apellido,
        tipoDocumento: 'CC',
        documento: formData.idNumber.trim(),
        correo: formData.email.trim(),
        password: formData.password,
        telefono: formData.phone.trim(),
        licencia: firstLicense.numero.trim(),
        categoriaLicencia: firstLicense.categoria,
        fechaExpedicion: firstLicense.fechaExpedicion,
        fechaVencimiento: firstLicense.fechaVencimiento,
        licencias: licencias.map((lic) => ({
          numero: lic.numero.trim(),
          categoria: lic.categoria.trim().toUpperCase(),
          fechaExpedicion: lic.fechaExpedicion,
          fechaVencimiento: lic.fechaVencimiento,
          lugarExpedicion: (lic.lugarExpedicion || '').trim(),
        })),
        experiencia: Number(formData.experience) || 0,
        disponible: false,
      };

      console.log('Datos enviados al backend:', datosConductor);

      const nuevoConductor = await driverService.create(datosConductor);

      console.log('Conductor creado:', nuevoConductor);

      if (onRegister) {
        onRegister(nuevoConductor);
      }

      onClose();

      setFormData({
        photo: '',
        fullName: '',
        idNumber: '',
        email: '',
        password: '',
        phone: '',
        emergencyPhone: '',
        experience: 0,
      });

      setLicencias([
        {
          numero: '',
          categoria: '',
          fechaExpedicion: '',
          fechaVencimiento: '',
          lugarExpedicion: '',
        },
      ]);
    } catch (error) {

      console.error(
        'Error registrando conductor:',
        error
      );

      console.log(
        'Respuesta del backend:',
        error.response?.data
      );

      console.log(
        'Mensaje del backend:',
        error.response?.data?.message
      );


      const mensaje =
        error.response?.data?.message ||
        'No se pudo registrar el conductor.';

      setError(mensaje);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal"
        style={{ maxWidth: 840 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">
              Conductor
            </p>
            <h2 className="mc-modal-title">
              Registrar Conductor
            </h2>
            <p className="mc-modal-desc">
              Registra los datos personales, contacto y licencias del conductor.
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

        {/* ERROR */}
        {error && (
          <div className="mx-8 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="mc-modal-body space-y-6">

          {/* FOTO */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Foto
            </label>

            <div className="flex items-center gap-4">

              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">

                {formData.photo ? (

                  <img
                    src={formData.photo}
                    alt="Foto del conductor"
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <PhotoIcon className="h-8 w-8 text-gray-400" />

                )}

              </div>

              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="URL de la foto"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              />

            </div>

          </div>


          {/* DATOS PERSONALES */}

          <div>

            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Datos personales
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Documento
                </label>

                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  placeholder="Número de documento"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Correo
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Contraseña"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="3001234567"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Teléfono de emergencia
                </label>

                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>

            </div>

          </div>


          {/* LICENCIA */}

          <div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">

              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Información de licencia
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Registra una o más licencias del conductor ({licencias.length} {licencias.length === 1 ? 'licencia' : 'licencias'}).
                </p>
              </div>

              {/* BOTÓN AGREGAR LICENCIA */}
              <button
                type="button"
                onClick={handleAddLicense}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition shadow-sm"
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

            <div className="space-y-4">
              {licencias.map((lic, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 transition-all"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[11px] font-bold">
                        {index + 1}
                      </span>
                      {index === 0 ? 'Licencia Principal' : `Licencia Adicional #${index + 1}`}
                    </span>

                    {licencias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLicense(index)}
                        title="Eliminar esta licencia"
                        className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition inline-flex items-center gap-1"
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

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Número de licencia
                      </label>
                      <input
                        type="text"
                        value={lic.numero}
                        onChange={(e) => handleLicenseChange(index, 'numero', e.target.value)}
                        required
                        placeholder="Número de licencia"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Categoría
                      </label>
                      <select
                        value={lic.categoria}
                        onChange={(e) => handleLicenseChange(index, 'categoria', e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-orange-500"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                        <option value="C3">C3</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Fecha de expedición
                      </label>
                      <input
                        type="date"
                        value={lic.fechaExpedicion}
                        onChange={(e) => handleLicenseChange(index, 'fechaExpedicion', e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="date"
                        value={lic.fechaVencimiento}
                        onChange={(e) => handleLicenseChange(index, 'fechaVencimiento', e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Lugar de expedición
                      </label>
                      <input
                        type="text"
                        value={lic.lugarExpedicion}
                        onChange={(e) => handleLicenseChange(index, 'lugarExpedicion', e.target.value)}
                        placeholder="Ciudad"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AÑOS DE EXPERIENCIA */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Años de experiencia
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              />
            </div>

          </div>


          </div>

          {/* BOTONES */}
          <div className="mc-modal-footer">
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
                ? 'Registrando...'
                : 'Registrar Conductor'}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
