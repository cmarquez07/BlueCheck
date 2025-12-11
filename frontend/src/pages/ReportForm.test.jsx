import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReportForm } from "./ReportForm";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import toast from "react-hot-toast";

// Helper el componente Select de Material UI
const selectValue = async (label, value) => {
  const select = screen.getByLabelText(label);
  fireEvent.mouseDown(select); // abre el menú
  const item = await screen.findByText(value); // espera el MenuItem
  fireEvent.click(item); // selecciona el valor
};

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
    useParams: () => ({ id: "1" }),
  };
});

// Mock fetch
global.fetch = vi.fn();

describe("ReportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fakeToken");
  });

  test("Renderiza todos los campos", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ playa: { nombre: "Playa Gran" } }),
    });

    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Enviar reporte para la playa "Playa Gran"/)).toBeInTheDocument();
    expect(screen.getByLabelText("Estado del mar")).toBeInTheDocument();
    expect(screen.getByLabelText("Limpieza del agua")).toBeInTheDocument();
    expect(screen.getByLabelText("Limpieza de la playa")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad de gente")).toBeInTheDocument();
    expect(screen.getByLabelText("Presencia de medusas")).toBeInTheDocument();
    expect(screen.getByLabelText("Color de la bandera")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mensaje")).toBeInTheDocument();
    expect(screen.getByText("Enviar reporte")).toBeInTheDocument();
  });

  test("Si los campos están vacíos se muestran errores", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ playa: { nombre: "Playa Gran" } }),
    });

    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Enviar reporte"));

    await waitFor(() => {
      expect(screen.getAllByText("Selecciona una opción").length).toBe(6);
    });
  });

  test("Envía el formulario y navega", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ playa: { nombre: "Playa Gran" } }) }) // fetch playa
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }); // enviar reporte

    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

      // Se selecciona el valor de los selects con el helper
      await selectValue("Estado del mar", "Calmado");
      await selectValue("Limpieza del agua", "Limpia");
      await selectValue("Limpieza de la playa", "Algunos residuos");
      await selectValue("Cantidad de gente", "Poca gente");
      await selectValue("Presencia de medusas", "No");
      await selectValue("Color de la bandera", "Verde");


    fireEvent.click(screen.getByText("Enviar reporte"));

    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/beach/1");
    });
  });

  test("Si falla el envío se muestra un mensaje de error", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ playa: { nombre: "Playa Gran" } }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ message: "Error en el servidor" }) });

    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

      // Se selecciona el valor de los selects con el helper
      await selectValue("Estado del mar", "Calmado");
      await selectValue("Limpieza del agua", "Limpia");
      await selectValue("Limpieza de la playa", "Algunos residuos");
      await selectValue("Cantidad de gente", "Poca gente");
      await selectValue("Presencia de medusas", "No");
      await selectValue("Color de la bandera", "Verde");

    fireEvent.click(screen.getByText("Enviar reporte"));

    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
  });
});
