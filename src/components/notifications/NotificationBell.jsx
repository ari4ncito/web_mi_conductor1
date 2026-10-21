// src/components/notifications/NotificationBell.jsx

import { useEffect, useRef, useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

function BellIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

export default function NotificationBell() {
    const { unreadCount } = useNotifications();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Cerrar al hacer clic fuera del componente
    useEffect(() => {
        if (!open) return undefined;

        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const displayCount = unreadCount > 99 ? "99+" : unreadCount;

    return (
        <div ref={containerRef} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    border: open
                        ? "1px solid rgba(37, 99, 235, 0.4)"
                        : "1px solid rgba(15, 23, 42, 0.08)",
                    background: open ? "#eff6ff" : "#f8fafc",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                    color: open ? "#2563eb" : "#0f172a",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.04)",
                    position: "relative",
                    transition: "all 0.15s ease"
                }}
                title={
                    unreadCount > 0
                        ? `${unreadCount} notificaciones sin leer`
                        : "Notificaciones"
                }
                aria-label={
                    unreadCount > 0
                        ? `Notificaciones, ${unreadCount} no leídas`
                        : "Notificaciones"
                }
                aria-expanded={open}
                aria-haspopup="true"
            >
                <BellIcon />

                {/* Badge de contador de no leídas */}
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: -3,
                            right: -3,
                            minWidth: 18,
                            height: 18,
                            padding: "0 4px",
                            borderRadius: 9,
                            background: "#ef4444",
                            color: "#ffffff",
                            fontSize: 10,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #ffffff",
                            boxShadow: "0 2px 5px rgba(239, 68, 68, 0.4)",
                            lineHeight: 1
                        }}
                    >
                        {displayCount}
                    </span>
                )}
            </button>

            {/* Menú desplegable */}
            {open && <NotificationDropdown onClose={() => setOpen(false)} />}
        </div>
    );
}
