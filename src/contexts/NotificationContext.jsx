// src/contexts/NotificationContext.jsx

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import notificacionService from "../services/api/notificacionService";
import {
    socket,
    subscribeSocketConsumer
} from "../services/websocket/socketClient";
import { useAuth } from "./AuthContext";
import { NotificationContext } from "./notificationContextInstance";

export function NotificationProvider({ children }) {
    const { token, isAuthenticated } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all' | 'unread'
    const [socketConnected, setSocketConnected] = useState(socket.connected);
    const [desktopPermission, setDesktopPermission] = useState(
        typeof window !== "undefined" && "Notification" in window
            ? window.Notification.permission
            : "unsupported"
    );

    /**
     * Extrae la lista de notificaciones desde el formato estándar de respuesta.
     */
    const extractNotificationList = (response) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data?.data)) return response.data.data;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.notifications)) return response.notifications;
        return [];
    };

    /**
     * Extrae el contador de no leídas de la respuesta de la API.
     */
    const extractUnreadCount = (response) => {
        if (typeof response?.data?.noLeidas === "number") {
            return response.data.noLeidas;
        }
        if (typeof response?.noLeidas === "number") {
            return response.noLeidas;
        }
        if (typeof response?.data?.count === "number") {
            return response.data.count;
        }
        return 0;
    };

    /**
     * Solicita permisos para notificaciones nativas de escritorio del navegador.
     */
    const requestDesktopNotificationPermission = useCallback(async () => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            return "unsupported";
        }

        try {
            const permission = await window.Notification.requestPermission();
            setDesktopPermission(permission);
            return permission;
        } catch (err) {
            console.error("Error al solicitar permisos de notificación:", err);
            return "denied";
        }
    }, []);

    /**
     * Dispara una notificación de escritorio nativa del sistema operativo si la pestaña está en segundo plano.
     */
    const triggerDesktopNotification = useCallback((nuevaNotificacion) => {
        if (
            typeof window === "undefined" ||
            !("Notification" in window) ||
            window.Notification.permission !== "granted" ||
            !nuevaNotificacion
        ) {
            return;
        }

        try {
            const notif = new window.Notification(nuevaNotificacion.titulo || "Mi Conductor", {
                body: nuevaNotificacion.mensaje || "Tienes una nueva notificación",
                icon: "/vite.svg",
                tag: nuevaNotificacion._id || nuevaNotificacion.id
            });

            notif.onclick = () => {
                window.focus();
                if (nuevaNotificacion.solicitud) {
                    window.location.href = "/service-requests";
                } else if (nuevaNotificacion.novedad) {
                    window.location.href = "/incidents";
                }
                notif.close();
            };
        } catch {
            // Silenciar si las políticas del navegador restringen la ejecución en ese instante
        }
    }, []);

    /**
     * Consulta el contador de notificaciones no leídas.
     */
    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const resp = await notificacionService.getUnreadCount();
            const count = extractUnreadCount(resp);
            setUnreadCount(count);
            return count;
        } catch (err) {
            console.error("Error al obtener contador de no leídas:", err);
            return 0;
        }
    }, [isAuthenticated]);

    /**
     * Consulta las notificaciones del usuario autenticado.
     */
    const fetchNotifications = useCallback(
        async ({ silent = false, leida } = {}) => {
            if (!isAuthenticated) return;

            if (!silent) {
                setLoading(true);
            }
            setError(null);

            try {
                const params = { limit: 30 };
                if (typeof leida === "boolean") {
                    params.leida = leida;
                }

                const resp = await notificacionService.getAll(params);
                const list = extractNotificationList(resp);

                setNotifications(list);

                // Sincronizar también el contador en la misma consulta
                await fetchUnreadCount();
            } catch (err) {
                console.error("Error al cargar notificaciones:", err);
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "No se pudieron cargar las notificaciones.";
                setError(msg);
            } finally {
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [isAuthenticated, fetchUnreadCount]
    );

    /**
     * Marca una notificación como leída tanto en la API como optimistamente en memoria.
     */
    const markAsRead = useCallback(
        async (notificationId) => {
            if (!notificationId) return;

            // Actualización optimista local
            let wasUnread = false;
            setNotifications((prev) =>
                prev.map((item) => {
                    const itemId = item._id || item.id;
                    if (itemId === notificationId) {
                        if (!item.leida) wasUnread = true;
                        return {
                            ...item,
                            leida: true,
                            fechaLectura: item.fechaLectura || new Date().toISOString()
                        };
                    }
                    return item;
                })
            );

            if (wasUnread) {
                setUnreadCount((c) => Math.max(0, c - 1));
            }

            try {
                await notificacionService.markAsRead(notificationId);
            } catch (err) {
                console.error("Error al marcar como leída:", err);
                void fetchNotifications({ silent: true });
            }
        },
        [fetchNotifications]
    );

    /**
     * Marca todas las notificaciones como leídas.
     */
    const markAllAsRead = useCallback(async () => {
        // Actualización optimista
        setNotifications((prev) =>
            prev.map((item) => ({
                ...item,
                leida: true,
                fechaLectura: item.fechaLectura || new Date().toISOString()
            }))
        );
        setUnreadCount(0);

        try {
            await notificacionService.markAllAsRead();
        } catch (err) {
            console.error("Error al marcar todas como leídas:", err);
            void fetchNotifications({ silent: true });
        }
    }, [fetchNotifications]);

    // ========================================================
    // CICLO DE VIDA, CARGA INICIAL Y CONEXIÓN SOCKET.IO
    // ========================================================
    useEffect(() => {
        if (!isAuthenticated || !token) {
            const timer = setTimeout(() => {
                setNotifications([]);
                setUnreadCount(0);
                setError(null);
            }, 0);
            return () => clearTimeout(timer);
        }

        // 1. Cargar notificaciones persistidas desde el backend de forma asíncrona
        const initialLoadTimer = setTimeout(() => {
            void fetchNotifications();
        }, 0);

        // 2. Conectar socket y mantener suscripción mientras esté autenticado
        const unsubscribeConsumer = subscribeSocketConsumer();

        const handleConnect = () => {
            setSocketConnected(true);
            void fetchNotifications({ silent: true });
        };

        const handleDisconnect = () => {
            setSocketConnected(false);
        };

        const handleNuevaNotificacion = (nuevaNotificacion) => {
            if (!nuevaNotificacion) return;

            const nuevaId = nuevaNotificacion._id || nuevaNotificacion.id;

            setNotifications((prev) => {
                const yaExiste = prev.some(
                    (n) => (n._id || n.id) === nuevaId
                );
                if (yaExiste) {
                    return prev.map((n) =>
                        (n._id || n.id) === nuevaId ? { ...n, ...nuevaNotificacion } : n
                    );
                }
                return [nuevaNotificacion, ...prev];
            });

            if (!nuevaNotificacion.leida) {
                setUnreadCount((c) => c + 1);
            }

            // Si la ventana está en segundo plano o minimizada, disparar notificación nativa del SO
            if (document.hidden) {
                triggerDesktopNotification(nuevaNotificacion);
            }
        };

        const handleNotificacionLeida = (datos) => {
            const id = datos?.id || datos?._id;
            if (!id) return;

            setNotifications((prev) =>
                prev.map((item) => {
                    const itemId = item._id || item.id;
                    if (itemId === id) {
                        return {
                            ...item,
                            leida: true,
                            fechaLectura: datos.fechaLectura || new Date().toISOString()
                        };
                    }
                    return item;
                })
            );

            void fetchUnreadCount();
        };

        const handleTodasLeidas = () => {
            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    leida: true,
                    fechaLectura: item.fechaLectura || new Date().toISOString()
                }))
            );
            setUnreadCount(0);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("notificacion:nueva", handleNuevaNotificacion);
        socket.on("notificacion:leida", handleNotificacionLeida);
        socket.on("notificacion:todas_leidas", handleTodasLeidas);

        return () => {
            clearTimeout(initialLoadTimer);
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("notificacion:nueva", handleNuevaNotificacion);
            socket.off("notificacion:leida", handleNotificacionLeida);
            socket.off("notificacion:todas_leidas", handleTodasLeidas);
            unsubscribeConsumer();
        };
    }, [isAuthenticated, token, fetchNotifications, fetchUnreadCount, triggerDesktopNotification]);

    // Filtrar notificaciones según tab seleccionado
    const filteredNotifications = useMemo(() => {
        if (filter === "unread") {
            return notifications.filter((n) => !n.leida);
        }
        return notifications;
    }, [notifications, filter]);

    const value = useMemo(
        () => ({
            notifications: filteredNotifications,
            allNotifications: notifications,
            unreadCount,
            loading,
            error,
            filter,
            setFilter,
            socketConnected,
            desktopPermission,
            requestDesktopNotificationPermission,
            fetchNotifications,
            fetchUnreadCount,
            markAsRead,
            markAllAsRead
        }),
        [
            filteredNotifications,
            notifications,
            unreadCount,
            loading,
            error,
            filter,
            socketConnected,
            desktopPermission,
            requestDesktopNotificationPermission,
            fetchNotifications,
            fetchUnreadCount,
            markAsRead,
            markAllAsRead
        ]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;
