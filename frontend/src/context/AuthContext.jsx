import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, SetIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        SetIsLoggedIn(!!token);
    }, []);

    const login = (token, userId) => {
        localStorage.setItem("token", token);
        SetIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        SetIsLoggedIn(false);
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