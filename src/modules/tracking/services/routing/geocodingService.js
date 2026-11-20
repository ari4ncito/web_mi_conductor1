const ARCGIS_GEOCODE_URL =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

const NOMINATIM_SEARCH_URL =
  "https://nominatim.openstreetmap.org/search";

const NOMINATIM_REVERSE_URL =
  "https://nominatim.openstreetmap.org/reverse";

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hora

const geocodingCache = new Map();
const verificationCache = new Map();

let ultimaSolicitudNominatim = 0;
let colaSolicitudesNominatim = Promise.resolve();

// ======================================================
// 1. EXPRESIONES REGULARES DE NOMENCLATURA VIAL COLOMBIANA
// ======================================================

const COLOMBIA_ROAD_PREFIX =
  "(?:calle|cll\\.?|cl\\.?|carrera|cra\\.?|cr\\.?|kr\\.?|k\\.?|circular|cir\\.?|cq\\.?|diagonal|diag\\.?|dg\\.?|transversal|transv\\.?|tv\\.?|tr\\.?|avenida|avda\\.?|av\\.?|autopista|auto\\.?|loma|pasaje|kil[oó]metro|km\\.?|v[ií]a|variante|camino|vereda|vda\\.?)";

export const COLOMBIA_ADDRESS_REGEX = new RegExp(
  `\\b${COLOMBIA_ROAD_PREFIX}\\s*(?:\\d{1,3}[a-zA-Z]?(?:\\s*(?:bis|sur|norte|este|oeste|oriente|occidente|[a-zA-Z]))?|[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,}(?:\\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})?)(?:\\s*(?:#|no\\.?|nro\\.?|n[°º]|-|\\s)\\s*\\d{1,3}[a-zA-Z]?(?:\\s*(?:bis|sur|norte|este|oeste|oriente|occidente|[a-zA-Z]))?\\s*(?:-|a|\\s)\\s*\\d{1,4}|\\s*\\d{1,3})`,
  "i"
);

export const FAKE_ADDRESS_REGEX =
  /calle\s+falsa|carrera\s+falsa|123\s*#\s*123|0+\s*#\s*0+|asdf|qwerty|sin\s+direcci[oó]n|ninguna|casa\s+de\s+mi\s+mam[aá]|casa\s+m[ií]a|prueba\s*123|test\s*123|direccion\s+falsa/i;

// Municipios del Valle de Aburrá y Oriente Antioqueño (compatible con tildes al final de palabra)
export const ANTIOQUIA_METRO_REGEX =
  /(?:^|[\s,;-])(medell[ií]n|envigado|itag[uü][ií]|bello|sabaneta|la\s+estrella|copacabana|girardota|caldas|barbosa|rionegro|marinilla|guarne|el\s+retiro|la\s+ceja|carmen\s+de\s+viboral|santuario|santa\s+elena)(?=$|[\s,.;-])/i;

// Otras ciudades principales de Colombia soportadas por Mi Conductor
export const COLOMBIA_CITIES_REGEX =
  /(?:^|[\s,;-])(bogot[aá]|cali|barranquilla|cartagena|bucaramanga|pereira|manizales|armenia|ibagu[eé]|c[uú]cuta|santa\s+marta|villavicencio|pasto|monter[ií]a|neiva|popay[aá]n|tunja|valledupar|sincelejo|riohacha|quibd[oó]|florencia|yopal|palmira|soledad|floridablanca|dosquebradas|tulu[aá]|apartad[oó]|turbo|caucasia)(?=$|[\s,.;-])/i;

const ACCEPTED_ARCGIS_ADDR_TYPES = new Set([
  "PointAddress",
  "StreetAddress",
  "Subaddress",
  "StreetInt",
  "StreetName",
]);

// Bounding boxes:
// 1. Valle de Aburrá + Oriente Cercano (Antioquia)
const EXTENT_ANTIOQUIA_METRO = {
  searchExtent: "-75.80,5.95,-75.20,6.50",
  minLon: -75.85,
  maxLon: -75.15,
  minLat: 5.90,
  maxLat: 6.55,
};

// 2. Territorio nacional de Colombia
const EXTENT_COLOMBIA = {
  searchExtent: "-79.10,-4.30,-66.80,12.60",
  minLon: -79.20,
  maxLon: -66.70,
  minLat: -4.40,
  maxLat: 12.70,
};

// ======================================================
// FASE 1: VALIDACIÓN SINTÁCTICA VIAL SÍNCRONA (0 ms)
// ======================================================

