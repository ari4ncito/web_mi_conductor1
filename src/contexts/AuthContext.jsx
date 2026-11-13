import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

    const decodedTokenUser = useMemo(() => {
        return parseJwt(token);
    }, [token]);

    const [profileOverride, setProfileOverride] = useState(null);

    const refreshPermissions = useCallback(async () => {
        const activeToken =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");
        if (!activeToken) {
            setProfileOverride(null);
            return null;
        }
        try {
            const response = await AuthService.getProfile();
            const data = response?.data || response;
            if (data && (data.id || data._id || data.rol !== undefined)) {
                setProfileOverride({
                    id: data.id || data._id,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    rol: data.rol || "",
                    permisos: Array.isArray(data.permisos) ? data.permisos : []
                });
                return data;
            }
        } catch (err) {
            // Si el token expiró o el rol fue desactivado (401), limpiar sesión
            if (err?.response?.status === 401) {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                setToken(null);
                setProfileOverride(null);
            }
        }
        return null;
    }, []);

    useEffect(() => {
        if (!token) {
            setProfileOverride(null);
            return;
        }
        void refreshPermissions();

        const handleFocus = () => {
            void refreshPermissions();
        };
        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [token, refreshPermissions]);

    const user = useMemo(() => {
        if (!decodedTokenUser) return null;
        if (!profileOverride) return decodedTokenUser;
        return {
            ...decodedTokenUser,
            ...profileOverride
        };
    }, [decodedTokenUser, profileOverride]);

    const permisos = useMemo(() => {
        if (!user) return [];
        return Array.isArray(user.permisos) ? user.permisos : [];
    }, [user]);

    const rol = user?.rol || "";

    const hasPermission = useCallback((permiso) => {
        if (!user) return false;
        if (rol === "ADMINISTRADOR") return true;
        if (!permiso) return true;
        if (Array.isArray(permiso)) {
            return permiso.some((p) => permisos.includes(p));
        }
        return permisos.includes(permiso);
    }, [user, rol, permisos]);

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
        const datosUsuario = respuesta.data?.usuario || respuesta.usuario;


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

        if (datosUsuario) {
            setProfileOverride({
                id: datosUsuario.id || datosUsuario._id,
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                correo: datosUsuario.correo,
                rol: datosUsuario.rol || "",
                permisos: Array.isArray(datosUsuario.permisos) ? datosUsuario.permisos : []
            });
        } else {
            setProfileOverride(null);
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

        setProfileOverride(null);
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
                refreshPermissions,
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
