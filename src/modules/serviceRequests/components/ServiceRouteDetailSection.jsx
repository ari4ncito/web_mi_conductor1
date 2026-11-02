import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const DEFAULT_CENTER = [6.2442, -75.5812];

function MapAutoBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: false });
        } catch (e) {
          console.warn("No se pudo ajustar bounds:", e);
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
  [6.2086, -75.5676],
  [6.2245, -75.5768],
  [6.2392, -75.5802],
  [6.2442, -75.5812],
  [6.2486, -75.5905],
];

export default function ServiceRouteDetailSection({
  origin = "",
  destination = "",
  novedad = null,
}) {
  const navigate = useNavigate();
  const [rutaCoordenadas, setRutaCoordenadas] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);

  useEffect(() => {
    let activo = true;

    if (!origin || !destination) return;

    const calcularRuta = async () => {
      setCargandoRuta(true);
      try {
        const [origGeo, destGeo] = await Promise.all([
          obtenerCoordenadasDireccion(origin),
          obtenerCoordenadasDireccion(destination),
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
            origenLabel: origGeo.direccion || origin,
            destinoLabel: destGeo.direccion || destination,
          });
        }
      } catch (err) {
        console.warn("No se pudo calcular la ruta con OSRM, usando estimado:", err);
        if (activo) {
          setRutaCoordenadas(RUTA_FALLBACK);
          setPuntos({
            origen: RUTA_FALLBACK[0],
            destino: RUTA_FALLBACK[RUTA_FALLBACK.length - 1],
            origenLabel: origin,
            destinoLabel: destination,
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
  }, [origin, destination]);

  // Punto de la novedad si tiene coordenadas
  const latNov = Number(novedad?.ubicacion?.lat);
  const lngNov = Number(novedad?.ubicacion?.lng);
  const tienePuntoNovedad =
    Number.isFinite(latNov) &&
    Number.isFinite(lngNov) &&
    Math.abs(latNov) > 0.1;

  const puntoNovedad = tienePuntoNovedad ? [latNov, lngNov] : null;

  const mapBounds = [
    ...(rutaCoordenadas.length > 0 ? rutaCoordenadas : [DEFAULT_CENTER]),
    ...(puntoNovedad ? [puntoNovedad] : []),
  ];

  const handleIrANovedad = () => {
    if (!novedad) return;
    navigate("/incidents", {
      state: { selectedIncidentId: novedad._id || novedad.id },
    });
  };

  return (
    <div className="mt-5 space-y-4">
      {/* ── Recorrido y Mapa de la Ruta del Servicio ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            Recorrido y Trazabilidad del Servicio
          </label>
          {cargandoRuta && (
            <span className="text-[11px] text-slate-400 font-medium">
              Cargando mapa...
            </span>
          )}
        </div>

        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 z-0">
          <MapContainer
            center={puntos?.origen || DEFAULT_CENTER}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapInvalidateSize />
            <MapAutoBounds bounds={mapBounds} />

            {/* Trazo púrpura (#9524DB) */}
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
                      Origen
                    </strong>
                    {puntos.origenLabel || origin}
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
                      Destino
                    </strong>
                    {puntos.destinoLabel || destination}
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Marcador rojo si hubo novedad en el recorrido */}
            {puntoNovedad && (
              <CircleMarker
                center={puntoNovedad}
                radius={9}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,
                  fillColor: "#dc2626",
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="text-xs font-semibold p-1">
                    <strong className="text-red-600 block text-[10px] uppercase">
                      Punto de la Novedad
                    </strong>
                    {novedad?.codigo || novedad?.id || "Novedad"} - {novedad?.tipo || "Incidente"}
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* ── Si tuvo Novedad Asociada, se visualiza la novedad ── */}
      {novedad && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50/70 border border-red-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                ⚠️
              </span>
              <div>
                <h3 className="text-sm font-bold text-red-950">
                  Novedad Registrada en este Servicio
                </h3>
                <span className="text-xs font-semibold text-red-700">
                  {novedad?.codigo || novedad?.id || "Novedad"} • {novedad?.tipo || "Incidente"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleIrANovedad}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              Ver Novedad Completa →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
            <div className="p-3 rounded-xl bg-white/80 border border-red-100">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                Descripción del Incidente
              </span>
              <p className="text-slate-800 font-medium whitespace-pre-wrap">
                {novedad?.descripcion || "Sin descripción adicional."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-red-100">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                Solución de la Novedad (Admin)
              </span>
              <p className="text-slate-800 font-medium whitespace-pre-wrap">
                {novedad?.notasResolucion ||
                  novedad?.observaciones ||
                  (novedad?.historialNotas?.length > 0
                    ? novedad.historialNotas[novedad.historialNotas.length - 1]?.nota
                    : "") ||
                  "Pendiente de resolución / En revisión"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