export function validarSintaxisDireccion(
  val = "",
  { required = false } = {}
) {
  const str = String(val || "").trim();

  if (!str) {
    return {
      isValid: !required,
      syntaxValid: false,
      error: required
        ? "Por favor ingresa la dirección exacta."
        : "",
    };
  }

  if (/[<>{}[\]$`\\;="!%^&*|~]/.test(str)) {
    return {
      isValid: false,
      syntaxValid: false,
      error: "No se admiten signos especiales no válidos en la dirección.",
    };
  }

  if (str.length < 8) {
    return {
      isValid: false,
      syntaxValid: false,
      error:
        "Ingresa una dirección completa con nomenclatura vial (ej: Calle 50 # 45-30 o Cra 70 # 44B-12).",
    };
  }

  if (str.length > 200) {
    return {
      isValid: false,
      syntaxValid: false,
      error: "La dirección no puede superar los 200 caracteres.",
    };
  }

  if (FAKE_ADDRESS_REGEX.test(str)) {
    return {
      isValid: false,
      syntaxValid: false,
      error: "Ingresa una dirección real y verificable.",
    };
  }

  if (!COLOMBIA_ADDRESS_REGEX.test(str)) {
    return {
      isValid: false,
      syntaxValid: false,
      error:
        "Usa nomenclatura vial colombiana válida (ej: Calle 10 # 43A-30, Cra 70 # 44B-12, Circular 4 # 70-18).",
    };
  }

  return {
    isValid: true,
    syntaxValid: true,
    error: "",
  };
}

// Alias compatible con la nomenclatura del manual técnico
export const validateDireccionMedellin = validarSintaxisDireccion;

// ======================================================
// FASE 2: NORMALIZACIÓN INTELIGENTE DE DIRECCIONES
// ======================================================

export function normalizarDireccionGeocodificacion(rawAddress = "") {
  const original = String(rawAddress || "").trim();

  // Extraer o limpiar detalles de propiedad horizontal (Apto, Torre, Interior, Piso, etc.)
  const cleaned = original
    .replace(
      /\b(?:apto\.?|apartamento|int\.?|interior|torre|bloque|blq\.?|piso|local|oficina|of\.?|casa|manzana|mz\.?|bodega|lote|etapa|consultorio|porter[ií]a)\b\s*[a-zA-Z0-9-]*/gi,
      ""
    )
    .replace(/\b(?:cr|cra|kr|k)\.?(?=\s*\d)/gi, "Carrera")
    .replace(/\b(?:cl|cll)\.?(?=\s*\d)/gi, "Calle")
    .replace(/\b(?:cq|cir)\.?(?=\s*\d)/gi, "Circular")
    .replace(/\b(?:dg|diag)\.?(?=\s*\d)/gi, "Diagonal")
    .replace(/\b(?:tv|tr|transv)\.?(?=\s*\d)/gi, "Transversal")
    .replace(/\b(?:av|avda)\.?(?=\s+)/gi, "Avenida")
    .replace(/\b(?:km)\.?(?=\s*\d)/gi, "Kilómetro")
    .replace(/\s+/g, " ")
    .replace(/^[\s,-]+|[\s,-]+$/g, "")
    .trim();

  // Determinar cobertura geográfica según el municipio o ciudad presente en el texto
  if (ANTIOQUIA_METRO_REGEX.test(cleaned)) {
    const query = /colombia/i.test(cleaned)
      ? cleaned
      : /antioquia/i.test(cleaned)
      ? `${cleaned}, Colombia`
      : `${cleaned}, Antioquia, Colombia`;

    return {
      cleaned,
      query,
      scope: "ANTIOQUIA_METRO",
      bounds: EXTENT_ANTIOQUIA_METRO,
    };
  }

  if (COLOMBIA_CITIES_REGEX.test(cleaned)) {
    const query = /colombia/i.test(cleaned)
      ? cleaned
      : `${cleaned}, Colombia`;

    return {
      cleaned,
      query,
      scope: "COLOMBIA_NACIONAL",
      bounds: EXTENT_COLOMBIA,
    };
  }

  // Por defecto: cobertura principal en Medellín y Valle de Aburrá
  return {
    cleaned,
    query: `${cleaned}, Medellín, Antioquia, Colombia`,
    scope: "ANTIOQUIA_METRO",
    bounds: EXTENT_ANTIOQUIA_METRO,
  };
}

function isWithinBounds(location, bounds = EXTENT_ANTIOQUIA_METRO) {
  if (!location) return false;
  const x = Number(location.x);
  const y = Number(location.y);
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= bounds.minLon &&
    x <= bounds.maxLon &&
    y >= bounds.minLat &&
    y <= bounds.maxLat
  );
}

// ======================================================
// FASE 4: REVERSE GEOCODING EN NOMINATIM (BARRIO / SECTOR)
// ======================================================

const esperarLimiteNominatim = async () => {
  const ahora = Date.now();
  const tiempoDesdeUltima = ahora - ultimaSolicitudNominatim;
  const esperaNecesaria = Math.max(0, 1000 - tiempoDesdeUltima);

  if (esperaNecesaria > 0) {
    await new Promise((resolve) => setTimeout(resolve, esperaNecesaria));
  }

  ultimaSolicitudNominatim = Date.now();
};

export async function obtenerBarrioNominatimReverse(lat, lon, externalSignal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      return "";
    }
    externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    const url =
      `${NOMINATIM_REVERSE_URL}?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=16`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return "";

    const data = await res.json();
    const addr = data?.address || {};
    return (
      addr.suburb ||
      addr.neighbourhood ||
      addr.quarter ||
      addr.city_district ||
      addr.residential ||
      ""
    );
  } catch {
    return "";
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }
  }
}

// ======================================================
// FASE 3 Y 4: GEOCODIFICACIÓN HÍBRIDA ARCGIS + NOMINATIM
// ======================================================

function createCompositeSignal(externalSignal, timeoutMs = 5000) {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => {
    controller.abort();
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const cleanup = () => {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }
  };

  return {
    signal: controller.signal,
    isTimeout: () => timedOut,
    cleanup,
  };
}

/**
 * Verifica una dirección en tiempo real distinguiendo estrictamente entre:
 * 1. Dirección geográficamente verificada (`status: "verified"`, `verified: true`, `syntaxValid: true`)
 * 2. Dirección con sintaxis válida pero fallo temporal del proveedor (`status: "provider_error"`, `verified: false`, `syntaxValid: true`, `providerError: true`)
 * 3. Dirección inválida por sintaxis o inexistente en la malla vial (`status: "invalid"`, `verified: false`)
 */
export async function verificarDireccionTiempoReal(
  direccion = "",
  options = {}
) {
  const { required = true, signal: externalSignal } = options;

  // Fase 1: Validación sintáctica síncrona
  const syncRes = validarSintaxisDireccion(direccion, { required });
  if (!syncRes.isValid) {
    return {
      status: "invalid",
      isValid: false,
      syntaxValid: false,
      verified: false,
      providerError: false,
      error: syncRes.error,
    };
  }

  const cacheKey = String(direccion || "").trim().toLowerCase();
  const cached = verificationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Fase 2: Normalización de la consulta
  const { query, bounds } = normalizarDireccionGeocodificacion(direccion);

  const params = new URLSearchParams({
    SingleLine: query,
    countryCode: "COL",
    searchExtent: bounds.searchExtent,
    maxLocations: "3",
    outFields: "Addr_type,Match_addr,Nbrhd,District,City,Region,Score",
    f: "json",
  });

  const url = `${ARCGIS_GEOCODE_URL}?${params.toString()}`;
  const { signal, isTimeout, cleanup } = createCompositeSignal(
    externalSignal,
    5000
  );

  try {
    // Fase 3: Consulta a ArcGIS REST World Geocoder
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data?.error) {
      throw new Error(data.error.message || "Error en servidor ArcGIS");
    }

    const candidates = Array.isArray(data?.candidates) ? data.candidates : [];

    const validCandidates = candidates.filter((c) => {
      const type = c?.attributes?.Addr_type || "";
      const score = Number(c?.score || 0);
      return (
        ACCEPTED_ARCGIS_ADDR_TYPES.has(type) &&
        score >= 78 &&
        isWithinBounds(c?.location, bounds)
      );
    });

    if (validCandidates.length === 0) {
      const notFoundRes = {
        status: "invalid",
        isValid: false,
        syntaxValid: true,
        verified: false,
        notFound: true,
        providerError: false,
        error:
          "No encontramos esa dirección en la malla vial. Verifica la vía y el número de placa.",
      };
      verificationCache.set(cacheKey, {
        data: notFoundRes,
        timestamp: Date.now(),
      });
      return notFoundRes;
    }

    const best = validCandidates[0];
    const lat = Number(best.location.y);
    const lng = Number(best.location.x);
    let barrio =
      best.attributes?.Nbrhd || best.attributes?.District || "";
    const ciudad =
      best.attributes?.City || "Medellín";

    // Fase 4: Enriquecimiento de Barrio con Nominatim Reverse si ArcGIS lo omitió
    if (!barrio && Number.isFinite(lat) && Number.isFinite(lng)) {
      barrio = await obtenerBarrioNominatimReverse(
        lat,
        lng,
        externalSignal
      );
    }

    const direccionFormateada =
      best.address || best.attributes?.Match_addr || direccion.trim();

    const verifiedRes = {
      status: "verified",
      isValid: true,
      syntaxValid: true,
      verified: true,
      providerError: false,
      error: "",
      address: direccionFormateada,
      direccion: direccionFormateada,
      barrio,
      ciudad,
      score: Number(best.score),
      addrType: best.attributes?.Addr_type || "StreetAddress",
      location: { x: lng, y: lat },
      coordenadas: { lat, lng },
    };

    verificationCache.set(cacheKey, {
      data: verifiedRes,
      timestamp: Date.now(),
    });

    // Poblar también la caché de obtenerCoordenadasDireccion para reutilización inmediata (0 ms)
    geocodingCache.set(String(direccion || "").trim(), {
      datos: {
        direccion: direccionFormateada,
        coordenadas: { lat, lng },
        barrio,
        ciudad,
        score: Number(best.score),
        tipo: best.attributes?.Addr_type || "StreetAddress",
        importancia: Number(best.score) / 100,
        lugar: {
          suburb: barrio,
          city: ciudad,
          region: best.attributes?.Region || "Antioquia",
          country: "Colombia",
        },
        verified: true,
        provider: "ArcGIS+Nominatim",
      },
      timestamp: Date.now(),
    });

    return verifiedRes;
  } catch (err) {
    if (externalSignal?.aborted) {
      throw err;
    }

    // Distinción obligatoria: sintaxis válida pero fallo temporal del proveedor / timeout.
    // NUNCA se presenta como verificación geográfica exitosa (verified: false, providerError: true).
    return {
      status: "provider_error",
      isValid: false,
      syntaxValid: true,
      verified: false,
      providerError: true,
      isTimeout: isTimeout(),
      error: isTimeout()
        ? "Tiempo de espera agotado al consultar el servicio de geocodificación. Inténtalo nuevamente."
        : "Fallo temporal de conexión con el proveedor de geocodificación. No se pudo verificar geográficamente la dirección.",
    };
  } finally {
    cleanup();
  }
}

export const verifyDireccionMedellinRealtime = verificarDireccionTiempoReal;

// ======================================================
// BÚSQUEDA DE RESPALDO EN NOMINATIM (PARA PUNTOS DE INTERÉS)
// ======================================================

const ejecutarSolicitudNominatim = async (direccion, externalSignal) => {
  const { query, bounds } = normalizarDireccionGeocodificacion(direccion);

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "1",
    countrycodes: "co",
  });

  const { signal, cleanup } = createCompositeSignal(externalSignal, 5000);

  try {
    const response = await fetch(
      `${NOMINATIM_SEARCH_URL}?${params.toString()}`,
      {
        signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error geocodificando la dirección: ${response.status}`
      );
    }

    const resultados = await response.json();

    if (!Array.isArray(resultados) || resultados.length === 0) {
      throw new Error(`No se encontró la dirección: ${direccion}`);
    }

    const resultado = resultados[0];
    const lat = Number(resultado.lat);
    const lng = Number(resultado.lon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !isWithinBounds({ x: lng, y: lat }, bounds)
    ) {
      throw new Error(`No se encontró la dirección: ${direccion}`);
    }

    const addr = resultado.address || {};
    const barrio =
      addr.suburb ||
      addr.neighbourhood ||
      addr.quarter ||
      addr.city_district ||
      "";
    const ciudad =
      addr.city ||
      addr.town ||
      addr.municipality ||
      "Medellín";

    const datos = {
      direccion: resultado.display_name,
      coordenadas: {
        lat,
        lng,
      },
      barrio,
      ciudad,
      tipo: resultado.type,
      importancia: resultado.importance,
      lugar: addr,
      verified: true,
      provider: "Nominatim",
    };

    return datos;
  } finally {
    cleanup();
  }
};

