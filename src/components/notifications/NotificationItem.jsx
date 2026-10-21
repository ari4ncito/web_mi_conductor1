// src/components/notifications/NotificationItem.jsx

import { useNavigate } from "react-router-dom";
import { formatRelativeTime, formatDateTime } from "../../utils/formatDate";

function getNotificationDetails(tipo) {
    switch (tipo) {
        case "SOLICITUD_CREADA":
            return {
                label: "Nueva Solicitud",
                bg: "#eff6ff",
                color: "#2563eb",
                borderColor: "#bfdbfe",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                )
            };
        case "SERVICIO_ASIGNADO":
            return {
                label: "Servicio Asignado",
                bg: "#eef2ff",
                color: "#4f46e5",
                borderColor: "#c7d2fe",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                    </svg>
                )
            };
        case "CONDUCTOR_EN_CAMINO":
            return {
                label: "Conductor en Camino",
                bg: "#fef3c7",
                color: "#d97706",
                borderColor: "#fde68a",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                )
            };
        case "SERVICIO_COMPLETADO":
            return {
                label: "Servicio Completado",
                bg: "#f0fdf4",
                color: "#16a34a",
                borderColor: "#bbf7d0",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                )
            };
        case "SOLICITUD_CANCELADA":
            return {
                label: "Solicitud Cancelada",
                bg: "#fef2f2",
                color: "#dc2626",
                borderColor: "#fecaca",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                )
            };
        case "NOVEDAD_REPORTADA":
            return {
                label: "Novedad Reportada",
                bg: "#fff7ed",
                color: "#ea580c",
                borderColor: "#ffedd5",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                )
            };
        case "SISTEMA":
        default:
            return {
                label: "Sistema",
                bg: "#f8fafc",
                color: "#475569",
                borderColor: "#e2e8f0",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                )
            };
    }
}

export default function NotificationItem({ notification, onMarkAsRead, onCloseMenu }) {
    const navigate = useNavigate();

    const id = notification._id || notification.id;
    const isUnread = !notification.leida;
    const config = getNotificationDetails(notification.tipo);
    const createdAt = notification.createdAt;

    const solicitudId =
        typeof notification.solicitud === "object"
            ? notification.solicitud?._id || notification.solicitud?.id
            : notification.solicitud;

    const solicitudCodigo =
        typeof notification.solicitud === "object"
            ? notification.solicitud?.codigo
            : null;

    const novedadId =
        typeof notification.novedad === "object"
            ? notification.novedad?._id || notification.novedad?.id
            : notification.novedad;

    const novedadTitulo =
        typeof notification.novedad === "object"
            ? notification.novedad?.titulo
            : null;

    const handleClickItem = (e) => {
        if (e.target.closest("button[data-action='mark-read']")) {
            return;
        }

        if (isUnread && onMarkAsRead) {
            onMarkAsRead(id);
        }

        if (solicitudId) {
            navigate(`/service-requests`);
            if (onCloseMenu) onCloseMenu();
        } else if (novedadId) {
            navigate(`/incidents`);
            if (onCloseMenu) onCloseMenu();
        }
    };

    const handleMarkSingleRead = (e) => {
        e.stopPropagation();
        if (onMarkAsRead) {
            onMarkAsRead(id);
        }
    };

    return (
        <div
            onClick={handleClickItem}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClickItem(e);
                }
            }}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 16px",
                background: isUnread ? "#f8fbff" : "#ffffff",
                borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
                cursor: (solicitudId || novedadId || isUnread) ? "pointer" : "default",
                transition: "background 0.15s ease",
                position: "relative"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = isUnread ? "#f0f7ff" : "#f8fafc";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = isUnread ? "#f8fbff" : "#ffffff";
            }}
        >
            {/* Indicador visual de no leída (punto azul brillante) */}
            {isUnread && (
                <span
                    style={{
                        position: "absolute",
                        left: 6,
                        top: 18,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#2563eb",
                        boxShadow: "0 0 6px rgba(37, 99, 235, 0.6)"
                    }}
                    title="No leída"
                />
            )}

            {/* Icono temático del tipo de notificación */}
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2
                }}
            >
                {config.icon}
            </div>

            {/* Contenido principal */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: config.color
                        }}
                    >
                        {config.label}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            whiteSpace: "nowrap"
                        }}
                        title={formatDateTime(createdAt)}
                    >
                        {formatRelativeTime(createdAt)}
                    </span>
                </div>

                <div
                    style={{
                        fontSize: 13,
                        fontWeight: isUnread ? 700 : 600,
                        color: "#0f172a",
                        lineHeight: 1.35,
                        marginBottom: 3
                    }}
                >
                    {notification.titulo}
                </div>

                <div
                    style={{
                        fontSize: 12,
                        color: isUnread ? "#334155" : "#64748b",
                        lineHeight: 1.45,
                        wordBreak: "break-word"
                    }}
                >
                    {notification.mensaje}
                </div>

                {/* Etiquetas de referencia si aplica */}
                {(solicitudCodigo || novedadTitulo) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                        {solicitudCodigo && (
                            <span
                                style={{
                                    fontSize: 11,
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    background: "#eff6ff",
                                    color: "#1d4ed8",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4
                                }}
                            >
                                📋 {solicitudCodigo}
                            </span>
                        )}
                        {novedadTitulo && (
                            <span
                                style={{
                                    fontSize: 11,
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    background: "#fff7ed",
                                    color: "#c2410c",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4
                                }}
                            >
                                ⚠️ {novedadTitulo}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Botón para marcar como leída individualmente */}
            {isUnread && (
                <button
                    type="button"
                    data-action="mark-read"
                    onClick={handleMarkSingleRead}
                    title="Marcar como leída"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: 6,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#2563eb";
                        e.currentTarget.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#94a3b8";
                        e.currentTarget.style.background = "transparent";
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
