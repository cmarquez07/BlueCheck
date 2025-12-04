import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, SetIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
        SetIsLoggedIn(!!token);
        if (id) {
            setUserId(id);
        }
    }, []);

    const login = (token, userId) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        SetIsLoggedIn(true);
        setUserId(userId)
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        SetIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}