/**
 * @jest-environment jsdom
 */

import React from "react";
import { Provider } from "react-redux";
import store from "./reducers/store";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock("./serviceWorker", () => ({
  register: jest.fn(),
}));

jest.mock("./App", () => () => <div>Mocked App</div>);

jest.mock("./lib/baseurl", () => ({
  BASEURL: "http://localhost",
}));


describe("index.js", () => {
  test("Renderiza App dentro de Provider y Suspense", async () => {
    // 👇 Importar index.js ejecuta createRoot/render
    await import("./index");

    const reactDomClient = require("react-dom/client");
    const serviceWorker = require("./serviceWorker");

    expect(reactDomClient.createRoot).toHaveBeenCalled();

    // Extraemos el objeto root creado
    const root = reactDomClient.createRoot.mock.results[0].value;

    expect(root.render).toHaveBeenCalledWith(
      expect.any(Object) // Suspense + Provider + App
    );

    // Verifica que el service worker se haya registrado
    expect(serviceWorker.register).toHaveBeenCalled();
  });
});
