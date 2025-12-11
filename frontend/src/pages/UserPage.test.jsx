import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserPage } from "./UserPage";
import toast from "react-hot-toast";

// Mockear react-hot-toast
vi.mock('react-hot-toast', () => {
    const toastMock = {
        promise: vi.fn((p) => p),
        error: vi.fn(),
        success: vi.fn(),
    };
    return { default: toastMock };
});

// Mockear react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mockear fetch
global.fetch = vi.fn();

describe("UserPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("token", "fakeToken");
    });

    test("Renderiza loader al principio", () => {
        fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );
        expect(screen.getAllByTestId("loader").length).toBeGreaterThanOrEqual(1);
    });


    test("Recoge y muestra los datos del usuario, sus reportes y sus favoritos", async () => {
        const userData = { email: "test@test.com", username: "tester", name: "Test User" };
        const reportsData = [{ id: 1, title: "Reporte 1" }];
        const favoritesData = [{ id: 0, nombre: "Playa Gran" }];

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => userData })   // get-user
            .mockResolvedValueOnce({ ok: true, json: async () => reportsData }) // get-user-reports
            .mockResolvedValueOnce({ ok: true, json: async () => favoritesData }); // get-user-favorites

        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Campos del formulario
            expect(screen.getByDisplayValue("test@test.com")).toBeInTheDocument();
            expect(screen.getByDisplayValue("tester")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();

            // Favoritos
            expect(screen.getByAltText("Playa Gran")).toBeInTheDocument();
            expect(screen.getAllByTestId("beach-card").length).toBeGreaterThanOrEqual(1);

            // Reportes
            expect(screen.getByText(/Reporte de/i)).toBeInTheDocument();
        });

    });

    test("navega al login si no hay token", async () => {
        localStorage.removeItem("token");
        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    test("muestra toast de error si falla fetch", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));
        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("🚩Error al cargar los datos🚩");
        });
    });

    test("valida campos del formulario", async () => {
        const userData = { email: "", username: "", name: "", password: "" };
        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => userData })
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });

        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );

        await waitFor(() => { });

        fireEvent.click(screen.getByText("Guardar cambios"));

        await waitFor(() => {
            expect(screen.getByText("El correo electrónico es obligatorio")).toBeInTheDocument();
            expect(screen.getByText("El nombre de usuario es obligatorio")).toBeInTheDocument();
            expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
        });
    });

    test("llama a toast.promise al actualizar usuario correctamente", async () => {
        const userData = { email: "a@b.com", username: "user", name: "User" };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => userData })
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }); // update-user

        render(
            <MemoryRouter>
                <UserPage />
            </MemoryRouter>
        );

        await waitFor(() => { });

        fireEvent.click(screen.getByText("Guardar cambios"));

        await waitFor(() => {
            expect(toast.promise).toHaveBeenCalled();
        });
    });
});
