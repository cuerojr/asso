import React, { useEffect, useState, Suspense } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import NotificationContainer from "./components/common/react-notifications/NotificationContainer";
const CargarNuevoInforme = React.lazy(
  () => import("./contenedores/informes/cargar-nuevo-informe"),
);
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { getDirection } from "./helpers/Utils";

const ViewUser = React.lazy(() => import("./views/user"));
const ViewError = React.lazy(() => import("./views/error"));
const InformeGenerado = React.lazy(() => import("./views/informe/index"));

// Lazy imports
const Clientes = React.lazy(() => import("./views/app/clientes/"));
const Usuarios = React.lazy(() => import("./views/app/usuarios"));
const MiUsuario = React.lazy(() => import("./views/app/miUsuario"));
const CargaMasivaDeControles = React.lazy(
  () => import("./views/app/carga-masiva"),
);
const Configuracion = React.lazy(() => import("./views/app/configuracion"));
const CargaMasiva = React.lazy(() => import("./views/app/cargamasiva"));

// Ruta protegida en v6
const AuthRoute = ({ authUser, children }) => {
  const usuario = window.localStorage.getItem("usuario");
  if (authUser || usuario) {
    return children;
  }
  return <Navigate to="/user/login" replace />;
};

const App = ({ user }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteACargarEnElInforme, setClienteACargarEnElInforme] =
    useState(null);
  const [seccionACargarEnElInforme, setSeccionACargarEnElInforme] =
    useState(null);

  const abrirModal = (cliente = null, seccion = null) => {
    setClienteACargarEnElInforme(cliente);
    setSeccionACargarEnElInforme(seccion);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
  }, []);

  return (
    <>
      <NotificationContainer />
      <Modal isOpen={modalOpen} toggle={abrirModal} size="lg">
        <ModalHeader data-testid="modal" toggle={abrirModal}>
          Cargar Nuevo Informe
        </ModalHeader>
        <ModalBody>
          <Suspense fallback={<div>Cargando...</div>}>
            <CargarNuevoInforme
              abrirModal={abrirModal}
              clienteACargarEnElInforme={clienteACargarEnElInforme}
              seccionACargarEnElInforme={seccionACargarEnElInforme}
            />
          </Suspense>
        </ModalBody>
      </Modal>
      <Suspense fallback={<div className="loading" />}>
        <Routes>
          {/* Rutas protegidas */}
          <Route
            path="/app/*"
            element={
              <AuthRoute authUser={user}>
                <Routes>
                  {/* Redirect inicial /app => /app/clientes */}
                  <Route index element={<Navigate to="clientes" replace />} />

                  {/* Rutas hijas */}
                  <Route
                    path="clientes/*"
                    element={<Clientes abrirModal={abrirModal} />}
                  />
                  <Route path="usuarios/*" element={<Usuarios />} />
                  <Route path="mi-usuario" element={<MiUsuario />} />
                  <Route
                    path="carga-masiva-de-controles"
                    element={<CargaMasivaDeControles />}
                  />
                  <Route
                    path="carga-masiva-controles"
                    element={<CargaMasiva />}
                  />
                  <Route path="configuracion/*" element={<Configuracion />} />

                  {/* Opcional: catch all */}
                  <Route
                    path="*"
                    element={<Navigate to="clientes" replace />}
                  />
                </Routes>
              </AuthRoute>
            }
          />

          {/* Rutas públicas */}
          <Route path="/user/*" element={<ViewUser />} />
          <Route path="/error" element={<ViewError />} />

          <Route
            path="/informe-generado/:idEmpresa/:idInforme"
            element={<InformeGenerado />}
          />

          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default connect((state) => ({ user: state.profile.user }))(App);
