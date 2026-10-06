import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import MapControls from "./MapControls";

const DEFAULT_POSITION = [
  6.2442,
  -75.5812,
];

const obtenerIconoConductor = () => {
  return new L.DivIcon({
    className: "bg-transparent border-none",

    html: `
      <div class="w-10 h-10 flex items-center justify-center">
        <div class="w-[22px] h-[22px] bg-[#0b3627] border-4 border-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-110"></div>
      </div>
    `,

    iconSize: [
      40,
      40,
    ],

    iconAnchor: [
      20,
      20,
    ],
  });
};

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
      (
        coordenada
      ) => [
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
      (
        coordenada
      ) => [
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
    (
      [lat, lng]
    ) =>
      Number.isFinite(lat) &&
      Number.isFinite(lng)
  );
};

const ServicioEnMapa = ({
  seguimiento,
  ubicacion,
  rutaTiempoReal = [],
  rutaPlanificada,
  seleccionado,
  onSeleccionar,
}) => {
  const coordenadas =
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

  let posicion =
    DEFAULT_POSITION;

  if (ubicacion) {
    posicion = [
      Number(
        ubicacion.lat
      ),
      Number(
        ubicacion.lng
      ),
    ];
  } else if (
    coordenadas.length > 0
  ) {
    posicion =
      coordenadas[
        coordenadas.length - 1
      ];
  }

  const rutaPlanificadaValida =
    Array.isArray(
      rutaPlanificada?.coordenadas
    ) &&
    rutaPlanificada
      .coordenadas.length > 1;

  return (
    <>
      {seleccionado &&
        rutaPlanificadaValida && (
          <Polyline
            positions={
              rutaPlanificada.coordenadas
            }
            pathOptions={{
              color: "#9524DB",
              weight: 6,
              opacity: 0.45,
            }}
          />
        )}

      {seleccionado &&
        coordenadas.length > 1 && (
          <Polyline
            positions={
              coordenadas
            }
            pathOptions={{
              color: "#9524DB",
              weight: 4,
              opacity: 0.95,
            }}
          />
        )}

      <Marker
        position={
          posicion
        }
        icon={
          obtenerIconoConductor()
        }
        eventHandlers={{
          click: () =>
            onSeleccionar(
              servicioId
            ),
        }}
      />
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
  setServicioSeleccionado,
  conectado,
}) => {
  const manejarClickMarcador =
    (
      servicioId
    ) => {
      console.log(
        "Servicio seleccionado:",
        servicioId
      );

      if (
        servicioSeleccionado ===
        servicioId
      ) {
        setServicioSeleccionado(
          null
        );

        return;
      }

      setServicioSeleccionado(
        servicioId
      );
    };

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
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapControls />

        <div className="absolute top-5 right-5 z-[1000] flex items-center gap-2 py-[9px] px-[14px] bg-white rounded-full text-[13px] font-semibold shadow-[0_5px_18px_rgba(0,0,0,0.15)]">
          <span
            className={`w-[9px] h-[9px] rounded-full ${
              conectado
                ? "bg-[#0f9aa7]"
                : "bg-[#999]"
            }`}
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

            if (errorRuta) {
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

                onSeleccionar={
                  manejarClickMarcador
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
