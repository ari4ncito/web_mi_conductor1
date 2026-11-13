import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerCoordenadasDireccion } from "../../tracking/services/routing/geocodingService";
import { obtenerRuta } from "../../tracking/services/routing/routingService";

// ======================================================
// ICONOS SVG INTEGRADOS
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

function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IdIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function EyeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" strokeWidth="1.7" />
    </svg>
  );
}

// Auto-ajustar vista del mapa a los límites
function MapAutoBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: false });
        } catch (e) {
          console.warn("No se pudo ajustar bounds del mapa:", e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [map, bounds]);
  return null;
}

// Asegurar renderizado correcto e inmediato de tiles al montar
function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Validación de coordenadas válidas en Colombia
function esCoordenadaValida(lat, lng) {
  const nLat = Number(lat);
  const nLng = Number(lng);
  if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) return false;
  if (Math.abs(nLat) < 0.1 && Math.abs(nLng) < 0.1) return false;
  if (nLat < 1 || nLat > 13.5 || nLng < -80 || nLng > -66) return false;
  return true;
}

// Trazado de ruta real en Medellín (desde El Poblado hasta Bello pasando por el centro)
const RUTA_MEDELLIN_INICIAL = [
  [6.2086, -75.5676], // El Poblado
  [6.2165, -75.5724], // Av. El Poblado
  [6.2245, -75.5768], // Ciudad del Río
  [6.2315, -75.5785], // Punto del incidente
  [6.2392, -75.5802], // Plaza Mayor
  [6.2442, -75.5812], // La Candelaria / Centro
  [6.2486, -75.5905], // Laureles / Estadio
  [6.2750, -75.5680], // Aranjuez
  [6.3350, -75.5580], // Bello
];

const RUTA_MEDELLIN_NUEVA = [
  [6.2315, -75.5785], // Desvío en el incidente
  [6.2345, -75.5860], // Av. Guayabal
  [6.2410, -75.5940], // Laureles
  [6.2486, -75.5905], // Destino modificado
];

const DEFAULT_CENTER = [6.2442, -75.5812];

