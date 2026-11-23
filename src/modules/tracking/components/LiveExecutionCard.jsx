
import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";

const ITEMS_POR_PAGINA = 8;

const obtenerNombrePersona = (persona) => {
  if (!persona) {
    return "";
  }

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

  return (
    obtenerNombrePersona(conductor) ||
    "Conductor sin asignar"
  );
};

const obtenerNombreCliente = (seguimiento) => {
  const solicitud = seguimiento?.servicio?.solicitud;

  const cliente =
    solicitud?.cliente ||
    seguimiento?.cliente;

  return (
    obtenerNombrePersona(cliente) ||
    "Cliente"
  );
};

const obtenerCodigoServicio = (seguimiento, index) => {
  const solicitud = seguimiento?.servicio?.solicitud;

  return (
    solicitud?.codigo ||
    seguimiento?.codigo ||
    `Servicio ${index + 1}`
  );
};

function SearchIcon({ size = 16, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function FilterIcon({ size = 16, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

const LiveExecution = ({
  seguimientos = [],
  servicioSeleccionado,
  onSeleccionar,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [criterioFiltro, setCriterioFiltro] = useState("todos");
  const [conductorFiltro, setConductorFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarMenuFiltros, setMostrarMenuFiltros] = useState(false);

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setMostrarMenuFiltros(false);
      }
    };

    if (mostrarMenuFiltros) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarMenuFiltros]);

  const conductoresUnicos = useMemo(() => {
    const conjunto = new Set();

    seguimientos.forEach((seguimiento) => {
      const nombre = obtenerNombreConductor(seguimiento);

      if (nombre && nombre !== "Conductor sin asignar") {
        conjunto.add(nombre);
      }
    });

    return Array.from(conjunto).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [seguimientos]);

  const seguimientosFiltrados = useMemo(() => {
    return seguimientos.filter((seguimiento, index) => {
      const codigo = obtenerCodigoServicio(seguimiento, index);
      const conductor = obtenerNombreConductor(seguimiento);

      if (
        conductorFiltro &&
        conductor.toLowerCase() !== conductorFiltro.toLowerCase()
      ) {
        return false;
      }

      const q = busqueda.trim().toLowerCase();

      if (!q) {
        return true;
      }

      if (criterioFiltro === "codigo") {
        return codigo.toLowerCase().includes(q);
      }

      if (criterioFiltro === "conductor") {
        return conductor.toLowerCase().includes(q);
      }

      return (
        codigo.toLowerCase().includes(q) ||
        conductor.toLowerCase().includes(q)
      );
    });
  }, [
    seguimientos,
    busqueda,
    criterioFiltro,
    conductorFiltro,
  ]);

  const totalItems = seguimientosFiltrados.length;
  const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA) || 1;

  const paginaValida = Math.min(
    Math.max(1, paginaActual),
    totalPaginas
  );

  const indiceInicio = (paginaValida - 1) * ITEMS_POR_PAGINA;
  const indiceFin = Math.min(
    indiceInicio + ITEMS_POR_PAGINA,
    totalItems
  );

  const seguimientosPaginados = seguimientosFiltrados.slice(
    indiceInicio,
    indiceFin
  );

  const hayFiltrosActivos =
    busqueda.trim() !== "" ||
    criterioFiltro !== "todos" ||
    conductorFiltro !== "";

  const limpiarFiltros = () => {
    setBusqueda("");
    setCriterioFiltro("todos");
    setConductorFiltro("");
    setPaginaActual(1);
    setMostrarMenuFiltros(false);
  };

  const renderBotonesPaginas = () => {
    const paginas = [];

    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else if (paginaValida <= 3) {
      paginas.push(1, 2, 3, "...", totalPaginas);
    } else if (paginaValida >= totalPaginas - 2) {
      paginas.push(
        1,
        "...",
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas
      );
    } else {
      paginas.push(1, "...", paginaValida, "...", totalPaginas);
    }

    return paginas.map((item, idx) => {
      if (item === "...") {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="w-5 text-center text-xs text-[#94a3b8]"
          >
            …
          </span>
        );
      }

      const activa = item === paginaValida;

      return (
        <button
          key={`page-${item}`}
          type="button"
          onClick={() => setPaginaActual(item)}
          className={`
            min-w-7 h-7 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
            ${
              activa
                ? "bg-[#9524DB] text-white shadow-xs"
                : "border border-gray-200 bg-white text-[#46515C] hover:bg-gray-50"
            }
          `}
        >
          {item}
        </button>
      );
    });
  };

  return (
    <section className="w-full h-full bg-white rounded-3xl p-5.5 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-3.5 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#122231]">
              Ejecución en Vivo
            </h2>

            <p className="mt-1 text-[#73808C] text-[15px]">
              {totalItems}{" "}
              {totalItems === 1
                ? "Servicio Activo"
                : "Servicios Activos"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#E53935] font-bold tracking-[0.08em] text-[13px] pt-1">
            <span className="size-2.25 bg-[#E53935] rounded-full animate-pulse" />
            EN VIVO
          </div>
        </div>

        <div className="relative" ref={filterRef}>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 flex items-center bg-[#f0f5ff] border border-[rgba(27,46,61,0.08)] rounded-xl px-3 py-2 transition-all focus-within:border-[#9524DB] focus-within:ring-1 focus-within:ring-[#9524DB]/20">
              <span className="text-[#73808C] mr-2 shrink-0">
                <SearchIcon size={15} />
              </span>

              <input
                type="text"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                placeholder={
                  criterioFiltro === "codigo"
                    ? "Buscar código..."
                    : criterioFiltro === "conductor"
                    ? "Buscar conductor..."
                    : "Buscar..."
                }
                className="w-full bg-transparent border-none outline-none text-[13px] text-[#122231] placeholder-[#73808C] leading-tight"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setPaginaActual(1);
                  }}
                  className="text-[#73808C] hover:text-[#122231] text-xs ml-1 p-0.5 cursor-pointer"
                  title="Limpiar texto"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMostrarMenuFiltros(!mostrarMenuFiltros)}
              className={`
                h-9.5 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all shrink-0
                ${
                  hayFiltrosActivos
                    ? "bg-[#fbf4ff] border-[#9524DB] text-[#9524DB]"
                    : "bg-[#f0f5ff] border-[rgba(27,46,61,0.08)] text-[#73808C] hover:text-[#122231] hover:border-gray-300"
                }
              `}
              title="Filtrar servicios"
            >
              <FilterIcon size={15} />
              {hayFiltrosActivos && (
                <span className="size-2 rounded-full bg-[#9524DB]" />
              )}
            </button>
          </div>

          {mostrarMenuFiltros && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 z-30 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#122231] uppercase tracking-wider">
                  Filtrar servicios
                </span>

                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="text-xs text-[#9524DB] hover:underline font-semibold cursor-pointer"
                  >
                    Restablecer
                  </button>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#73808C] uppercase tracking-wider block mb-1.5">
                  Buscar por
                </span>

                <div className="grid grid-cols-3 gap-1 bg-[#f0f5ff] p-1 rounded-xl">
                  {[
                    ["todos", "Todos"],
                    ["codigo", "Código"],
                    ["conductor", "Conductor"],
                  ].map(([valor, texto]) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => {
                        setCriterioFiltro(valor);
                        setPaginaActual(1);
                      }}
                      className={`py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                        criterioFiltro === valor
                          ? "bg-white text-[#9524DB] shadow-xs font-bold"
                          : "text-[#73808C] hover:text-[#122231]"
                      }`}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
              </div>

              {conductoresUnicos.length > 0 && (
                <div>
                  <label className="text-[11px] font-semibold text-[#73808C] uppercase tracking-wider block mb-1.5">
                    Conductor asignado
                  </label>

                  <select
                    value={conductorFiltro}
                    onChange={(e) => {
                      setConductorFiltro(e.target.value);
                      setPaginaActual(1);
                    }}
                    className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-[#122231] outline-none focus:border-[#9524DB] cursor-pointer"
                  >
                    <option value="">Todos los conductores</option>
                    {conductoresUnicos.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMostrarMenuFiltros(false)}
                className="w-full py-1.5 bg-[#9524DB] text-white text-xs font-semibold rounded-xl hover:bg-[#8018bf] transition-colors cursor-pointer text-center"
              >
                Listo
              </button>
            </div>
          )}

          {(conductorFiltro || criterioFiltro !== "todos") && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {criterioFiltro !== "todos" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#fbf4ff] text-[#9524DB] px-2 py-0.5 rounded-full border border-[#f3e8ff]">
                  Campo: {criterioFiltro === "codigo" ? "Código" : "Conductor"}
                  <button
                    type="button"
                    onClick={() => {
                      setCriterioFiltro("todos");
                      setPaginaActual(1);
                    }}
                    className="hover:text-black cursor-pointer font-bold ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              )}

              {conductorFiltro && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#fbf4ff] text-[#9524DB] px-2 py-0.5 rounded-full border border-[#f3e8ff]">
                  {conductorFiltro}
                  <button
                    type="button"
                    onClick={() => {
                      setConductorFiltro("");
                      setPaginaActual(1);
                    }}
                    className="hover:text-black cursor-pointer font-bold ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 my-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#CCD7E2] [&::-webkit-scrollbar-thumb]:rounded-full">
        {seguimientos.length === 0 && (
          <div className="rounded-2xl border border-gray-200 p-5 text-center text-sm text-[#73808C]">
            No hay servicios activos.
          </div>
        )}

        {seguimientos.length > 0 && seguimientosFiltrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-[#73808C]">
            No se encontraron servicios que coincidan con la búsqueda.
          </div>
        )}

        {seguimientosPaginados.map((seguimiento, index) => {
          const servicioId = seguimiento?.servicio?._id;

          if (!servicioId) {
            return null;
          }

          const codigo = obtenerCodigoServicio(
            seguimiento,
            indiceInicio + index
          );

          const nombreConductor = obtenerNombreConductor(seguimiento);
          const nombreCliente = obtenerNombreCliente(seguimiento);

          const seleccionado =
            servicioSeleccionado === servicioId;

          return (
            <button
              key={servicioId}
              type="button"
              onClick={() => onSeleccionar(servicioId)}
              className={`
                w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer
                ${
                  seleccionado
                    ? "p-4 border-[#9524DB] bg-[#fbf4ff] shadow-[0_4px_16px_rgba(149,36,219,0.12)]"
                    : "p-3.5 border-[#e5e7eb] bg-white hover:border-[#c084fc] hover:bg-[#fcf8ff]"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-[#122231] truncate">
                    {codigo}
                  </div>

                  {seleccionado && (
                    <>
                      <div className="mt-1 text-[14px] text-[#9524DB] font-medium truncate">
                        {nombreConductor}
                      </div>

                      <div className="mt-1 text-[12px] text-[#73808C] truncate">
                        {nombreCliente}
                      </div>
                    </>
                  )}
                </div>

                <span className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white text-base bg-[#9524DB] transition-all">
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-1.5 shrink-0">
          <div className="text-[12px] font-medium text-[#73808C]">
            {indiceInicio + 1}–{indiceFin} de {totalItems}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setPaginaActual((prev) => Math.max(1, prev - 1))
              }
              disabled={paginaValida === 1}
              className={`
                w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors
                ${
                  paginaValida === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-[#46515C] hover:bg-gray-50 cursor-pointer"
                }
              `}
              aria-label="Página anterior"
            >
              ←
            </button>

            {renderBotonesPaginas()}

            <button
              type="button"
              onClick={() =>
                setPaginaActual((prev) =>
                  Math.min(totalPaginas, prev + 1)
                )
              }
              disabled={
                paginaValida === totalPaginas || totalPaginas === 0
              }
              className={`
                w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors
                ${
                  paginaValida === totalPaginas || totalPaginas === 0
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-[#46515C] hover:bg-gray-50 cursor-pointer"
                }
              `}
              aria-label="Página siguiente"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveExecution;
