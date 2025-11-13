import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import CargarNuevoInforme from "../../contenedores/informes/cargar-nuevo-informe";
import AppLayout from "../../layout/AppLayout";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

// Lazy imports
const Clientes = React.lazy(() => import("./clientes/"));
const Usuarios = React.lazy(() => import("./usuarios"));
const MiUsuario = React.lazy(() => import("./miUsuario"));
const CargaMasivaDeControles = React.lazy(() => import("./carga-masiva"));
const Configuracion = React.lazy(() => import("./configuracion"));
const CargaMasiva = React.lazy(() => import("./cargamasiva"));

const App = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteACargarEnElInforme, setClienteACargarEnElInforme] = useState(null);
  const [seccionACargarEnElInforme, setSeccionACargarEnElInforme] = useState(null);

  const abrirModal = (cliente = null, seccion = null) => {
    setClienteACargarEnElInforme(cliente);
    setSeccionACargarEnElInforme(seccion);
    setModalOpen(!modalOpen);
  };

  return (
    <AppLayout abrirModal={abrirModal} navigate={navigate}>
      {/* Modal global */}
      <Modal isOpen={modalOpen} toggle={abrirModal} size="lg">
        <ModalHeader toggle={abrirModal}>
          Cargar Nuevo Informe
        </ModalHeader>
        <ModalBody>
          <CargarNuevoInforme
            abrirModal={abrirModal}
            clienteACargarEnElInforme={clienteACargarEnElInforme}
            seccionACargarEnElInforme={seccionACargarEnElInforme}
          />
        </ModalBody>
      </Modal>

      <div className="dashboard-wrappers w-full">
        <Suspense fallback={<div className="loading" />}>
          <Routes>
            {/* Redirect inicial /app => /app/clientes */}
            <Route index element={<Navigate to="clientes" replace />} />

            {/* Rutas hijas */}
            <Route path="clientes/*" element={<Clientes abrirModal={abrirModal} />} />
            <Route path="usuarios/*" element={<Usuarios />} />
            <Route path="mi-usuario" element={<MiUsuario />} />
            <Route path="carga-masiva-de-controles" element={<CargaMasivaDeControles />} />
            <Route path="carga-masiva-controles" element={<CargaMasiva />} />
            <Route path="configuracion/*" element={<Configuracion />} />

            {/* Opcional: catch all */}
            <Route path="*" element={<Navigate to="clientes" replace />} />
          </Routes>
        </Suspense>
      </div>
    </AppLayout>
  );
};

export default App;
