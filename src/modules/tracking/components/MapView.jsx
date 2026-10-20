
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

import MapControls from "./MapControls";

const DEFAULT_POSITION = [6.2442, -75.5812];

const COLOR_RUTA = "#9524DB";

const obtenerNombrePersona = (persona) => {
  if (!persona) return "";

  if (persona.usuario) {
    return `${persona.usuario.nombre || ""} ${persona.usuario.apellido || ""}`.trim();
  }

  return `${persona.nombre || ""} ${persona.apellido || ""}`.trim();
};

const obtenerNombreConductor = (seguimiento) => {
  const servicio = seguimiento?.servicio;
  const solicitud = servicio?.solicitud;

  const conductor =
    servicio?.conductor ||
    solicitud?.conductorAsignado ||
    seguimiento?.conductor;

  return obtenerNombrePersona(conductor) || "Conductor sin asignar";
};

const obtenerNombreCliente = (seguimiento) => {
  const solicitud = seguimiento?.servicio?.solicitud;

  const cliente = solicitud?.cliente || seguimiento?.cliente;

  return obtenerNombrePersona(cliente) || "Cliente";
};

const obtenerCodigoServicio = (seguimiento, index = 0) => {
  const solicitud = seguimiento?.servicio?.solicitud;

  return (
    solicitud?.codigo ||
    seguimiento?.codigo ||
    `Servicio ${index + 1}`
  );
};

