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
    licenseNumber: '',
    licenseCategory: '',
    licenseIssueDate: '',
    licenseExpiry: '',
    phone: '',
    emergencyPhone: '',
    location: '',
    experience: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) {
    return null;
  }

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      // ==========================================
      // SEPARAR NOMBRE Y APELLIDO
      // ==========================================

      const partesNombre =
        formData.fullName
          .trim()
          .split(/\s+/);

      const nombre =
        partesNombre.shift() || '';

      const apellido =
        partesNombre.join(' ');


      // ==========================================
      // DATOS QUE ESPERA EL BACKEND
      // ==========================================

      const datosConductor = {

        nombre,

        apellido,

        tipoDocumento: 'CC',

        documento:
          formData.idNumber.trim(),

        correo:
          formData.email.trim(),

        password:
          formData.password,

        telefono:
          formData.phone.trim(),

        licencia:
          formData.licenseNumber.trim(),

        categoriaLicencia:
          formData.licenseCategory,

        fechaExpedicion:
          formData.licenseIssueDate,

        fechaVencimiento:
          formData.licenseExpiry,

        experiencia:
          Number(formData.experience) || 0,

        disponible: false
      };


      console.log(
        'Datos enviados al backend:',
        datosConductor
      );


      // ==========================================
      // CREAR CONDUCTOR
      // ==========================================

      const nuevoConductor =
        await driverService.create(
          datosConductor
        );


      console.log(
        'Conductor creado:',
        nuevoConductor
      );


      // ==========================================
      // AVISAR A DRIVERS PAGE
      // ==========================================

      if (onRegister) {
        onRegister(nuevoConductor);
      }


      // ==========================================
      // CERRAR MODAL
      // ==========================================

      onClose();


      // ==========================================
      // LIMPIAR FORMULARIO
      // ==========================================

      setFormData({
        photo: '',
        fullName: '',
        idNumber: '',
        email: '',
        password: '',
        licenseNumber: '',
        licenseCategory: '',
        licenseIssueDate: '',
        licenseExpiry: '',
        phone: '',
        emergencyPhone: '',
        location: '',
        experience: 0
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Registrar Conductor
            </h2>

            <p className="text-sm text-gray-500">
              Registra los datos del conductor
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>

        )}


        {/* FORMULARIO */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

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

            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Información de licencia
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Número de licencia
                </label>

                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  placeholder="Número de licencia"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Categoría
                </label>

                <select
                  name="licenseCategory"
                  value={formData.licenseCategory}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                >

                  <option value="">
                    Seleccionar categoría
                  </option>

                  <option value="A1">
                    A1
                  </option>

                  <option value="A2">
                    A2
                  </option>

                  <option value="B1">
                    B1
                  </option>

                  <option value="B2">
                    B2
                  </option>

                  <option value="B3">
                    B3
                  </option>

                  <option value="C1">
                    C1
                  </option>

                  <option value="C2">
                    C2
                  </option>

                  <option value="C3">
                    C3
                  </option>

                </select>

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Fecha de expedición
                </label>

                <input
                  type="date"
                  name="licenseIssueDate"
                  value={formData.licenseIssueDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Fecha de vencimiento
                </label>

                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>


              <div>

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


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lugar de expedición
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                />

              </div>

            </div>

          </div>


          {/* BOTONES */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>


            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
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