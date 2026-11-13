import { createContext, useContext, useMemo, useState } from "react";
import AuthService from "../modules/auth/services/authService";

const AuthContext = createContext();

function parseJwt(token) {
    try {
        if (!token) return null;
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding token:", e);
        return null;
    }
}

export function AuthProvider({ children }) {

    // Primero busca una sesión recordada.
    // Si no existe, busca una sesión temporal.
    const [token, setToken] = useState(
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );

    const user = useMemo(() => {
        return parseJwt(token);
    }, [token]);

    const permisos = useMemo(() => {
        if (!user) return [];
        return Array.isArray(user.permisos) ? user.permisos : [];
    }, [user]);

    const rol = user?.rol || "";

    const hasPermission = (permiso) => {
        if (!user) return false;
        if (rol === "ADMINISTRADOR") return true;
        if (!permiso) return true;
        if (Array.isArray(permiso)) {
            return permiso.some((p) => permisos.includes(p));
        }
        return permisos.includes(permiso);
    };

    // ==========================================
    // LOGIN
    // ==========================================

    const login = async (
        correo,
        password,
        rememberMe = false
    ) => {

        const respuesta = await AuthService.login({
            correo,
            password
        });

        const nuevoToken = respuesta.data?.token || respuesta.token;


        // Limpiamos cualquier sesión anterior
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");


        // ==========================================
        // RECORDAR SESIÓN
        // ==========================================

        if (rememberMe) {

            // El usuario marcó "Recordarme"
            localStorage.setItem(
                "token",
                nuevoToken
            );

        } else {

            // Sesión temporal
            sessionStorage.setItem(
                "token",
                nuevoToken
            );
        }


        setToken(nuevoToken);

        return respuesta;
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        // Eliminamos ambos por seguridad
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        setToken(null);
    };


    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    const isAuthenticated = !!token;


    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                rol,
                permisos,
                hasPermission,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);

}
