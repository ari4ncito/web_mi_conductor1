const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

const validarCoordenadas =
  (
    coordenadas,
    nombre
  ) => {
    if (
      coordenadas?.lat == null ||
      coordenadas?.lng == null
    ) {
      throw new Error(
        `${nombre} no tiene coordenadas válidas.`
      );
    }

    const lat =
      Number(
        coordenadas.lat
      );

    const lng =
      Number(
        coordenadas.lng
      );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      throw new Error(
        `${nombre} contiene coordenadas no válidas.`
      );
    }

    if (
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      throw new Error(
        `${nombre} contiene coordenadas fuera de rango.`
      );
    }

    return {
      lat,
      lng,
    };
  };

export const obtenerRuta =
  async (
    origen,
    destino
  ) => {
    const origenValido =
      validarCoordenadas(
        origen,
        "El origen"
      );

    const destinoValido =
      validarCoordenadas(
        destino,
        "El destino"
      );

    const coordenadas =
      [
        `${origenValido.lng},${origenValido.lat}`,
        `${destinoValido.lng},${destinoValido.lat}`,
      ].join(";");

    const params =
      new URLSearchParams({
        overview: "full",
        geometries: "geojson",
        steps: "false",
      });

    const url =
      `${OSRM_URL}/${coordenadas}?${params.toString()}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error obteniendo la ruta: ${response.status}`
      );
    }

    const resultado =
      await response.json();

    if (
      resultado?.code !== "Ok"
    ) {
      throw new Error(
        resultado?.message ||
          "OSRM no pudo calcular la ruta."
      );
    }

    const ruta =
      resultado?.routes?.[0];

    if (!ruta) {
      throw new Error(
        "OSRM no devolvió ninguna ruta."
      );
    }

    const geometry =
      ruta.geometry;

    if (
      !geometry ||
      geometry.type !==
        "LineString" ||
      !Array.isArray(
        geometry.coordinates
      ) ||
      geometry.coordinates.length <
        2
    ) {
      throw new Error(
        "La geometría de la ruta no es válida."
      );
    }

    const coordenadasLeaflet =
      geometry.coordinates.map(
        ([lng, lat]) => [
          Number(lat),
          Number(lng),
        ]
      );

    return {
      coordenadas:
        coordenadasLeaflet,

      distanciaMetros:
        Number(ruta.distance) || 0,

      duracionSegundos:
        Number(ruta.duration) || 0,

      geometry,
    };
  };