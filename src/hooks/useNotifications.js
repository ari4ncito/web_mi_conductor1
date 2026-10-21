// src/hooks/useNotifications.js

import { useContext } from "react";
import { NotificationContext } from "../contexts/notificationContextInstance";

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications debe usarse dentro de un NotificationProvider"
        );
    }
    return context;
}

export default useNotifications;

