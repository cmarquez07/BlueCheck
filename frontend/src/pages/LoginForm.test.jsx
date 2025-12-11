import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../pages/LoginForm";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import { vi } from "vitest";

// Mockear el login
const mockLogin = vi.fn();

// Mockear del context
vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({ login: mockLogin }),
}));

// Mockear react-hot-toast
vi.mock('react-hot-toast', () => {
  const toastMock = {
    promise: vi.fn((p) => p),
    error: vi.fn(),
    success: vi.fn(),
  };
  return { default: toastMock };
});

// Mockear useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ children, to }) => <a href={to}>{children}</a>,
    };
});

describe("LoginForm", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        global.fetch = vi.fn();
    });

    test("Renderiza todos los campos", () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Iniciar sesión/i })).toBeInTheDocument();
    });

    test("Si los campos están vacíos se muestran errores", async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(screen.getByText(/Debes indicar el nombre de usuario/i)).toBeInTheDocument();
            expect(screen.getByText(/Debes indicar la contraseña/i)).toBeInTheDocument();
        });
    });

    test("Realiza el login y navega al home", async () => {
        const userResponse = {
            token: "fakeToken",
            user: { id: 1, username: "User" },
        };
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => userResponse,
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "password" } });

        fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("fakeToken", 1);
            expect(toast.promise).toHaveBeenCalled();
        });
    });

    test("Muestra mensaje de error si el inicio de sesión es incorrecto", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Usuario o contraseña incorrectos" }),
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "wrongpass" } });

        fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(toast.promise).toHaveBeenCalled();
        });
    });
});