// ======================================================
// FUNCIÓN PRINCIPAL CONSUMIDA POR LOS MÓDULOS EXISTENTES
// ======================================================

export const obtenerCoordenadasDireccion = async (
  direccion,
  options = {}
) => {
  const direccionLimpia = direccion?.trim();

  if (!direccionLimpia) {
    throw new Error("La dirección no puede estar vacía.");
  }

  if (FAKE_ADDRESS_REGEX.test(direccionLimpia)) {
    throw new Error(`No se encontró la dirección: ${direccionLimpia}`);
  }

  // 1. Revisar caché en memoria
  const cacheKey = direccionLimpia.toLowerCase();
  const direccionCacheada =
    geocodingCache.get(direccionLimpia) || geocodingCache.get(cacheKey);

  if (
    direccionCacheada &&
    Date.now() - direccionCacheada.timestamp < CACHE_TTL_MS
  ) {
    return direccionCacheada.datos;
  }

  // 2. Consultar primero ArcGIS REST World Geocoder + Nominatim Reverse
  const { query, bounds } = normalizarDireccionGeocodificacion(direccionLimpia);
  const arcgisParams = new URLSearchParams({
    SingleLine: query,
    countryCode: "COL",
    searchExtent: bounds.searchExtent,
    maxLocations: "3",
    outFields: "Addr_type,Match_addr,Nbrhd,District,City,Region,Score",
    f: "json",
  });

  const { signal, cleanup } = createCompositeSignal(options.signal, 5000);
  let arcgisNetworkError = null;

  try {
    const response = await fetch(
      `${ARCGIS_GEOCODE_URL}?${arcgisParams.toString()}`,
      {
        signal,
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ArcGIS: ${response.status}`);
    }

    const data = await response.json();
    if (data?.error) {
      throw new Error(data.error.message || "Error en ArcGIS REST");
    }

    const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
    const validCandidates = candidates.filter((c) => {
      const type = c?.attributes?.Addr_type || "";
      const score = Number(c?.score || 0);
      return (
        ACCEPTED_ARCGIS_ADDR_TYPES.has(type) &&
        score >= 78 &&
        isWithinBounds(c?.location, bounds)
      );
    });

    if (validCandidates.length > 0) {
      const best = validCandidates[0];
      const lat = Number(best.location.y);
      const lng = Number(best.location.x);
      let barrio =
        best.attributes?.Nbrhd || best.attributes?.District || "";
      const ciudad = best.attributes?.City || "Medellín";

      if (!barrio && Number.isFinite(lat) && Number.isFinite(lng)) {
        barrio = await obtenerBarrioNominatimReverse(
          lat,
          lng,
          options.signal
        );
      }

      const direccionResuelta =
        best.address || best.attributes?.Match_addr || direccionLimpia;

      const datos = {
        direccion: direccionResuelta,
        coordenadas: { lat, lng },
        barrio,
        ciudad,
        score: Number(best.score),
        tipo: best.attributes?.Addr_type || "StreetAddress",
        importancia: Number(best.score) / 100,
        lugar: {
          suburb: barrio,
          city: ciudad,
          region: best.attributes?.Region || "Antioquia",
          country: "Colombia",
        },
        verified: true,
        provider: "ArcGIS+Nominatim",
      };

      geocodingCache.set(direccionLimpia, {
        datos,
        timestamp: Date.now(),
      });
      geocodingCache.set(cacheKey, {
        datos,
        timestamp: Date.now(),
      });

      return datos;
    }

    // Si la dirección tiene nomenclatura vial colombiana pero ArcGIS confirmó 0 candidatos válidos
    // en la malla vial (ej. Calle 999 # 999-999), no existe geográficamente.
    if (COLOMBIA_ADDRESS_REGEX.test(direccionLimpia)) {
      throw new Error(`No se encontró la dirección: ${direccionLimpia}`);
    }
  } catch (err) {
    if (options.signal?.aborted) {
      cleanup();
      throw err;
    }
    if (
      typeof err?.message === "string" &&
      err.message.startsWith("No se encontró la dirección:")
    ) {
      cleanup();
      throw err;
    }
    arcgisNetworkError = err;
  } finally {
    cleanup();
  }

  // 3. Respaldo con Nominatim Search solo si no tenía formato de placa rechazado por ArcGIS
  //    o si ArcGIS tuvo un fallo de red temporal
  const solicitudNominatim = colaSolicitudesNominatim.then(async () => {
    await esperarLimiteNominatim();
    const datos = await ejecutarSolicitudNominatim(
      direccionLimpia,
      options.signal
    );

    geocodingCache.set(direccionLimpia, {
      datos,
      timestamp: Date.now(),
    });
    geocodingCache.set(cacheKey, {
      datos,
      timestamp: Date.now(),
    });

    return datos;
  });

  colaSolicitudesNominatim = solicitudNominatim.catch(() => undefined);

  try {
    return await solicitudNominatim;
  } catch (nomErr) {
    if (arcgisNetworkError && !nomErr?.message?.startsWith("No se encontró la dirección:")) {
      throw new Error(
        `Error de conexión con los proveedores de geocodificación: ${arcgisNetworkError.message}`
      );
    }
    throw nomErr;
  }
};

export const limpiarCacheGeocodificacion = () => {
  geocodingCache.clear();
  verificationCache.clear();
};
