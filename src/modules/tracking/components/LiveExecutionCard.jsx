const obtenerNombrePersona = (
  persona
) => {
  if (!persona) {
    return "";
  }

  if (persona.usuario) {
    return `${persona.usuario.nombre || ""} ${persona.usuario.apellido || ""}`.trim();
  }

  return `${persona.nombre || ""} ${persona.apellido || ""}`.trim();
};

const obtenerNombreConductor = (
  seguimiento
) => {
  const servicio =
    seguimiento?.servicio;

  const solicitud =
    servicio?.solicitud;

  const conductor =
    servicio?.conductor ||
    solicitud?.conductorAsignado ||
    seguimiento?.conductor;

  return (
    obtenerNombrePersona(
      conductor
    ) ||
    "Conductor sin asignar"
  );
};

const obtenerNombreCliente = (
  seguimiento
) => {
  const solicitud =
    seguimiento
      ?.servicio
      ?.solicitud;

  const cliente =
    solicitud?.cliente ||
    seguimiento?.cliente;

  return (
    obtenerNombrePersona(
      cliente
    ) ||
    "Cliente"
  );
};

const obtenerCodigoServicio = (
  seguimiento,
  index
) => {
  const solicitud =
    seguimiento
      ?.servicio
      ?.solicitud;

  return (
    solicitud?.codigo ||
    seguimiento?.codigo ||
    `Servicio ${index + 1}`
  );
};

const LiveExecution = ({
  seguimientos = [],
  servicioSeleccionado,
  onSeleccionar,
}) => {
  return (
    <section className="w-full h-full bg-white rounded-3xl p-[22px] flex flex-col">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-2xl font-bold text-[#122231]">
            Ejecución en Vivo
          </h2>

          <p className="mt-1.5 text-[#73808C] text-[15px]">
            {seguimientos.length}{" "}
            {seguimientos.length === 1
              ? "Servicio Activo"
              : "Servicios Activos"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#E53935] font-bold tracking-[0.08em] text-[13px]">
          <span className="w-[9px] h-[9px] bg-[#E53935] rounded-full animate-pulse" />

          EN VIVO
        </div>

      </div>

      <div className="mt-6 flex flex-col gap-3 overflow-y-auto pr-1">

        {seguimientos.length === 0 && (
          <div className="rounded-2xl border border-gray-200 p-5 text-center text-sm text-[#73808C]">
            No hay servicios activos.
          </div>
        )}

        {seguimientos.map(
          (
            seguimiento,
            index
          ) => {
            const servicioId =
              seguimiento
                ?.servicio?._id;

            if (!servicioId) {
              return null;
            }

            const codigo =
              obtenerCodigoServicio(
                seguimiento,
                index
              );

            const nombreConductor =
              obtenerNombreConductor(
                seguimiento
              );

            const nombreCliente =
              obtenerNombreCliente(
                seguimiento
              );

            const seleccionado =
              servicioSeleccionado ===
              servicioId;

            return (
              <button
                key={servicioId}
                type="button"
                onClick={() =>
                  onSeleccionar(
                    servicioId
                  )
                }
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  p-4
                  border
                  transition-all
                  duration-200
                  cursor-pointer
                  ${
                    seleccionado
                      ? "border-[#9524DB] bg-[#fbf4ff] shadow-[0_4px_16px_rgba(149,36,219,0.12)]"
                      : "border-[#e5e7eb] bg-white hover:border-[#c084fc] hover:bg-[#fcf8ff]"
                  }
                `}
              >

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <div className="text-[14px] font-semibold text-[#122231]">
                      {codigo}
                    </div>

                    <div className="mt-1 text-[14px] text-[#9524DB] truncate">
                      {nombreConductor}
                    </div>

                    <div className="mt-1 text-[12px] text-[#73808C] truncate">
                      {nombreCliente}
                    </div>

                  </div>

                  <span
                    className={`
                      shrink-0
                      w-8
                      h-8
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-white
                      text-lg
                      transition-all
                      ${
                        seleccionado
                          ? "bg-[#9524DB] rotate-0"
                          : "bg-[#9524DB]"
                      }
                    `}
                  >
                    →
                  </span>

                </div>

              </button>
            );
          }
        )}

      </div>

    </section>
  );
};

export default LiveExecution;