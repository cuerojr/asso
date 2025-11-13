import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ListaCliente = React.lazy(() => import("./lista-clientes"));
const AltaCliente = React.lazy(() => import("./alta-cliente"));
const EditarCliente = React.lazy(() => import("./editar-cliente"));
const GenerarConsulta = React.lazy(() => import("./generarConsulta"));

const Clientes = ({ abrirModal }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Routes>
        {/* Redirección base */}
        <Route index element={<Navigate to="lista-clientes" replace />} />

        {/* Rutas hijas */}
        <Route path="lista-clientes" element={<ListaCliente abrirModal={abrirModal} />} />
        <Route path="alta-cliente" element={<AltaCliente abrirModal={abrirModal} />} />
        <Route
          path="editar-cliente/:cliente/:seccion"
          element={<EditarCliente abrirModal={abrirModal} />}
        />
        <Route
          path="nuevo-informe/:cliente/generar-consulta"
          element={<GenerarConsulta />}
        />

        {/* Fallback  */}
        <Route path="*" element={<ListaCliente abrirModal={abrirModal} />} />
      </Routes>
    </Suspense>
  );
};

export default Clientes;
