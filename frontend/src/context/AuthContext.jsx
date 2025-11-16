import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggenIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggenIn(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggenIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggenIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}