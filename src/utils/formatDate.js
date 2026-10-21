// src/utils/formatDate.js

/**
 * Formatea una fecha en tiempo relativo (ej. "Hace 5 min", "Hace 2 h", "Ayer", etc.)
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatRelativeTime(dateInput) {
    if (!dateInput) return "—";

    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "—";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) {
        return "Hace un momento";
    }

    if (diffInSeconds < 60) {
        return `Hace ${diffInSeconds} seg`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
        return "Ayer";
    }

    if (diffInDays < 7) {
        return `Hace ${diffInDays} días`;
    }

    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
}

/**
 * Formatea una fecha completa con hora en español (Colombia).
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateTime(dateInput) {
    if (!dateInput) return "—";

    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

export default {
    formatRelativeTime,
    formatDateTime
};

