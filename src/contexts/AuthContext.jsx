import { createContext, useContext, useState } from "react";
import AuthService from "../modules/auth/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    // Primero busca una sesión recordada.
    // Si no existe, busca una sesión temporal.
    const [token, setToken] = useState(
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );


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

        const nuevoToken = respuesta.data.token;


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