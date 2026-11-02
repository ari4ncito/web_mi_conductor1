import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { obtenerCoordenadasDireccion } from "../../tracking/services/routing/geocodingService.js";
import { obtenerRuta } from "../../tracking/services/routing/routingService.js";

const DEFAULT_CENTER = [6.2442, -75.5812]; // Medellín

function ArrowLeftIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function NavigationIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 19-7-4-7 4 7-19z" />
    </svg>
  );
}

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

const RUTA_FALLBACK = [
  [6.2086, -75.5676], // El Poblado
  [6.2245, -75.5768], // Ciudad del Río
  [6.2392, -75.5802], // Plaza Mayor
  [6.2442, -75.5812], // Centro
  [6.2486, -75.5905], // Laureles
];

function ReadOnlyField({ id, label, value, icon }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <div
        id={id}
        className={`w-full ${icon ? "pl-10" : "pl-3.5"} pr-3.5 py-2 min-h-10.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-slate-800 text-xs sm:text-sm font-semibold select-all`}
      >
        {value || "—"}
      </div>
      {label && (
        <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-500 rounded">
          {label}
        </span>
      )}
    </div>
  );
}

export default function ServiceRouteMainView({ request, onBack }) {
  const [rutaCoordenadas, setRutaCoordenadas] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);

  const origen = request?.origin || request?.origen || "";
  const destino = request?.destination || request?.destino || "";

  useEffect(() => {
    let activo = true;

    if (!origen || !destino) {
      return;
    }

    const calcularRuta = async () => {
      setCargandoRuta(true);
      try {
        const [origGeo, destGeo] = await Promise.all([
          obtenerCoordenadasDireccion(origen),
          obtenerCoordenadasDireccion(destino),
        ]);

        const ruta = await obtenerRuta(
          origGeo.coordenadas,
          destGeo.coordenadas
        );

        if (activo && ruta?.coordenadas?.length > 1) {
          setRutaCoordenadas(ruta.coordenadas);
          setPuntos({
            origen: [origGeo.coordenadas.lat, origGeo.coordenadas.lng],
            destino: [destGeo.coordenadas.lat, destGeo.coordenadas.lng],
            origenLabel: origGeo.direccion || origen,
            destinoLabel: destGeo.direccion || destino,
          });
        }
      } catch (err) {
        console.warn("No se pudo calcular la ruta con OSRM, usando trazado de respaldo:", err);
        if (activo) {
          setRutaCoordenadas(RUTA_FALLBACK);
          setPuntos({
            origen: RUTA_FALLBACK[0],
            destino: RUTA_FALLBACK[RUTA_FALLBACK.length - 1],
            origenLabel: origen,
            destinoLabel: destino,
          });
        }
      } finally {
        if (activo) setCargandoRuta(false);
      }
    };

    void calcularRuta();

    return () => {
      activo = false;
    };
  }, [origen, destino]);

  const mapBounds =
    rutaCoordenadas.length > 0 ? rutaCoordenadas : [DEFAULT_CENTER];

  return (
    <div className="w-full min-w-0 p-3 sm:p-4 lg:p-5 animate-fade-in" style={{ boxSizing: "border-box" }}>
      {/* ── Encabezado Superior Compacto ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
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
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Módulo de Solicitudes
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                {request?.code || request?.fullCode || request?.id || "Solicitud"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {request?.status || "En Proceso"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mt-0.5">
              Ruta del servicio
            </h1>
          </div>
        </div>
      </div>

      {/* ── Contenedor Principal: Campos Origen/Destino y Mapa sin scroll excesivo ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        {/* Campos Origen y Destino (Visuales, Solo Lectura) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <ReadOnlyField
            id="sr-route-main-origin"
            label="ORIGEN"
            value={origen}
            icon={<MapPinIcon />}
          />
          <ReadOnlyField
            id="sr-route-main-destination"
            label="DESTINO"
            value={destino}
            icon={<NavigationIcon />}
          />
        </div>

        {/* Mapa con la Ruta del Servicio (Ajustado al viewport para evitar scroll innecesario) */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-[calc(100vh-210px)] min-h-110 z-0 bg-slate-100">
          {cargandoRuta && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 shadow-md">
              Cargando ruta del servicio...
            </div>
          )}

          <MapContainer
            center={puntos?.origen || DEFAULT_CENTER}
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

            {/* Trazo púrpura (#9524DB) idéntico a Trazabilidad */}
            {rutaCoordenadas.length > 1 && (
              <Polyline
                positions={rutaCoordenadas}
                pathOptions={{
                  color: "#9524DB",
                  weight: 5,
                  opacity: 0.95,
                  lineCap: "round",
                }}
              />
            )}

            {/* Punto de Inicio */}
            {puntos?.origen && (
              <CircleMarker
                center={puntos.origen}
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
                    <strong className="text-emerald-700 block text-[10px] uppercase">
                      Punto de Origen
                    </strong>
                    {puntos.origenLabel || origen}
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Punto de Destino */}
            {puntos?.destino && (
              <CircleMarker
                center={puntos.destino}
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
                    <strong className="text-purple-700 block text-[10px] uppercase">
                      Punto de Destino
                    </strong>
                    {puntos.destinoLabel || destino}
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
