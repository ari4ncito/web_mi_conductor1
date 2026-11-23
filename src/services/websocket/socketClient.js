import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env?.VITE_SOCKET_URL || "http://localhost:4000";

const getToken = () => {
  try {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      null
    );
  } catch {
    return null;
  }
};

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ["websocket", "polling"],
  auth: (cb) => {
    cb({ token: getToken() });
  },
});

let activeSubscriptions = 0;

/**
 * Conecta el socket asegurando que el token de autenticación esté actualizado.
 * @param {string} [tokenOverride] Token opcional explícito.
 */
export const connectSocket = (tokenOverride) => {
  const token = tokenOverride || getToken();

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

/**
 * Desconecta el socket. Si force es false y existen consumidores activos
 * (por ejemplo el centro de notificaciones), la conexión se mantiene abierta.
 * @param {boolean} [force=false]
 */
export const disconnectSocket = (force = false) => {
  if (force) {
    activeSubscriptions = 0;
    if (socket.connected) {
      socket.disconnect();
    }
    return;
  }

  if (activeSubscriptions <= 0 && socket.connected) {
    socket.disconnect();
  }
};

/**
 * Registra un suscriptor persistente (por ejemplo, el centro de notificaciones).
 */
export const subscribeSocketConsumer = () => {
  activeSubscriptions += 1;
  connectSocket();
  return () => {
    activeSubscriptions = Math.max(0, activeSubscriptions - 1);
  };
};

export default socket;
