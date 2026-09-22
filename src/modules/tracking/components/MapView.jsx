import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import MapControls from "./MapControls";

import "./MapView.css";

const DEFAULT_POSITION = [
  6.2442,
  -75.5812,
];

const obtenerIconoConductor = () => {
  return new L.DivIcon({
    className:
      "driver-marker-icon",

    html: `
      <div class="driver-marker-wrapper">
        <div class="driver-marker-dot"></div>
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
    <div className="map-view">

      <MapContainer
        center={
          DEFAULT_POSITION
        }
        zoom={13}
        scrollWheelZoom={
          true
        }
        className="real-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapControls />

        <div className="map-status">
          <span
            className={`status-dot ${
              conectado
                ? "connected"
                : "disconnected"
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