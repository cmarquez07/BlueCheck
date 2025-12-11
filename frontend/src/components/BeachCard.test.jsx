import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BeachCard } from "./BeachCard";

describe("BeachCard Component", () => {
    const beachMock = {
        id: 0,
        nombre: "Playa Gran",
        municipio: "Portbou",
        descripcion: "La playa se ubica dentro de la bahía del mismo nombre y está muy cerca del puerto de Portbou. Limita por el norte con un tramo rocoso, donde hay algunas calas, y por el suroeste con el embarcadero y el camino asfaltado que conduce al muelle.",
        costa: "Costa Brava norte",
        imagen_url: "G00405_Portbou_general.jpg",
        latitud: "42.4270933527",
        longitud: "3.16079069346",
        medusas: {
            name: "_NO_INFO_",
            text: "Sin información",
            value: "_SENSE_INFORMACI_",
            color: "brightness(0) saturate(100%) invert(73%) sepia(13%) saturate(246%) hue-rotate(179deg) brightness(87%) contrast(89%)"
        },
        estadoCielo: {
            name: "_ESTADOCIELO_3_",
            text: "Entre poco y medio nublado",
            value: "_3_",
            icon: "cloudy.png"
        },
        estadoAgua: {
            name: "_NO_CONTROLADA_",
            text: "No controlada",
            value: "_NO_CONTROLADA_",
            color: "brightness(0) saturate(100%) invert(22%) sepia(0%) saturate(5%) hue-rotate(159deg) brightness(91%) contrast(81%)"
        },
        isFavorite: false
    }

    const renderCard = (props = {}) => {
        const defaultProps = {
            beach: beachMock,
            onImageLoad: vi.fn(),
            onToggleFavorite: vi.fn(),
            ...props
        };

        return render(
            <MemoryRouter>
                <BeachCard {...defaultProps} />
            </MemoryRouter>
        );
    };

    // Render tests
    test("Renderiza el nombre de la playa", () => {
        renderCard();
        expect(screen.getByText("Playa Gran")).toBeInTheDocument();
    });

    test("Renderiza el municipio", () => {
        renderCard();
        expect(screen.getByText("Portbou")).toBeInTheDocument();
    });

    test("Renderiza la descripción", () => {
        renderCard();
        expect(screen.getByText("La playa se ubica dentro de la bahía del mismo nombre y está muy cerca del puerto de Portbou. Limita por el norte con un tramo rocoso, donde hay algunas calas, y por el suroeste con el embarcadero y el camino asfaltado que conduce al muelle."))
            .toBeInTheDocument();
    });

    test("Renderiza la imagen con el src correcto", () => {
        renderCard();
        
        const mainImg = screen.getByAltText("Playa Gran");
        expect(mainImg).toHaveAttribute(
            "src",
            expect.stringContaining("G00405_Portbou_general.jpg")
        );
    });

    // Icons
    test("Renderiza el icono de la medusa", () => {
        renderCard();
        expect(screen.getByAltText("Sin información")).toBeInTheDocument();
    });

    test("Renderiza el icono del cielo", () => {
        renderCard();
        expect(screen.getByAltText("Entre poco y medio nublado")).toBeInTheDocument();
    });

    test("Renderiza el icono de la medusa", () => {
        renderCard();
        expect(screen.getByAltText("No controlada")).toBeInTheDocument();
    });

    // Favoritos
    test("Llamada a onToggleFavorite al pulsar el botón de favorito", () => {
        const onToggleFavorite = vi.fn();
        renderCard({ onToggleFavorite });

        const favButton = screen.getByLabelText("Favorito");
        fireEvent.click(favButton);

        expect(onToggleFavorite).toHaveBeenCalledWith(0);
    });

    test("Llamada a onToggleFavorite al pulsar el botón de favorito", () => {
        renderCard({
            beach: { ...beachMock, isFavorite: true }
        });

        const cardDiv = screen.getByTestId("beach-card");
        expect(cardDiv.className).toMatch(/favorite/);
    });

    // Image Load Event
    test("Llamada a onImageLoad al cargar la imagen principal", () => {
        const onImageLoad = vi.fn();
        renderCard({ onImageLoad });

        const mainImg = screen.getByAltText("Playa Gran");
        fireEvent.load(mainImg);

        expect(onImageLoad).toHaveBeenCalled();
    });

    test("Llamada a onImageLoad al cargar la imagen principal", () => {
        const onImageLoad = vi.fn();
        renderCard({ onImageLoad });

        const mainImg = screen.getByAltText("Playa Gran");
        fireEvent.error(mainImg);

        expect(onImageLoad).toHaveBeenCalled();
    });

    // Distancia
    test("Muestra la distancia si existe", () => {
        renderCard({
            beach: { ...beachMock, distance: "3.12"}
        });

        expect(screen.getByText("📍 A 3.12 Km")).toBeInTheDocument();
    });

    test("No muestra la distancia si no existe", () => {
        renderCard();
        
        const distance = screen.queryByText(/Km/); 
        expect(distance).not.toBeInTheDocument();
    });

    // Routing
    test("El enlace apunta a /beach/:id", () => {
        renderCard();
        
        const link = screen.getByRole("link"); 
        expect(link).toHaveAttribute("href", "/beach/0");
    });

})
