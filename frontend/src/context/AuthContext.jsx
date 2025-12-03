import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggenIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
        setIsLoggenIn(!!token);
        if (id) {
            setUserId(id);
        }
    }, []);

    const login = (token, userId) => {
        localStorage.setItem("token", token);
        setIsLoggenIn(true);
        setUserId(userId)
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggenIn(false);
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