import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import CargarNuevoInforme from "../../../contenedores/informes/cargar-nuevo-informe";
import AppLayout from "../../../layout/AppLayout";

const ListaCliente = React.lazy(() => import("./lista-clientes"));
const AltaCliente = React.lazy(() => import("./alta-cliente"));
const EditarCliente = React.lazy(() => import("./editar-cliente"));
const EditarEmpleado = React.lazy(() => import("./editar-empleado"));
const GenerarConsulta = React.lazy(() => import("./generarConsulta"));

const Clientes = ({ abrirModal }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteACargarEnElInforme, setClienteACargarEnElInforme] =
    useState(null);
  const [seccionACargarEnElInforme, setSeccionACargarEnElInforme] =
    useState(null);

  
  return (
    <AppLayout abrirModal={abrirModal} navigate={navigate}>
      <Routes>
        {/* Redirección base */}
        <Route index element={<Navigate to="lista-clientes" replace />} />

        {/* Rutas hijas */}
        <Route
          path="lista-clientes"
          element={<ListaCliente abrirModal={abrirModal} />}
        />
        <Route
          path="alta-cliente"
          element={<AltaCliente abrirModal={abrirModal} />}
        />
        <Route
          path="editar-cliente/:cliente/:seccion"
          element={<EditarCliente abrirModal={abrirModal} />}
        />
        <Route
          path="editar-empleado/:cliente/empleado/:empresa"
          element={<EditarEmpleado />}
        />
        <Route
          path="nuevo-informe/:cliente/generar-consulta"
          element={<GenerarConsulta />}
        />

        {/* Fallback  */}
        <Route path="*" element={<ListaCliente abrirModal={abrirModal} />} />
      </Routes>
    </AppLayout>
  );
};

export default Clientes;
