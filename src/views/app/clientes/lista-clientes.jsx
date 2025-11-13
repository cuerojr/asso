import React, { useEffect } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { connect } from "react-redux";
import { fetchListarClientes, limpiarClienteSeleccionado } from "../../../reducers/clientes-reducer";
import { ItemListaCliente } from "../../../componentes/itemListaClientes";
import { habilitarDeshabilitarCliente } from "../../../lib/clientes-api";
import Notificaciones from "../../../componentes/notificaciones";
import { useLocation, useNavigate } from "react-router-dom";

const ListaCliente = ({
  clientes,
  fetchListarClientes,
  abrirModal,
  detalleClienteState,
  limpiarClienteSeleccionado,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ejecuta fetchListarClientes cada vez que cambia la ruta
  useEffect(() => {
    fetchListarClientes();
  }, [fetchListarClientes, location.pathname]);

  const habDeshab = (id, h) => {
    habilitarDeshabilitarCliente(id, h).then(() => {
      fetchListarClientes();
    });
  };

  const cargarMasivamenteControles = () => {
    navigate("/app/carga-masiva-controles");
  };

  const crearNuevoCliente = () => {
    navigate("/app/clientes/alta-cliente");
  };

  useEffect(() => {
    if (detalleClienteState) {
      limpiarClienteSeleccionado();
    }
  }, [detalleClienteState, limpiarClienteSeleccionado]);

  return (
    <>
      <div className="mb-2 row">
        <div className="col-xs-12 col-md-4 mb-2">
          <Card>
            <CardBody className="text-center">
              <h3>CARGAR CONTROLES</h3>
              <Button color="primary" size="md" onClick={cargarMasivamenteControles}>
                <i className="simple-icon-target"></i> COMENZAR
              </Button>
            </CardBody>
          </Card>
        </div>
        <div className="col-xs-12 col-md-4 mb-2">
          <Card>
            <CardBody className="text-center">
              <h3>CARGAR UN INFORME</h3>
              <Button color="primary" size="md" onClick={abrirModal}>
                <i className="simple-icon-cloud-upload"></i> COMENZAR
              </Button>
            </CardBody>
          </Card>
        </div>
        <div className="col-xs-12 col-md-4 mb-2">
          <Card>
            <CardBody className="text-center">
              <h3>ENVIAR NOVEDADES</h3>
              <Notificaciones mostrarBt={true} cambiarLabel={true} />
            </CardBody>
          </Card>
        </div>
        <div className="col-12">
          <hr />
        </div>
      </div>
      <Row>
        <Col>
          <h1>Listado de Clientes</h1>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={crearNuevoCliente}>
            <i className="simple-icon-user-follow"></i> NUEVO CLIENTE
          </Button>
        </Col>
      </Row>
      <Row>
        {clientes.map((cliente) => (
          <ItemListaCliente
            key={cliente.id}
            item={cliente}
            habDeshab={habDeshab}
          />
        ))}
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientes: state.clientesReducer.clientes,
  detalleClienteState: state.clientesReducer.detalleClienteState,
});

export default connect(mapStateToProps, { fetchListarClientes, limpiarClienteSeleccionado })(ListaCliente);
