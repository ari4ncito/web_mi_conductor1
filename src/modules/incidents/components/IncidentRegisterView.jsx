import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  obtenerCoordenadasDireccion,
  validarSintaxisDireccion,
  verificarDireccionTiempoReal,
} from "../../tracking/services/routing/geocodingService.js";
import { obtenerRuta } from "../../tracking/services/routing/routingService.js";
import cloudinaryService from "../../../services/cloudinaryService.js";

const DEFAULT_MAP_CENTER = [6.2442, -75.5812];

function MapAutoFit({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds || bounds.length === 0) return undefined;
    const t = setTimeout(() => {
      try {
        map.invalidateSize();
        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15, animate: false });
        } else {
          map.setView(bounds[0], 15, { animate: false });
        }
      } catch (err) {
        console.warn("No se pudo ajustar el mapa:", err);
      }
    }, 120);
    return () => clearTimeout(t);
  }, [map, bounds]);
  return null;
}

// ======================================================
// VALIDACIÓN EN TIEMPO REAL DE DIRECCIONES (idéntica a Registrar Solicitud)
// ======================================================
function useDireccionRealtimeValidation(direccion = "", { enabled = true } = {}) {
  const normalized = String(direccion || "").trim();
  const syncResult = validarSintaxisDireccion(normalized, { required: false });
  const shouldCheck = Boolean(enabled && normalized && syncResult.isValid);

  const [asyncState, setAsyncState] = useState({
    address: "",
    status: "idle", // "idle" | "checking" | "verified" | "invalid" | "provider_error"
    info: null,
    apiError: "",
  });

  useEffect(() => {
    if (!shouldCheck) {
      return undefined;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await verificarDireccionTiempoReal(normalized, {
          required: true,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (res.status === "verified" && res.verified) {
          setAsyncState({
            address: normalized,
            status: "verified",
            info: res,
            apiError: "",
          });
        } else if (res.status === "provider_error" || res.providerError) {
          setAsyncState({
            address: normalized,
            status: "provider_error",
            info: res,
            apiError: res.error || "Fallo temporal del proveedor de geocodificación.",
          });
        } else {
          setAsyncState({
            address: normalized,
            status: "invalid",
            info: null,
            apiError:
              res.error ||
              "No encontramos esa dirección en la malla vial. Verifica la vía y el número.",
          });
        }
      } catch (err) {
        if (controller.signal.aborted || err?.name === "AbortError") return;
        setAsyncState({
          address: normalized,
          status: "provider_error",
          info: null,
          apiError:
            "Fallo temporal de conexión con el proveedor de geocodificación.",
        });
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalized, shouldCheck]);

  const effectiveStatus = !shouldCheck
    ? "idle"
    : asyncState.address === normalized
      ? asyncState.status
      : "checking";
  const effectiveInfo =
    shouldCheck && asyncState.address === normalized ? asyncState.info : null;
  const effectiveApiError =
    shouldCheck && asyncState.address === normalized ? asyncState.apiError : "";

  return {
    status: effectiveStatus,
    syntaxValid: syncResult.syntaxValid,
    verified: effectiveStatus === "verified",
    providerError: effectiveStatus === "provider_error",
    isInvalid:
      (Boolean(normalized) && !syncResult.isValid) ||
      effectiveStatus === "invalid",
    error: syncResult.error || (effectiveStatus === "invalid" ? effectiveApiError : ""),
    providerErrorMessage:
      effectiveStatus === "provider_error" ? effectiveApiError : "",
    verifiedInfo: effectiveInfo,
  };
}

function AddressVerificationStatus({ validation }) {
  if (!validation) return null;

  const { status, verifiedInfo, providerErrorMessage } = validation;

  if (status === "checking") {
    return (
      <p className="mt-1 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
        <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Verificando dirección en tiempo real (ArcGIS + Nominatim)...</span>
      </p>
    );
  }

  if (status === "verified" && verifiedInfo) {
    const ciudad = verifiedInfo.ciudad || "Medellín";
    const barrioText = verifiedInfo.barrio ? ` · Barrio ${verifiedInfo.barrio}` : "";
    return (
      <p className="mt-1 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>
          Dirección verificada geográficamente en {ciudad}
          {barrioText}
        </span>
      </p>
    );
  }

  if (status === "provider_error") {
    return (
      <p className="mt-1 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          Sintaxis vial válida · {providerErrorMessage || "Fallo temporal del proveedor (no verificada geográficamente)"}
        </span>
      </p>
    );
  }

  return null;
}

// ======================================================
// ICONOS SVG INTEGRADOS (estilo Registrar Solicitud)
// ======================================================
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

function DriverIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

function UploadIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

// ======================================================
// CATÁLOGOS (tipos de novedad permitidos y prioridad por defecto)
// ======================================================
const TIPOS_NOVEDAD_MOBILE = [
  { value: "ACCIDENTE", label: "Accidente", prioridad: "ALTA" },
  { value: "FALLA_MECANICA", label: "Falla mecánica", prioridad: "ALTA" },
  { value: "TRAFICO_LEVE", label: "Tráfico leve", prioridad: "BAJA" },
  { value: "TRAFICO_PESADO", label: "Tráfico pesado", prioridad: "MEDIA" },
  { value: "GASOLINA_BAJA", label: "Gasolina baja", prioridad: "BAJA" },
  { value: "CAMBIO_RUTA", label: "Cambio de ruta", prioridad: "MEDIA" },
  { value: "OTRO", label: "Otro", prioridad: "MEDIA" },
];

const PRIORIDADES_OPTIONS = [
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
];

const MIN_MOTIVO_OTRO = 5;
const MAX_MOTIVO_OTRO = 20;
const MAX_FOTOS = 4;
const MAX_FOTO_BYTES = 5 * 1024 * 1024; // 5 MB

// ======================================================
// HELPERS DE SEGURIDAD Y FORMATO
// ======================================================
function normalizarTexto(texto) {
  return String(texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function contieneCodigo(texto) {
  if (!texto || typeof texto !== "string") return false;
  const str = texto.trim();
  if (/<\/?[a-z][\s\S]*>/i.test(str)) return true;
  if (/(javascript:|eval\(|alert\(|console\.|<script|<iframe|<img|<svg|onload=|onerror=|onclick=)/i.test(str)) return true;
  if (/(\bfunction\s*\(|\bconst\s+\w+\s*=|\blet\s+\w+\s*=|\bvar\s+\w+\s*=|\bimport\s+.*from|\bexport\s+|\bclass\s+\w+)/i.test(str)) return true;
  if (/(\bUNION\s+SELECT\b|\bDROP\s+TABLE\b|\bINSERT\s+INTO\b|\bDELETE\s+FROM\b|\bOR\s+1\s*=\s*1\b|--|;\s*DROP|\$where)/i.test(str)) return true;
  if (/[<>{}[\]$`\\]/.test(str)) return true;
  return false;
}

function contieneInyeccionCodigo(texto) {
  if (!texto || typeof texto !== "string") return false;
  const str = texto.trim();
  if (/<\s*\/?\s*[a-zA-Z][\s\S]*>/i.test(str)) return true;
  if (/(javascript\s*:|eval\s*\(|alert\s*\(|console\s*\.|<script|<iframe|<img|<svg|onload\s*=|onerror\s*=|onclick\s*=|onmouseover\s*=)/i.test(str)) return true;
  if (/(\bfunction\s*\(|\bconst\s+\w+\s*=|\blet\s+\w+\s*=|\bvar\s+\w+\s*=|\bimport\s+.*from|\bexport\s+|\bclass\s+\w+)/i.test(str)) return true;
  if (/(\bUNION\s+ALL\s+SELECT\b|\bUNION\s+SELECT\b|\bDROP\s+TABLE\b|\bINSERT\s+INTO\b|\bDELETE\s+FROM\b|;\s*DROP\b|;\s*DELETE\b|--|\$where)/i.test(str)) return true;
  return false;
}

function getConductorId(conductor) {
  if (!conductor) return "";
  if (typeof conductor === "string") return conductor;
  return String(conductor._id || conductor.id || "");
}

function getConductorNombre(conductor) {
  if (!conductor || typeof conductor === "string") return "";
  if (conductor.usuario) {
    const full = `${conductor.usuario.nombre || ""} ${conductor.usuario.apellido || ""}`.trim();
    if (full) return full;
    if (conductor.usuario.nombreCompleto) return String(conductor.usuario.nombreCompleto).trim();
  }
  const top = `${conductor.nombre || ""} ${conductor.apellido || ""}`.trim();
  if (top) return top;
  return String(conductor.nombreCompleto || "").trim();
}

function getConductorDocumento(conductor) {
  if (!conductor || typeof conductor === "string") return "";
  return conductor.documento || conductor.usuario?.documento || conductor.identificacion || "";
}

function getClienteNombreDeSolicitud(sol) {
  if (!sol) return "";
  const cli = sol.cliente;
  if (!cli || typeof cli === "string") return sol.nombreCliente || "";
  if (cli.usuario) {
    const full = `${cli.usuario.nombre || ""} ${cli.usuario.apellido || ""}`.trim();
    if (full) return full;
  }
  return `${cli.nombre || ""} ${cli.apellido || ""}`.trim() || cli.nombreCompleto || "";
}

function getSolicitudId(sol) {
  if (!sol) return "";
  return String(sol._id || sol.id || "");
}

function esSolicitudCancelada(sol) {
  const norm = normalizarTexto(sol?.estado);
  return norm === "cancelado" || norm === "cancelada";
}

function formatearEstadoSolicitud(estado) {
  const norm = normalizarTexto(estado).replace(/\s+/g, "_");
  if (norm === "en_proceso") return "En Proceso";
  if (norm === "completado" || norm === "completada") return "Completado";
  if (norm === "cancelado" || norm === "cancelada") return "Cancelado";
  return "Pendiente";
}

function construirMapaCodigosCortos(solicitudes = []) {
  const map = new Map();
  if (!Array.isArray(solicitudes) || solicitudes.length === 0) return map;
  const ordenadas = [...solicitudes].sort((a, b) => {
    const tA = new Date(a?.createdAt || 0).getTime();
    const tB = new Date(b?.createdAt || 0).getTime();
    return tA - tB;
  });
  ordenadas.forEach((sol, idx) => {
    const id = getSolicitudId(sol);
    if (id) {
      map.set(id, `SOL-${String(idx + 1).padStart(3, "0")}`);
    }
  });
  return map;
}

function getSolicitudCodigo(sol, shortCodeMap = null) {
  if (!sol) return "";
  const id = getSolicitudId(sol);
  if (shortCodeMap && id && shortCodeMap.has(id)) {
    return shortCodeMap.get(id);
  }
  return sol.codigo || `SOL-${String(sol._id || sol.id || "").slice(-6).toUpperCase()}`;
}

function resolverConductorDeSolicitud(sol, conductores = []) {
  if (!sol?.conductorAsignado) {
    return { id: "", nombre: "", documento: "" };
  }
  const raw = sol.conductorAsignado;
  const id = getConductorId(raw);
  let nombre = getConductorNombre(raw);
  let documento = getConductorDocumento(raw);

  if ((!nombre || !documento) && id && Array.isArray(conductores)) {
    const found = conductores.find((c) => getConductorId(c) === id);
    if (found) {
      nombre = nombre || getConductorNombre(found);
      documento = documento || getConductorDocumento(found);
    }
  }
  return { id, nombre, documento };
}

// ======================================================
// FORM FIELD (idéntico al estilo de Registrar Solicitud)
// ======================================================
function FormField({
  id,
  name,
  label,
  icon,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  options = null,
  error = "",
  readOnly = false,
  textarea = false,
  rows = 3,
  maxLength,
  required = false,
}) {
  const hasError = Boolean(error);

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
            onBlur={onBlur}
            aria-required={required}
            className={`w-full ${icon ? "pl-11" : "pl-4"} pr-9 py-3 rounded-xl border ${
              hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            } outline-none transition text-sm font-medium appearance-none cursor-pointer`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
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
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
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

// ======================================================
// BUSCADOR DE SOLICITUD ASOCIADA (idéntico al campo Cliente en Registrar Solicitud)
// ======================================================
function SolicitudSearchField({
  id = "inc-field-solicitud",
  label = "SOLICITUD ASOCIADA",
  value = "",
  solicitudes = [],
  conductores = [],
  onSelect,
  onBlur,
  error = "",
  required = true,
  placeholder = "Seleccionar solicitud",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);

  const shortCodeMap = useMemo(
    () => construirMapaCodigosCortos(solicitudes),
    [solicitudes]
  );

  const solicitudesActivas = useMemo(
    () => solicitudes.filter((s) => !esSolicitudCancelada(s)),
    [solicitudes]
  );

  const selected = solicitudesActivas.find((s) => getSolicitudId(s) === String(value));
  const resolvedLabel = selected ? getSolicitudCodigo(selected, shortCodeMap) : "";
  const inputValue = draftQuery !== null ? draftQuery : resolvedLabel;

  const searchWords = normalizarTexto(inputValue).split(/\s+/).filter(Boolean);
  const filtered = searchWords.length > 0
    ? solicitudesActivas.filter((s) => {
        const condInfo = resolverConductorDeSolicitud(s, conductores);
        const corpus = normalizarTexto(
          [
            getSolicitudCodigo(s, shortCodeMap),
            s.codigo,
            getClienteNombreDeSolicitud(s),
            condInfo.nombre,
            condInfo.documento,
            s.origen,
            s.destino,
            formatearEstadoSolicitud(s.estado),
          ]
            .filter(Boolean)
            .join(" ")
        );
        return searchWords.every((w) => corpus.includes(w));
      })
    : solicitudesActivas;

  const safeHighlight =
    filtered.length > 0 ? Math.min(highlightedIndex, filtered.length - 1) : 0;

  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setDraftQuery(null);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const handleChoose = (sol) => {
    const sId = getSolicitudId(sol);
    setDraftQuery(null);
    setIsOpen(false);
    setHighlightedIndex(0);
    onSelect(sId);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filtered.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length > 0) {
        setHighlightedIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
      }
    } else if (e.key === "Enter" && isOpen) {
      e.preventDefault();
      if (filtered.length > 0) {
        handleChoose(filtered[safeHighlight]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const hasError = Boolean(error);

  return (
    <div className="mb-4" ref={containerRef}>
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            hasError ? "text-red-500" : "text-slate-400"
          }`}
        >
          <DocumentIcon />
        </div>

        <input
          id={id}
          name="solicitud"
          type="text"
          value={inputValue}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            if (typeof onBlur === "function") onBlur();
          }}
          onChange={(e) => {
            const text = e.target.value;
            setDraftQuery(text);
            setIsOpen(true);
            setHighlightedIndex(0);
            if (!text.trim() || (value && normalizarTexto(text) !== normalizarTexto(resolvedLabel))) {
              onSelect("");
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-required={required}
          className={`w-full pl-11 pr-10 py-3 rounded-xl border ${
            hasError
              ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 bg-white text-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          } outline-none transition text-sm font-medium`}
        />

        {inputValue && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setDraftQuery("");
              setIsOpen(true);
              setHighlightedIndex(0);
              onSelect("");
            }}
            aria-label="Limpiar solicitud"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <CloseIcon />
          </button>
        )}

        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-500 text-center font-medium">
                {solicitudesActivas.length === 0
                  ? "No hay solicitudes activas disponibles para asociar."
                  : "No se encontraron solicitudes activas."}
              </div>
            ) : (
              filtered.map((sol, idx) => {
                const sId = getSolicitudId(sol);
                const sCode = getSolicitudCodigo(sol, shortCodeMap);
                const sEstado = formatearEstadoSolicitud(sol.estado);
                const cliName = getClienteNombreDeSolicitud(sol);
                const condInfo = resolverConductorDeSolicitud(sol, conductores);
                const isSelected = String(value) === sId;
                const isHighlighted = idx === safeHighlight;

                return (
                  <button
                    key={sId}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleChoose(sol)}
                    className={`w-full text-left px-4 py-2.5 transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/90 text-slate-900 border-l-4 border-l-orange-500"
                        : isHighlighted
                          ? "bg-slate-50 text-slate-900"
                          : "bg-white hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-900 shrink-0">
                          {sCode}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 shrink-0">
                          {sEstado}
                        </span>
                        {cliName && (
                          <span className="text-[11px] text-slate-600 font-medium truncate">
                            • {cliName}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        {condInfo.nombre
                          ? `Conductor: ${condInfo.nombre}`
                          : "Sin conductor asignado"}
                        {sol.origen ? ` · ${sol.origen}` : ""}
                      </span>
                    </div>
                    {isSelected && <CheckIcon className="w-4 h-4 text-orange-500 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
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

// ======================================================
// VISTA PRINCIPAL: REGISTRAR NUEVA NOVEDAD
// ======================================================
export default function IncidentRegisterView({
  solicitudes = [],
  conductores = [],
  currentUserId = "",
  saving = false,
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState({
    solicitud: "",
    tipo: "",
    severidad: "MEDIA",
    motivoOtro: "",
    ubicacion: "",
    nuevoDestino: "",
    descripcion: "",
  });

  const [photoItems, setPhotoItems] = useState([]); // [{ id, file, previewUrl }]
  const [photoError, setPhotoError] = useState("");
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [validatingGeo, setValidatingGeo] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewRutaInicial, setPreviewRutaInicial] = useState([]);
  const [previewRutaNueva, setPreviewRutaNueva] = useState([]);
  const [previewPuntos, setPreviewPuntos] = useState(null);
  const fileInputRef = useRef(null);

  const selectedSolicitud = useMemo(
    () => solicitudes.find((s) => getSolicitudId(s) === String(form.solicitud)) || null,
    [solicitudes, form.solicitud]
  );

  const conductorAsignado = useMemo(
    () => resolverConductorDeSolicitud(selectedSolicitud, conductores),
    [selectedSolicitud, conductores]
  );

  const clienteDeSolicitud = useMemo(
    () => getClienteNombreDeSolicitud(selectedSolicitud),
    [selectedSolicitud]
  );

  const esOtro = form.tipo === "OTRO";
  const esCambioRuta = form.tipo === "CAMBIO_RUTA";

  // Validación geográfica en tiempo real (idéntica a Registrar Solicitud)
  const ubicacionValidation = useDireccionRealtimeValidation(form.ubicacion, {
    enabled: true,
  });
  const nuevoDestinoValidation = useDireccionRealtimeValidation(form.nuevoDestino, {
    enabled: esCambioRuta,
  });

  // Cálculo de mapa en tiempo real: ruta del servicio + ubicación de la novedad (+ nueva ruta si es cambio de ruta)
  useEffect(() => {
    const origenSol = selectedSolicitud?.origen || "";
    const destinoSol = selectedSolicitud?.destino || "";
    const ubicacionCoords = ubicacionValidation.verifiedInfo?.coordenadas || null;
    const nuevoDestinoCoords = esCambioRuta
      ? nuevoDestinoValidation.verifiedInfo?.coordenadas || null
      : null;

    let activo = true;
    const controller = new AbortController();

    const calcularPreviewRutas = async () => {
      try {
        let origCoords = null;
        let destOrigCoords = null;
        let rutaOrigCoords = [];

        if (origenSol && destinoSol) {
          const [oGeo, dGeo] = await Promise.all([
            obtenerCoordenadasDireccion(origenSol, { signal: controller.signal }),
            obtenerCoordenadasDireccion(destinoSol, { signal: controller.signal }),
          ]);
          origCoords = oGeo?.coordenadas || null;
          destOrigCoords = dGeo?.coordenadas || null;
          if (origCoords && destOrigCoords) {
            const rutaOrig = await obtenerRuta(origCoords, destOrigCoords, {
              signal: controller.signal,
            });
            rutaOrigCoords = rutaOrig?.coordenadas || [];
          }
        }

        const inicioNuevaCoords = ubicacionCoords || origCoords;
        let rutaNuevaCoords = [];

        if (esCambioRuta && inicioNuevaCoords && nuevoDestinoCoords) {
          const rutaNueva = await obtenerRuta(inicioNuevaCoords, nuevoDestinoCoords, {
            signal: controller.signal,
          });
          rutaNuevaCoords = rutaNueva?.coordenadas || [];
        }

        if (!activo) return;
        setPreviewRutaInicial(rutaOrigCoords);
        setPreviewRutaNueva(rutaNuevaCoords);
        setPreviewPuntos({
          origen: origCoords ? [origCoords.lat, origCoords.lng] : null,
          destinoOriginal: destOrigCoords ? [destOrigCoords.lat, destOrigCoords.lng] : null,
          puntoIncidente: ubicacionCoords
            ? [ubicacionCoords.lat, ubicacionCoords.lng]
            : null,
          nuevoDestino: nuevoDestinoCoords
            ? [nuevoDestinoCoords.lat, nuevoDestinoCoords.lng]
            : null,
        });
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.warn("No se pudo previsualizar la ruta del servicio:", err);
        }
      }
    };

    void calcularPreviewRutas();

    return () => {
      activo = false;
      controller.abort();
    };
  }, [
    esCambioRuta,
    selectedSolicitud?.origen,
    selectedSolicitud?.destino,
    ubicacionValidation.verifiedInfo?.coordenadas,
    nuevoDestinoValidation.verifiedInfo?.coordenadas,
  ]);

  const previewMapBounds = useMemo(() => {
    const pts = [];
    if (previewRutaInicial.length > 0) pts.push(...previewRutaInicial);
    if (previewRutaNueva.length > 0) pts.push(...previewRutaNueva);
    if (previewPuntos?.origen) pts.push(previewPuntos.origen);
    if (previewPuntos?.destinoOriginal) pts.push(previewPuntos.destinoOriginal);
    if (previewPuntos?.puntoIncidente) pts.push(previewPuntos.puntoIncidente);
    if (previewPuntos?.nuevoDestino) pts.push(previewPuntos.nuevoDestino);
    return pts.length > 0 ? pts : [DEFAULT_MAP_CENTER];
  }, [previewRutaInicial, previewRutaNueva, previewPuntos]);

  // Limpiar object URLs al desmontar
  const photoItemsRef = useRef(photoItems);
  useEffect(() => {
    photoItemsRef.current = photoItems;
  }, [photoItems]);

  useEffect(() => {
    return () => {
      photoItemsRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const validarCampo = (field, value, nextForm = form) => {
    const trimmed = String(value ?? "").trim();

    if (field !== "descripcion" && contieneCodigo(String(value ?? ""))) {
      return "No se permite ingresar código en este campo.";
    }

    if (field === "solicitud") {
      if (!trimmed) return "Selecciona una solicitud asociada.";
      const solObj = solicitudes.find((s) => getSolicitudId(s) === trimmed);
      if (solObj && esSolicitudCancelada(solObj)) {
        return "No se puede registrar una novedad sobre una solicitud cancelada.";
      }
      return "";
    }

    if (field === "tipo") {
      return trimmed ? "" : "Selecciona un tipo de novedad.";
    }

    if (field === "motivoOtro") {
      if (nextForm.tipo === "OTRO") {
        if (!trimmed) return "Escribe el motivo de la novedad.";
        if (trimmed.length < MIN_MOTIVO_OTRO) {
          return `Ingresa al menos ${MIN_MOTIVO_OTRO} caracteres.`;
        }
        if (trimmed.length > MAX_MOTIVO_OTRO) {
          return `Máximo ${MAX_MOTIVO_OTRO} caracteres.`;
        }
        if (/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,-]/.test(trimmed)) {
          return "No se admiten caracteres especiales en este campo.";
        }
      }
      return "";
    }

    if (field === "ubicacion") {
      if (!trimmed) return "La dirección / ubicación es obligatoria.";
      const check = validarSintaxisDireccion(value, { required: true });
      if (!check.isValid) return check.error;
      return "";
    }

    if (field === "nuevoDestino") {
      if (nextForm.tipo === "CAMBIO_RUTA") {
        if (!trimmed) return "El nuevo destino es obligatorio para cambio de ruta.";
        const check = validarSintaxisDireccion(value, { required: true });
        if (!check.isValid) return check.error;
      }
      return "";
    }

    if (field === "descripcion") {
      if (!trimmed) return "La descripción del incidente es obligatoria.";
      if (contieneInyeccionCodigo(String(value ?? ""))) {
        return "No se permite ingresar código o scripts en la descripción.";
      }
      if (trimmed.length < 5) return "Ingresa al menos 5 caracteres.";
      if (trimmed.length > 1000) return "La descripción no puede superar los 1000 caracteres.";
      return "";
    }

    return "";
  };

  const handleSelectTipo = (tipoObj) => {
    const nextForm = {
      ...form,
      tipo: tipoObj.value,
      severidad: tipoObj.prioridad,
      motivoOtro: tipoObj.value === "OTRO" ? form.motivoOtro : "",
      nuevoDestino: tipoObj.value === "CAMBIO_RUTA" ? form.nuevoDestino : "",
    };
    setForm(nextForm);
    setErrors((prev) => ({
      ...prev,
      tipo: "",
      motivoOtro: "",
      nuevoDestino: "",
    }));
  };

  const handleFieldChange = (field) => (e) => {
    const rawValue = e.target.value;
    const value = field === "motivoOtro" ? rawValue.slice(0, MAX_MOTIVO_OTRO) : rawValue;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setErrors((prev) => ({
      ...prev,
      [field]: validarCampo(field, value, nextForm),
    }));
  };

  const handleFieldBlur = (field) => () => {
    setErrors((prev) => ({
      ...prev,
      [field]: validarCampo(field, form[field], form),
    }));
  };

  const handleSelectSolicitud = (solicitudId) => {
    const nextForm = { ...form, solicitud: solicitudId };
    setForm(nextForm);
    setErrors((prev) => ({
      ...prev,
      solicitud: validarCampo("solicitud", solicitudId, nextForm),
    }));
  };

  const handlePhotoFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setPhotoError("");
    const disponibles = MAX_FOTOS - photoItems.length;
    if (disponibles <= 0) {
      setPhotoError(`Solo puedes subir un máximo de ${MAX_FOTOS} fotos de evidencia.`);
      return;
    }

    const nuevos = [];
    for (const file of files.slice(0, disponibles)) {
      if (!file.type || !file.type.startsWith("image/")) {
        setPhotoError("Solo se permiten archivos de imagen (JPG, PNG, WEBP).");
        continue;
      }
      if (file.size > MAX_FOTO_BYTES) {
        setPhotoError("Cada imagen debe pesar máximo 5 MB.");
        continue;
      }
      nuevos.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (files.length > disponibles) {
      setPhotoError(`Se agregaron solo las primeras ${disponibles} imágenes (máximo ${MAX_FOTOS}).`);
    }

    if (nuevos.length > 0) {
      setPhotoItems((prev) => [...prev, ...nuevos]);
    }
  };

  const handleRemovePhoto = (id) => {
    setPhotoItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setPhotoError("");
  };

  const ubicacionErrorMessage =
    errors.ubicacion ||
    (ubicacionValidation.status === "invalid" ? ubicacionValidation.error : "");

  const nuevoDestinoErrorMessage =
    errors.nuevoDestino ||
    (esCambioRuta && nuevoDestinoValidation.status === "invalid"
      ? nuevoDestinoValidation.error
      : "");

  const isBusy = saving || uploadingPhotos || validatingGeo;

  const focusCampo = (campo) => {
    const fieldIds = {
      solicitud: "inc-field-solicitud",
      tipo: "inc-field-tipo",
      nuevoDestino: "inc-field-nuevoDestino",
      motivoOtro: "inc-field-motivoOtro",
      ubicacion: "inc-field-ubicacion",
      descripcion: "inc-field-descripcion",
    };
    const elementId = fieldIds[campo];
    if (!elementId) return;

    const applyFocus = (shouldScroll) => {
      const target = document.getElementById(elementId);
      if (!target) return;
      if (shouldScroll) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const focusable = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName)
        ? target
        : target.querySelector("input, textarea, select, button");
      if (focusable && typeof focusable.focus === "function") {
        focusable.focus({ preventScroll: true });
      }
    };

    requestAnimationFrame(() => applyFocus(true));
    setTimeout(() => applyFocus(false), 120);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBusy) return;

    const camposValidar = [
      "solicitud",
      "tipo",
      "nuevoDestino",
      "motivoOtro",
      "ubicacion",
      "descripcion",
    ];
    const nuevosErrores = {};
    camposValidar.forEach((campo) => {
      const msg = validarCampo(campo, form[campo], form);
      if (msg) nuevosErrores[campo] = msg;
    });

    if (!nuevosErrores.ubicacion && ubicacionValidation.status === "invalid") {
      nuevosErrores.ubicacion = ubicacionValidation.error;
    }
    if (esCambioRuta && !nuevosErrores.nuevoDestino && nuevoDestinoValidation.status === "invalid") {
      nuevosErrores.nuevoDestino = nuevoDestinoValidation.error;
    }

    setErrors(nuevosErrores);
    const primerCampoConError = camposValidar.find((campo) => Boolean(nuevosErrores[campo]));
    if (primerCampoConError) {
      focusCampo(primerCampoConError);
      return;
    }

    // 1. Validar geocodificación de dirección de ubicación (y nuevo destino si aplica)
    setValidatingGeo(true);
    let ubicacionGeo;
    try {
      ubicacionGeo = await obtenerCoordenadasDireccion(form.ubicacion.trim());
    } catch (geoErr) {
      setErrors((prev) => ({
        ...prev,
        ubicacion:
          geoErr?.message ||
          "No se encontró la dirección ingresada. Verifícala antes de registrar.",
      }));
      setValidatingGeo(false);
      focusCampo("ubicacion");
      return;
    }

    let nuevoDestinoGeo = null;
    if (esCambioRuta) {
      try {
        nuevoDestinoGeo = await obtenerCoordenadasDireccion(form.nuevoDestino.trim());
      } catch (geoErr) {
        setErrors((prev) => ({
          ...prev,
          nuevoDestino:
            geoErr?.message ||
            "No se encontró la dirección del nuevo destino. Verifícala antes de registrar.",
        }));
        setValidatingGeo(false);
        focusCampo("nuevoDestino");
        return;
      }
    }
    setValidatingGeo(false);

    // 2. Subir fotos seleccionadas a Cloudinary
    let urlsEvidencia = [];
    if (photoItems.length > 0) {
      try {
        setUploadingPhotos(true);
        setPhotoError("");
        const results = await cloudinaryService.uploadMultipleImages(
          photoItems.map((item) => item.file),
          { folder: "novedades" }
        );
        urlsEvidencia = results.map((r) => r.secure_url).filter(Boolean);
      } catch (uploadErr) {
        setPhotoError(
          uploadErr?.message || "No se pudieron subir las fotos de evidencia. Inténtalo nuevamente."
        );
        setUploadingPhotos(false);
        return;
      } finally {
        setUploadingPhotos(false);
      }
    }

    // 3. Construir payload compatible con POST /api/novedades
    const tipoMeta = TIPOS_NOVEDAD_MOBILE.find((t) => t.value === form.tipo);
    const tituloGenerado = esOtro
      ? `Novedad: ${form.motivoOtro.trim()}`
      : `Novedad: ${tipoMeta?.label || form.tipo}`;

    const payload = {
      tipo: form.tipo,
      severidad: form.severidad,
      titulo: tituloGenerado,
      descripcion: form.descripcion.trim(),
      estadoNovedad: "POR_REVISAR",
      solicitud: form.solicitud,
      ubicacion: {
        lat: ubicacionGeo?.coordenadas?.lat ?? null,
        lng: ubicacionGeo?.coordenadas?.lng ?? null,
        direccion: form.ubicacion.trim(),
      },
      fotosEvidencia: urlsEvidencia,
      evidenciaUrl: urlsEvidencia[0] || null,
    };

    if (currentUserId) {
      payload.usuarioRegistro = currentUserId;
    }
    if (conductorAsignado.id) {
      payload.conductor = conductorAsignado.id;
    }
    if (esOtro && form.motivoOtro.trim()) {
      payload.motivoOtro = form.motivoOtro.trim();
    }
    if (selectedSolicitud) {
      payload.rutaInicial = {
        origen: selectedSolicitud.origen || "Punto de partida",
        destino: selectedSolicitud.destino || "Destino programado",
        coordenadas: previewRutaInicial,
      };
    }
    if (esCambioRuta && form.nuevoDestino.trim()) {
      payload.nuevoDestino = form.nuevoDestino.trim();
      payload.rutaNueva = {
        origen: form.ubicacion.trim() || selectedSolicitud?.origen || "Ubicación actual",
        destino: form.nuevoDestino.trim(),
        coordenadas:
          previewRutaNueva.length > 1
            ? previewRutaNueva
            : nuevoDestinoGeo?.coordenadas
              ? [[nuevoDestinoGeo.coordenadas.lat, nuevoDestinoGeo.coordenadas.lng]]
              : [],
      };
    }

    await onSubmit(payload);
  };

  return (
    <div className="p-6 md:p-8 mx-auto">
      {/* Top Header & Breadcrumb (idéntico a Registrar Nueva Solicitud) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Módulo de Novedades
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                Nuevo Registro
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Registrar Nueva Novedad
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa los datos del incidente o novedad ocurrida durante el servicio.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Card 1: Datos del Servicio y Conductor (Conductor solo lectura) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-base font-bold text-slate-800">Datos del Servicio</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 ml-3.5">
              Busca la solicitud para cargar automáticamente su conductor, cliente y ruta
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <SolicitudSearchField
                id="inc-field-solicitud"
                label="SOLICITUD ASOCIADA"
                value={form.solicitud}
                solicitudes={solicitudes}
                conductores={conductores}
                onSelect={handleSelectSolicitud}
                onBlur={handleFieldBlur("solicitud")}
                error={errors.solicitud}
                required
                placeholder="Seleccionar solicitud"
              />

              <FormField
                id="inc-field-conductor"
                name="conductor"
                label="CONDUCTOR"
                value={
                  selectedSolicitud
                    ? conductorAsignado.nombre || "Sin conductor asignado"
                    : ""
                }
                placeholder="—"
                icon={<DriverIcon />}
                readOnly
              />

              <FormField
                id="inc-field-cliente"
                name="cliente"
                label="CLIENTE"
                value={selectedSolicitud ? clienteDeSolicitud || "—" : ""}
                placeholder="—"
                icon={<DriverIcon />}
                readOnly
              />

              <FormField
                id="inc-field-sol-origen"
                name="solOrigen"
                label="ORIGEN DEL SERVICIO"
                value={selectedSolicitud?.origen || ""}
                placeholder="—"
                icon={<MapPinIcon />}
                readOnly
              />

              <div className="md:col-span-2">
                <FormField
                  id="inc-field-sol-destino"
                  name="solDestino"
                  label="DESTINO DEL SERVICIO"
                  value={selectedSolicitud?.destino || ""}
                  placeholder="—"
                  icon={<NavigationIcon />}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Card 2: Tipo de Novedad (7 botones seleccionables) y Prioridad editable */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-base font-bold text-slate-800">Tipo de Novedad</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5 ml-3.5">
              Selecciona el tipo de incidente ocurrido durante el servicio
            </p>

            <div id="inc-field-tipo" className="mb-4">
              <div className="flex flex-wrap gap-2">
                {TIPOS_NOVEDAD_MOBILE.map((item) => {
                  const isSelected = form.tipo === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleSelectTipo(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? "bg-[#ff9a2f] text-white border-[#ff9a2f] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {errors.tipo && (
                <p className="text-xs text-red-500 mt-2 ml-1 font-semibold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.tipo}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-1">
              {esCambioRuta && (
                <div className="mb-3">
                  <FormField
                    id="inc-field-nuevoDestino"
                    name="nuevoDestino"
                    label="NUEVA RUTA / NUEVO DESTINO"
                    value={form.nuevoDestino}
                    onChange={handleFieldChange("nuevoDestino")}
                    onBlur={handleFieldBlur("nuevoDestino")}
                    placeholder="Ej: Cra 70 # 44B-12, Medellín"
                    error={nuevoDestinoErrorMessage}
                    icon={<NavigationIcon />}
                    required
                  />
                  {!nuevoDestinoErrorMessage && (
                    <AddressVerificationStatus validation={nuevoDestinoValidation} />
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {esOtro && (
                  <div>
                    <FormField
                      id="inc-field-motivoOtro"
                      name="motivoOtro"
                      label={`OTRO MOTIVO (${form.motivoOtro.length}/${MAX_MOTIVO_OTRO})`}
                      value={form.motivoOtro}
                      onChange={handleFieldChange("motivoOtro")}
                      onBlur={handleFieldBlur("motivoOtro")}
                      placeholder="Ej: Llanta pinchada"
                      maxLength={MAX_MOTIVO_OTRO}
                      error={errors.motivoOtro}
                      icon={<AlertTriangleIcon />}
                      required
                    />
                  </div>
                )}

                <div className={esOtro ? "" : "md:col-span-2"}>
                  <FormField
                    id="inc-field-severidad"
                    name="severidad"
                    label="PRIORIDAD"
                    options={PRIORIDADES_OPTIONS}
                    value={form.severidad}
                    onChange={handleFieldChange("severidad")}
                    icon={<FlagIcon />}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Ubicación, Mapa de Ruta del Servicio, Descripción y Evidencia */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-base font-bold text-slate-800">Ubicación, Detalles y Evidencia</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 ml-3.5">
              Dirección validada en tiempo real, ruta del servicio en el mapa, descripción del incidente y fotos de evidencia
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div>
                <FormField
                  id="inc-field-ubicacion"
                  name="ubicacion"
                  label="DIRECCIÓN / UBICACIÓN"
                  value={form.ubicacion}
                  onChange={handleFieldChange("ubicacion")}
                  onBlur={handleFieldBlur("ubicacion")}
                  placeholder="Ej: Calle 10 # 43A-30, Medellín"
                  error={ubicacionErrorMessage}
                  icon={<MapPinIcon />}
                  required
                />
                {!ubicacionErrorMessage && (
                  <AddressVerificationStatus validation={ubicacionValidation} />
                )}
              </div>

              <div>
                <FormField
                  id="inc-field-descripcion"
                  name="descripcion"
                  label="DESCRIPCIÓN DEL INCIDENTE"
                  textarea
                  rows={3}
                  maxLength={1000}
                  value={form.descripcion}
                  onChange={handleFieldChange("descripcion")}
                  onBlur={handleFieldBlur("descripcion")}
                  placeholder="Describe detalladamente lo ocurrido durante el servicio..."
                  error={errors.descripcion}
                  icon={<DocumentIcon />}
                  required
                />
              </div>

              <div className="md:col-span-2 my-3">
                <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
                  <MapContainer
                    center={DEFAULT_MAP_CENTER}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapAutoFit bounds={previewMapBounds} />

                    {previewRutaInicial.length > 1 && (
                      <Polyline
                        positions={previewRutaInicial}
                        pathOptions={{ color: "#9524DB", weight: 5, opacity: 0.85 }}
                      />
                    )}

                    {esCambioRuta && previewRutaNueva.length > 1 && (
                      <Polyline
                        positions={previewRutaNueva}
                        pathOptions={{
                          color: "#f97316",
                          weight: 5,
                          opacity: 0.95,
                          dashArray: "8, 8",
                        }}
                      />
                    )}

                    {previewPuntos?.origen && (
                      <CircleMarker
                        center={previewPuntos.origen}
                        radius={7}
                        pathOptions={{ color: "#fff", weight: 2, fillColor: "#9524DB", fillOpacity: 1 }}
                      >
                        <Popup>Origen: {selectedSolicitud?.origen}</Popup>
                      </CircleMarker>
                    )}

                    {previewPuntos?.destinoOriginal && (
                      <CircleMarker
                        center={previewPuntos.destinoOriginal}
                        radius={7}
                        pathOptions={{ color: "#fff", weight: 2, fillColor: "#9524DB", fillOpacity: 1 }}
                      >
                        <Popup>Destino: {selectedSolicitud?.destino}</Popup>
                      </CircleMarker>
                    )}

                    {previewPuntos?.puntoIncidente && (
                      <CircleMarker
                        center={previewPuntos.puntoIncidente}
                        radius={8}
                        pathOptions={{ color: "#fff", weight: 2, fillColor: "#dc2626", fillOpacity: 1 }}
                      >
                        <Popup>Ubicación novedad: {form.ubicacion}</Popup>
                      </CircleMarker>
                    )}

                    {esCambioRuta && previewPuntos?.nuevoDestino && (
                      <CircleMarker
                        center={previewPuntos.nuevoDestino}
                        radius={8}
                        pathOptions={{ color: "#fff", weight: 2, fillColor: "#ea580c", fillOpacity: 1 }}
                      >
                        <Popup>Nuevo destino: {form.nuevoDestino}</Popup>
                      </CircleMarker>
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Carga de Fotos de Evidencia (subida de archivos, no URL) */}
            <div className="mt-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                FOTOS DE EVIDENCIA (OPCIONAL · MÁX. {MAX_FOTOS} IMÁGENES)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoFilesChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoItems.length >= MAX_FOTOS || isBusy}
                className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 transition flex flex-col items-center justify-center gap-1.5 text-slate-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadIcon className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Haz clic para subir fotos de evidencia
                </span>
                <span className="text-xs text-slate-400">
                  JPG, PNG o WEBP (máximo 5 MB por imagen · {photoItems.length}/{MAX_FOTOS})
                </span>
              </button>

              {photoError && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-semibold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {photoError}
                </p>
              )}

              {photoItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {photoItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                    >
                      <img
                        src={item.previewUrl}
                        alt={`Evidencia ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(item.id)}
                        disabled={isBusy}
                        aria-label={`Quitar foto ${idx + 1}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/75 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions Bar (idéntica a Registrar Nueva Solicitud) */}
        <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="px-6 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className={`px-8 h-12 rounded-xl border-0 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
              isBusy
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#ff9a2f] hover:bg-[#f08c23] shadow-[0_4px_14px_rgba(255,154,47,0.35)]"
            }`}
          >
            {isBusy ? (
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <CheckIcon className="w-5 h-5" />
            )}
            {validatingGeo
              ? "Validando dirección..."
              : uploadingPhotos
                ? "Subiendo fotos..."
                : saving
                  ? "Registrando..."
                  : "Registrar Novedad"}
          </button>
        </div>
      </form>
    </div>
  );
}
