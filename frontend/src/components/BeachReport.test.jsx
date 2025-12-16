import { render, screen } from "@testing-library/react";
import { BeachReport } from "./BeachReport";

// Mockear un reporte
const mockReport = {
    id: 1,
    beach_id: 0,
    user_id: 1,
    water_status: "Calmado",
    water_cleanliness: "Algunos residuos",
    beach_cleanliness: "Muchos residuos",
    people_number: "Lleno",
    jellyfish_presence: "Muchas",
    flag_color: "Verde",
    comment: "Test",
    created_at: "2025-12-03T19:08:29.044Z",
    beach_name: "Playa Gran",
    username: "Cristian"
};

describe("BeachReport", () => {
    test("Renderiza el nombre de usuario y el nombre de la playa", () => {
        render(<BeachReport report={mockReport} />);

        expect(screen.getByText(/Reporte de Cristian/i)).toBeInTheDocument();
        expect(screen.getByText("Playa Gran")).toBeInTheDocument();
    });

    test("Renderiza todos los campos del reporte", () => {
        render(<BeachReport report={mockReport} />);

        expect(screen.getByText("Calmado")).toBeInTheDocument();
        expect(screen.getByText("Algunos residuos")).toBeInTheDocument();
        expect(screen.getByText("Muchos residuos")).toBeInTheDocument();
        expect(screen.getByText("Lleno")).toBeInTheDocument();
        expect(screen.getByText("Muchas")).toBeInTheDocument();
    });

    test("Muestra el comentario si existe", () => {
        render(<BeachReport report={mockReport} />);

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    test("No muestra el bloque de comentario si está vacío", () => {
        const noComment = { ...mockReport, comment: "" };

        render(<BeachReport report={noComment} />);

        expect(screen.queryByText("Comentario")).not.toBeInTheDocument();
    });

    test("Aplica correctamente el color de la bandera", () => {
        const reportRojo = { ...mockReport, flag_color: "Roja" };

        render(<BeachReport report={reportRojo} />);

        const badge = screen.getByLabelText("Bandera: Roja");

        expect(badge).toHaveClass("bg-red-500");
    });

    test("Renderiza correctamente la fecha en formato español", () => {
        render(<BeachReport report={mockReport} />);

        // Se comprueba solo dia/mes/año
        const fechaEsperada = /3\/12\/25/;

        expect(screen.getByText(fechaEsperada)).toBeInTheDocument();
    });
});