import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { Home } from "./Home";
import { vi, beforeEach, afterEach, describe, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

// Mockear react-hot-toast
vi.mock("react-hot-toast", () => ({
    default: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

// Mockear playas
const mockBeaches = [
    { id: 1, nombre: "Playa Gran", municipio: "Portbou", latitud: "25.10", longitud: "10.12", imagen_url: "playa-gran.png", medusas: { text: "Sin presencia de medusas" }, isFavorite: false },
    { id: 2, nombre: "Playa d'en Goixa-els Morts", municipio: "Colera", latitud: "13.56", longitud: "14.56", imagen_url: "playa-morts.png", medusas: { text: "Presencia de medusas sin peligro" }, isFavorite: false },
];

// Mockear el matchMedia
beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

// Mockear el Fetch
beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
        json: () => Promise.resolve(mockBeaches)
    });
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
});

// Resetear los mocks
afterEach(() => {
    vi.restoreAllMocks();
});

describe("Home", () => {
    test("Renderiza loader al principio", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("Recoge y muestra la lista de playas", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Espera que BeachList tenga hijos
        await waitFor(() => {
            const beachList = screen.getByTestId("beachlist");
            expect(beachList.children.length).toBeGreaterThan(0);
        });

        const beachList = screen.getByTestId("beachlist");
        mockBeaches.forEach(beach => {
            expect(within(beachList).getByText(beach.nombre)).toBeInTheDocument();
        });
    });

    test("Filtra playas por búsqueda", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("beachlist").children.length).toBeGreaterThan(0);
        });

        const input = screen.getByPlaceholderText("Buscar por playa o municipio");
        fireEvent.change(input, { target: { value: "Playa Gran" } });

        const beachList = screen.getByTestId("beachlist");
        await waitFor(() => {
            expect(within(beachList).getByText("Playa Gran")).toBeInTheDocument();
            expect(within(beachList).queryByText("Playa d'en Goixa-els Morts")).not.toBeInTheDocument();
        });
    });

    test("Darle a favorito sin haber iniciado sesión muestra mensaje de error", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("beachlist").children.length).toBeGreaterThan(0);
        });

        const beachList = screen.getByTestId("beachlist");
        const favoriteButtons = within(beachList).getAllByLabelText("Favorito");

        fireEvent.click(favoriteButtons[0]);
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Debes iniciar sesión"));
    });
});
