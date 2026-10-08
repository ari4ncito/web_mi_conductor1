import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

import MapControls from "./MapControls";

const DEFAULT_POSITION = [
  6.2442,
  -75.5812,
];

const COLOR_RUTA =
  "#9524DB";

const obtenerCoordenadasGPS = (
  seguimiento,
  rutaTiempoReal,
  ubicacion
) => {
  const coordenadasGuardadas =
    seguimiento?.coordenadas ||
    [];

  const coordenadas = [
    ...coordenadasGuardadas.map(
      (coordenada) => [
        Number(
          coordenada.lat
        ),
        Number(
          coordenada.lng
        ),
      ]
    ),

    ...(
      rutaTiempoReal || []
    ).map(
      (coordenada) => [
        Number(
          coordenada.lat
        ),
        Number(
          coordenada.lng
        ),
      ]
    ),
  ];

  if (ubicacion) {
    const ultima =
      coordenadas[
        coordenadas.length - 1
      ];

    const actual = [
      Number(
        ubicacion.lat
      ),
      Number(
        ubicacion.lng
      ),
    ];

    if (
      !ultima ||
      ultima[0] !== actual[0] ||
      ultima[1] !== actual[1]
    ) {
      coordenadas.push(
        actual
      );
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
      !Array.isArray(
        ruta.coordenadas
      ) ||
      ruta.coordenadas.length < 2
    ) {
      return;
    }

    const limites =
      ruta.coordenadas;

    map.fitBounds(
      limites,
      {
        padding: [
          70,
          70,
        ],
        maxZoom: 16,
        animate: true,
      }
    );
  }, [
    map,
    ruta,
    seleccionado,
  ]);

  return null;
};

const ServicioEnMapa = ({
  seguimiento,
  ubicacion,
  rutaTiempoReal = [],
  rutaPlanificada,
  seleccionado,
}) => {
  const coordenadasGPS =
    obtenerCoordenadasGPS(
      seguimiento,
      rutaTiempoReal,
      ubicacion
    );

  const servicioId =
    seguimiento
      ?.servicio?._id;

  if (!servicioId) {
    return null;
  }

  const rutaPlanificadaValida =
    Array.isArray(
      rutaPlanificada?.coordenadas
    ) &&
    rutaPlanificada
      .coordenadas.length > 1;

  const coordenadasRuta =
    rutaPlanificadaValida
      ? rutaPlanificada.coordenadas
      : [];

  const puntoInicio =
    coordenadasRuta.length > 0
      ? coordenadasRuta[0]
      : null;

  const puntoFinal =
    coordenadasRuta.length > 1
      ? coordenadasRuta[
          coordenadasRuta.length - 1
        ]
      : null;

  return (
    <>
      {seleccionado &&
        rutaPlanificadaValida && (
          <Polyline
            positions={
              coordenadasRuta
            }
            pathOptions={{
              color:
                COLOR_RUTA,
              weight: 6,
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

      {seleccionado &&
        puntoInicio && (
          <CircleMarker
            center={
              puntoInicio
            }
            radius={9}
            pathOptions={{
              color:
                "#ffffff",
              weight: 3,
              fillColor:
                COLOR_RUTA,
              fillOpacity: 1,
            }}
          />
        )}

      {seleccionado &&
        puntoFinal && (
          <CircleMarker
            center={
              puntoFinal
            }
            radius={9}
            pathOptions={{
              color:
                "#ffffff",
              weight: 3,
              fillColor:
                COLOR_RUTA,
              fillOpacity: 1,
            }}
          />
        )}

      {/*
        La ruta GPS real se mantiene disponible
        en los datos para la trazabilidad,
        pero no dibujamos un marcador de conductor.
      */}

      {seleccionado &&
        !rutaPlanificadaValida &&
        coordenadasGPS.length > 1 && (
          <>
            <Polyline
              positions={
                coordenadasGPS
              }
              pathOptions={{
                color:
                  COLOR_RUTA,
                weight: 5,
                opacity: 0.9,
                lineCap:
                  "round",
                lineJoin:
                  "round",
              }}
            />

            <CircleMarker
              center={
                coordenadasGPS[0]
              }
              radius={9}
              pathOptions={{
                color:
                  "#ffffff",
                weight: 3,
                fillColor:
                  COLOR_RUTA,
                fillOpacity: 1,
              }}
            />

            <CircleMarker
              center={
                coordenadasGPS[
                  coordenadasGPS.length -
                    1
                ]
              }
              radius={9}
              pathOptions={{
                color:
                  "#ffffff",
                weight: 3,
                fillColor:
                  COLOR_RUTA,
                fillOpacity: 1,
              }}
            />
          </>
        )}

      {seleccionado && (
        <AjustarVistaRuta
          ruta={
            rutaPlanificada
          }
          seleccionado={
            seleccionado
          }
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
        center={
          DEFAULT_POSITION
        }
        zoom={13}
        scrollWheelZoom={
          true
        }
        className="w-full h-full z-[1]"
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapControls />

        <div className="absolute top-5 right-5 z-[1000] flex items-center gap-2 py-[9px] px-[14px] bg-white rounded-full text-[13px] font-semibold shadow-[0_5px_18px_rgba(0,0,0,0.15)]">

          <span
            className={`
              w-[9px]
              h-[9px]
              rounded-full
              ${
                conectado
                  ? "bg-[#0f9aa7]"
                  : "bg-[#999]"
              }
            `}
          />

          {conectado
            ? "Conectado"
            : "Desconectado"}

        </div>

        {seguimientos.map(
          (
            seguimiento
          ) => {
            const servicioId =
              seguimiento
                ?.servicio?._id;

            if (!servicioId) {
              return null;
            }

            const rutaPlanificada =
              rutasPlanificadas[
                servicioId
              ];

            const errorRuta =
              erroresRutas[
                servicioId
              ];

            if (
              errorRuta &&
              servicioSeleccionado ===
                servicioId
            ) {
              console.warn(
                `Ruta planificada no disponible para ${servicioId}:`,
                errorRuta
              );
            }

            return (
              <ServicioEnMapa
                key={
                  servicioId
                }

                seguimiento={
                  seguimiento
                }

                ubicacion={
                  ubicaciones[
                    servicioId
                  ]
                }

                rutaTiempoReal={
                  rutasTiempoReal[
                    servicioId
                  ]
                }

                rutaPlanificada={
                  rutaPlanificada
                }

                seleccionado={
                  servicioSeleccionado ===
                  servicioId
                }
              />
            );
          }
        )}

      </MapContainer>

    </div>
  );
};

export default MapView;