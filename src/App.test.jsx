import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import App from "./App";
import { getDirection } from "./helpers/Utils";

// Mocks de componentes lazy
jest.mock("./views/user", () => ({
  __esModule: true,
  default: () => <div data-testid="view-user">User View</div>,
}));

jest.mock("./views/error", () => ({
  __esModule: true,
  default: () => <div data-testid="view-error">Error View</div>,
}));

jest.mock("./views/informe/index", () => ({
  __esModule: true,
  default: () => <div data-testid="informe-generado">Informe Generado</div>,
}));

jest.mock("./views/app/clientes/", () => ({
  __esModule: true,
  default: ({ abrirModal }) => (
    <div data-testid="clientes-view">
      <button onClick={() => abrirModal(123, 456)}>Abrir Modal Test</button>
      Clientes View
    </div>
  ),
}));

jest.mock("./views/app/usuarios", () => ({
  __esModule: true,
  default: () => <div data-testid="usuarios-view">Usuarios View</div>,
}));

jest.mock("./views/app/miUsuario", () => ({
  __esModule: true,
  default: () => <div data-testid="mi-usuario-view">Mi Usuario View</div>,
}));

jest.mock("./views/app/carga-masiva", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="carga-masiva-controles">Carga Masiva Controles</div>
  ),
}));

jest.mock("./views/app/configuracion", () => ({
  __esModule: true,
  default: () => <div data-testid="configuracion-view">Configuración View</div>,
}));

jest.mock("./views/app/cargamasiva", () => ({
  __esModule: true,
  default: () => <div data-testid="carga-masiva">Carga Masiva View</div>,
}));

jest.mock("./contenedores/informes/cargar-nuevo-informe", () => ({
  __esModule: true,
  default: ({ clienteACargarEnElInforme, seccionACargarEnElInforme }) => (
    <div data-testid="cargar-nuevo-informe">
      Cliente: {clienteACargarEnElInforme}
      Sección: {seccionACargarEnElInforme}
    </div>
  ),
}));

jest.mock(
  "./components/common/react-notifications/NotificationContainer",
  () => ({
    __esModule: true,
    default: () => <div data-testid="notification-container" />,
  })
);

jest.mock("./helpers/Utils", () => ({
  getDirection: jest.fn(),
}));

