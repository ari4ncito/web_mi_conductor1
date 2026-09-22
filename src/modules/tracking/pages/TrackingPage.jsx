import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage";

import FeedPanel from "../components/FeedPanel";
import HistoryPanel from "../components/HistoryPanel";
import LiveExecution from "../components/LiveExecutionCard";
import MapView from "../components/MapView";

import useSocket from "../../../hooks/useSocket";

import {
  obtenerCoordenadasDireccion,
} from "../services/routing/geocodingService";

import {
  obtenerRuta,
} from "../services/routing/routingService";

import "./TrackingPage.css";

const API_URL =
  "http://localhost:3000";

const TrackingPage = () => {
  const [
    seguimientos,
    setSeguimientos,
  ] = useState([]);

  const [
    servicioSeleccionado,
    setServicioSeleccionado,
  ] = useState(null);

  const [
    rutasPlanificadas,
    setRutasPlanificadas,
  ] = useState({});

  const [
    erroresRutas,
    setErroresRutas,
  ] = useState({});

  useEffect(() => {
    let activo = true;

    const obtenerSeguimientosActivos =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/api/seguimientos/activos`
            );

          if (!response.ok) {
            throw new Error(
              "No se pudieron obtener los seguimientos activos."
            );
          }

          const resultado =
            await response.json();

          const datos =
            Array.isArray(
              resultado?.data
            )
              ? resultado.data
              : [];

          if (activo) {
            setSeguimientos(
              datos
            );
          }
        } catch (error) {
          console.error(
            "Error obteniendo seguimientos activos:",
            error
          );

          if (activo) {
            setSeguimientos(
              []
            );
          }
        }
      };

    obtenerSeguimientosActivos();

    return () => {
      activo = false;
    };
  }, []);

  const servicioIds =
    useMemo(() => {
      return seguimientos
        .map(
          (
            seguimiento
          ) =>
            seguimiento
              ?.servicio?._id
        )
        .filter(Boolean);
    }, [seguimientos]);

  const {
    ubicaciones,
    rutasTiempoReal,
    conectado,
  } =
    useSocket(
      servicioIds
    );

  useEffect(() => {
    let activo = true;

    const calcularRutasPlanificadas =
      async () => {
        if (
          !seguimientos.length
        ) {
          if (activo) {
            setRutasPlanificadas(
              {}
            );
            setErroresRutas(
              {}
            );
          }

          return;
        }

        const rutasActuales =
          {};

        const erroresActuales =
          {};

        for (
          const seguimiento of seguimientos
        ) {
          const servicioId =
            seguimiento
              ?.servicio?._id;

          const solicitud =
            seguimiento
              ?.servicio
              ?.solicitud;

          const origen =
            solicitud?.origen?.trim();

          const destino =
            solicitud?.destino?.trim();

          if (
            !servicioId ||
            !origen ||
            !destino
          ) {
            continue;
          }

          try {
            const [
              origenGeocodificado,
              destinoGeocodificado,
            ] =
              await Promise.all([
                obtenerCoordenadasDireccion(
                  origen
                ),
                obtenerCoordenadasDireccion(
                  destino
                ),
              ]);

            const ruta =
              await obtenerRuta(
                origenGeocodificado.coordenadas,
                destinoGeocodificado.coordenadas
              );

            rutasActuales[
              servicioId
            ] = {
              origen: {
                direccion:
                  origenGeocodificado.direccion,

                coordenadas:
                  origenGeocodificado.coordenadas,
              },

              destino: {
                direccion:
                  destinoGeocodificado.direccion,

                coordenadas:
                  destinoGeocodificado.coordenadas,
              },

              coordenadas:
                ruta.coordenadas,

              distanciaMetros:
                ruta.distanciaMetros,

              duracionSegundos:
                ruta.duracionSegundos,
            };
          } catch (error) {
            console.error(
              `Error calculando la ruta del servicio ${servicioId}:`,
              error
            );

            erroresActuales[
              servicioId
            ] =
              error.message ||
              "No se pudo calcular la ruta.";
          }
        }

        if (!activo) {
          return;
        }

        setRutasPlanificadas(
          rutasActuales
        );

        setErroresRutas(
          erroresActuales
        );
      };

    calcularRutasPlanificadas();

    return () => {
      activo = false;
    };
  }, [seguimientos]);

  useEffect(() => {
    if (
      servicioSeleccionado &&
      !servicioIds.includes(
        servicioSeleccionado
      )
    ) {
      setServicioSeleccionado(
        null
      );
    }
  }, [
    servicioIds,
    servicioSeleccionado,
  ]);

  return (
    <ModulePage
      label="Trazabilidad y Control"
      title="Trazabilidad y Control"
      description="Monitoree en tiempo real la ejecución de los servicios, la ubicación de los conductores y el estado operativo de la flota."
    >
      <section className="tracking">

        <div className="tracking-map">
          <MapView
            seguimientos={
              seguimientos
            }

            ubicaciones={
              ubicaciones
            }

            rutasTiempoReal={
              rutasTiempoReal
            }

            rutasPlanificadas={
              rutasPlanificadas
            }

            erroresRutas={
              erroresRutas
            }

            servicioSeleccionado={
              servicioSeleccionado
            }

            setServicioSeleccionado={
              setServicioSeleccionado
            }

            conectado={
              conectado
            }
          />
        </div>

        <aside className="tracking-panels">

          <LiveExecution />

          <FeedPanel />

          <HistoryPanel />

        </aside>

      </section>
    </ModulePage>
  );
};

export default TrackingPage;