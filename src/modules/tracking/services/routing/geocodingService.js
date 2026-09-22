const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

const CACHE_TTL_MS =
  1000 * 60 * 60;

const geocodingCache = new Map();

let ultimaSolicitud =
  0;

let colaSolicitudes =
  Promise.resolve();

const esperarLimiteNominatim = async () => {
  const ahora =
    Date.now();

  const tiempoDesdeUltimaSolicitud =
    ahora - ultimaSolicitud;

  const esperaNecesaria =
    Math.max(
      0,
      1000 - tiempoDesdeUltimaSolicitud
    );

  if (esperaNecesaria > 0) {
    await new Promise(
      (resolve) => {
        setTimeout(
          resolve,
          esperaNecesaria
        );
      }
    );
  }

  ultimaSolicitud =
    Date.now();
};

const ejecutarSolicitudNominatim = async (
  direccion
) => {
  const params =
    new URLSearchParams({
      q: direccion,
      format: "json",
      addressdetails: "1",
      limit: "1",
      countrycodes: "co",
    });

  const response =
    await fetch(
      `${NOMINATIM_URL}?${params.toString()}`,
      {
        headers: {
          Accept:
            "application/json",
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      `Error geocodificando la dirección: ${response.status}`
    );
  }

  const resultados =
    await response.json();

  if (
    !Array.isArray(resultados) ||
    resultados.length === 0
  ) {
    throw new Error(
      `No se encontró la dirección: ${direccion}`
    );
  }

  const resultado =
    resultados[0];

  const lat =
    Number(resultado.lat);

  const lng =
    Number(resultado.lon);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    throw new Error(
      "La dirección no tiene coordenadas válidas."
    );
  }

  const datos =
    {
      direccion:
        resultado.display_name,

      coordenadas: {
        lat,
        lng,
      },

      tipo:
        resultado.type,

      importancia:
        resultado.importance,

      lugar:
        resultado.address || {},
    };

  geocodingCache.set(
    direccion,
    {
      datos,
      timestamp:
        Date.now(),
    }
  );

  return datos;
};

export const obtenerCoordenadasDireccion =
  async (
    direccion
  ) => {
    const direccionLimpia =
      direccion?.trim();

    if (!direccionLimpia) {
      throw new Error(
        "La dirección no puede estar vacía."
      );
    }

    const direccionCacheada =
      geocodingCache.get(
        direccionLimpia
      );

    if (
      direccionCacheada &&
      Date.now() -
        direccionCacheada.timestamp <
        CACHE_TTL_MS
    ) {
      return direccionCacheada.datos;
    }

    const solicitud =
      colaSolicitudes.then(
        async () => {
          await esperarLimiteNominatim();

          return ejecutarSolicitudNominatim(
            direccionLimpia
          );
        }
      );

    colaSolicitudes =
      solicitud.catch(
        () => undefined
      );

    return solicitud;
  };