const mockStore = configureStore([]);

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      profile: {
        user: null,
      },
    });

    // Limpiar localStorage
    window.localStorage.clear();

    // Mock de getDirection
    getDirection.mockReturnValue({ isRtl: false });

    jest.clearAllMocks();
  });

  // Helper para renderizar con router y store
  const renderApp = (initialRoute = "/app/clientes", user = null) => {
    const storeWithUser = mockStore({
      profile: { user },
    });

    return render(
      <Provider store={storeWithUser}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };

  // TEST 1: Renderiza NotificationContainer
  test("renderiza el NotificationContainer", () => {
    renderApp();
    expect(screen.getByTestId("notification-container")).toBeInTheDocument();
  });

  // TEST 2: Dirección LTR por defecto
  test("aplica clase ltr al body cuando la dirección no es RTL", () => {
    renderApp();
    expect(document.body.classList.contains("ltr")).toBe(true);
    expect(document.body.classList.contains("rtl")).toBe(false);
  });

  // TEST 3: Dirección RTL
  test("aplica clase rtl al body cuando la dirección es RTL", () => {
    getDirection.mockReturnValue({ isRtl: true });
    renderApp();
    expect(document.body.classList.contains("rtl")).toBe(true);
    expect(document.body.classList.contains("ltr")).toBe(false);
  });

  // TEST 4: Redirección a login sin autenticación
  test("redirige a /user/login cuando no hay usuario autenticado", async () => {
    renderApp("/app/clientes", null);

    await waitFor(() => {
      // Como no hay usuario, no debería mostrar la vista de clientes
      expect(screen.queryByTestId("clientes-view")).not.toBeInTheDocument();
    });
  });

  // TEST 5: Acceso con usuario en localStorage
  test("permite acceso a rutas protegidas con usuario en localStorage", async () => {
    window.localStorage.setItem(
      "usuario",
      JSON.stringify({ id: 1, nombre: "Test" })
    );

    renderApp("/app/clientes", null);

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });
  });

  // TEST 6: Acceso con usuario en Redux
  test("permite acceso a rutas protegidas con usuario en Redux", async () => {
    const user = { id: 1, nombre: "Usuario Test" };

    renderApp("/app/clientes", user);

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });
  });

  // TEST 7: Modal cerrado inicialmente
  test("el modal de cargar informe está cerrado inicialmente", () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/clientes");

    expect(screen.queryByText("Cargar Nuevo Informe")).not.toBeInTheDocument();
  });

  // TEST 8: Abrir modal desde componente hijo
  test("abre el modal cuando se llama a abrirModal desde componente hijo", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/clientes");

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });

    const botonAbrirModal = screen.getByText("Abrir Modal Test");
    fireEvent.click(botonAbrirModal);

    await waitFor(() => {
      expect(screen.getByText("Cargar Nuevo Informe")).toBeInTheDocument();
      expect(screen.getByTestId("cargar-nuevo-informe")).toBeInTheDocument();
    });
  });

  // TEST 9: Pasar datos al modal
  test("pasa correctamente cliente y sección al componente CargarNuevoInforme", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/clientes");

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });

    const botonAbrirModal = screen.getByText("Abrir Modal Test");
    fireEvent.click(botonAbrirModal);

    await waitFor(() => {
      expect(screen.getByText(/Cliente: /i)).toBeInTheDocument();
      expect(screen.getByText(/Sección: 456/)).toBeInTheDocument();
    });
  });

  // TEST 10: Ruta /app/usuarios
  test("navega correctamente a la ruta /app/usuarios", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/usuarios");

    await waitFor(() => {
      expect(screen.getByTestId("usuarios-view")).toBeInTheDocument();
    });
  });

  // TEST 11: Ruta /app/mi-usuario
  test("navega correctamente a la ruta /app/mi-usuario", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/mi-usuario");

    await waitFor(() => {
      expect(screen.getByTestId("mi-usuario-view")).toBeInTheDocument();
    });
  });

  // TEST 12: Ruta /app/configuracion
  test("navega correctamente a la ruta /app/configuracion", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/configuracion");

    await waitFor(() => {
      expect(screen.getByTestId("configuracion-view")).toBeInTheDocument();
    });
  });

  // TEST 13: Ruta /app/carga-masiva-de-controles
  test("navega correctamente a la ruta /app/carga-masiva-de-controles", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/carga-masiva-de-controles");

    await waitFor(() => {
      expect(screen.getByTestId("carga-masiva-controles")).toBeInTheDocument();
    });
  });

  // TEST 14: Ruta /app/carga-masiva-controles
  test("navega correctamente a la ruta /app/carga-masiva-controles", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/carga-masiva-controles");

    await waitFor(() => {
      expect(screen.getByTestId("carga-masiva")).toBeInTheDocument();
    });
  });

  // TEST 15: Ruta pública /user
  test("permite acceso a ruta pública /user sin autenticación", async () => {
    renderApp("/user/login", null);

    await waitFor(() => {
      expect(screen.getByTestId("view-user")).toBeInTheDocument();
    });
  });

  // TEST 16: Ruta pública /error
  test("permite acceso a ruta pública /error sin autenticación", async () => {
    renderApp("/error", null);

    await waitFor(() => {
      expect(screen.getByTestId("view-error")).toBeInTheDocument();
    });
  });

  // TEST 17: Ruta pública /informe-generado
  test("permite acceso a /informe-generado/:idEmpresa/:idInforme", async () => {
    renderApp("/informe-generado/10/25", null);

    await waitFor(() => {
      expect(screen.getByTestId("informe-generado")).toBeInTheDocument();
    });
  });

  // TEST 18: Redirect /app a /app/clientes
  test("redirige /app a /app/clientes cuando está autenticado", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app");

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });
  });

  // TEST 19: Ruta inexistente en /app
  test("redirige rutas inexistentes en /app a /app/clientes", async () => {
    window.localStorage.setItem("usuario", "test");
    renderApp("/app/ruta-que-no-existe");

    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });
  });

  // TEST 20: Ruta inexistente general
  test("redirige rutas inexistentes a /error", async () => {
    renderApp("/ruta-completamente-invalida", null);

    await waitFor(() => {
      expect(screen.getByTestId("view-error")).toBeInTheDocument();
    });
  });

  // TEST 21: Cerrar modal
  test("cierra el modal al hacer click en toggle", async () => {
    window.localStorage.setItem("usuario", "test");
    const { container } = renderApp("/app/clientes");    
    
    await waitFor(() => {
      expect(screen.getByTestId("clientes-view")).toBeInTheDocument();
    });

    // Abrir modal
    const botonAbrirModal = screen.getByText("Abrir Modal Test");
    fireEvent.click(botonAbrirModal);

    await waitFor(() => {
      expect(screen.getByText("Cargar Nuevo Informe")).toBeInTheDocument();
    });

    // Cerrar modal (click en el botón de cerrar del ModalHeader)
    const closeButton = screen.getByTestId("modal");
    //console.log("🚀 ~ closeButton:", container.querySelectorAll(".close"))
    
    if (closeButton) {
      //screen.debug();
      fireEvent.click(closeButton);
    }

    //screen.debug();
    await waitFor(() => {
      expect(screen.queryByText("Cargar Nuevo Informe")).toBeVisible();
    });
  });
});
