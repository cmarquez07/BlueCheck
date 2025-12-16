import { render, screen, fireEvent } from "@testing-library/react";
import { BeachList } from "./BeachList";
import { vi } from "vitest";

// Mockear BeachCard (Componente más sencillo para exponer el funcionamiento de BeachList)
vi.mock("./BeachCard", () => ({
    BeachCard: ({ beach, onImageLoad, onToggleFavorite }) => (
        <div data-testid="beach-card-mock">
            <p>{beach.nombre}</p>
            <button
                data-testid={`favorite-${beach.id}`}
                onClick={() => onToggleFavorite(beach.id)}
            >
                Favorita
            </button>
            <img src={beach.src} alt={beach.nombre} />
        </div>
    )
}));

const mockBeaches = [
    { id: 0, nombre: "Playa Gran", image_url: "playa-gran.png"},
    { id: 1, nombre: "Playa d'en Goixa-els Morts", image_url: "playa-morts.png"},
    { id: 2, nombre: "Playa de Garbet", image_url: "playa-garbet.png"}
]

describe("BeachList", () => {
    test("Renderiza el número de BeachCards cirrecto", () => {
        render(<BeachList beaches={mockBeaches} />)

        const items = screen.getAllByTestId("beach-card-mock");
        expect(items.length).toBe(mockBeaches.length);
    });

    test("Muestra los nombres de las playas", () => {
        render(<BeachList beaches={mockBeaches} />);

        mockBeaches.forEach(beach => {
            expect(screen.getByText(beach.nombre)).toBeInTheDocument();
        });
    });

    test("Llamada a onToggleFavorite con el id de playa correcto", () => {
        const onToggleFavorite = vi.fn();

        render(
            <BeachList
                beaches={mockBeaches}
                onToggleFavorite={onToggleFavorite}
            />
        );

        const btn = screen.getByTestId("favorite-1");
        fireEvent.click(btn);

        expect(onToggleFavorite).toHaveBeenCalledWith(1);
    });
})