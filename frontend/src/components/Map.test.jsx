import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Map } from "./Map";

// Mockear useIsMobile
vi.mock("../../utils/functions", () => ({
  useIsMobile: vi.fn(),
}));

// Mockear react-leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer"></div>,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({}),
}));

// Mockear Leaflet
vi.mock("leaflet", () => ({
  __esModule: true,
  default: {
    icon: vi.fn(() => ({})),
    Marker: { prototype: { options: {} } },
  },
  icon: vi.fn(() => ({})),
  Marker: { prototype: { options: {} } },
}));


vi.mock("@mui/material/Box", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@mui/material/Fab", () => ({
  default: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@mui/icons-material/Favorite", () => ({
  default: ({ className }) => <span data-testid="fav-icon" className={className}></span>
}));


import { useIsMobile } from "../../utils/functions";
useIsMobile.mockReturnValue(false);

describe("Map component", () => {
  const markers = [
    {
      id: 0,
      position: [41.1, 2.1],
      nombre: "Playa Gran",
      municipio: "Portbou",
      imagen_url: "playa-gran.png",
      isFavorite: false
    },
    {
      id: 1,
      position: [20.2, 12.2],
      nombre: "Playa d'en Goixa-els Morts",
      municipio: "Colera",
      imagen_url: "playa-morts.jpg",
      isFavorite: true
    }
  ];

  test("Renderizar el mapa y las capas base", () => {
    render(<Map markers={markers} onToggleFavorite={() => {}} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
  });

  test("Renderizar un marker por cada playa", () => {
    render(<Map markers={markers} onToggleFavorite={() => {}} />, {
      wrapper: MemoryRouter,
    });

    const renderedMarkers = screen.getAllByTestId("marker");
    expect(renderedMarkers.length).toBe(markers.length);
  });

  test("Renderizar el contenido del popup", () => {
    render(<Map markers={markers} onToggleFavorite={() => {}} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getAllByTestId("popup").length).toBe(2);
    expect(screen.getByText("Playa Gran")).toBeInTheDocument();
    expect(screen.getByText("Playa d'en Goixa-els Morts")).toBeInTheDocument();
  });

  test("Hacer click en el botón de favorito ejecuta onToggleFavorite", () => {
    const mockToggle = vi.fn();

    render(<Map markers={markers} onToggleFavorite={mockToggle} />, {
      wrapper: MemoryRouter,
    });

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockToggle).toHaveBeenCalledWith(0);
  });

});
