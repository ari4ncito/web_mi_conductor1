import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage";

import LiveExecution from "../components/LiveExecutionCard";
import MapView from "../components/MapView";

import useSocket from "../../../hooks/useSocket";
import axiosInstance from "../../../services/api/axiosInstance";

import {
  obtenerCoordenadasDireccion,
} from "../services/routing/geocodingService";

import {
  obtenerRuta,
} from "../services/routing/routingService";

const TrackingPage = () => {
  const [seguimientos, setSeguimientos] = useState([]);

  const [
    servicioSeleccionado,
    setServicioSeleccionado,
  ] = useState(null);

  const [rutasPlanificadas, setRutasPlanificadas] = useState({});
  const [erroresRutas, setErroresRutas] = useState({});

  useEffect(() => {
    let activo = true;

    const obtenerSeguimientosActivos = async () => {
      try {
        const response = await axiosInstance.get("/seguimientos/activos");
        const resultado = response.data;

        const datos = Array.isArray(resultado?.data)
          ? resultado.data
          : Array.isArray(resultado)
          ? resultado
          : [];

        if (activo) {
          setSeguimientos(datos);
        }
      } catch (error) {
        console.error(
          "Error obteniendo seguimientos activos:",
          error
        );

        if (activo) {
          setSeguimientos([]);
        }
      }
    };

    obtenerSeguimientosActivos();

    return () => {
      activo = false;
    };
  }, []);

  const servicioIds = useMemo(() => {
    return seguimientos
      .map((seguimiento) => seguimiento?.servicio?._id)
      .filter(Boolean);
  }, [seguimientos]);

  const {
    ubicaciones,
    rutasTiempoReal,
    conectado,
  } = useSocket(servicioIds);

  useEffect(() => {
    let activo = true;

    const calcularRutasPlanificadas = async () => {
      if (!seguimientos.length) {
        if (activo) {
          setRutasPlanificadas({});
          setErroresRutas({});
        }

        return;
      }

      const rutasActuales = {};
      const erroresActuales = {};

      for (const seguimiento of seguimientos) {
        const servicioId = seguimiento?.servicio?._id;
        const solicitud = seguimiento?.servicio?.solicitud;

        const origen = solicitud?.origen?.trim();
        const destino = solicitud?.destino?.trim();

        if (!servicioId || !origen || !destino) {
          continue;
        }

        try {
          const [
            origenGeocodificado,
            destinoGeocodificado,
          ] = await Promise.all([
            obtenerCoordenadasDireccion(origen),
            obtenerCoordenadasDireccion(destino),
          ]);

          const ruta = await obtenerRuta(
            origenGeocodificado.coordenadas,
            destinoGeocodificado.coordenadas
          );

          rutasActuales[servicioId] = {
            origen: {
              direccion: origenGeocodificado.direccion,
              coordenadas: origenGeocodificado.coordenadas,
            },
            destino: {
              direccion: destinoGeocodificado.direccion,
              coordenadas: destinoGeocodificado.coordenadas,
            },
            coordenadas: ruta.coordenadas,
            distanciaMetros: ruta.distanciaMetros,
            duracionSegundos: ruta.duracionSegundos,
          };
        } catch (error) {
          console.error(
            `Error calculando la ruta del servicio ${servicioId}:`,
            error
          );

          erroresActuales[servicioId] =
            error.message ||
            "No se pudo calcular la ruta.";
        }
      }

      if (!activo) {
        return;
      }

      setRutasPlanificadas(rutasActuales);
      setErroresRutas(erroresActuales);
    };

    calcularRutasPlanificadas();

    return () => {
      activo = false;
    };
  }, [seguimientos]);

  const servicioSeleccionadoValido =
    servicioSeleccionado &&
    servicioIds.includes(servicioSeleccionado)
      ? servicioSeleccionado
      : null;

  const manejarSeleccionServicio = (servicioId) => {
    if (servicioSeleccionado === servicioId) {
      setServicioSeleccionado(null);
      return;
    }

    setServicioSeleccionado(servicioId);
  };

  return (
    <ModulePage
      label="Trazabilidad y Control"
      title="Trazabilidad y Control"
      description="Monitoree en tiempo real la ejecución de los servicios, la ubicación de los conductores y el estado operativo de la flota."
    >
      <section className="w-full flex flex-col lg:flex-row gap-5 min-h-137.5 lg:h-[calc(100vh-180px)]">
        <aside className="w-full lg:w-87.5 shrink-0 max-h-95 lg:max-h-none lg:h-full overflow-y-auto">
          <LiveExecution
            seguimientos={seguimientos}
            servicioSeleccionado={servicioSeleccionadoValido}
            onSeleccionar={manejarSeleccionServicio}
          />
        </aside>

        <div className="flex-1 min-w-0 min-h-100 lg:h-full rounded-3xl sm:rounded-[28px] overflow-hidden relative z-1">
          <MapView
            seguimientos={seguimientos}
            ubicaciones={ubicaciones}
            rutasTiempoReal={rutasTiempoReal}
            rutasPlanificadas={rutasPlanificadas}
            erroresRutas={erroresRutas}
            servicioSeleccionado={servicioSeleccionadoValido}
            setServicioSeleccionado={setServicioSeleccionado}
            conectado={conectado}
          />
        </div>
      </section>
    </ModulePage>
  );
};

export default TrackingPage;