// Componente para campos estandarizados idénticos a Solicitud
function DetailField({ id, label, value, icon, badge = null, fullWidth = false }) {
  return (
    <div className={`mb-4 ${fullWidth ? "col-span-1 md:col-span-2" : ""}`}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <div
          id={id}
          className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 min-h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-slate-800 text-sm font-semibold select-all`}
        >
          {badge ? badge : (value || "—")}
        </div>

        {label && (
          <span className="absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function IncidentDetailMainView({
  incident,
  onBack,
  onChangeStatus,
  saving = false,
}) {
  const { hasPermission } = useAuth();
  const canEditIncident = hasPermission("editar.novedades");
  const [adminNotes, setAdminNotes] = useState("");
  const [errorNotes, setErrorNotes] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [rutaCalculada, setRutaCalculada] = useState(null);
  const [puntosRuta, setPuntosRuta] = useState(null);

  const origenServicio =
    incident?.solicitud?.origen ||
    incident?.rutaInicial?.origen ||
    "";
  const destinoServicio =
    incident?.solicitud?.destino ||
    incident?.rutaInicial?.destino ||
    "";

  // Calcular ruta del servicio conectada directamente con Solicitud
  useEffect(() => {
    let activo = true;

    if (!origenServicio || !destinoServicio) return;

    const cargarRutaServicio = async () => {
      try {
        const [origGeo, destGeo] = await Promise.all([
          obtenerCoordenadasDireccion(origenServicio),
          obtenerCoordenadasDireccion(destinoServicio),
        ]);

        const ruta = await obtenerRuta(
          origGeo.coordenadas,
          destGeo.coordenadas
        );

        if (activo && ruta?.coordenadas?.length > 1) {
          setRutaCalculada(ruta.coordenadas);
          setPuntosRuta({
            origen: [origGeo.coordenadas.lat, origGeo.coordenadas.lng],
            destino: [destGeo.coordenadas.lat, destGeo.coordenadas.lng],
            origenLabel: origGeo.direccion || origenServicio,
            destinoLabel: destGeo.direccion || destinoServicio,
          });
        }
      } catch (err) {
        console.warn("No se pudo calcular la ruta con OSRM para la novedad:", err);
      }
    };

    void cargarRutaServicio();

    return () => {
      activo = false;
    };
  }, [origenServicio, destinoServicio]);

  // Estados: Solo "Por revisar" y "Revisado"
  const estadoActual = incident?.estado || "Por revisar";
  const esRevisado =
    estadoActual.toLowerCase().includes("revisado") &&
    !estadoActual.toLowerCase().includes("por");
  const esPorRevisar = !esRevisado;

  // Prioridad: "Alta", "Media" o "Baja"
  const prioridadBadge = useMemo(() => {
    const prio = incident?.prioridad || "Media";
    const styles = {
      Alta: "bg-red-50 text-red-600 border-red-200",
      Crítica: "bg-red-50 text-red-600 border-red-200",
      Media: "bg-amber-50 text-amber-700 border-amber-200",
      Baja: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const currentStyle = styles[prio] || styles.Media;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${currentStyle}`}>
        {prio}
      </span>
    );
  }, [incident?.prioridad]);

  // Badge Estado: Rojo ("Por revisar") o Verde ("Revisado")
  const estadoBadge = useMemo(() => {
    if (esRevisado) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
          Revisado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
        <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
        Por revisar
      </span>
    );
  }, [esRevisado]);

  // Validación de tipo de cambio de ruta
  const esCambioDeRuta =
    incident?.tipoOriginal === "CAMBIO_RUTA" ||
    (incident?.tipo && incident.tipo.toLowerCase().includes("cambio de ruta"));

  // Punto exacto donde fue la novedad reportado por GPS
  const latNum = Number(incident?.ubicacion?.lat);
  const lngNum = Number(incident?.ubicacion?.lng);
  const puntoIncidente = esCoordenadaValida(latNum, lngNum)
    ? [latNum, lngNum]
    : [6.2315, -75.5785];

  // Ruta del servicio conectada (calculada u original)
  const rutaFinalCoordenadas =
    rutaCalculada && rutaCalculada.length > 1
      ? rutaCalculada
      : Array.isArray(incident?.rutaInicial?.coordenadas) &&
        incident.rutaInicial.coordenadas.length > 1
      ? incident.rutaInicial.coordenadas
      : RUTA_MEDELLIN_INICIAL;

  // Ruta nueva si es cambio de ruta
  const rutaNuevaCoordenadas = !esCambioDeRuta
    ? []
    : Array.isArray(incident?.rutaNueva?.coordenadas) &&
      incident.rutaNueva.coordenadas.length > 1
    ? incident.rutaNueva.coordenadas
    : RUTA_MEDELLIN_NUEVA;

  // Puntos para bounds
  const mapPoints = [...rutaFinalCoordenadas, puntoIncidente];
  if (puntosRuta?.origen) mapPoints.push(puntosRuta.origen);
  if (puntosRuta?.destino) mapPoints.push(puntosRuta.destino);
  if (esCambioDeRuta && rutaNuevaCoordenadas.length > 0) {
    mapPoints.push(...rutaNuevaCoordenadas);
  }
  const mapBounds = mapPoints.length > 0 ? mapPoints : [DEFAULT_CENTER];

  // Acción: Marcar como Revisado (exige nota obligatoria)
  const handleMarcarRevisado = async () => {
    const notas = adminNotes.trim();
    if (!notas || notas.length < 5) {
      setErrorNotes("Debes ingresar la descripción de la solución de la novedad (mínimo 5 caracteres).");
      return;
    }

    setErrorNotes("");
    try {
      await onChangeStatus("REVISADO", notas);
      setAdminNotes("");
    } catch (err) {
      setErrorNotes(err?.message || "No se pudo actualizar la novedad a Revisado.");
    }
  };

  const centerPoint = puntoIncidente || DEFAULT_CENTER;

  return (
    <div className="w-full p-3 sm:p-4 lg:p-5 animate-fade-in" style={{ boxSizing: "border-box" }}>
      {/* ── Top Header & Breadcrumb (Compacto) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
            title="Volver atrás"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Módulo de Novedades
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {incident?.codigo || incident?.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-0.5">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Detalle de la Novedad
              </h1>
              {estadoBadge}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Información de la novedad en modo de solo lectura.
            </p>
          </div>
        </div>
      </div>

      {/* ── Grid Principal que se adapta a todo el Main (como en Solicitud) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── CARD 1: Datos del Conductor ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <h2 className="text-base font-bold text-slate-800">Datos del Conductor</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-3.5">
            Información de identificación y contacto del conductor asignado
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <DetailField
              id="nov-conductor-documento"
              label="DOCUMENTO"
              value={incident?.conductorDocumento || "—"}
              icon={<IdIcon />}
            />
            <DetailField
              id="nov-conductor-nombre"
              label="NOMBRE DEL CONDUCTOR"
              value={incident?.conductor || "Sin conductor asignado"}
              icon={<UserIcon />}
            />
            <DetailField
              id="nov-conductor-telefono"
              label="TELÉFONO"
              value={incident?.conductorTelefono || "—"}
              icon={<PhoneIcon />}
            />
            <DetailField
              id="nov-conductor-correo"
              label="CORREO"
              value={incident?.conductorCorreo || "—"}
              icon={<MailIcon />}
            />
          </div>
        </div>

        {/* ── CARD 2: Datos del Cliente ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <h2 className="text-base font-bold text-slate-800">Datos del Cliente</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-3.5">
            Información del cliente y servicio de transporte asociado
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <DetailField
              id="nov-cliente-documento"
              label="DOCUMENTO"
              value={incident?.clienteDocumento || "—"}
              icon={<IdIcon />}
            />
            <DetailField
              id="nov-cliente-nombre"
              label="NOMBRE DEL CLIENTE"
              value={incident?.clienteNombre || "Cliente asignado"}
              icon={<UserIcon />}
            />
            <DetailField
              id="nov-cliente-telefono"
              label="TELÉFONO"
              value={incident?.clienteTelefono || "—"}
              icon={<PhoneIcon />}
            />
            <DetailField
              id="nov-cliente-correo"
              label="CORREO DEL CLIENTE"
              value={incident?.clienteCorreo || "—"}
              icon={<MailIcon />}
            />
          </div>
        </div>

        {/* ── CARD 3: Datos de la Novedad (Span completo de 2 columnas) ── */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <h2 className="text-base font-bold text-slate-800">Datos de la Novedad</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-3.5">
            Tipo de incidente, prioridad y especificaciones del reporte
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4">
            <DetailField
              id="nov-data-codigo"
              label="CÓDIGO"
              value={incident?.codigo || incident?.id}
            />
            <DetailField
              id="nov-data-tipo"
              label="TIPO DE NOVEDAD"
              value={incident?.tipo}
              icon={<AlertTriangleIcon />}
            />
            <DetailField
              id="nov-data-prioridad"
              label="PRIORIDAD"
              badge={prioridadBadge}
            />
            <DetailField
              id="nov-data-estado"
              label="ESTADO"
              badge={estadoBadge}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <DetailField
              id="nov-data-fechahora"
              label="FECHA Y HORA"
              value={`${incident?.fecha || incident?.fechaInicialDate || "—"} • ${incident?.hora || incident?.fechaInicialTime || "—"}`}
              icon={<CalendarIcon />}
            />
            <DetailField
              id="nov-data-ubicacion"
              label="DIRECCIÓN / UBICACIÓN REGISTRADA"
              value={incident?.ubicacionTexto || incident?.ubicacion?.direccion || "Medellín, Antioquia"}
              icon={<MapPinIcon />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <DetailField
              id="nov-data-origen"
              label="ORIGEN DEL SERVICIO"
              value={origenServicio || "—"}
              icon={<MapPinIcon />}
            />
            <DetailField
              id="nov-data-destino"
              label="DESTINO DEL SERVICIO"
              value={destinoServicio || "—"}
              icon={<MapPinIcon />}
            />
          </div>

          <div className="mt-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              DESCRIPCIÓN DEL INCIDENTE
            </label>
            <div className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium leading-relaxed select-all">
              {incident?.descripcion || "Sin descripción adicional."}
            </div>
          </div>
        </div>

        {/* ── CARD 4: Ruta (Izquierda - Mapa Cuadrado estilo Trazabilidad) ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <h2 className="text-base font-bold text-slate-800">Ruta</h2>
          </div>

          {/* Mapa Cuadrado para visualización completa del valle y ruta */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex-1 min-h-90 z-0">
            <MapContainer
              center={centerPoint}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapInvalidateSize />
              <MapAutoBounds bounds={mapBounds} />

              {/* Ruta inicial en púrpura idéntica a Trazabilidad (#9524DB) */}
              {rutaFinalCoordenadas.length > 1 && (
                <>
                  <Polyline
                    positions={rutaFinalCoordenadas}
                    pathOptions={{ color: "#9524DB", weight: 5, opacity: 0.9, lineCap: "round" }}
                  />

                  {/* Punto de Inicio estilo Trazabilidad (Círculo morado con borde blanco) */}
                  <CircleMarker
                    center={puntosRuta?.origen || rutaFinalCoordenadas[0]}
                    radius={8}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 3,
                      fillColor: "#9524DB",
                      fillOpacity: 1,
                    }}
                  >
                    <Popup>
                      <div className="text-xs font-semibold p-1">
                        {puntosRuta?.origenLabel || origenServicio || "Origen del servicio"}
                      </div>
                    </Popup>
                  </CircleMarker>

                  {/* Punto de Destino estilo Trazabilidad (Círculo morado con borde blanco) */}
                  <CircleMarker
                    center={puntosRuta?.destino || rutaFinalCoordenadas[rutaFinalCoordenadas.length - 1]}
                    radius={8}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 3,
                      fillColor: "#9524DB",
                      fillOpacity: 1,
                    }}
                  >
                    <Popup>
                      <div className="text-xs font-semibold p-1">
                        {puntosRuta?.destinoLabel || destinoServicio || "Destino del servicio"}
                      </div>
                    </Popup>
                  </CircleMarker>
                </>
              )}

              {/* Trazado de nueva ruta únicamente si la novedad es "Cambio de ruta" */}
              {esCambioDeRuta && rutaNuevaCoordenadas.length > 1 && (
                <>
                  <Polyline
                    positions={rutaNuevaCoordenadas}
                    pathOptions={{ color: "#f97316", weight: 5, opacity: 0.9, dashArray: "8, 8", lineCap: "round" }}
                  />
                  <CircleMarker
                    center={rutaNuevaCoordenadas[rutaNuevaCoordenadas.length - 1]}
                    radius={8}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 3,
                      fillColor: "#ea580c",
                      fillOpacity: 1,
                    }}
                  >
                    <Popup>
                      <div className="text-xs font-semibold p-1">
                        {incident?.rutaNueva?.destino || "Destino modificado"}
                      </div>
                    </Popup>
                  </CircleMarker>
                </>
              )}

              {/* ÚNICO PUNTO ROJO: donde fue la novedad marcado con GPS */}
              <CircleMarker
                center={puntoIncidente}
                radius={9}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,
                  fillColor: "#dc2626",
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="p-1 min-w-40 text-xs">
                    <span className="text-[10px] font-bold uppercase text-red-600 block">Punto de la Novedad</span>
                    <strong className="text-sm font-bold text-slate-900 block mt-0.5">{incident?.codigo || incident?.id}</strong>
                    <span className="text-xs text-slate-600 block mt-0.5"><strong>Tipo:</strong> {incident?.tipo}</span>
                    <span className="text-xs text-slate-600 block"><strong>Conductor:</strong> {incident?.conductor}</span>
                    <span className="text-xs text-slate-500 block mt-0.5"><strong>Hora:</strong> {incident?.hora || incident?.fechaInicialTime || ""}</span>
                  </div>
                </Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Fotos de Evidencia + Descripción de la solución ── */}
        <div className="space-y-6 flex flex-col justify-between">

          {/* CARD FOTOS DE EVIDENCIA */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-base font-bold text-slate-800">Fotos de Evidencia</h2>
            </div>

            {incident?.evidencias?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {incident.evidencias.map((fotoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setModalImage(fotoUrl)}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition"
                  >
                    <img
                      src={fotoUrl}
                      alt={`Evidencia ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <EyeIcon className="w-5 h-5" />
                    </div>
                    <div className="absolute bottom-1 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Foto {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                No se adjuntaron fotos de evidencia para esta novedad.
              </div>
            )}
          </div>

          {/* CARD DESCRIPCIÓN DE LA SOLUCIÓN DE LA NOVEDAD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-base font-bold text-slate-800">Descripción de la solución de la novedad.</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5 ml-3.5">
              Registro de la solución aplicada y observaciones del administrador para la novedad.
            </p>

            {/* Historial de Notas previas */}
            {incident?.historialNotas?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Historial de Soluciones Registradas ({incident.historialNotas.length})
                </h3>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {incident.historialNotas.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {item.autor || "Administrador"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.fecha ? new Date(item.fecha).toLocaleString("es-CO") : "—"}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                        {item.nota}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Si ya está Revisado y tiene solución registrada */}
            {esRevisado && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex-1">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1 text-emerald-900">
                  <CheckIcon className="w-4 h-4 text-emerald-700" />
                  Solución Registrada de la Novedad
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 whitespace-pre-wrap">
                  {incident?.notasResolucion ||
                    incident?.observaciones ||
                    (incident?.historialNotas && incident.historialNotas.length > 0
                      ? incident.historialNotas[incident.historialNotas.length - 1]?.nota
                      : "") ||
                    "Novedad revisada y validada por el administrador."}
                </p>
                {incident?.fechaCierre && (
                  <p className="text-[11px] text-emerald-700 mt-2 font-semibold">
                    Revisada el: {new Date(incident.fechaCierre).toLocaleString("es-CO")}
                  </p>
                )}
              </div>
            )}

            {/* Campo para ingresar solución si está Por revisar */}
            {esPorRevisar && canEditIncident && (
              <div className="flex-1 flex flex-col justify-end">
                <label htmlFor="admin-incident-notes" className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  NOTAS DEL ADMINISTRADOR *
                </label>
                <textarea
                  id="admin-incident-notes"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => {
                    setAdminNotes(e.target.value);
                    setErrorNotes("");
                  }}
                  disabled={saving}
                  placeholder="Descripción de la solución de la novedad."
                  className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-slate-800 outline-none transition resize-y font-medium ${
                    errorNotes
                      ? "border-red-500 bg-red-50/40 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }`}
                />
                {errorNotes && (
                  <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                    <AlertTriangleIcon className="w-3.5 h-3.5 shrink-0" />
                    {errorNotes}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── Sticky Bottom Actions Bar (Botón Volver atras y Revisado) ── */}
      <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex flex-wrap items-center justify-between gap-4 z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
        >
          Volver atras
        </button>

        <div className="flex items-center gap-3">
          {esPorRevisar ? (
            canEditIncident ? (
              <button
                type="button"
                onClick={handleMarcarRevisado}
                disabled={!adminNotes.trim() || adminNotes.trim().length < 5 || saving}
                className={`px-7 h-11 rounded-xl border-0 text-white text-sm font-bold flex items-center gap-2 shadow-md transition ${
                  !adminNotes.trim() || adminNotes.trim().length < 5 || saving
                    ? "bg-emerald-400 opacity-60 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                }`}
                title={
                  !adminNotes.trim() || adminNotes.trim().length < 5
                    ? "Escribe la descripción de la solución (mínimo 5 caracteres) para habilitar este botón"
                    : "Marcar novedad como Revisado"
                }
              >
                <CheckIcon className="w-4 h-4" />
                {saving ? "Guardando..." : "Revisado"}
              </button>
            ) : null
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-200">
              <CheckIcon className="w-4 h-4 text-emerald-600" />
              Novedad Revisada
            </span>
          )}
        </div>
      </div>

      {/* ── Modal de Zoom de Imagen ── */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <img src={modalImage} alt="Evidencia completa" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
            <button
              type="button"
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