const InfoServicioPopup = ({
  seguimiento,
  rutaPlanificada,
  tipoPunto = null,
}) => {
  const codigo = obtenerCodigoServicio(seguimiento);
  const conductor = obtenerNombreConductor(seguimiento);
  const cliente = obtenerNombreCliente(seguimiento);

  const solicitud = seguimiento?.servicio?.solicitud;

  const origen =
    solicitud?.origen ||
    rutaPlanificada?.origen?.direccion ||
    "Origen no especificado";

  const destino =
    solicitud?.destino ||
    rutaPlanificada?.destino?.direccion ||
    "Destino no especificado";

  const estado =
    solicitud?.estado ||
    seguimiento?.servicio?.estado ||
    "En Ejecución";

  const distanciaKm = rutaPlanificada?.distanciaMetros
    ? (rutaPlanificada.distanciaMetros / 1000).toFixed(1)
    : null;

  const duracionMin = rutaPlanificada?.duracionSegundos
    ? Math.round(rutaPlanificada.duracionSegundos / 60)
    : null;

  const tituloPunto =
    tipoPunto === "origen"
      ? "Punto de Origen"
      : tipoPunto === "destino"
      ? "Punto de Destino"
      : "Ruta en Ejecución";

  const badgeColor =
    tipoPunto === "origen"
      ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
      : tipoPunto === "destino"
      ? "bg-[#fdf2f8] text-[#db2777] border-[#fbcfe8]"
      : "bg-[#fbf4ff] text-[#9524DB] border-[#f3e8ff]";

  return (
    <div className="min-w-52.5 max-w-65 text-[#122231] font-sans py-0.5">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#73808C]">
            {tituloPunto}
          </span>

          <span className="font-bold text-[13px] text-[#122231]">
            {codigo}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeColor}`}
        >
          {tipoPunto === "origen"
            ? "Origen"
            : tipoPunto === "destino"
            ? "Destino"
            : estado}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-[12px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#9524DB] font-semibold text-[11px] shrink-0">
            Conductor:
          </span>

          <span className="text-[#122231] font-medium truncate">
            {conductor}
          </span>
        </div>

        {cliente && cliente !== "Cliente" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#73808C] font-semibold text-[11px] shrink-0">
              Cliente:
            </span>

            <span className="text-[#46515C] truncate">
              {cliente}
            </span>
          </div>
        )}

        <div className="bg-[#f8fafc] rounded-lg p-2 flex flex-col gap-1 mt-1 border border-gray-100">
          <div className="flex items-start gap-1.5">
            <span className="size-2 rounded-full bg-[#10b981] mt-1 shrink-0" />

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-[#94a3b8] font-bold uppercase">
                Origen
              </span>

              <span className="text-[11px] text-[#334155] leading-snug line-clamp-2 block">
                {origen}
              </span>
            </div>
          </div>

          <div className="w-px h-2 bg-gray-200 ml-[3.5px]" />

          <div className="flex items-start gap-1.5">
            <span className="size-2 rounded-full bg-[#ef4444] mt-1 shrink-0" />

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-[#94a3b8] font-bold uppercase">
                Destino
              </span>

              <span className="text-[11px] text-[#334155] leading-snug line-clamp-2 block">
                {destino}
              </span>
            </div>
          </div>
        </div>

        {(distanciaKm || duracionMin) && (
          <div className="flex items-center justify-between pt-1.5 text-[11px] text-[#73808C] font-medium border-t border-gray-100">
            {distanciaKm && <span>📏 {distanciaKm} km</span>}
            {duracionMin && <span>⏱️ ~{duracionMin} min</span>}
          </div>
        )}
      </div>
    </div>
  );
};

const obtenerCoordenadasGPS = (
  seguimiento,
  rutaTiempoReal,
  ubicacion
) => {
  const coordenadasGuardadas = seguimiento?.coordenadas || [];

  const coordenadas = [
    ...coordenadasGuardadas.map((coordenada) => [
      Number(coordenada.lat),
      Number(coordenada.lng),
    ]),

    ...(rutaTiempoReal || []).map((coordenada) => [
      Number(coordenada.lat),
      Number(coordenada.lng),
    ]),
  ];

  if (ubicacion) {
    const ultima = coordenadas[coordenadas.length - 1];

    const actual = [
      Number(ubicacion.lat),
      Number(ubicacion.lng),
    ];

    if (
      !ultima ||
      ultima[0] !== actual[0] ||
      ultima[1] !== actual[1]
    ) {
      coordenadas.push(actual);
    }
  }

  return coordenadas.filter(
    ([lat, lng]) =>
      Number.isFinite(lat) &&
      Number.isFinite(lng)
  );
};

const AjustarVistaRuta = ({
  ruta,
  seleccionado,
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      !seleccionado ||
      !ruta ||
      !Array.isArray(ruta.coordenadas) ||
      ruta.coordenadas.length < 2
    ) {
      return;
    }

    map.fitBounds(ruta.coordenadas, {
      padding: [70, 70],
      maxZoom: 16,
      animate: true,
    });
  }, [map, ruta, seleccionado]);

  return null;
};

const ServicioEnMapa = ({
  seguimiento,
  ubicacion,
  rutaTiempoReal = [],
  rutaPlanificada,
  seleccionado,
}) => {
  const coordenadasGPS = obtenerCoordenadasGPS(
    seguimiento,
    rutaTiempoReal,
    ubicacion
  );

  const servicioId = seguimiento?.servicio?._id;

  if (!servicioId) {
    return null;
  }

  const rutaPlanificadaValida =
    Array.isArray(rutaPlanificada?.coordenadas) &&
    rutaPlanificada.coordenadas.length > 1;

  const coordenadasRuta = rutaPlanificadaValida
    ? rutaPlanificada.coordenadas
    : [];

  const puntoInicio =
    coordenadasRuta.length > 0
      ? coordenadasRuta[0]
      : null;

  const puntoFinal =
    coordenadasRuta.length > 1
      ? coordenadasRuta[coordenadasRuta.length - 1]
      : null;

  return (
    <>
      {seleccionado && rutaPlanificadaValida && (
        <Polyline
          positions={coordenadasRuta}
          pathOptions={{
            color: COLOR_RUTA,
            weight: 6,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
          }}
        >
          <Popup>
            <InfoServicioPopup
              seguimiento={seguimiento}
              rutaPlanificada={rutaPlanificada}
              tipoPunto="ruta"
            />
          </Popup>
        </Polyline>
      )}

      {seleccionado && puntoInicio && (
        <CircleMarker
          center={puntoInicio}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: COLOR_RUTA,
            fillOpacity: 1,
          }}
        >
          <Popup>
            <InfoServicioPopup
              seguimiento={seguimiento}
              rutaPlanificada={rutaPlanificada}
              tipoPunto="origen"
            />
          </Popup>
        </CircleMarker>
      )}

      {seleccionado && puntoFinal && (
        <CircleMarker
          center={puntoFinal}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: COLOR_RUTA,
            fillOpacity: 1,
          }}
        >
          <Popup>
            <InfoServicioPopup
              seguimiento={seguimiento}
              rutaPlanificada={rutaPlanificada}
              tipoPunto="destino"
            />
          </Popup>
        </CircleMarker>
      )}

      {seleccionado &&
        !rutaPlanificadaValida &&
        coordenadasGPS.length > 1 && (
          <>
            <Polyline
              positions={coordenadasGPS}
              pathOptions={{
                color: COLOR_RUTA,
                weight: 5,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}
            >
              <Popup>
                <InfoServicioPopup
                  seguimiento={seguimiento}
                  rutaPlanificada={rutaPlanificada}
                  tipoPunto="ruta"
                />
              </Popup>
            </Polyline>

            <CircleMarker
              center={coordenadasGPS[0]}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: COLOR_RUTA,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <InfoServicioPopup
                  seguimiento={seguimiento}
                  rutaPlanificada={rutaPlanificada}
                  tipoPunto="origen"
                />
              </Popup>
            </CircleMarker>

            <CircleMarker
              center={coordenadasGPS[coordenadasGPS.length - 1]}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: COLOR_RUTA,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <InfoServicioPopup
                  seguimiento={seguimiento}
                  rutaPlanificada={rutaPlanificada}
                  tipoPunto="destino"
                />
              </Popup>
            </CircleMarker>
          </>
        )}

      {seleccionado && (
        <AjustarVistaRuta
          ruta={rutaPlanificada}
          seleccionado={seleccionado}
        />
      )}
    </>
  );
};

const MapView = ({
  seguimientos = [],
  ubicaciones = {},
  rutasTiempoReal = {},
  rutasPlanificadas = {},
  erroresRutas = {},
  servicioSeleccionado,
  conectado,
}) => {
  return (
    <div className="w-full h-full relative rounded-[28px] overflow-hidden">
      <MapContainer
        center={DEFAULT_POSITION}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-1"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapControls />

        <div className="absolute top-5 right-5 z-1000 flex items-center gap-2 py-2.25 px-3.5 bg-white rounded-full text-[13px] font-semibold shadow-[0_5px_18px_rgba(0,0,0,0.15)]">
          <span
            className={`size-2.25 rounded-full ${
              conectado ? "bg-[#0f9aa7]" : "bg-[#999]"
            }`}
          />

          {conectado ? "Conectado" : "Desconectado"}
        </div>

        {seguimientos.map((seguimiento) => {
          const servicioId = seguimiento?.servicio?._id;

          if (!servicioId) {
            return null;
          }

          const rutaPlanificada = rutasPlanificadas[servicioId];
          const errorRuta = erroresRutas[servicioId];

          if (
            errorRuta &&
            servicioSeleccionado === servicioId
          ) {
            console.warn(
              `Ruta planificada no disponible para ${servicioId}:`,
              errorRuta
            );
          }

          return (
            <ServicioEnMapa
              key={servicioId}
              seguimiento={seguimiento}
              ubicacion={ubicaciones[servicioId]}
              rutaTiempoReal={rutasTiempoReal[servicioId]}
              rutaPlanificada={rutaPlanificada}
              seleccionado={servicioSeleccionado === servicioId}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
