import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import toast from "react-hot-toast";
import { vi, describe, it, beforeEach, expect } from "vitest";

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

beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
});

describe("RegisterForm", () => {
    test("Renderiza todos los campos", () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Registrarse/i })).toBeInTheDocument();
    });

    test("Muestra los errores de validación", () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "wrongemail" } });
        expect(screen.getByText(/formato del correo/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: "ab" } });
        expect(screen.getByText(/al menos 3 carácteres/i)).toBeInTheDocument();
    });

    test("Si hay errores no se hace submit", async () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    test("Realiza el registro, muestra un mensaje y navega al login", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { username: "tester" } }),
        });

        toast.promise.mockImplementation((p) => p);

        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.com" } });
        fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: "tester" } });
        fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "Abcd1234!" } });

        fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
            expect(toast.promise).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    test("Muestra un mensaje de error si falla el fetch", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Usuario ya existe" }),
        });

        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.com" } });
        fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: "tester" } });
        fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "Abcd1234!" } });

        fireEvent.click(screen.getByRole("button", { name: /Registrarse/i }));

        await waitFor(() => {
            expect(toast.promise).toHaveBeenCalledWith(expect.any(Promise), expect.objectContaining({
                loading: expect.any(String),
                success: expect.any(Function),
                error: expect.any(Function)
            }));
        });
    });
});
