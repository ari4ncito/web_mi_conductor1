
import { useEffect, useRef, useState } from "react";
import { obtenerCoordenadasDireccion } from "../../tracking/services/routing/geocodingService.js";

const colors = {
  surface: "#ffffff",
  text: "#1b1b1b",
  textMuted: "#667085",
  border: "rgba(17, 17, 17, 0.12)",
  accent: "#ff9a2f",
  disabled: "#f3f4f6"
};

const modalTextStyle = {
  display: "block",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "normal",
  writingMode: "horizontal-tb",
  textOrientation: "mixed",
  letterSpacing: "normal",
  lineHeight: 1.6
};

const errorModalOverlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  boxSizing: "border-box",
  backgroundColor: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(8px)"
};

const errorModalStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 480,
  minWidth: 0,
  maxHeight: "90vh",
  boxSizing: "border-box",
  overflowX: "hidden",
  overflowY: "auto",
  writingMode: "horizontal-tb"
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Field({
  name,
  label,
  placeholder = "",
  value,
  onChange,
  readOnly = false,
  textarea = false,
  options = null,
  error = ""
}) {
  const commonStyle = {
    width: "100%",
    minWidth: 0,
    borderRadius: 12,
    border: `1px solid ${error ? "#dc2626" : colors.border}`,
    outline: "none",
    padding: textarea ? 14 : "0 14px",
    fontSize: 15,
    lineHeight: 1.45,
    color: colors.text,
    boxSizing: "border-box",
    background: readOnly ? colors.disabled : colors.surface,
    fontFamily: "inherit"
  };

  return (
    <div style={{ minWidth: 0 }}>
      <label
        htmlFor={`sr-field-${name}`}
        style={{
          display: "block",
          color: "#6b5e52",
          fontSize: 14,
          marginBottom: 8,
          fontWeight: 500
        }}
      >
        {label}
      </label>

      {options ? (
        <select
          id={`sr-field-${name}`}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `sr-error-${name}` : undefined}
          style={{ ...commonStyle, height: 48 }}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          id={`sr-field-${name}`}
          name={name}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          rows={4}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `sr-error-${name}` : undefined}
          style={{
            ...commonStyle,
            minHeight: 100,
            resize: "vertical"
          }}
        />
      ) : (
        <input
          id={`sr-field-${name}`}
          name={name}
          type="text"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `sr-error-${name}` : undefined}
          style={{ ...commonStyle, height: 48 }}
        />
      )}

      {error && (
        <p
          id={`sr-error-${name}`}
          role="alert"
          style={{
            margin: "6px 0 0",
            color: "#dc2626",
            fontSize: 13
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function getClientId(client) {
  const id = client?._id ?? client?.id ?? "";

  return typeof id === "object" && id !== null
    ? String(id._id ?? id)
    : String(id);
}

function getClientName(client) {
  if (!client) return "";

  if (client.usuario) {
    return `${client.usuario.nombre || ""} ${client.usuario.apellido || ""}`.trim();
  }

  return client.nombre || "";
}

function getClientEmail(client) {
  return (
    client?.usuario?.correo ||
    client?.correo ||
    client?.email ||
    client?.usuario?.email ||
    ""
  );
}

function getDriverName(driver) {
  if (!driver) return "";

  if (driver.usuario) {
    return `${driver.usuario.nombre || ""} ${driver.usuario.apellido || ""}`.trim();
  }

  return driver.nombre || "";
}

function getVehicleId(vehicle) {
  const id = vehicle?._id ?? vehicle?.id ?? "";

  return typeof id === "object" && id !== null
    ? String(id._id ?? id)
    : String(id);
}

function getVehicleClientId(vehicle) {
  const client = vehicle?.cliente;

  if (!client) return "";

  if (typeof client === "object") {
    return String(client._id ?? client.id ?? "");
  }

  return String(client);
}

function getVehicleLabel(vehicle) {
  if (!vehicle) return "";

  return [
    vehicle.placa,
    vehicle.marca,
    vehicle.modelo
  ].filter(Boolean).join(" ");
}

function esDireccionNoEncontrada(error) {
  return (
    typeof error?.message === "string" &&
    error.message.startsWith("No se encontró la dirección:")
  );
}

/* Modal de dirección no encontrada: solo cambia su presentación. */
function ModalErrorDireccion({ campo, direccion, onClose }) {
  return (
    <div
      className="mc-modal-overlay"
      style={errorModalOverlayStyle}
    >
      <div
        className="mc-modal mc-modal--sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sr-geocode-error-title"
        style={errorModalStyle}
      >
        <div
          className="mc-modal-header"
          style={{
            display: "block",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: "28px",
            borderBottom: "none"
          }}
        >
          <p
            className="mc-modal-subtitle"
            style={{
              ...modalTextStyle,
              margin: "0 0 12px"
            }}
          >
            Validación de dirección
          </p>

          <h2
            id="sr-geocode-error-title"
            className="mc-modal-title"
            style={{
              ...modalTextStyle,
              margin: "0 0 12px",
              color: "#b91c1c",
              fontSize: 24,
              lineHeight: 1.25
            }}
          >
            Dirección no encontrada
          </h2>

          <p
            className="mc-modal-desc"
            style={{
              ...modalTextStyle,
              margin: "0 0 16px",
              fontSize: 15
            }}
          >
            No se encontró la dirección de {campo.toLowerCase()}.
          </p>

          <div
            style={{
              ...modalTextStyle,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #fecaca",
              backgroundColor: "#fff7f7",
              color: "#7f1d1d",
              fontSize: 14
            }}
          >
            <p
              style={{
                ...modalTextStyle,
                margin: 0,
                fontWeight: 600
              }}
            >
              Dirección ingresada:
            </p>

            <p
              style={{
                ...modalTextStyle,
                margin: "6px 0 0",
                fontWeight: 400
              }}
            >
              {direccion}
            </p>
          </div>

          <p
            className="mc-modal-desc"
            style={{
              ...modalTextStyle,
              margin: "16px 0 0",
              fontSize: 14
            }}
          >
            Corrige la dirección antes de registrar la solicitud.
          </p>
        </div>

        <div
          className="mc-modal-footer"
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            className="mc-btn-primary"
            onClick={onClose}
            autoFocus
          >
            Corregir dirección
          </button>
        </div>
      </div>
    </div>
  );
}

/* Modal de error del servicio de geocodificación: solo cambia su presentación. */
function ModalErrorValidacionDireccion({ campo, onClose }) {
  return (
    <div
      className="mc-modal-overlay"
      style={errorModalOverlayStyle}
    >
      <div
        className="mc-modal mc-modal--sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sr-geocode-network-error-title"
        style={errorModalStyle}
      >
        <div
          className="mc-modal-header"
          style={{
            display: "block",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: "28px",
            borderBottom: "none"
          }}
        >
          <p
            className="mc-modal-subtitle"
            style={{
              ...modalTextStyle,
              margin: "0 0 12px"
            }}
          >
            Validación de dirección
          </p>

          <h2
            id="sr-geocode-network-error-title"
            className="mc-modal-title"
            style={{
              ...modalTextStyle,
              margin: "0 0 12px",
              fontSize: 24,
              lineHeight: 1.25
            }}
          >
            No se pudo validar la dirección
          </h2>

          <p
            className="mc-modal-desc"
            style={{
              ...modalTextStyle,
              margin: 0,
              fontSize: 15
            }}
          >
            No fue posible comprobar el {campo.toLowerCase()}. Puede tratarse
            de un problema de conexión o del servicio de búsqueda. La
            solicitud no se ha registrado.
          </p>
        </div>

        <div
          className="mc-modal-footer"
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            className="mc-btn-primary"
            onClick={onClose}
            autoFocus
          >
            Volver al formulario
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceRequestFormModal({
  title,
  description,
  request,
  readOnly = false,
  submitLabel,
  onClose,
  onSubmit,
  closeLabel = "Cancelar",
  clients = [],
  drivers = [],
  vehicles = [],
  onLoadVehicles
}) {
  const [form, setForm] = useState(() => ({ ...request }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDriverPicker, setShowDriverPicker] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);
  const [geocodeServiceError, setGeocodeServiceError] = useState(null);

  const [clientVehicles, setClientVehicles] = useState(() => {
    const initialClientId = String(
      request?.clientId?._id ??
      request?.clientId ??
      ""
    );

    return Array.isArray(vehicles)
      ? vehicles.filter(
          vehicle => getVehicleClientId(vehicle) === initialClientId
        )
      : [];
  });

  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleLoadError, setVehicleLoadError] = useState("");

  const fieldRefs = useRef({});

  useEffect(() => {
    let cancelado = false;

    async function cargarVehiculosDelCliente() {
      const clientId = String(
        form.clientId?._id ??
        form.clientId ??
        ""
      );

      if (!clientId) {
        setClientVehicles([]);
        setLoadingVehicles(false);
        setVehicleLoadError("");
        return;
      }

      if (typeof onLoadVehicles !== "function") {
        setClientVehicles(
          vehicles.filter(
            vehicle => getVehicleClientId(vehicle) === clientId
          )
        );

        setLoadingVehicles(false);
        setVehicleLoadError("");
        return;
      }

      setLoadingVehicles(true);
      setVehicleLoadError("");

      try {
        const result = await onLoadVehicles(clientId);

        if (cancelado) return;

        const lista = Array.isArray(result) ? result : [];

        setClientVehicles(
          lista.filter(vehicle => {
            const relatedClientId = getVehicleClientId(vehicle);

            return (
              !relatedClientId ||
              relatedClientId === clientId
            );
          })
        );
      } catch (error) {
        if (!cancelado) {
          setClientVehicles([]);
          setVehicleLoadError(
            "No se pudieron cargar los vehículos de este cliente."
          );

          console.error(
            "Error cargando vehículos del cliente:",
            error
          );
        }
      } finally {
        if (!cancelado) {
          setLoadingVehicles(false);
        }
      }
    }

    void cargarVehiculosDelCliente();

    return () => {
      cancelado = true;
    };
  }, [form.clientId, onLoadVehicles, vehicles]);

  const updateField = field => event => {
    const value = event.target.value;

    setForm(current => ({
      ...current,
      [field]: value
    }));

    setErrors(current => ({
      ...current,
      [field]: ""
    }));
  };

  const handleSelectClient = clientId => {
    const selected = clients.find(
      client => getClientId(client) === String(clientId)
    );

    setForm(current => ({
      ...current,
      clientId,
      client: getClientName(selected),
      clientEmail: getClientEmail(selected),
      vehicleId: "",
      vehicle: ""
    }));

    setClientVehicles([]);
    setVehicleLoadError("");

    setErrors(current => ({
      ...current,
      clientId: "",
      clientEmail: "",
      vehicleId: ""
    }));
  };

  const handleSelectVehicle = vehicleId => {
    const selected = clientVehicles.find(
      vehicle => getVehicleId(vehicle) === String(vehicleId)
    );

    setForm(current => ({
      ...current,
      vehicleId,
      vehicle: getVehicleLabel(selected)
    }));

    setErrors(current => ({
      ...current,
      vehicleId: ""
    }));
  };

  const handleSelectDriver = driverId => {
    const selected = drivers.find(
      driver => String(driver._id) === String(driverId)
    );

    setForm(current => ({
      ...current,
      driverId,
      driver: getDriverName(selected)
    }));

    setErrors(current => ({
      ...current,
      driverId: ""
    }));

    setShowDriverPicker(false);
  };

  const enfocarCampo = campo => {
    requestAnimationFrame(() => {
      const contenedor = fieldRefs.current[campo];

      if (!contenedor) return;

      const control = contenedor.matches?.(
        "input, select, textarea, button"
      )
        ? contenedor
        : contenedor.querySelector?.(
            "input, select, textarea, button"
          );

      if (control) {
        control.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        control.focus({ preventScroll: true });
      }
    });
  };

  const validarFormulario = () => {
    const siguientesErrores = {};

    if (!form.clientId) {
      siguientesErrores.clientId = "Selecciona un cliente.";
    }

    if (!form.clientEmail?.trim()) {
      siguientesErrores.clientEmail =
        "El correo del cliente es obligatorio.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.clientEmail.trim()
      )
    ) {
      siguientesErrores.clientEmail =
        "Ingresa un correo electrónico válido.";
    }

    if (!form.serviceType?.trim()) {
      siguientesErrores.serviceType =
        "Selecciona el tipo de servicio.";
    }

    if (!form.description?.trim()) {
      siguientesErrores.description =
        "La descripción es obligatoria.";
    } else if (form.description.trim().length < 10) {
      siguientesErrores.description =
        "Escribe al menos 10 caracteres.";
    } else if (form.description.trim().length > 500) {
      siguientesErrores.description =
        "No superes los 500 caracteres.";
    }

    if (!form.origin?.trim()) {
      siguientesErrores.origin = "El origen es obligatorio.";
    } else if (form.origin.trim().length < 3) {
      siguientesErrores.origin =
        "Escribe una dirección más completa.";
    } else if (form.origin.trim().length > 200) {
      siguientesErrores.origin =
        "No superes los 200 caracteres.";
    }

    if (!form.destination?.trim()) {
      siguientesErrores.destination = "El destino es obligatorio.";
    } else if (form.destination.trim().length < 3) {
      siguientesErrores.destination =
        "Escribe una dirección más completa.";
    } else if (form.destination.trim().length > 200) {
      siguientesErrores.destination =
        "No superes los 200 caracteres.";
    }

    if (!["Baja", "Media", "Alta", "Urgente"].includes(form.priority)) {
      siguientesErrores.priority =
        "Selecciona una prioridad válida.";
    }

    if (form.driverId) {
      const conductor = drivers.find(
        driver => String(driver._id) === String(form.driverId)
      );

      if (!conductor) {
        siguientesErrores.driverId =
          "Selecciona un conductor válido.";
      } else if (conductor.disponible !== true) {
        siguientesErrores.driverId =
          "El conductor seleccionado no está disponible.";
      }
    }

    if (form.vehicleId) {
      const vehicleBelongsToClient = clientVehicles.some(
        vehicle => getVehicleId(vehicle) === String(form.vehicleId)
      );

      if (!vehicleBelongsToClient) {
        siguientesErrores.vehicleId =
          "Selecciona un vehículo válido para el cliente.";
      }
    }

    setErrors(siguientesErrores);

    const primerCampo = Object.keys(siguientesErrores)[0];

    if (primerCampo) {
      enfocarCampo(primerCampo);
      return false;
    }

    return true;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (readOnly || submitting) return;

    setGeocodeError(null);
    setGeocodeServiceError(null);

    if (loadingVehicles) {
      setErrors(current => ({
        ...current,
        vehicleId: "Espera a que terminen de cargar los vehículos."
      }));

      enfocarCampo("vehicleId");
      return;
    }

    if (vehicleLoadError && form.vehicleId) {
      setErrors(current => ({
        ...current,
        vehicleId: vehicleLoadError
      }));

      enfocarCampo("vehicleId");
      return;
    }

    if (!validarFormulario()) return;

    setSubmitting(true);

    try {
      // 1. Validar el origen.
      try {
        await obtenerCoordenadasDireccion(form.origin.trim());
      } catch (error) {
        if (esDireccionNoEncontrada(error)) {
          setGeocodeError({
            campo: "Origen",
            direccion: form.origin.trim()
          });
        } else {
          setGeocodeServiceError({
            campo: "Origen"
          });

          setErrors(current => ({
            ...current,
            origin:
              "No se pudo comprobar el origen. Inténtalo nuevamente."
          }));
        }

        return;
      }

      // 2. Validar el destino después de validar el origen.
      try {
        await obtenerCoordenadasDireccion(form.destination.trim());
      } catch (error) {
        if (esDireccionNoEncontrada(error)) {
          setGeocodeError({
            campo: "Destino",
            direccion: form.destination.trim()
          });
        } else {
          setGeocodeServiceError({
            campo: "Destino"
          });

          setErrors(current => ({
            ...current,
            destination:
              "No se pudo comprobar el destino. Inténtalo nuevamente."
          }));
        }

        return;
      }

      // 3. Enviar solo después de validar ambas direcciones.
      await onSubmit({
        ...form,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        description: form.description.trim(),
        clientEmail: form.clientEmail.trim().toLowerCase()
      });
    } finally {
      setSubmitting(false);
    }
  };

  const serviceTypes = [
    "Transporte Ejecutivo",
    "Servicio Empresarial",
    "Servicio Día Completo",
    "Traslado Aeropuerto"
  ];

  const priorities = ["Alta", "Media", "Baja", "Urgente"];

  const clientOptions = [
    { value: "", label: "Seleccionar cliente" },
    ...clients.map(client => ({
      value: getClientId(client),
      label: getClientName(client) || "Cliente sin nombre"
    }))
  ];

  const vehicleOptions = [
    {
      value: "",
      label: !form.clientId
        ? "Selecciona primero un cliente"
        : loadingVehicles
          ? "Cargando vehículos..."
          : vehicleLoadError
            ? "No se pudieron cargar los vehículos"
            : "Sin vehículo asignado"
    },
    ...clientVehicles.map(vehicle => ({
      value: getVehicleId(vehicle),
      label: getVehicleLabel(vehicle) || "Vehículo sin descripción"
    }))
  ];

  const driverOptions = drivers.filter(
    driver =>
      driver.disponible === true ||
      String(driver._id) === String(form.driverId)
  );

  return (
    <>
      <div className="mc-modal-overlay">
        <form
          className="mc-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sr-form-title"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mc-modal-header">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
                width: "100%",
                minWidth: 0
              }}
            >
              <div style={{ maxWidth: 520, minWidth: 0 }}>
                <p className="mc-modal-subtitle">
                  Solicitud
                </p>

                <h2
                  id="sr-form-title"
                  className="mc-modal-title"
                >
                  {title}
                </h2>

                <p className="mc-modal-desc">
                  {description}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="mc-modal-close"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="mc-modal-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "22px 18px"
              }}
            >
              {readOnly && (
                <Field
                  name="code"
                  label="Código"
                  value={form.code}
                  readOnly
                />
              )}

              <div
                ref={element => {
                  fieldRefs.current.clientId = element;
                }}
              >
                <Field
                  name="clientId"
                  label="Cliente"
                  value={
                    typeof form.clientId === "object"
                      ? form.clientId?._id ?? ""
                      : form.clientId
                  }
                  onChange={event =>
                    handleSelectClient(event.target.value)
                  }
                  readOnly={readOnly}
                  options={clientOptions}
                  error={errors.clientId}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.clientEmail = element;
                }}
              >
                <Field
                  name="clientEmail"
                  label="Correo del cliente"
                  value={form.clientEmail}
                  onChange={updateField("clientEmail")}
                  readOnly={readOnly}
                  error={errors.clientEmail}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.driverId = element;
                }}
                style={{ minWidth: 0 }}
              >
                <label
                  style={{
                    display: "block",
                    color: "#6b5e52",
                    fontSize: 14,
                    marginBottom: 8,
                    fontWeight: 500
                  }}
                >
                  Conductor asignado
                </label>

                {readOnly ? (
                  <div
                    style={{
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 14px",
                      borderRadius: 12,
                      background: colors.disabled,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {form.driver || "Sin asignar"}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mc-btn-secondary"
                    style={{
                      width: "100%",
                      minHeight: 48,
                      justifyContent: "space-between"
                    }}
                    onClick={() =>
                      setShowDriverPicker(value => !value)
                    }
                  >
                    <span>
                      {form.driver || "Sin asignar"}
                    </span>
                    <span aria-hidden="true">⌄</span>
                  </button>
                )}

                {errors.driverId && (
                  <p
                    role="alert"
                    style={{
                      color: "#dc2626",
                      fontSize: 13
                    }}
                  >
                    {errors.driverId}
                  </p>
                )}

                {!readOnly && showDriverPicker && (
                  <div
                    style={{
                      marginTop: 10,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: 12,
                      background: "#fff"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setForm(current => ({
                          ...current,
                          driverId: "",
                          driver: ""
                        }));

                        setShowDriverPicker(false);

                        setErrors(current => ({
                          ...current,
                          driverId: ""
                        }));
                      }}
                      style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 10,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 8,
                        background: "#fff",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      Sin asignar (Pendiente)
                    </button>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: 10
                      }}
                    >
                      {driverOptions.map(driver => {
                        const selected =
                          String(form.driverId) === String(driver._id);

                        return (
                          <button
                            key={driver._id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              handleSelectDriver(driver._id)
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: 12,
                              borderRadius: 10,
                              border: `1px solid ${
                                selected ? colors.accent : colors.border
                              }`,
                              background: selected ? "#fff7ed" : "#fff",
                              cursor: "pointer",
                              textAlign: "left",
                              minWidth: 0
                            }}
                          >
                            <div
                              aria-hidden="true"
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                background: "#eaf1f7",
                                color: "#164e63",
                                fontWeight: 700,
                                flexShrink: 0
                              }}
                            >
                              {(
                                getDriverName(driver).charAt(0) || "C"
                              ).toUpperCase()}
                            </div>

                            <span
                              style={{
                                overflowWrap: "anywhere"
                              }}
                            >
                              {getDriverName(driver)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {driverOptions.length === 0 && (
                      <p style={{ color: colors.textMuted }}>
                        No hay conductores disponibles.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div
                ref={element => {
                  fieldRefs.current.vehicleId = element;
                }}
              >
                <Field
                  name="vehicleId"
                  label="Vehículo"
                  value={form.vehicleId}
                  onChange={event =>
                    handleSelectVehicle(event.target.value)
                  }
                  readOnly={readOnly}
                  options={vehicleOptions}
                  error={errors.vehicleId || vehicleLoadError}
                />

                {!readOnly && form.clientId && loadingVehicles && (
                  <p
                    role="status"
                    style={{
                      margin: "6px 0 0",
                      color: colors.textMuted,
                      fontSize: 13
                    }}
                  >
                    Cargando vehículos del cliente...
                  </p>
                )}
              </div>

              <div
                ref={element => {
                  fieldRefs.current.serviceType = element;
                }}
              >
                <Field
                  name="serviceType"
                  label="Tipo de servicio"
                  value={form.serviceType}
                  onChange={updateField("serviceType")}
                  readOnly={readOnly}
                  options={serviceTypes.map(value => ({
                    value,
                    label: value
                  }))}
                  error={errors.serviceType}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.priority = element;
                }}
              >
                <Field
                  name="priority"
                  label="Prioridad"
                  value={form.priority}
                  onChange={updateField("priority")}
                  readOnly={readOnly}
                  options={priorities.map(value => ({
                    value,
                    label: value
                  }))}
                  error={errors.priority}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.description = element;
                }}
                style={{ gridColumn: "1 / -1" }}
              >
                <Field
                  name="description"
                  label="Descripción"
                  placeholder="Detalles del servicio solicitado..."
                  value={form.description}
                  onChange={updateField("description")}
                  readOnly={readOnly}
                  textarea
                  error={errors.description}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.origin = element;
                }}
              >
                <Field
                  name="origin"
                  label="Origen"
                  placeholder="Dirección de recogida"
                  value={form.origin}
                  onChange={updateField("origin")}
                  readOnly={readOnly}
                  error={errors.origin}
                />
              </div>

              <div
                ref={element => {
                  fieldRefs.current.destination = element;
                }}
              >
                <Field
                  name="destination"
                  label="Destino"
                  placeholder="Dirección de destino"
                  value={form.destination}
                  onChange={updateField("destination")}
                  readOnly={readOnly}
                  error={errors.destination}
                />
              </div>

              {readOnly && (
                <>
                  <Field
                    name="status"
                    label="Estado"
                    value={form.status}
                    readOnly
                  />

                  <Field
                    name="createdAt"
                    label="Fecha de registro"
                    value={
                      form.createdAt
                        ? new Date(form.createdAt).toLocaleString("es-CO")
                        : ""
                    }
                    readOnly
                  />
                </>
              )}
            </div>
          </div>

          <div className="mc-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="mc-btn-secondary"
              disabled={submitting}
            >
              {closeLabel}
            </button>

            {!readOnly && (
              <button
                type="submit"
                className="mc-btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? "Validando direcciones..."
                  : submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>

      {geocodeError && (
        <ModalErrorDireccion
          campo={geocodeError.campo}
          direccion={geocodeError.direccion}
          onClose={() => {
            const campo = geocodeError.campo === "Origen"
              ? "origin"
              : "destination";

            setGeocodeError(null);
            enfocarCampo(campo);
          }}
        />
      )}

      {geocodeServiceError && (
        <ModalErrorValidacionDireccion
          campo={geocodeServiceError.campo}
          onClose={() => {
            const campo = geocodeServiceError.campo === "Origen"
              ? "origin"
              : "destination";

            setGeocodeServiceError(null);
            enfocarCampo(campo);
          }}
        />
      )}
    </>
  );
}
