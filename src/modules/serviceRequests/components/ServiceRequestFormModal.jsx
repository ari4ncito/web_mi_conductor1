import { useEffect, useRef, useState } from "react";
import { obtenerCoordenadasDireccion } from "../../tracking/services/routing/geocodingService.js";

// Icons
function ArrowLeftIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function DocumentIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IdIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  );
}

function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function DriverIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l2-5h14l2 5v7a1 1 0 01-1 1h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a1 1 0 01-1-1V9z" />
    </svg>
  );
}

function CarFrontIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function ArrowsIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function PlateIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ColorIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

function BriefcaseIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function FlagIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function NavigationIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

// Reusable FormField matching VehicleFormPage style
function FormField({
  id,
  name,
  label,
  icon,
  type = "text",
  value,
  onChange,
  onFocus,
  placeholder = "",
  options = null,
  error = "",
  isWarning = false,
  helperText = "",
  readOnly = false,
  textarea = false,
  rows = 3,
  required = false,
  children
}) {
  const hasError = Boolean(error || isWarning);

  return (
    <div className="mb-4">
      <div className="relative">
        {icon && (
          <div
            className={`absolute ${
              textarea ? "top-3.5" : "inset-y-0"
            } left-0 pl-4 flex items-center pointer-events-none transition-colors ${
              hasError ? "text-red-500" : "text-slate-400"
            }`}
          >
            {icon}
          </div>
        )}

        {readOnly ? (
          <input
            id={id}
            name={name}
            type={type}
            value={value ?? ""}
            placeholder={placeholder}
            readOnly
            tabIndex={-1}
            aria-readonly="true"
            className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl border border-slate-200 bg-slate-100/75 text-slate-700 text-sm font-semibold outline-none cursor-not-allowed select-none`}
          />
        ) : options ? (
          <select
            id={id}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            disabled={readOnly}
            aria-required={required}
            className={`w-full ${icon ? "pl-11" : "pl-4"} pr-9 py-3 rounded-xl border ${
              hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            } outline-none transition text-sm font-medium appearance-none cursor-pointer`}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : textarea ? (
          <textarea
            id={id}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            aria-required={required}
            className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl border ${
              hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            } outline-none transition text-sm font-medium resize-y`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-required={required}
            className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl border ${
              hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            } outline-none transition text-sm font-medium`}
          />
        )}

        {label && (
          <label
            htmlFor={id}
            className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${
              hasError ? "text-red-500 font-extrabold" : "text-slate-500"
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1 font-extrabold">*</span>}
          </label>
        )}

        {options && !readOnly && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {children}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className={`text-xs mt-1 ml-1 flex items-center gap-1 font-semibold ${isWarning ? "text-red-600" : "text-slate-400"}`}>
          {isWarning && (
            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {helperText}
        </p>
      )}
    </div>
  );
}

function getDriverDocument(driver) {
  if (!driver) return "";
  return driver.documento || driver.usuario?.documento || driver.identificacion || "";
}

function DriverSelectField({
  id = "sr-field-driverId",
  label = "ASIGNAR CONDUCTOR",
  value = "",
  onChange,
  drivers = [],
  selectedDriverName = "",
  selectedDriverDoc = "",
  error = "",
  required = false,
  readOnly = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedDriver = drivers.find(d => String(d._id || d.id) === String(value));
  const displayDoc =
    getDriverDocument(selectedDriver) ||
    selectedDriverDoc ||
    "";
  const displayName =
    getDriverName(selectedDriver) ||
    selectedDriverName ||
    "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const hasError = Boolean(error);

  return (
    <div className="mb-4" ref={containerRef}>
      <div className="relative">
        {/* Left Icon */}
        <div
          className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            hasError ? "text-red-500" : "text-slate-400"
          }`}
        >
          <DriverIcon />
        </div>

        {readOnly ? (
          <div
            id={id}
            aria-readonly="true"
            className="w-full pl-11 pr-4 py-2 min-h-12 rounded-xl border border-slate-200 bg-slate-100/75 flex flex-col justify-center cursor-not-allowed select-none"
          >
            {value && (displayDoc || displayName) ? (
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[13px] font-bold text-slate-800 tracking-wide">
                  {displayDoc ? `Doc: ${displayDoc}` : "Conductor asignado"}
                </span>
                <span className="text-[12px] font-medium text-slate-600 truncate mt-0.5">
                  {displayName}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-slate-500">
                Sin conductor asignado
              </span>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              id={id}
              onClick={() => setIsOpen(prev => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={`w-full pl-11 pr-10 py-1.5 min-h-12 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                hasError
                  ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : isOpen
                  ? "border-orange-400 bg-white ring-4 ring-orange-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {value && (displayDoc || displayName) ? (
                <div className="flex flex-col justify-center leading-tight min-w-0 pr-2">
                  <span className="text-[13px] font-bold text-slate-900 tracking-wide">
                    {displayDoc ? `Doc: ${displayDoc}` : "Conductor asignado"}
                  </span>
                  <span className="text-[12px] font-medium text-slate-600 truncate mt-0.5">
                    {displayName}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-500">
                  Seleccionar conductor
                </span>
              )}

              {/* Chevron Arrow */}
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div
                className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto py-1"
                role="listbox"
              >
                <div
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={!value}
                  className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition border-b border-slate-100 ${
                    !value ? "bg-orange-50 text-orange-700" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Seleccionar conductor (Sin asignar)
                </div>

                {drivers.map(driver => {
                  const dId = String(driver._id || driver.id);
                  const dDoc = getDriverDocument(driver);
                  const dName = getDriverName(driver);
                  const isSelected = String(value) === dId;
                  const isAvailable = driver.disponible !== false;

                  return (
                    <div
                      key={dId}
                      onClick={() => {
                        onChange(dId);
                        setIsOpen(false);
                      }}
                      role="option"
                      aria-selected={isSelected}
                      className={`px-4 py-2.5 cursor-pointer transition flex items-center justify-between gap-3 border-b border-slate-50 last:border-b-0 ${
                        isSelected
                          ? "bg-orange-50/80 text-slate-900 border-l-4 border-l-orange-500"
                          : "hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 tracking-wide">
                          {dDoc ? `Doc: ${dDoc}` : "Sin documento"}
                        </span>
                        <span className="text-[12px] font-medium text-slate-600 truncate mt-0.5">
                          {dName || "Conductor sin nombre"}
                        </span>
                      </div>

                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shrink-0 ${
                        isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isAvailable ? "• Disponible" : "• En servicio"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Floating Label */}
        {label && (
          <label
            htmlFor={id}
            className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${
              hasError ? "text-red-500 font-extrabold" : "text-slate-500"
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1 font-extrabold">*</span>}
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Client helper functions
function getClientId(client) {
  const id = client?._id ?? client?.id ?? "";
  return typeof id === "object" && id !== null ? String(id._id ?? id) : String(id);
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
  return typeof id === "object" && id !== null ? String(id._id ?? id) : String(id);
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
  return [vehicle.placa, vehicle.marca, vehicle.modelo].filter(Boolean).join(" ");
}

function esDireccionNoEncontrada(error) {
  return (
    typeof error?.message === "string" &&
    error.message.startsWith("No se encontró la dirección:")
  );
}

// Modal dialog for geocoding errors
function ModalErrorDireccion({ campo, direccion, onClose }) {
  return (
    <div className="mc-modal-overlay" style={{ zIndex: 1300 }}>
      <div className="mc-modal mc-modal--sm" role="alertdialog" aria-modal="true" style={{ maxWidth: 480, width: "calc(100% - 32px)" }}>
        <div className="mc-modal-header">
          <p className="mc-modal-subtitle">Validación de dirección</p>
          <h2 className="mc-modal-title" style={{ color: "#b91c1c" }}>Dirección no encontrada</h2>
          <p className="mc-modal-desc">No se encontró la dirección de {campo.toLowerCase()}.</p>
          <div style={{ padding: 14, borderRadius: 12, border: "1px solid #fecaca", backgroundColor: "#fff7f7", color: "#7f1d1d", fontSize: 14, marginTop: 12 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Dirección ingresada:</p>
            <p style={{ margin: "6px 0 0" }}>{direccion}</p>
          </div>
          <p className="mc-modal-desc" style={{ marginTop: 14 }}>Corrige la dirección antes de registrar la solicitud.</p>
        </div>
        <div className="mc-modal-footer">
          <button type="button" className="mc-btn-primary" onClick={onClose} autoFocus>
            Corregir dirección
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalErrorValidacionDireccion({ campo, onClose }) {
  return (
    <div className="mc-modal-overlay" style={{ zIndex: 1300 }}>
      <div className="mc-modal mc-modal--sm" role="alertdialog" aria-modal="true" style={{ maxWidth: 480, width: "calc(100% - 32px)" }}>
        <div className="mc-modal-header">
          <p className="mc-modal-subtitle">Validación de dirección</p>
          <h2 className="mc-modal-title" style={{ color: "#b91c1c" }}>No se pudo validar la dirección</h2>
          <p className="mc-modal-desc">
            No fue posible comprobar el {campo.toLowerCase()}. Puede tratarse de un problema de conexión o del servicio de búsqueda. La solicitud no se ha registrado.
          </p>
        </div>
        <div className="mc-modal-footer">
          <button type="button" className="mc-btn-primary" onClick={onClose} autoFocus>
            Volver al formulario
          </button>
        </div>
      </div>
    </div>
  );
}

// Helpers de validación de seguridad y formato
function contieneCodigo(texto) {
  if (!texto || typeof texto !== "string") return false;
  const str = texto.trim();
  // Etiquetas HTML o scripts
  if (/<\/?[a-z][\s\S]*>/i.test(str)) return true;
  // Llamadas de JavaScript, eventos o manipulaciones
  if (/(javascript:|eval\(|alert\(|console\.|<script|<iframe|<img|<svg|onload=|onerror=|onclick=)/i.test(str)) return true;
  // Declaraciones y sintaxis de programación
  if (/(\bfunction\s*\(|\bconst\s+\w+\s*=|\blet\s+\w+\s*=|\bvar\s+\w+\s*=|\bimport\s+.*from|\bexport\s+|\bclass\s+\w+)/i.test(str)) return true;
  // Inyecciones SQL comunes
  if (/(\bUNION\s+SELECT\b|\bDROP\s+TABLE\b|\bINSERT\s+INTO\b|\bDELETE\s+FROM\b|\bOR\s+1\s*=\s*1\b|--|;\s*DROP|\$where)/i.test(str)) return true;
  // Caracteres típicos de código que no corresponden a texto normal
  if (/[<>{}[\]$`\\]/.test(str)) return true;
  return false;
}

// Permite signos especiales habituales pero bloquea inyecciones de código malicioso
function contieneInyeccionCodigo(texto) {
  if (!texto || typeof texto !== "string") return false;
  const str = texto.trim();
  // Etiquetas HTML o scripts (<tag>, </tag>)
  if (/<\s*\/?\s*[a-zA-Z][\s\S]*>/i.test(str)) return true;
  // Pseudo-protocolos de JS, evaluadores o eventos DOM
  if (/(javascript\s*:|eval\s*\(|alert\s*\(|console\s*\.|<script|<iframe|<img|<svg|onload\s*=|onerror\s*=|onclick\s*=|onmouseover\s*=)/i.test(str)) return true;
  // Declaraciones de programación
  if (/(\bfunction\s*\(|\bconst\s+\w+\s*=|\blet\s+\w+\s*=|\bvar\s+\w+\s*=|\bimport\s+.*from|\bexport\s+|\bclass\s+\w+)/i.test(str)) return true;
  // Inyecciones SQL comunes
  if (/(\bUNION\s+ALL\s+SELECT\b|\bUNION\s+SELECT\b|\bDROP\s+TABLE\b|\bINSERT\s+INTO\b|\bDELETE\s+FROM\b|;\s*DROP\b|;\s*DELETE\b|--|\$where)/i.test(str)) return true;
  return false;
}

function normalizarTexto(texto) {
  return (texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function limpiarDigitos(texto) {
  return String(texto || "").replace(/\D/g, "");
}

export default function ServiceRequestFormModal({
  title,
  description = "",
  request,
  readOnly = false,
  submitLabel,
  onClose,
  onSubmit,
  closeLabel = "Cancelar",
  clients = [],
  drivers = [],
  vehicles = [],
  onLoadVehicles,
  inline = false
}) {
  // Estado para alternar entre formulario normal y modo Invitado
  const [isGuest, setIsGuest] = useState(Boolean(request?.isGuest));

  // El tipo de documento y documento empiezan vacíos hasta que se seleccione un cliente
  const [form, setForm] = useState(() => {
    const initialClientId = String(
      request?.clientId?._id ?? request?.clientId ?? ""
    );
    let initialTipoDoc = request?.tipoDocumento || "";
    let initialDoc = request?.documento || "";

    if (initialClientId && (!initialTipoDoc || !initialDoc)) {
      const selected = clients.find(c => getClientId(c) === initialClientId);
      if (selected) {
        initialTipoDoc =
          initialTipoDoc ||
          selected.tipoDocumento ||
          selected.usuario?.tipoDocumento ||
          "";
        initialDoc =
          initialDoc ||
          selected.documento ||
          selected.usuario?.documento ||
          "";
      }
    }

    let initialClientName = request?.clientName || request?.client || "";
    if (!initialClientName || /^[0-9a-fA-F]{24}$/.test(initialClientName)) {
      const selected = clients.find(c => getClientId(c) === initialClientId);
      if (selected) {
        initialClientName = getClientName(selected);
      }
    }

    let initialDriverName = request?.driver || "";
    let initialDriverDoc = request?.driverDocument || "";
    const initialDriverId = String(request?.driverId?._id ?? request?.driverId ?? "");
    if (initialDriverId && (!initialDriverName || !initialDriverDoc || /^[0-9a-fA-F]{24}$/.test(initialDriverName))) {
      const selDriver = drivers.find(d => String(d._id || d.id) === initialDriverId);
      if (selDriver) {
        initialDriverName = getDriverName(selDriver);
        initialDriverDoc = getDriverDocument(selDriver);
      }
    }

    let initialVehicleLabel = request?.vehicle || "";
    const initialVehicleId = String(request?.vehicleId?._id ?? request?.vehicleId ?? "");
    if (initialVehicleId && (!initialVehicleLabel || /^[0-9a-fA-F]{24}$/.test(initialVehicleLabel))) {
      const selVeh = vehicles.find(v => String(v._id || v.id) === initialVehicleId);
      if (selVeh) {
        initialVehicleLabel = getVehicleLabel(selVeh);
      }
    }

    return {
      ...request,
      tipoDocumento: initialTipoDoc,
      documento: initialDoc,
      client: initialClientName,
      clientName: initialClientName,
      clientPhone: request?.clientPhone || "",
      driver: initialDriverName,
      driverDocument: initialDriverDoc,
      driverId: initialDriverId,
      vehicle: initialVehicleLabel,
      vehicleId: initialVehicleId,
      vehicleMarca: request?.vehicleMarca || "",
      vehicleModelo: request?.vehicleModelo || "",
      vehiclePlaca: request?.vehiclePlaca || "",
      vehicleAnio: request?.vehicleAnio || "",
      vehicleColor: request?.vehicleColor || "",
      vehicleTipoVehiculo: request?.vehicleTipoVehiculo || ""
    };
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);
  const [geocodeServiceError, setGeocodeServiceError] = useState(null);

  const [clientVehicles, setClientVehicles] = useState(() => {
    const initialClientId = String(
      request?.clientId?._id ?? request?.clientId ?? ""
    );
    return Array.isArray(vehicles)
      ? vehicles.filter(v => getVehicleClientId(v) === initialClientId)
      : [];
  });

  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleLoadError, setVehicleLoadError] = useState("");

  const fieldRefs = useRef({});

  // Load client vehicles when client changes
  useEffect(() => {
    let cancelado = false;

    async function cargarVehiculosDelCliente() {
      const clientId = String(form.clientId?._id ?? form.clientId ?? "");

      if (!clientId) {
        setClientVehicles([]);
        setLoadingVehicles(false);
        setVehicleLoadError("");
        return;
      }

      if (typeof onLoadVehicles !== "function") {
        setClientVehicles(
          vehicles.filter(v => getVehicleClientId(v) === clientId)
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
          lista.filter(v => {
            const relId = getVehicleClientId(v);
            return !relId || relId === clientId;
          })
        );
      } catch (err) {
        if (!cancelado) {
          setClientVehicles([]);
          setVehicleLoadError("No se pudieron cargar los vehículos de este cliente.");
          console.error("Error cargando vehículos del cliente:", err);
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

  // Autocompletado y búsqueda en tiempo real de clientes existentes por documento
  const [docSuggestions, setDocSuggestions] = useState([]);
  const [showDocSuggestions, setShowDocSuggestions] = useState(false);
  const [matchedClient, setMatchedClient] = useState(() => {
    const initClientId = String(
      request?.clientId?._id ?? request?.clientId ?? ""
    );
    if (initClientId && Array.isArray(clients)) {
      return clients.find(c => getClientId(c) === initClientId) || null;
    }
    return null;
  });
  const [guestClientVehicles, setGuestClientVehicles] = useState([]);
  const docSearchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (docSearchRef.current && !docSearchRef.current.contains(e.target)) {
        setShowDocSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Limpia y resetea todos los campos al alternar entre modo normal e invitado
  const cambiarModoInvitado = nuevoModo => {
    setIsGuest(nuevoModo);
    setForm({
      id: "",
      code: "",
      clientId: "",
      client: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      tipoDocumento: "",
      documento: "",
      driverId: "",
      driver: "",
      vehicleId: "",
      vehicle: "",
      vehicleMarca: "",
      vehicleModelo: "",
      vehiclePlaca: "",
      vehicleAnio: "",
      vehicleColor: "",
      vehicleTipoVehiculo: "",
      serviceType: "Transporte Ejecutivo",
      priority: "Media",
      description: "",
      origin: "",
      destination: "",
      isGuest: nuevoModo
    });
    setErrors({});
    setMatchedClient(null);
    setDocSuggestions([]);
    setShowDocSuggestions(false);
    setGuestClientVehicles([]);
    setClientVehicles([]);
    setVehicleLoadError("");
  };

  const applyExistingVehicle = veh => {
    setForm(current => ({
      ...current,
      vehicleId: getVehicleId(veh),
      vehicleMarca: veh.marca || current.vehicleMarca || "",
      vehicleModelo: veh.modelo || current.vehicleModelo || "",
      vehiclePlaca: (veh.placa || current.vehiclePlaca || "").toUpperCase(),
      vehicleAnio: veh.anio || current.vehicleAnio || "",
      vehicleColor: veh.color || current.vehicleColor || "",
      vehicleTipoVehiculo: veh.tipoVehiculo || current.vehicleTipoVehiculo || ""
    }));
    setErrors(current => ({
      ...current,
      vehicleMarca: "",
      vehicleModelo: "",
      vehiclePlaca: ""
    }));
  };

  const applySelectedClient = async client => {
    const clientId = getClientId(client);
    const clientDoc = client.documento || client.usuario?.documento || "";
    const clientTipoDoc =
      client.tipoDocumento || client.usuario?.tipoDocumento || form.tipoDocumento || "CC";
    const clientName = getClientName(client);
    const clientEmail = getClientEmail(client);
    const clientPhone = client.telefono || client.usuario?.telefono || "";

    setForm(current => ({
      ...current,
      clientId,
      tipoDocumento: clientTipoDoc,
      documento: clientDoc,
      clientName,
      client: clientName,
      clientEmail,
      clientPhone
    }));

    setMatchedClient(client);
    setShowDocSuggestions(false);
    setErrors(current => ({
      ...current,
      tipoDocumento: "",
      documento: "",
      clientName: "",
      clientEmail: "",
      clientPhone: ""
    }));

    if (clientId) {
      if (typeof onLoadVehicles === "function") {
        try {
          const vehs = await onLoadVehicles(clientId);
          const lista = Array.isArray(vehs) ? vehs : [];
          setGuestClientVehicles(lista);
          if (lista.length === 1 && !form.vehiclePlaca) {
            applyExistingVehicle(lista[0]);
          }
        } catch (err) {
          console.warn("No se pudieron cargar vehículos del cliente existente:", err);
        }
      } else if (Array.isArray(vehicles)) {
        const lista = vehicles.filter(v => getVehicleClientId(v) === clientId);
        setGuestClientVehicles(lista);
        if (lista.length === 1 && !form.vehiclePlaca) {
          applyExistingVehicle(lista[0]);
        }
      }
    }
  };

  const handleGuestDocumentChange = e => {
    const query = e.target.value;
    setForm(current => ({
      ...current,
      documento: query
    }));

    let docError = "";
    if (contieneCodigo(query)) {
      docError = "No se permite ingresar código en este campo.";
    } else if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(query)) {
      docError = "No se permiten letras en este campo (solo números).";
    } else if (/[^0-9]/.test(query)) {
      docError = "No se admiten signos especiales en este campo.";
    }

    setErrors(current => ({
      ...current,
      documento: docError
    }));

    if (docError) {
      setDocSuggestions([]);
      setShowDocSuggestions(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      const matches = clients.filter(c => {
        const doc = String(c.documento || c.usuario?.documento || "").toLowerCase();
        const numOnly = doc.replace(/\D/g, "");
        const queryOnly = trimmed.toLowerCase().replace(/\D/g, "");
        return (
          doc.includes(trimmed.toLowerCase()) ||
          (queryOnly && numOnly.includes(queryOnly))
        );
      });

      setDocSuggestions(matches);
      setShowDocSuggestions(matches.length > 0);

      const exact = matches.find(c => {
        const doc = String(c.documento || c.usuario?.documento || "").trim();
        return doc.toLowerCase() === trimmed.toLowerCase();
      });

      if (exact) {
        void applySelectedClient(exact);
      } else if (
        matchedClient &&
        trimmed !== String(matchedClient.documento || matchedClient.usuario?.documento || "").trim()
      ) {
        setMatchedClient(null);
        setForm(current => ({ ...current, clientId: "" }));
        setGuestClientVehicles([]);
      }
    } else {
      setDocSuggestions([]);
      setShowDocSuggestions(false);
      if (matchedClient) {
        setMatchedClient(null);
        setForm(current => ({ ...current, clientId: "" }));
        setGuestClientVehicles([]);
      }
    }
  };

  const updateField = field => event => {
    const value = event.target.value;
    setForm(current => ({
      ...current,
      [field]: value
    }));

    // Validación reactiva inmediata para resaltar en rojo si infringe las reglas
    let liveError = "";

    if (contieneCodigo(value)) {
      liveError = "No se permite ingresar código en este campo.";
    } else if (field === "clientName") {
      if (/[0-9]/.test(value)) {
        liveError = "No se permiten números en este campo (solo letras).";
      } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(value)) {
        liveError = "No se admiten signos especiales en este campo.";
      } else if (matchedClient) {
        const nombreExistente = getClientName(matchedClient);
        if (value.trim() && normalizarTexto(value) !== normalizarTexto(nombreExistente)) {
          liveError = `Este documento ya pertenece a ${nombreExistente}. Los datos deben coincidir.`;
        }
      }
    } else if (field === "clientPhone") {
      if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(value)) {
        liveError = "No se permiten letras en este campo (solo números).";
      } else if (/[^0-9]/.test(value)) {
        liveError = "No se admiten signos especiales en este campo.";
      } else if (matchedClient) {
        const telExistente = limpiarDigitos(matchedClient.telefono || matchedClient.usuario?.telefono);
        if (telExistente && limpiarDigitos(value) !== telExistente) {
          liveError = "El teléfono no coincide con el registrado para este documento.";
        }
      }
    } else if (field === "clientEmail") {
      if (/[^a-zA-Z0-9@._+-]/.test(value)) {
        liveError = "El correo contiene caracteres especiales no válidos.";
      } else if (matchedClient) {
        const emailExistente = getClientEmail(matchedClient).trim().toLowerCase();
        if (value.trim() && emailExistente && value.trim().toLowerCase() !== emailExistente) {
          liveError = `El correo no coincide con el del cliente registrado (${emailExistente}).`;
        }
      }
    } else if (field === "vehicleColor") {
      if (/[0-9]/.test(value)) {
        liveError = "No se permiten números en este campo (solo letras).";
      } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(value)) {
        liveError = "No se admiten signos especiales en este campo.";
      }
    } else if (field === "vehicleAnio") {
      if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(value)) {
        liveError = "No se permiten letras en este campo (solo números).";
      } else if (/[^0-9]/.test(value)) {
        liveError = "No se admiten signos especiales en este campo.";
      }
    } else if (field === "vehiclePlaca") {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        liveError = "No se admiten signos especiales en la placa.";
      } else {
        const placaUpper = value.trim().toUpperCase();
        if (placaUpper) {
          const vehExistente = vehicles.find(
            v => (v.placa || "").trim().toUpperCase() === placaUpper
          );
          if (vehExistente) {
            const ownerId = getVehicleClientId(vehExistente);
            const currentClientId = String(form.clientId || getClientId(matchedClient) || "");
            if (ownerId && (!currentClientId || ownerId !== currentClientId)) {
              const dueno = clients.find(c => getClientId(c) === ownerId);
              const nombreDueno = dueno ? getClientName(dueno) : "otro cliente registrado";
              liveError = `Esta placa ya está asociada a ${nombreDueno} y no puede ser utilizada por otro cliente.`;
            }
          }
        }
      }
    } else if (field === "vehicleMarca" || field === "vehicleModelo") {
      if (/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/.test(value)) {
        liveError = "No se admiten signos especiales en este campo.";
      }
    } else if (field === "origin" || field === "destination") {
      if (/[<>{}[\]$`\\;="!%^&*|~]/.test(value)) {
        liveError = "No se admiten signos especiales en la dirección.";
      }
    } else if (field === "description") {
      if (contieneInyeccionCodigo(value)) {
        liveError = "No se permite ingresar código o scripts en la descripción.";
      }
    }

    setErrors(current => ({
      ...current,
      [field]: liveError
    }));
  };

  // Auto-fill Tipo de documento y Documento al seleccionar cliente
  const handleSelectClient = clientId => {
    const selected = clients.find(c => getClientId(c) === String(clientId));
    const clientTipoDoc =
      selected?.tipoDocumento ||
      selected?.usuario?.tipoDocumento ||
      "";
    const clientDoc =
      selected?.documento ||
      selected?.usuario?.documento ||
      "";

    setForm(current => ({
      ...current,
      clientId,
      client: getClientName(selected),
      clientEmail: getClientEmail(selected),
      tipoDocumento: clientId ? (clientTipoDoc || "") : "",
      documento: clientId ? (clientDoc || "") : "",
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
    const selected = clientVehicles.find(v => getVehicleId(v) === String(vehicleId));
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
    const selected = drivers.find(d => String(d._id || d.id) === String(driverId));
    setForm(current => ({
      ...current,
      driverId,
      driver: getDriverName(selected),
      driverDocument: getDriverDocument(selected)
    }));
    setErrors(current => ({
      ...current,
      driverId: ""
    }));
  };

  const enfocarCampo = campo => {
    requestAnimationFrame(() => {
      const contenedor = fieldRefs.current[campo];
      if (!contenedor) return;
      const control = contenedor.matches?.("input, select, textarea, button")
        ? contenedor
        : contenedor.querySelector?.("input, select, textarea, button");
      if (control) {
        control.scrollIntoView({ behavior: "smooth", block: "center" });
        control.focus({ preventScroll: true });
      }
    });
  };

  const validarFormulario = () => {
    const siguientesErrores = {};

    if (isGuest) {
      // 1. Tipo de documento
      if (!form.tipoDocumento?.trim()) {
        siguientesErrores.tipoDocumento = "Selecciona o ingresa el tipo de documento.";
      }

      // 2. Documento (solo números, sin letras, sin código ni signos especiales)
      if (!form.documento?.trim()) {
        siguientesErrores.documento = "El documento es obligatorio.";
      } else if (contieneCodigo(form.documento)) {
        siguientesErrores.documento = "No se permite ingresar código en este campo.";
      } else if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(form.documento)) {
        siguientesErrores.documento = "No se permiten letras en este campo (solo números).";
      } else if (/[^0-9]/.test(form.documento.trim())) {
        siguientesErrores.documento = "No se admiten signos especiales en este campo.";
      }

      // 3. Nombre completo (solo letras y espacios, sin números, sin código ni signos)
      if (!form.clientName?.trim()) {
        siguientesErrores.clientName = "El nombre del cliente es obligatorio.";
      } else if (contieneCodigo(form.clientName)) {
        siguientesErrores.clientName = "No se permite ingresar código en este campo.";
      } else if (/[0-9]/.test(form.clientName)) {
        siguientesErrores.clientName = "No se permiten números en este campo (solo letras).";
      } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(form.clientName.trim())) {
        siguientesErrores.clientName = "No se admiten signos especiales en este campo.";
      }

      // 4. Correo del cliente (permite formato estándar de correo, sin código)
      if (!form.clientEmail?.trim()) {
        siguientesErrores.clientEmail = "El correo del cliente es obligatorio.";
      } else if (contieneCodigo(form.clientEmail)) {
        siguientesErrores.clientEmail = "No se permite ingresar código en este campo.";
      } else if (/[^a-zA-Z0-9@._+-]/.test(form.clientEmail.trim())) {
        siguientesErrores.clientEmail = "El correo contiene caracteres especiales no válidos.";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.clientEmail.trim())) {
        siguientesErrores.clientEmail = "Ingresa un correo electrónico válido.";
      }

      // 5. Teléfono (solo números, sin letras, sin código ni signos)
      if (!form.clientPhone?.trim()) {
        siguientesErrores.clientPhone = "El teléfono del cliente es obligatorio.";
      } else if (contieneCodigo(form.clientPhone)) {
        siguientesErrores.clientPhone = "No se permite ingresar código en este campo.";
      } else if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(form.clientPhone)) {
        siguientesErrores.clientPhone = "No se permiten letras en este campo (solo números).";
      } else if (/[^0-9]/.test(form.clientPhone.trim())) {
        siguientesErrores.clientPhone = "No se admiten signos especiales en este campo.";
      } else if (form.clientPhone.trim().length < 7 || form.clientPhone.trim().length > 15) {
        siguientesErrores.clientPhone = "El teléfono debe tener entre 7 y 15 números.";
      }

      // 6. REGLA: Coherencia estricta con datos de clientes existentes en la base de datos
      const formDoc = form.documento?.trim();
      const formEmail = form.clientEmail?.trim().toLowerCase();
      const formPhone = limpiarDigitos(form.clientPhone);

      // A) Si el documento coincide con un cliente existente
      if (formDoc) {
        const clientePorDoc = clients.find(c => {
          const d = String(c.documento || c.usuario?.documento || "").trim();
          return d && d.toLowerCase() === formDoc.toLowerCase();
        });

        if (clientePorDoc) {
          const nombreExistente = getClientName(clientePorDoc);
          const emailExistente = getClientEmail(clientePorDoc).trim().toLowerCase();
          const telExistente = limpiarDigitos(clientePorDoc.telefono || clientePorDoc.usuario?.telefono);
          const tipoDocExistente = clientePorDoc.tipoDocumento || clientePorDoc.usuario?.tipoDocumento;

          if (form.clientName?.trim() && normalizarTexto(form.clientName) !== normalizarTexto(nombreExistente)) {
            siguientesErrores.clientName = `Este documento ya pertenece a ${nombreExistente}. Los datos deben coincidir.`;
          }

          if (formEmail && emailExistente && formEmail !== emailExistente) {
            siguientesErrores.clientEmail = `El correo no coincide con el registrado para este documento (${emailExistente}).`;
          }

          if (formPhone && telExistente && formPhone !== telExistente) {
            siguientesErrores.clientPhone = "El teléfono no coincide con el registrado para este documento.";
          }

          if (tipoDocExistente && form.tipoDocumento && form.tipoDocumento !== tipoDocExistente) {
            siguientesErrores.tipoDocumento = `El tipo de documento debe ser ${tipoDocExistente} para este cliente.`;
          }
        }
      }

      // B) Si el correo coincide con un cliente existente pero con otro documento
      if (formEmail) {
        const clientePorEmail = clients.find(c => {
          const em = getClientEmail(c).trim().toLowerCase();
          return em && em === formEmail;
        });

        if (clientePorEmail) {
          const docExistente = String(clientePorEmail.documento || clientePorEmail.usuario?.documento || "").trim();
          if (formDoc && docExistente && formDoc.toLowerCase() !== docExistente.toLowerCase()) {
            siguientesErrores.documento = `Este correo ya está asociado al documento ${docExistente}. Los datos deben coincidir.`;
            siguientesErrores.clientEmail = `Este correo ya pertenece a otro cliente registrado con documento ${docExistente}.`;
          }
        }
      }

      // C) Si el teléfono coincide con otro cliente existente
      if (formPhone && formPhone.length >= 7) {
        const clientePorTel = clients.find(c => {
          const t = limpiarDigitos(c.telefono || c.usuario?.telefono);
          return t && t === formPhone;
        });

        if (clientePorTel) {
          const docExistente = String(clientePorTel.documento || clientePorTel.usuario?.documento || "").trim();
          if (formDoc && docExistente && formDoc.toLowerCase() !== docExistente.toLowerCase()) {
            siguientesErrores.clientPhone = `Este teléfono ya pertenece a otro cliente registrado con documento ${docExistente}.`;
          }
        }
      }

      // 7. Marca del vehículo (alfanumérico y guion, sin código ni signos)
      if (!form.vehicleMarca?.trim()) {
        siguientesErrores.vehicleMarca = "La marca del vehículo es obligatoria.";
      } else if (contieneCodigo(form.vehicleMarca)) {
        siguientesErrores.vehicleMarca = "No se permite ingresar código en este campo.";
      } else if (/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/.test(form.vehicleMarca.trim())) {
        siguientesErrores.vehicleMarca = "No se admiten signos especiales en este campo.";
      }

      // 8. Modelo del vehículo (alfanumérico y guion, sin código ni signos)
      if (!form.vehicleModelo?.trim()) {
        siguientesErrores.vehicleModelo = "El modelo del vehículo es obligatorio.";
      } else if (contieneCodigo(form.vehicleModelo)) {
        siguientesErrores.vehicleModelo = "No se permite ingresar código en este campo.";
      } else if (/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/.test(form.vehicleModelo.trim())) {
        siguientesErrores.vehicleModelo = "No se admiten signos especiales en este campo.";
      }

      // 9. Placa del vehículo (solo letras y números, sin signos especiales ni código)
      if (!form.vehiclePlaca?.trim()) {
        siguientesErrores.vehiclePlaca = "La placa del vehículo es obligatoria.";
      } else if (contieneCodigo(form.vehiclePlaca)) {
        siguientesErrores.vehiclePlaca = "No se permite ingresar código en la placa.";
      } else if (/[^a-zA-Z0-9]/.test(form.vehiclePlaca.trim())) {
        siguientesErrores.vehiclePlaca = "No se admiten signos especiales en la placa.";
      } else if (form.vehiclePlaca.trim().length < 5 || form.vehiclePlaca.trim().length > 7) {
        siguientesErrores.vehiclePlaca = "La placa debe tener entre 5 y 7 caracteres.";
      } else {
        const placaUpper = form.vehiclePlaca.trim().toUpperCase();
        const vehExistente = vehicles.find(
          v => (v.placa || "").trim().toUpperCase() === placaUpper
        );
        if (vehExistente) {
          const ownerId = getVehicleClientId(vehExistente);
          const currentClientId = String(form.clientId || getClientId(matchedClient) || "");
          if (ownerId && (!currentClientId || ownerId !== currentClientId)) {
            const dueno = clients.find(c => getClientId(c) === ownerId);
            const nombreDueno = dueno ? getClientName(dueno) : "otro cliente registrado";
            siguientesErrores.vehiclePlaca = `Esta placa ya está asociada a ${nombreDueno} y no puede ser utilizada por otro cliente.`;
          }
        }
      }

      // 10. Año (opcional, solo números)
      if (form.vehicleAnio) {
        const anioStr = String(form.vehicleAnio).trim();
        if (contieneCodigo(anioStr)) {
          siguientesErrores.vehicleAnio = "No se permite ingresar código en este campo.";
        } else if (/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(anioStr)) {
          siguientesErrores.vehicleAnio = "No se permiten letras en este campo (solo números).";
        } else if (/[^0-9]/.test(anioStr)) {
          siguientesErrores.vehicleAnio = "No se admiten signos especiales en este campo.";
        } else {
          const anioNum = Number(anioStr);
          const maxAnio = new Date().getFullYear() + 1;
          if (anioNum < 1900 || anioNum > maxAnio) {
            siguientesErrores.vehicleAnio = `El año debe estar entre 1900 y ${maxAnio}.`;
          }
        }
      }

      // 11. Color (opcional, solo letras)
      if (form.vehicleColor?.trim()) {
        const colorStr = form.vehicleColor.trim();
        if (contieneCodigo(colorStr)) {
          siguientesErrores.vehicleColor = "No se permite ingresar código en este campo.";
        } else if (/[0-9]/.test(colorStr)) {
          siguientesErrores.vehicleColor = "No se permiten números en este campo (solo letras).";
        } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(colorStr)) {
          siguientesErrores.vehicleColor = "No se admiten signos especiales en este campo.";
        }
      }
    } else {
      // Validaciones formulario estándar
      if (!form.clientId) {
        siguientesErrores.clientId = "Selecciona un cliente.";
      }

      if (!form.clientEmail?.trim()) {
        siguientesErrores.clientEmail = "El correo del cliente es obligatorio.";
      } else if (contieneCodigo(form.clientEmail)) {
        siguientesErrores.clientEmail = "No se permite ingresar código en este campo.";
      } else if (/[^a-zA-Z0-9@._+-]/.test(form.clientEmail.trim())) {
        siguientesErrores.clientEmail = "El correo contiene caracteres especiales no válidos.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail.trim())) {
        siguientesErrores.clientEmail = "Ingresa un correo electrónico válido.";
      }

      if (!form.vehicleId) {
        if (clientHasNoVehicles) {
          siguientesErrores.vehicleId = "El cliente seleccionado no tiene vehículos para asignar.";
        } else if (!form.clientId) {
          siguientesErrores.vehicleId = "Selecciona primero un cliente.";
        } else {
          siguientesErrores.vehicleId = "Selecciona un vehículo.";
        }
      } else {
        const vehicleBelongsToClient = clientVehicles.some(
          v => getVehicleId(v) === String(form.vehicleId)
        );
        if (!vehicleBelongsToClient) {
          siguientesErrores.vehicleId = "Selecciona un vehículo válido para el cliente.";
        }
      }
    }

    // Conductor asignado (obligatorio en ambos modos)
    if (!form.driverId) {
      siguientesErrores.driverId = "Selecciona un conductor.";
    } else {
      const conductor = drivers.find(d => String(d._id) === String(form.driverId));
      if (!conductor) {
        siguientesErrores.driverId = "Selecciona un conductor válido.";
      } else if (conductor.disponible !== true) {
        siguientesErrores.driverId = "El conductor seleccionado no está disponible.";
      }
    }

    // Descripción: TOTALMENTE OPCIONAL (sin mínimo de caracteres, admite signos especiales, bloquea inyecciones de código)
    if (form.description?.trim()) {
      if (contieneInyeccionCodigo(form.description)) {
        siguientesErrores.description = "No se permite ingresar código o scripts en la descripción.";
      } else if (form.description.trim().length > 500) {
        siguientesErrores.description = "No superes los 500 caracteres.";
      }
    }

    // Origen (obligatorio)
    if (!form.origin?.trim()) {
      siguientesErrores.origin = "El origen es obligatorio.";
    } else if (contieneCodigo(form.origin)) {
      siguientesErrores.origin = "No se permite ingresar código en la dirección.";
    } else if (/[<>{}[\]$`\\;="!%^&*|~]/.test(form.origin.trim())) {
      siguientesErrores.origin = "No se admiten signos especiales en la dirección.";
    } else if (form.origin.trim().length < 3) {
      siguientesErrores.origin = "Escribe una dirección más completa.";
    } else if (form.origin.trim().length > 200) {
      siguientesErrores.origin = "No superes los 200 caracteres.";
    }

    // Destino (obligatorio)
    if (!form.destination?.trim()) {
      siguientesErrores.destination = "El destino es obligatorio.";
    } else if (contieneCodigo(form.destination)) {
      siguientesErrores.destination = "No se permite ingresar código en la dirección.";
    } else if (/[<>{}[\]$`\\;="!%^&*|~]/.test(form.destination.trim())) {
      siguientesErrores.destination = "No se admiten signos especiales en la dirección.";
    } else if (form.destination.trim().length < 3) {
      siguientesErrores.destination = "Escribe una dirección más completa.";
    } else if (form.destination.trim().length > 200) {
      siguientesErrores.destination = "No superes los 200 caracteres.";
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

    if (!isGuest && loadingVehicles) {
      setErrors(current => ({
        ...current,
        vehicleId: "Espera a que terminen de cargar los vehículos."
      }));
      enfocarCampo("vehicleId");
      return;
    }

    if (!isGuest && vehicleLoadError && form.vehicleId) {
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
      // 1. Validar origen
      try {
        await obtenerCoordenadasDireccion(form.origin.trim());
      } catch (error) {
        if (esDireccionNoEncontrada(error)) {
          setGeocodeError({ campo: "Origen", direccion: form.origin.trim() });
        } else {
          setGeocodeServiceError({ campo: "Origen" });
          setErrors(current => ({
            ...current,
            origin: "No se pudo comprobar el origen. Inténtalo nuevamente."
          }));
        }
        return;
      }

      // 2. Validar destino
      try {
        await obtenerCoordenadasDireccion(form.destination.trim());
      } catch (error) {
        if (esDireccionNoEncontrada(error)) {
          setGeocodeError({ campo: "Destino", direccion: form.destination.trim() });
        } else {
          setGeocodeServiceError({ campo: "Destino" });
          setErrors(current => ({
            ...current,
            destination: "No se pudo comprobar el destino. Inténtalo nuevamente."
          }));
        }
        return;
      }

      // 3. Enviar datos al onSubmit
      if (isGuest) {
        const vehicleLabel = [
          form.vehiclePlaca?.trim().toUpperCase(),
          form.vehicleMarca?.trim(),
          form.vehicleModelo?.trim()
        ].filter(Boolean).join(" ");

        await onSubmit({
          ...form,
          isGuest: true,
          clientId: form.clientId || "",
          vehicleId: form.vehicleId || "",
          client: form.clientName?.trim(),
          clientName: form.clientName?.trim(),
          clientEmail: form.clientEmail?.trim().toLowerCase(),
          clientPhone: form.clientPhone?.trim(),
          tipoDocumento: form.tipoDocumento?.trim(),
          documento: form.documento?.trim(),
          vehicle: vehicleLabel,
          vehicleMarca: form.vehicleMarca?.trim(),
          vehicleModelo: form.vehicleModelo?.trim(),
          vehiclePlaca: form.vehiclePlaca?.trim().toUpperCase(),
          vehicleAnio: form.vehicleAnio,
          vehicleColor: form.vehicleColor?.trim(),
          vehicleTipoVehiculo: form.vehicleTipoVehiculo?.trim(),
          serviceType: form.serviceType?.trim() || "Transporte Ejecutivo",
          priority: form.priority || "Media",
          origin: form.origin.trim(),
          destination: form.destination.trim(),
          description: form.description?.trim() || ""
        });
      } else {
        await onSubmit({
          ...form,
          isGuest: false,
          serviceType: form.serviceType?.trim() || "Transporte Ejecutivo",
          priority: form.priority || "Media",
          origin: form.origin.trim(),
          destination: form.destination.trim(),
          description: form.description?.trim() || "",
          clientEmail: form.clientEmail.trim().toLowerCase()
        });
      }
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

  const tipoDocumentoOptions = [
    { value: "", label: "Seleccionar tipo" },
    { value: "CC", label: "Cédula de Ciudadanía (CC)" },
    { value: "CE", label: "Cédula de Extranjería (CE)" },
    { value: "TI", label: "Tarjeta de Identidad (TI)" },
    { value: "NIT", label: "NIT" },
    { value: "PASAPORTE", label: "Pasaporte" }
  ];

  const vehicleTypeOptions = [
    { label: "Selecciona el tipo", value: "" },
    { label: "Sedán", value: "Sedán" },
    { label: "SUV", value: "SUV" },
    { label: "Camioneta", value: "Camioneta" },
    { label: "Hatchback", value: "Hatchback" }
  ];

  const clientOptions = [
    { value: "", label: "Seleccionar cliente" },
    ...clients.map(client => ({
      value: getClientId(client),
      label: getClientName(client) || "Cliente sin nombre"
    }))
  ];

  // Regla: si el cliente seleccionado no tiene vehículos
  const clientHasNoVehicles =
    !isGuest &&
    Boolean(form.clientId) &&
    !loadingVehicles &&
    !vehicleLoadError &&
    clientVehicles.length === 0;

  const vehicleOptions = [
    {
      value: "",
      label: !form.clientId
        ? "Selecciona primero un cliente"
        : loadingVehicles
          ? "Cargando vehículos..."
          : vehicleLoadError
            ? "No se pudieron cargar los vehículos"
            : clientHasNoVehicles
              ? "El cliente no tiene vehículos registrados"
              : "Selecciona un vehículo"
    },
    ...clientVehicles.map(vehicle => ({
      value: getVehicleId(vehicle),
      label: getVehicleLabel(vehicle) || "Vehículo sin descripción"
    }))
  ];

  const driverOptions = drivers.filter(
    driver => driver.disponible === true || String(driver._id) === String(form.driverId)
  );

  // ─────────────────────────────────────────────────────────────
  // VISTA DENTRO DEL MAIN (como el módulo de Vehículos)
  // ─────────────────────────────────────────────────────────────
  if (inline) {
    return (
      <div className="p-6 md:p-8 mx-auto">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer"
              title="Volver al listado"
            >
              <ArrowLeftIcon />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Módulo de Solicitudes
                </span>
                <span className="text-slate-300">•</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  readOnly
                    ? "bg-blue-100 text-blue-800"
                    : isGuest
                    ? "bg-amber-100 text-amber-800"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {readOnly ? (form.code || "Detalle") : isGuest ? "Cliente Invitado" : "Nuevo Registro"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {readOnly
                    ? (title || "Detalle de la Solicitud")
                    : isGuest ? (
                    <>
                      Registrar Nueva Solicitud<span className="font-extrabold">-Invitado</span>
                    </>
                  ) : (
                    title
                  )}
                </h1>

                {/* Botón para alternar a Invitado solo si no es readOnly */}
                {!readOnly && (
                  isGuest ? (
                    <button
                      type="button"
                      onClick={() => cambiarModoInvitado(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition shadow-2xs cursor-pointer"
                      title="Volver al formulario Registrar Nueva Solicitud"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      Registrar Nueva Solicitud
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cambiarModoInvitado(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#ff9a2f]/15 hover:bg-[#ff9a2f]/25 text-[#d97706] border border-[#ff9a2f]/30 transition shadow-2xs cursor-pointer"
                      title="Abrir formulario para cliente invitado"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Invitado
                    </button>
                  )
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {description || (readOnly ? "Información de la solicitud en modo de solo lectura." : "Ingresa los datos del servicio solicitado.")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {isGuest ? (
            /* ── MODO CLIENTE INVITADO ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Datos del Cliente (Invitado - Todos editables) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Datos del Cliente</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Información personal y de contacto del cliente invitado
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {/* 1. Tipo de documento */}
                  <div ref={el => { fieldRefs.current.tipoDocumento = el; }}>
                    <FormField
                      id="sr-guest-tipoDocumento"
                      name="tipoDocumento"
                      label="TIPO DE DOCUMENTO"
                      type="select"
                      options={tipoDocumentoOptions}
                      value={form.tipoDocumento}
                      onChange={updateField("tipoDocumento")}
                      error={errors.tipoDocumento}
                      icon={<DocumentIcon />}
                      required
                    />
                  </div>

                  {/* 2. Documento con búsqueda y sugerencias */}
                  <div
                    ref={el => {
                      fieldRefs.current.documento = el;
                      docSearchRef.current = el;
                    }}
                    className="relative"
                  >
                    <FormField
                      id="sr-guest-documento"
                      name="documento"
                      label="DOCUMENTO"
                      type="text"
                      value={form.documento}
                      onChange={handleGuestDocumentChange}
                      onFocus={() => {
                        if (docSuggestions.length > 0) {
                          setShowDocSuggestions(true);
                        }
                      }}
                      placeholder="Ej. 1020304050"
                      error={errors.documento}
                      icon={<IdIcon />}
                      required
                    >
                      {showDocSuggestions && docSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                          <div className="px-3.5 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Clientes existentes ({docSuggestions.length})</span>
                            <span className="text-[10px] text-slate-400 font-normal">Clic para autorrellenar</span>
                          </div>
                          {docSuggestions.map(client => {
                            const cDoc = client.documento || client.usuario?.documento || "Sin doc";
                            const cTipoDoc = client.tipoDocumento || client.usuario?.tipoDocumento || "CC";
                            const cName = getClientName(client);
                            const cEmail = getClientEmail(client);
                            return (
                              <button
                                key={getClientId(client)}
                                type="button"
                                onClick={() => void applySelectedClient(client)}
                                className="w-full text-left px-3.5 py-2.5 hover:bg-orange-50/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition">
                                      {cName || "Cliente"}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                                      {cTipoDoc} {cDoc}
                                    </span>
                                  </div>
                                  {cEmail && (
                                    <span className="text-[11px] text-slate-400 block truncate">
                                      {cEmail}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-semibold text-orange-500 shrink-0 opacity-0 group-hover:opacity-100 transition">
                                  Seleccionar →
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </FormField>
                  </div>

                  {/* 3. Nombre completo */}
                  <div ref={el => { fieldRefs.current.clientName = el; }}>
                    <FormField
                      id="sr-guest-clientName"
                      name="clientName"
                      label="NOMBRE COMPLETO"
                      type="text"
                      value={form.clientName}
                      onChange={updateField("clientName")}
                      placeholder="Ej. Carlos Pérez"
                      error={errors.clientName}
                      icon={<UserIcon />}
                      required
                    />
                  </div>

                  {/* 4. Correo del cliente */}
                  <div ref={el => { fieldRefs.current.clientEmail = el; }}>
                    <FormField
                      id="sr-guest-clientEmail"
                      name="clientEmail"
                      label="CORREO DEL CLIENTE"
                      type="email"
                      value={form.clientEmail}
                      onChange={updateField("clientEmail")}
                      placeholder="cliente@ejemplo.com"
                      error={errors.clientEmail}
                      icon={<MailIcon />}
                      required
                    />
                  </div>

                  {/* 5. Teléfono */}
                  <div ref={el => { fieldRefs.current.clientPhone = el; }} className="md:col-span-2">
                    <FormField
                      id="sr-guest-clientPhone"
                      name="clientPhone"
                      label="TELÉFONO"
                      type="tel"
                      value={form.clientPhone}
                      onChange={updateField("clientPhone")}
                      placeholder="Ej. 3001234567"
                      error={errors.clientPhone}
                      icon={<PhoneIcon />}
                      required
                    />
                  </div>

                  {/* Aviso informativo si se asoció a un cliente existente */}
                  {matchedClient && (
                    <div className="md:col-span-2 mt-1 mb-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                        ✓
                      </span>
                      <p className="font-bold">
                        Cliente existente encontrado: {getClientName(matchedClient)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Datos Básicos del Vehículo (Campos del módulo Vehículo) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Datos Básicos del Vehículo</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Información principal de identificación del vehículo
                </p>

                {guestClientVehicles.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <p className="font-bold mb-1.5 flex items-center gap-1.5">
                      <CarIcon className="w-4 h-4 text-amber-600" />
                      Vehículos registrados de este cliente:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {guestClientVehicles.map(v => (
                        <button
                          key={getVehicleId(v)}
                          type="button"
                          onClick={() => applyExistingVehicle(v)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                            form.vehiclePlaca === (v.placa || "").toUpperCase()
                              ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-amber-100"
                          }`}
                          title="Usar este vehículo"
                        >
                          {v.placa} • {v.marca} {v.modelo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {/* Marca */}
                  <div ref={el => { fieldRefs.current.vehicleMarca = el; }}>
                    <FormField
                      id="sr-guest-marca"
                      name="vehicleMarca"
                      label="MARCA"
                      type="text"
                      value={form.vehicleMarca}
                      onChange={updateField("vehicleMarca")}
                      placeholder="Ej. Toyota, Chevrolet, Mazda"
                      error={errors.vehicleMarca}
                      icon={<ArrowsIcon />}
                      required
                    />
                  </div>

                  {/* Modelo */}
                  <div ref={el => { fieldRefs.current.vehicleModelo = el; }}>
                    <FormField
                      id="sr-guest-modelo"
                      name="vehicleModelo"
                      label="MODELO"
                      type="text"
                      value={form.vehicleModelo}
                      onChange={updateField("vehicleModelo")}
                      placeholder="Ej. Corolla, Tracker, Mazda 3"
                      error={errors.vehicleModelo}
                      icon={<CarFrontIcon />}
                      required
                    />
                  </div>

                  {/* Placa */}
                  <div ref={el => { fieldRefs.current.vehiclePlaca = el; }}>
                    <FormField
                      id="sr-guest-placa"
                      name="vehiclePlaca"
                      label="PLACA"
                      type="text"
                      value={form.vehiclePlaca}
                      onChange={e => setForm(c => ({ ...c, vehiclePlaca: e.target.value.toUpperCase() }))}
                      placeholder="Ej. ABC123"
                      error={errors.vehiclePlaca}
                      icon={<PlateIcon />}
                      required
                    />
                  </div>

                  {/* Año */}
                  <div ref={el => { fieldRefs.current.vehicleAnio = el; }}>
                    <FormField
                      id="sr-guest-anio"
                      name="vehicleAnio"
                      label="AÑO"
                      type="number"
                      value={form.vehicleAnio}
                      onChange={updateField("vehicleAnio")}
                      placeholder="Ej. 2023"
                      icon={<CalendarIcon />}
                    />
                  </div>

                  {/* Color */}
                  <div ref={el => { fieldRefs.current.vehicleColor = el; }}>
                    <FormField
                      id="sr-guest-color"
                      name="vehicleColor"
                      label="COLOR"
                      type="text"
                      value={form.vehicleColor}
                      onChange={updateField("vehicleColor")}
                      placeholder="Ej. Blanco, Gris, Negro"
                      icon={<ColorIcon />}
                    />
                  </div>

                  {/* Tipo de vehículo */}
                  <div ref={el => { fieldRefs.current.vehicleTipoVehiculo = el; }}>
                    <FormField
                      id="sr-guest-tipoVehiculo"
                      name="vehicleTipoVehiculo"
                      label="TIPO DE VEHÍCULO"
                      type="select"
                      value={form.vehicleTipoVehiculo}
                      onChange={updateField("vehicleTipoVehiculo")}
                      options={vehicleTypeOptions}
                      icon={<CarIcon />}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Asignación del Servicio */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Asignación del Servicio</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Conductor asignado y especificaciones operativas
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                  {/* Conductor asignado (obligatorio *) */}
                  <div ref={el => { fieldRefs.current.driverId = el; }}>
                    <DriverSelectField
                      id="sr-guest-driverId"
                      name="driverId"
                      label="ASIGNAR CONDUCTOR"
                      value={form.driverId || ""}
                      onChange={handleSelectDriver}
                      drivers={driverOptions}
                      selectedDriverName={form.driver}
                      selectedDriverDoc={form.driverDocument}
                      error={errors.driverId}
                      required
                      readOnly={readOnly}
                    />
                  </div>

                  {/* Tipo de servicio (OPCIONAL) */}
                  <div ref={el => { fieldRefs.current.serviceType = el; }}>
                    <FormField
                      id="sr-guest-serviceType"
                      name="serviceType"
                      label="TIPO DE SERVICIO"
                      type="select"
                      value={form.serviceType}
                      onChange={updateField("serviceType")}
                      options={serviceTypes.map(v => ({ value: v, label: v }))}
                      icon={<BriefcaseIcon />}
                    />
                  </div>

                  {/* Prioridad (OPCIONAL) */}
                  <div ref={el => { fieldRefs.current.priority = el; }}>
                    <FormField
                      id="sr-guest-priority"
                      name="priority"
                      label="PRIORIDAD"
                      type="select"
                      value={form.priority}
                      onChange={updateField("priority")}
                      options={priorities.map(v => ({ value: v, label: v }))}
                      icon={<FlagIcon />}
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Detalles y Ruta del Servicio */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Detalles y Ruta del Servicio</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Descripción de la solicitud y direcciones de origen y destino
                </p>

                <div className="space-y-4">
                  {/* Descripción (opcional, min 5 chars si se ingresa) */}
                  <div ref={el => { fieldRefs.current.description = el; }}>
                    <FormField
                      id="sr-guest-description"
                      name="description"
                      label="DESCRIPCIÓN"
                      textarea
                      rows={3}
                      value={form.description}
                      onChange={updateField("description")}
                      placeholder="Detalles del servicio solicitado (opcional)..."
                      error={errors.description}
                      icon={<DocumentIcon />}
                    />
                  </div>

                  {/* Origen y Destino (ambos obligatorios *) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <div ref={el => { fieldRefs.current.origin = el; }}>
                      <FormField
                        id="sr-guest-origin"
                        name="origin"
                        label="ORIGEN"
                        type="text"
                        value={form.origin}
                        onChange={updateField("origin")}
                        placeholder="Dirección de recogida"
                        error={errors.origin}
                        icon={<MapPinIcon />}
                        required
                      />
                    </div>

                    <div ref={el => { fieldRefs.current.destination = el; }}>
                      <FormField
                        id="sr-guest-destination"
                        name="destination"
                        label="DESTINO"
                        type="text"
                        value={form.destination}
                        onChange={updateField("destination")}
                        placeholder="Dirección de destino"
                        error={errors.destination}
                        icon={<NavigationIcon />}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── MODO ESTÁNDAR ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Datos del Cliente */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Datos del Cliente</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Información de identificación y contacto del cliente solicitante
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {/* 1. Tipo de documento (solo lectura, empieza vacío) */}
                  <div ref={el => { fieldRefs.current.tipoDocumento = el; }}>
                    <FormField
                      id="sr-field-tipoDocumento"
                      name="tipoDocumento"
                      label="TIPO DE DOCUMENTO"
                      type="text"
                      value={form.tipoDocumento}
                      placeholder="—"
                      icon={<DocumentIcon />}
                      readOnly
                    />
                  </div>

                  {/* 2. Documento (solo lectura, empieza vacío) */}
                  <div ref={el => { fieldRefs.current.documento = el; }}>
                    <FormField
                      id="sr-field-documento"
                      name="documento"
                      label="DOCUMENTO"
                      type="text"
                      value={form.documento}
                      placeholder="—"
                      icon={<IdIcon />}
                      readOnly
                    />
                  </div>

                  {/* 3. Cliente (obligatorio *) */}
                  <div ref={el => { fieldRefs.current.clientId = el; }}>
                    {readOnly ? (
                      <FormField
                        id="sr-field-clientId"
                        name="clientId"
                        label="CLIENTE"
                        type="text"
                        value={form.client || form.clientName || "—"}
                        icon={<UserIcon />}
                        readOnly
                      />
                    ) : (
                      <FormField
                        id="sr-field-clientId"
                        name="clientId"
                        label="CLIENTE"
                        type="select"
                        value={typeof form.clientId === "object" ? form.clientId?._id ?? "" : form.clientId}
                        onChange={e => handleSelectClient(e.target.value)}
                        options={clientOptions}
                        error={errors.clientId}
                        icon={<UserIcon />}
                        required
                      />
                    )}
                  </div>

                  {/* 4. Correo del cliente (obligatorio *) */}
                  <div ref={el => { fieldRefs.current.clientEmail = el; }}>
                    <FormField
                      id="sr-field-clientEmail"
                      name="clientEmail"
                      label="CORREO DEL CLIENTE"
                      type="email"
                      value={form.clientEmail}
                      onChange={updateField("clientEmail")}
                      placeholder="cliente@ejemplo.com"
                      error={errors.clientEmail}
                      icon={<MailIcon />}
                      required
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Asignación del Servicio */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Asignación del Servicio</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Conductor asignado y vehículo asociado al cliente
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {/* 5. Conductor asignado (obligatorio *) */}
                  <div ref={el => { fieldRefs.current.driverId = el; }}>
                    <DriverSelectField
                      id="sr-field-driverId"
                      name="driverId"
                      label="ASIGNAR CONDUCTOR"
                      value={form.driverId || ""}
                      onChange={handleSelectDriver}
                      drivers={driverOptions}
                      selectedDriverName={form.driver}
                      selectedDriverDoc={form.driverDocument}
                      error={errors.driverId}
                      required
                      readOnly={readOnly}
                    />
                  </div>

                  {/* 6. Vehículo (obligatorio *, EN ROJO SI NO TIENE VEHÍCULO) */}
                  <div ref={el => { fieldRefs.current.vehicleId = el; }}>
                    {readOnly ? (
                      <FormField
                        id="sr-field-vehicleId"
                        name="vehicleId"
                        label="VEHÍCULO"
                        type="text"
                        value={
                          form.vehicle ||
                          (form.vehiclePlaca ? `${form.vehiclePlaca} ${form.vehicleMarca || ""} ${form.vehicleModelo || ""}`.trim() : "Sin vehículo")
                        }
                        icon={<CarIcon />}
                        readOnly
                      />
                    ) : (
                      <FormField
                        id="sr-field-vehicleId"
                        name="vehicleId"
                        label="VEHÍCULO"
                        type="select"
                        value={form.vehicleId || ""}
                        onChange={e => handleSelectVehicle(e.target.value)}
                        options={vehicleOptions}
                        error={errors.vehicleId || vehicleLoadError}
                        isWarning={clientHasNoVehicles}
                        helperText={
                          clientHasNoVehicles
                            ? "El cliente seleccionado no tiene vehículos registrados"
                            : loadingVehicles
                            ? "Cargando vehículos del cliente..."
                            : undefined
                        }
                        icon={<CarIcon />}
                        required
                      />
                    )}
                  </div>

                  {/* 7. Tipo de servicio (OPCIONAL) */}
                  <div ref={el => { fieldRefs.current.serviceType = el; }}>
                    <FormField
                      id="sr-field-serviceType"
                      name="serviceType"
                      label="TIPO DE SERVICIO"
                      type="select"
                      value={form.serviceType}
                      onChange={updateField("serviceType")}
                      options={serviceTypes.map(v => ({ value: v, label: v }))}
                      icon={<BriefcaseIcon />}
                      readOnly={readOnly}
                    />
                  </div>

                  {/* 8. Prioridad (OPCIONAL) */}
                  <div ref={el => { fieldRefs.current.priority = el; }}>
                    <FormField
                      id="sr-field-priority"
                      name="priority"
                      label="PRIORIDAD"
                      type="select"
                      value={form.priority}
                      onChange={updateField("priority")}
                      options={priorities.map(v => ({ value: v, label: v }))}
                      icon={<FlagIcon />}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Detalles y Ruta del Servicio */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Detalles y Ruta del Servicio</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  Descripción de la solicitud y direcciones de origen y destino
                </p>

                <div className="space-y-4">
                  {/* 9. Descripción (opcional, min 5 chars si se ingresa) */}
                  <div ref={el => { fieldRefs.current.description = el; }}>
                    <FormField
                      id="sr-field-description"
                      name="description"
                      label="DESCRIPCIÓN"
                      textarea
                      rows={3}
                      value={form.description}
                      onChange={updateField("description")}
                      placeholder="Detalles del servicio solicitado (opcional)..."
                      error={errors.description}
                      icon={<DocumentIcon />}
                      readOnly={readOnly}
                    />
                  </div>

                  {/* 10. Origen y 11. Destino (ambos obligatorios *) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <div ref={el => { fieldRefs.current.origin = el; }}>
                      <FormField
                        id="sr-field-origin"
                        name="origin"
                        label="ORIGEN"
                        type="text"
                        value={form.origin}
                        onChange={updateField("origin")}
                        placeholder="Dirección de recogida"
                        error={errors.origin}
                        icon={<MapPinIcon />}
                        required
                        readOnly={readOnly}
                      />
                    </div>

                    <div ref={el => { fieldRefs.current.destination = el; }}>
                      <FormField
                        id="sr-field-destination"
                        name="destination"
                        label="DESTINO"
                        type="text"
                        value={form.destination}
                        onChange={updateField("destination")}
                        placeholder="Dirección de destino"
                        error={errors.destination}
                        icon={<NavigationIcon />}
                        required
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Tiempos y Estado del Servicio (Solo lectura) */}
              {readOnly && (
                <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    <h2 className="text-base font-bold text-slate-800">Tiempos y Estado del Servicio</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-6 ml-3.5">
                    Estado operativo y fechas registradas para esta solicitud
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      id="sr-field-status"
                      name="status"
                      label="ESTADO"
                      value={form.status}
                      readOnly
                    />
                    <FormField
                      id="sr-field-fechaInicio"
                      name="fechaInicio"
                      label="FECHA Y HORA DE INICIO"
                      icon={<CalendarIcon />}
                      value={
                        form.fechaInicioFormatted?.completo ||
                        (form.fechaInicio ? new Date(form.fechaInicio).toLocaleString("es-CO") :
                          (form.createdAt ? new Date(form.createdAt).toLocaleString("es-CO") : "—"))
                      }
                      readOnly
                    />
                    <FormField
                      id="sr-field-fechaFin"
                      name="fechaFin"
                      label="FINALIZACIÓN"
                      icon={<CalendarIcon />}
                      value={
                        form.fechaFinFormatted?.completo ||
                        (form.fechaFin ? new Date(form.fechaFin).toLocaleString("es-CO") :
                          (form.status === "Completado" || form.status === "Cancelado"
                            ? (form.updatedAt ? new Date(form.updatedAt).toLocaleString("es-CO") : "Finalizado")
                            : form.status === "En Proceso" ? "En curso" : "Pendiente"))
                      }
                      readOnly
                    />
                    <FormField
                      id="sr-field-createdAt"
                      name="createdAt"
                      label="FECHA DE REGISTRO"
                      icon={<CalendarIcon />}
                      value={form.createdAt ? new Date(form.createdAt).toLocaleString("es-CO") : "—"}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
            >
              {readOnly ? "Volver al listado" : closeLabel}
            </button>

            {!readOnly && (
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 h-12 rounded-xl border-0 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  submitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#ff9a2f] hover:bg-[#f08c23] shadow-[0_4px_14px_rgba(255,154,47,0.35)]"
                }`}
              >
                {submitting ? (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <CheckIcon className="w-5 h-5" />
                )}
                {submitting ? "Validando direcciones..." : submitLabel}
              </button>
            )}
          </div>
        </form>

        {geocodeError && (
          <ModalErrorDireccion
            campo={geocodeError.campo}
            direccion={geocodeError.direccion}
            onClose={() => {
              const campo = geocodeError.campo === "Origen" ? "origin" : "destination";
              setGeocodeError(null);
              enfocarCampo(campo);
            }}
          />
        )}

        {geocodeServiceError && (
          <ModalErrorValidacionDireccion
            campo={geocodeServiceError.campo}
            onClose={() => {
              const campo = geocodeServiceError.campo === "Origen" ? "origin" : "destination";
              setGeocodeServiceError(null);
              enfocarCampo(campo);
            }}
          />
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // VISTA MODAL (para edición y detalle cuando se abre como modal)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="mc-modal-overlay">
      <form
        className="mc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-form-title"
        onSubmit={handleSubmit}
        noValidate
        style={{ maxWidth: 840, width: "calc(100% - 32px)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="mc-modal-header" style={{ padding: "24px 28px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p className="mc-modal-subtitle">Solicitud</p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="sr-form-title" className="mc-modal-title">
                  {isGuest ? (
                    <>
                      Registrar Nueva Solicitud<span className="font-extrabold">-Invitado</span>
                    </>
                  ) : (
                    title
                  )}
                </h2>
                {!readOnly && (
                  isGuest ? (
                    <button
                      type="button"
                      onClick={() => cambiarModoInvitado(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3 h-3" />
                      Registrar Nueva Solicitud
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cambiarModoInvitado(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ff9a2f]/15 hover:bg-[#ff9a2f]/25 text-[#d97706] border border-[#ff9a2f]/30 transition cursor-pointer"
                    >
                      <UserIcon className="w-3 h-3" />
                      Invitado
                    </button>
                  )
                )}
              </div>
              <p className="mc-modal-desc">
                {readOnly ? "Información de la solicitud en modo de solo lectura." : isGuest ? "Ingresa los datos del cliente invitado y su vehículo." : "Ingresa los datos del servicio solicitado."}
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="mc-modal-close">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="mc-modal-body" style={{ padding: "16px 28px 24px" }}>
          {isGuest ? (
            /* Modal - Modo Invitado */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px 14px" }}>
              <div ref={el => { fieldRefs.current.tipoDocumento = el; }}>
                <FormField
                  id="sr-modal-guest-tipoDocumento"
                  name="tipoDocumento"
                  label="Tipo de documento"
                  type="select"
                  options={tipoDocumentoOptions}
                  value={form.tipoDocumento}
                  onChange={updateField("tipoDocumento")}
                  error={errors.tipoDocumento}
                  icon={<DocumentIcon />}
                  required
                />
              </div>

              <div
                ref={el => {
                  fieldRefs.current.documento = el;
                }}
                className="relative"
              >
                <FormField
                  id="sr-modal-guest-documento"
                  name="documento"
                  label="Documento"
                  type="text"
                  value={form.documento}
                  onChange={handleGuestDocumentChange}
                  onFocus={() => {
                    if (docSuggestions.length > 0) {
                      setShowDocSuggestions(true);
                    }
                  }}
                  placeholder="Ej. 1020304050"
                  error={errors.documento}
                  icon={<IdIcon />}
                  required
                >
                  {showDocSuggestions && docSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-52 overflow-y-auto">
                      <div className="px-3.5 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Clientes existentes ({docSuggestions.length})</span>
                        <span className="text-[10px] text-slate-400 font-normal">Clic para autorrellenar</span>
                      </div>
                      {docSuggestions.map(client => {
                        const cDoc = client.documento || client.usuario?.documento || "Sin doc";
                        const cTipoDoc = client.tipoDocumento || client.usuario?.tipoDocumento || "CC";
                        const cName = getClientName(client);
                        const cEmail = getClientEmail(client);
                        return (
                          <button
                            key={getClientId(client)}
                            type="button"
                            onClick={() => void applySelectedClient(client)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-orange-50/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition">
                                  {cName || "Cliente"}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                                  {cTipoDoc} {cDoc}
                                </span>
                              </div>
                              {cEmail && (
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {cEmail}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-orange-500 shrink-0 opacity-0 group-hover:opacity-100 transition">
                              Seleccionar →
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </FormField>
              </div>

              <div ref={el => { fieldRefs.current.clientName = el; }}>
                <FormField
                  id="sr-modal-guest-clientName"
                  name="clientName"
                  label="Nombre completo"
                  type="text"
                  value={form.clientName}
                  onChange={updateField("clientName")}
                  placeholder="Ej. Carlos Pérez"
                  error={errors.clientName}
                  icon={<UserIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.clientEmail = el; }}>
                <FormField
                  id="sr-modal-guest-clientEmail"
                  name="clientEmail"
                  label="Correo del cliente"
                  type="email"
                  value={form.clientEmail}
                  onChange={updateField("clientEmail")}
                  placeholder="cliente@ejemplo.com"
                  error={errors.clientEmail}
                  icon={<MailIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.clientPhone = el; }} style={{ gridColumn: "1 / -1" }}>
                <FormField
                  id="sr-modal-guest-clientPhone"
                  name="clientPhone"
                  label="Teléfono"
                  type="tel"
                  value={form.clientPhone}
                  onChange={updateField("clientPhone")}
                  placeholder="Ej. 3001234567"
                  error={errors.clientPhone}
                  icon={<PhoneIcon />}
                  required
                />
              </div>

              {/* Aviso si se asoció a un cliente existente */}
              {matchedClient && (
                <div style={{ gridColumn: "1 / -1" }} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                    ✓
                  </span>
                  <p className="font-bold">
                    Cliente existente encontrado: {getClientName(matchedClient)}
                  </p>
                </div>
              )}

              {/* Chips de vehículos existentes si los tiene */}
              {guestClientVehicles.length > 0 && (
                <div style={{ gridColumn: "1 / -1" }} className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold mb-1.5 flex items-center gap-1.5">
                    <CarIcon className="w-4 h-4 text-amber-600" />
                    Vehículos registrados de este cliente:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guestClientVehicles.map(v => (
                      <button
                        key={getVehicleId(v)}
                        type="button"
                        onClick={() => applyExistingVehicle(v)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                          form.vehiclePlaca === (v.placa || "").toUpperCase()
                            ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-amber-100"
                        }`}
                        title="Usar este vehículo"
                      >
                        {v.placa} • {v.marca} {v.modelo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Datos del vehículo */}
              <div ref={el => { fieldRefs.current.vehicleMarca = el; }}>
                <FormField
                  id="sr-modal-guest-marca"
                  name="vehicleMarca"
                  label="Marca"
                  type="text"
                  value={form.vehicleMarca}
                  onChange={updateField("vehicleMarca")}
                  placeholder="Ej. Toyota, Chevrolet, Mazda"
                  error={errors.vehicleMarca}
                  icon={<ArrowsIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.vehicleModelo = el; }}>
                <FormField
                  id="sr-modal-guest-modelo"
                  name="vehicleModelo"
                  label="Modelo"
                  type="text"
                  value={form.vehicleModelo}
                  onChange={updateField("vehicleModelo")}
                  placeholder="Ej. Corolla, Tracker, Mazda 3"
                  error={errors.vehicleModelo}
                  icon={<CarFrontIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.vehiclePlaca = el; }}>
                <FormField
                  id="sr-modal-guest-placa"
                  name="vehiclePlaca"
                  label="Placa"
                  type="text"
                  value={form.vehiclePlaca}
                  onChange={e => setForm(c => ({ ...c, vehiclePlaca: e.target.value.toUpperCase() }))}
                  placeholder="Ej. ABC123"
                  error={errors.vehiclePlaca}
                  icon={<PlateIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.vehicleAnio = el; }}>
                <FormField
                  id="sr-modal-guest-anio"
                  name="vehicleAnio"
                  label="Año"
                  type="number"
                  value={form.vehicleAnio}
                  onChange={updateField("vehicleAnio")}
                  placeholder="Ej. 2023"
                  icon={<CalendarIcon />}
                />
              </div>

              <div ref={el => { fieldRefs.current.vehicleColor = el; }}>
                <FormField
                  id="sr-modal-guest-color"
                  name="vehicleColor"
                  label="Color"
                  type="text"
                  value={form.vehicleColor}
                  onChange={updateField("vehicleColor")}
                  placeholder="Ej. Blanco, Gris, Negro"
                  icon={<ColorIcon />}
                />
              </div>

              <div ref={el => { fieldRefs.current.vehicleTipoVehiculo = el; }}>
                <FormField
                  id="sr-modal-guest-tipoVehiculo"
                  name="vehicleTipoVehiculo"
                  label="Tipo de vehículo"
                  type="select"
                  value={form.vehicleTipoVehiculo}
                  onChange={updateField("vehicleTipoVehiculo")}
                  options={vehicleTypeOptions}
                  icon={<CarIcon />}
                />
              </div>

              {/* Conductor asignado */}
              <div ref={el => { fieldRefs.current.driverId = el; }}>
                <DriverSelectField
                  id="sr-modal-guest-driverId"
                  name="driverId"
                  label="Asignar conductor"
                  value={form.driverId || ""}
                  onChange={handleSelectDriver}
                  drivers={driverOptions}
                  selectedDriverName={form.driver}
                  selectedDriverDoc={form.driverDocument}
                  error={errors.driverId}
                  required
                  readOnly={readOnly}
                />
              </div>

              {/* Tipo de servicio (OPCIONAL) */}
              <div ref={el => { fieldRefs.current.serviceType = el; }}>
                <FormField
                  id="sr-modal-guest-serviceType"
                  name="serviceType"
                  label="Tipo de servicio"
                  type="select"
                  value={form.serviceType}
                  onChange={updateField("serviceType")}
                  options={serviceTypes.map(v => ({ value: v, label: v }))}
                  icon={<BriefcaseIcon />}
                />
              </div>

              {/* Prioridad (OPCIONAL) */}
              <div ref={el => { fieldRefs.current.priority = el; }}>
                <FormField
                  id="sr-modal-guest-priority"
                  name="priority"
                  label="Prioridad"
                  type="select"
                  value={form.priority}
                  onChange={updateField("priority")}
                  options={priorities.map(v => ({ value: v, label: v }))}
                  icon={<FlagIcon />}
                />
              </div>

              {/* Descripción */}
              <div ref={el => { fieldRefs.current.description = el; }} style={{ gridColumn: "1 / -1" }}>
                <FormField
                  id="sr-modal-guest-description"
                  name="description"
                  label="Descripción"
                  textarea
                  rows={3}
                  placeholder="Detalles del servicio solicitado (opcional)..."
                  value={form.description}
                  onChange={updateField("description")}
                  error={errors.description}
                  icon={<DocumentIcon />}
                />
              </div>

              {/* Origen y Destino */}
              <div ref={el => { fieldRefs.current.origin = el; }}>
                <FormField
                  id="sr-modal-guest-origin"
                  name="origin"
                  label="Origen"
                  type="text"
                  value={form.origin}
                  onChange={updateField("origin")}
                  placeholder="Dirección de recogida"
                  error={errors.origin}
                  icon={<MapPinIcon />}
                  required
                />
              </div>

              <div ref={el => { fieldRefs.current.destination = el; }}>
                <FormField
                  id="sr-modal-guest-destination"
                  name="destination"
                  label="Destino"
                  type="text"
                  value={form.destination}
                  onChange={updateField("destination")}
                  placeholder="Dirección de destino"
                  error={errors.destination}
                  icon={<NavigationIcon />}
                  required
                />
              </div>
            </div>
          ) : (
            /* Modal - Modo Estándar */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px 14px" }}>
              {/* 1. Tipo de documento */}
              <div ref={el => { fieldRefs.current.tipoDocumento = el; }}>
                <FormField
                  id="sr-modal-tipoDocumento"
                  name="tipoDocumento"
                  label="Tipo de documento"
                  type="text"
                  value={form.tipoDocumento}
                  placeholder="—"
                  icon={<DocumentIcon />}
                  readOnly
                />
              </div>

              {/* 2. Documento */}
              <div ref={el => { fieldRefs.current.documento = el; }}>
                <FormField
                  id="sr-modal-documento"
                  name="documento"
                  label="Documento"
                  type="text"
                  value={form.documento}
                  placeholder="—"
                  icon={<IdIcon />}
                  readOnly
                />
              </div>

              {/* 3. Cliente */}
              <div ref={el => { fieldRefs.current.clientId = el; }}>
                {readOnly ? (
                  <FormField
                    id="sr-modal-clientId"
                    name="clientId"
                    label="Cliente"
                    type="text"
                    value={form.client || form.clientName || "—"}
                    icon={<UserIcon />}
                    readOnly
                  />
                ) : (
                  <FormField
                    id="sr-modal-clientId"
                    name="clientId"
                    label="Cliente"
                    type="select"
                    value={typeof form.clientId === "object" ? form.clientId?._id ?? "" : form.clientId}
                    onChange={e => handleSelectClient(e.target.value)}
                    options={clientOptions}
                    error={errors.clientId}
                    icon={<UserIcon />}
                    required
                  />
                )}
              </div>

              {/* 4. Correo del cliente */}
              <div ref={el => { fieldRefs.current.clientEmail = el; }}>
                <FormField
                  id="sr-modal-clientEmail"
                  name="clientEmail"
                  label="Correo del cliente"
                  type="email"
                  value={form.clientEmail}
                  onChange={updateField("clientEmail")}
                  error={errors.clientEmail}
                  icon={<MailIcon />}
                  required
                  readOnly={readOnly}
                />
              </div>

              {/* 5. Conductor asignado */}
              <div ref={el => { fieldRefs.current.driverId = el; }}>
                <DriverSelectField
                  id="sr-modal-driverId"
                  name="driverId"
                  label="Asignar conductor"
                  value={form.driverId || ""}
                  onChange={handleSelectDriver}
                  drivers={driverOptions}
                  selectedDriverName={form.driver}
                  selectedDriverDoc={form.driverDocument}
                  error={errors.driverId}
                  required
                  readOnly={readOnly}
                />
              </div>

              {/* 6. Vehículo (EN ROJO SI NO TIENE VEHÍCULO) */}
              <div ref={el => { fieldRefs.current.vehicleId = el; }}>
                {readOnly ? (
                  <FormField
                    id="sr-modal-vehicleId"
                    name="vehicleId"
                    label="Vehículo"
                    type="text"
                    value={
                      form.vehicle ||
                      (form.vehiclePlaca ? `${form.vehiclePlaca} ${form.vehicleMarca || ""} ${form.vehicleModelo || ""}`.trim() : "Sin vehículo")
                    }
                    icon={<CarIcon />}
                    readOnly
                  />
                ) : (
                  <FormField
                    id="sr-modal-vehicleId"
                    name="vehicleId"
                    label="Vehículo"
                    type="select"
                    value={form.vehicleId || ""}
                    onChange={e => handleSelectVehicle(e.target.value)}
                    options={vehicleOptions}
                    error={errors.vehicleId || vehicleLoadError}
                    isWarning={clientHasNoVehicles}
                    helperText={
                      clientHasNoVehicles
                        ? "El cliente seleccionado no tiene vehículos registrados"
                        : loadingVehicles
                        ? "Cargando vehículos del cliente..."
                        : undefined
                    }
                    icon={<CarIcon />}
                    required
                  />
                )}
              </div>

              {/* 7. Tipo de servicio (OPCIONAL) */}
              <div ref={el => { fieldRefs.current.serviceType = el; }}>
                <FormField
                  id="sr-modal-serviceType"
                  name="serviceType"
                  label="Tipo de servicio"
                  type="select"
                  value={form.serviceType}
                  onChange={updateField("serviceType")}
                  options={serviceTypes.map(v => ({ value: v, label: v }))}
                  icon={<BriefcaseIcon />}
                  readOnly={readOnly}
                />
              </div>

              {/* 8. Prioridad (OPCIONAL) */}
              <div ref={el => { fieldRefs.current.priority = el; }}>
                <FormField
                  id="sr-modal-priority"
                  name="priority"
                  label="Prioridad"
                  type="select"
                  value={form.priority}
                  onChange={updateField("priority")}
                  options={priorities.map(v => ({ value: v, label: v }))}
                  icon={<FlagIcon />}
                  readOnly={readOnly}
                />
              </div>

              {/* 9. Descripción */}
              <div ref={el => { fieldRefs.current.description = el; }} style={{ gridColumn: "1 / -1" }}>
                <FormField
                  id="sr-modal-description"
                  name="description"
                  label="Descripción"
                  textarea
                  rows={3}
                  placeholder="Detalles del servicio solicitado (opcional)..."
                  value={form.description}
                  onChange={updateField("description")}
                  error={errors.description}
                  icon={<DocumentIcon />}
                  readOnly={readOnly}
                />
              </div>

              {/* 10. Origen */}
              <div ref={el => { fieldRefs.current.origin = el; }}>
                <FormField
                  id="sr-modal-origin"
                  name="origin"
                  label="Origen"
                  type="text"
                  value={form.origin}
                  onChange={updateField("origin")}
                  placeholder="Dirección de recogida"
                  error={errors.origin}
                  icon={<MapPinIcon />}
                  required
                  readOnly={readOnly}
                />
              </div>

              {/* 11. Destino */}
              <div ref={el => { fieldRefs.current.destination = el; }}>
                <FormField
                  id="sr-modal-destination"
                  name="destination"
                  label="Destino"
                  type="text"
                  value={form.destination}
                  onChange={updateField("destination")}
                  placeholder="Dirección de destino"
                  error={errors.destination}
                  icon={<NavigationIcon />}
                  required
                  readOnly={readOnly}
                />
              </div>

              {readOnly && (
                <>
                  <FormField
                    id="sr-modal-status"
                    name="status"
                    label="Estado"
                    value={form.status}
                    readOnly
                  />
                  <FormField
                    id="sr-modal-fechaInicio"
                    name="fechaInicio"
                    label="Fecha y hora de inicio"
                    icon={<CalendarIcon />}
                    value={
                      form.fechaInicioFormatted?.completo ||
                      (form.fechaInicio ? new Date(form.fechaInicio).toLocaleString("es-CO") :
                        (form.createdAt ? new Date(form.createdAt).toLocaleString("es-CO") : "—"))
                    }
                    readOnly
                  />
                  <FormField
                    id="sr-modal-fechaFin"
                    name="fechaFin"
                    label="Fecha y hora de finalización"
                    icon={<CalendarIcon />}
                    value={
                      form.fechaFinFormatted?.completo ||
                      (form.fechaFin ? new Date(form.fechaFin).toLocaleString("es-CO") :
                        (form.status === "Completado" || form.status === "Cancelado"
                          ? (form.updatedAt ? new Date(form.updatedAt).toLocaleString("es-CO") : "Finalizado")
                          : form.status === "En Proceso" ? "En curso" : "Pendiente"))
                    }
                    readOnly
                  />
                  <FormField
                    id="sr-modal-createdAt"
                    name="createdAt"
                    label="Fecha de registro"
                    icon={<CalendarIcon />}
                    value={form.createdAt ? new Date(form.createdAt).toLocaleString("es-CO") : ""}
                    readOnly
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className="mc-modal-footer" style={{ padding: "16px 28px 24px" }}>
          <button type="button" onClick={onClose} className="mc-btn-secondary" disabled={submitting}>
            {closeLabel}
          </button>
          {!readOnly && (
            <button type="submit" className="mc-btn-primary" disabled={submitting}>
              {submitting ? "Validando direcciones..." : submitLabel}
            </button>
          )}
        </div>
      </form>

      {geocodeError && (
        <ModalErrorDireccion
          campo={geocodeError.campo}
          direccion={geocodeError.direccion}
          onClose={() => {
            const campo = geocodeError.campo === "Origen" ? "origin" : "destination";
            setGeocodeError(null);
            enfocarCampo(campo);
          }}
        />
      )}

      {geocodeServiceError && (
        <ModalErrorValidacionDireccion
          campo={geocodeServiceError.campo}
          onClose={() => {
            const campo = geocodeServiceError.campo === "Origen" ? "origin" : "destination";
            setGeocodeServiceError(null);
            enfocarCampo(campo);
          }}
        />
      )}
    </div>
  );
}
