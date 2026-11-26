import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ requiredPermission, adminOnly = false }) {
    const { isAuthenticated, hasPermission, rol } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    const normalizedRol = String(rol || "").trim().toUpperCase();
    if (adminOnly && normalizedRol !== "ADMINISTRADOR" && normalizedRol !== "SUPERADMINISTRADOR") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}