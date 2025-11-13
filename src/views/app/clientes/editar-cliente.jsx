import React, { Fragment, useState, useEffect } from "react";
import { Row, Nav, NavItem, TabContent, TabPane, Button } from "reactstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";

import Secciones from "../../../contenedores/clientes/secciones";
import Informes from "../../../contenedores/clientes/informes";
import InfoCliente from "../../../contenedores/clientes/info-cliente";
import Rutas from "../../../contenedores/clientes/rutas";
import Equipos from "../../../contenedores/clientes/equipos";
import Novedades from "../../../contenedores/clientes/novedades";

import { connect } from 'react-redux';
import { fetchDetalleCliente } from '../../../reducers/clientes-reducer';

const EditarCliente = ({ detalleCliente, fetchDetalleCliente, abrirModal }) => {
  const { cliente, seccion } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(seccion);

  useEffect(() => {
    setCurrentTab(seccion);
  }, [seccion]);

  useEffect(() => {
    fetchDetalleCliente(cliente);
  }, [cliente, fetchDetalleCliente]);

  const volverAClientes = () => {
    navigate('/app/clientes');
  }

  if (!detalleCliente) {
    return <div className="loading" />;
  }

  const tabs = [
    { id: "equipos", label: "Equipos", component: <Equipos idEmpresa={cliente} currentTab={currentTab} nombreEmpresa={detalleCliente.empresa} /> },
    { id: "secciones", label: "Secciones", component: <Secciones idEmpresa={cliente} currentTab={currentTab} abrirModal={abrirModal} nombreEmpresa={detalleCliente.empresa} /> },
    { id: "informes", label: "Informes", component: <Informes idEmpresa={cliente} currentTab={currentTab} abrirModal={abrirModal} /> },
    { id: "rutas", label: "Rutas", component: <Rutas idEmpresa={cliente} currentTab={currentTab} /> },
    { id: "novedades", label: "Mensajes", component: <Novedades idEmpresa={cliente} currentTab={currentTab} /> },
    { id: "info", label: "Configuración", component: <InfoCliente idEmpresa={cliente} currentTab={currentTab} /> },
  ];

  return (
    <Fragment>
      <div className="container">
        <Row>
          <div className="col-md-12 mb-2">
            <Button color="link" className="pl-0" onClick={volverAClientes}>&lt; Volver</Button>
          </div>
        </Row>
        <Row>
          <div className="col-md-12">
            <h1>{detalleCliente.empresa}</h1>
          </div>
          <div className="col-md-12">
            <div className="separator mb-5"></div>
          </div>
        </Row>

        <Row className="mb-5">
          <div className="col-md-12">
            <Nav tabs className="card-header-tabs">
              {tabs.map(tab => (
                <NavItem key={tab.id}>
                  <NavLink
                    to={`/app/clientes/editar-cliente/${cliente}/${tab.id}`}
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  >
                    {tab.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
          <div className="col-md-12">
            <div className="separator mt-3"></div>
          </div>
        </Row>

        <Row>
          <TabContent activeTab={currentTab} className="mt-4 col-md-12">
            {tabs.map(tab => (
              <TabPane key={tab.id} tabId={tab.id}>
                {tab.id === currentTab && <Row><div className="col-md-12">{tab.component}</div></Row>}
              </TabPane>
            ))}
          </TabContent>
        </Row>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  detalleCliente: state.clientesReducer.detalleClienteState,
});

export default connect(mapStateToProps, { fetchDetalleCliente })(EditarCliente);
