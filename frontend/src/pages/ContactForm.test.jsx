import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ContactForm } from "./ContactForm";

vi.mock("../components/Logo", () => ({
  Logo: () => <div data-testid="logo"></div>
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn() },
  success: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ ok: true })
  })
);

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Muestra errores si se intenta enviar el formulario vacío", () => {
    render(<ContactForm />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(screen.getByText("Debes indicar el nombre de usuario o el correo electrónico")).toBeInTheDocument();
    expect(screen.getByText("El correo electrónico es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("Debes indicar un mensaje")).toBeInTheDocument();
  });

  test("Realiza el submit y navega a inicio", async () => {
    render(<ContactForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Carlos" }
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" }
    });

    fireEvent.change(screen.getByPlaceholderText("Mensaje"), {
      target: { value: "Hola" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("Detecta formato de correo electrónico inválido", () => {
    render(<ContactForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "malemail" }
    });

    expect(screen.getByText("El formato del correo electrónico no es válido")).toBeInTheDocument();
  });
});
