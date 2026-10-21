// src/components/notifications/NotificationDropdown.jsx

import useNotifications from "../../hooks/useNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown({ onClose }) {
    const {
        notifications,
        unreadCount,
        loading,
        error,
        filter,
        setFilter,
        socketConnected,
        desktopPermission,
        requestDesktopNotificationPermission,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 10px)",
                width: 380,
                maxWidth: "calc(100vw - 32px)",
                background: "#ffffff",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                borderRadius: 16,
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06)",
                overflow: "hidden",
                zIndex: 50,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Header del Centro de Notificaciones */}
            <div
                style={{
                    padding: "14px 16px 10px",
                    borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
                    background: "#ffffff"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                            Notificaciones
                        </span>
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    padding: "2px 7px",
                                    borderRadius: 10,
                                    border: "1px solid #bfdbfe"
                                }}
                            >
                                {unreadCount} nuevas
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            style={{
                                border: "none",
                                background: "transparent",
                                color: "#2563eb",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: "4px 8px",
                                borderRadius: 6,
                                transition: "background 0.15s ease"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            Marcar todas leídas
                        </button>
                    )}
                </div>

                {/* Filtro de Pestañas: Todas vs No Leídas */}
                <div style={{ display: "flex", gap: 6 }}>
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        style={{
                            flex: 1,
                            padding: "6px 0",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: filter === "all" ? "#0f172a" : "#f1f5f9",
                            color: filter === "all" ? "#ffffff" : "#475569",
                            transition: "all 0.15s ease"
                        }}
                    >
                        Todas
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("unread")}
                        style={{
                            flex: 1,
                            padding: "6px 0",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: filter === "unread" ? "#0f172a" : "#f1f5f9",
                            color: filter === "unread" ? "#ffffff" : "#475569",
                            transition: "all 0.15s ease"
                        }}
                    >
                        No leídas {unreadCount > 0 ? `(${unreadCount})` : ""}
                    </button>
                </div>
            </div>

            {/* Banner opcional para activar Notificaciones en Segundo Plano */}
            {desktopPermission !== "granted" && desktopPermission !== "unsupported" && (
                <div
                    style={{
                        margin: "10px 16px 4px",
                        padding: "8px 12px",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#1e40af", fontWeight: 600 }}>
                        <span aria-hidden="true">🔔</span>
                        <span>Alertas en segundo plano</span>
                    </div>
                    <button
                        type="button"
                        onClick={requestDesktopNotificationPermission}
                        style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 6,
                            padding: "3px 8px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer"
                        }}
                    >
                        Activar
                    </button>
                </div>
            )}

            {/* Cuerpo de la lista */}
            <div
                style={{
                    maxHeight: 380,
                    overflowY: "auto",
                    overflowX: "hidden"
                }}
            >
                {/* Estado de Carga */}
                {loading && notifications.length === 0 && (
                    <div style={{ padding: "24px 16px" }}>
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    marginBottom: 14,
                                    animation: "pulse 1.5s infinite ease-in-out"
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: "#e2e8f0",
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: 12, background: "#e2e8f0", borderRadius: 4, width: "60%", marginBottom: 8 }} />
                                    <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "90%", marginBottom: 4 }} />
                                    <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "40%" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Estado de Error */}
                {error && (
                    <div style={{ padding: "20px 16px", textAlign: "center" }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "#fef2f2",
                                color: "#dc2626",
                                margin: "0 auto 10px",
                                display: "grid",
                                placeItems: "center"
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p style={{ fontSize: 13, color: "#991b1b", marginBottom: 12, lineHeight: 1.4 }}>
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchNotifications()}
                            style={{
                                background: "#ffffff",
                                border: "1px solid #fca5a5",
                                color: "#dc2626",
                                padding: "6px 14px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                            }}
                        >
                            Volver a intentar
                        </button>
                    </div>
                )}

                {/* Estado Vacío */}
                {!loading && !error && notifications.length === 0 && (
                    <div style={{ padding: "36px 20px", textAlign: "center" }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "#f8fafc",
                                border: "1px dashed #cbd5e1",
                                color: "#94a3b8",
                                margin: "0 auto 12px",
                                display: "grid",
                                placeItems: "center"
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                            {filter === "unread" ? "Todo al día" : "No hay notificaciones"}
                        </div>
                        <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                            {filter === "unread"
                                ? "No tienes notificaciones pendientes de lectura."
                                : "Te avisaremos cuando se generen nuevas solicitudes o novedades."}
                        </p>
                    </div>
                )}

                {/* Lista de Notificaciones */}
                {!loading && !error && notifications.length > 0 && (
                    <div>
                        {notifications.map((item) => (
                            <NotificationItem
                                key={item._id || item.id}
                                notification={item}
                                onMarkAsRead={markAsRead}
                                onCloseMenu={onClose}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer con estado de conexión en tiempo real */}
            <div
                style={{
                    padding: "8px 16px",
                    background: "#f8fafc",
                    borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#64748b"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: socketConnected ? "#10b981" : "#f59e0b",
                            boxShadow: socketConnected
                                ? "0 0 6px rgba(16, 185, 129, 0.6)"
                                : "none"
                        }}
                    />
                    <span>
                        {socketConnected ? "En tiempo real" : "Reconectando..."}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => fetchNotifications()}
                    title="Actualizar notificaciones"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#64748b",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    <span>Sincronizar</span>
                </button>
            </div>
        </div>
    );
}
