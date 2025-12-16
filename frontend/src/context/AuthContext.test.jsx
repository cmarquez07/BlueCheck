// src/contexts/AuthContext.test.jsx
import { describe, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock de un componente de prueba para comprobar el AuthProvider
const TestComponent = () => {
    const { isLoggedIn, login, logout } = useAuth();

    return (
        <div>
            <span data-testid="isLoggedIn">{isLoggedIn ? "true" : "false"}</span>
            <button onClick={() => login("fakeToken", "1")}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe("AuthProvider", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("Inicializa con isLoggedIn = false si no hay token", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("isLoggedIn").textContent).toBe("false");
    });

    test("Inicializa con isLoggedIn = true si hay token", () => {
        localStorage.setItem("token", "real-token");

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("isLoggedIn").textContent).toBe("true");
    });

    test("Al hacer login se guarda el token en localStorage y cambia isLoggedIn", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByText("Login"));

        expect(localStorage.getItem("token")).toBe("fakeToken");
        expect(screen.getByTestId("isLoggedIn").textContent).toBe("true");
    });

    test("logout elimina token de localStorage y cambia isLoggedIn", () => {
        localStorage.setItem("token", "real-token");

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByText("Logout"));

        expect(localStorage.getItem("token")).toBeNull();
        expect(screen.getByTestId("isLoggedIn").textContent).toBe("false");
    });
});
