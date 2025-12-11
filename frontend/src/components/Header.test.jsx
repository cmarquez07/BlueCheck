import { describe, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

const mockLogout = vi.fn();

vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        isLoggedIn: true,
        logout: mockLogout
    })
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Header component", () => {
    test("Muestra el botón Logout cuando ha iniciado sesión", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const buttons = screen.getAllByRole("button", { name: "Cerrar sesión" });

        expect(buttons.length).toBeGreaterThan(0);
    });

    test("Muestra el botón Mi cuenta cuando está iniciado sesión", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const myAccountButton = screen.getByRole("link", { name: "Mi cuenta" });

        expect(myAccountButton).toBeInTheDocument();
    });


    test("Logout ejecuta logout, useNavigate y toast", async () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const buttons = screen.getAllByRole("button", { name: "Cerrar sesión" });

        fireEvent.click(buttons[0]);

        const toast = await import("react-hot-toast");

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
        expect(toast.default.success).toHaveBeenCalledWith(
            "🌊Se ha cerrado la sesión correctamente🌊"
        );
    });
});
