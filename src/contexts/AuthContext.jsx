import { createContext, useContext, useState } from "react";
import AuthService from "../modules/auth/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = async (correo, password) => {

        const respuesta = await AuthService.login({
            correo,
            password
        });

        const nuevoToken = respuesta.data.token;

        localStorage.setItem("token", nuevoToken);

        setToken(nuevoToken);

        return respuesta;
    };

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
    };

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