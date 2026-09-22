import {
  useEffect,
  useState,
} from "react";

import {
  socket,
  connectSocket,
  disconnectSocket,
} from "../services/websocket/socketClient";

const useSocket = (
  servicioIds = []
) => {
  const [ubicaciones, setUbicaciones] =
    useState({});

  const [rutasTiempoReal, setRutasTiempoReal] =
    useState({});

  const [conectado, setConectado] =
    useState(false);

  useEffect(() => {

    if (!servicioIds.length) {
      return;
    }

    const handleConnect = () => {
      console.log(
        "Socket.IO conectado:",
        socket.id
      );

      setConectado(true);

      servicioIds.forEach(
        (servicioId) => {
          socket.emit(
            "seguimiento:subscribe",
            {
              servicioId,
            }
          );

          console.log(
            "Suscrito al servicio:",
            servicioId
          );
        }
      );
    };

    const handleDisconnect = (
      reason
    ) => {
      console.log(
        "Socket.IO desconectado:",
        reason
      );

      setConectado(false);
    };

    const handleConnectionError = (
      error
    ) => {
      console.error(
        "Error de conexión Socket.IO:",
        error.message
      );

      setConectado(false);
    };

    const handleUbicacion = (
      data
    ) => {
      console.log(
        "Ubicación recibida:",
        data
      );

      const {
        servicioId,
        lat,
        lng,
        timestamp,
      } = data;

      if (
        !servicioId ||
        lat == null ||
        lng == null
      ) {
        return;
      }

      setUbicaciones(
        (actuales) => ({
          ...actuales,

          [servicioId]: {
            lat,
            lng,
            timestamp,
          },
        })
      );

      setRutasTiempoReal(
        (rutas) => {

          const rutaActual =
            rutas[servicioId] || [];

          const ultima =
            rutaActual[
              rutaActual.length - 1
            ];

          if (
            ultima &&
            ultima.lat === lat &&
            ultima.lng === lng
          ) {
            return rutas;
          }

          return {
            ...rutas,

            [servicioId]: [
              ...rutaActual,
              {
                lat,
                lng,
                timestamp,
              },
            ],
          };
        }
      );
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectionError
    );

    socket.on(
      "seguimiento:ubicacion",
      handleUbicacion
    );

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {

      servicioIds.forEach(
        (servicioId) => {
          socket.emit(
            "seguimiento:unsubscribe",
            {
              servicioId,
            }
          );
        }
      );

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectionError
      );

      socket.off(
        "seguimiento:ubicacion",
        handleUbicacion
      );

      disconnectSocket();
    };

  }, [servicioIds]);

  return {
    ubicaciones,
    rutasTiempoReal,
    conectado,
  };
};

export default useSocket;