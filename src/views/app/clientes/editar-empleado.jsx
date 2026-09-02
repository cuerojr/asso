import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Button,
  InputGroup,
  InputGroupText,
  Input,
  Col,
  Form,
} from "reactstrap";
import { connect } from "react-redux";

import { Tarjeta } from "../../../componentes/tarjeta";
import { fetchUsuarioEmpresa } from "../../../reducers/usuarios-reducer";
import { fetchDetalleCliente } from "../../../reducers/clientes-reducer";
import { NotificationManager } from "../../../components/common/react-notifications";
import { listarUsuariosEmpleados } from "../../../lib/usuarios-api";

const EditarEmpleado = ({
  detalleCliente,
  fetchUsuarioEmpresa,
  fetchDetalleCliente,
  listarUsuariosEmpleados,
  usuarioEmpresa,
  abrirModal,
}) => {
  console.log("🚀 ~ EditarEmpleado ~ detalleCliente:", detalleCliente)
  
  const { cliente, empresa } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioEmpresa(empresa).then((res) => {
      console.log("🚀 ~ EditarEmpleado ~ res:", res)
      if (res && res.payload && res.payload.stat === 1) {
        // Aquí puedes manejar la respuesta exitosa si es necesario
      } else {
        // Aquí puedes manejar el error si es necesario
        NotificationManager.error("No puede editar este usuario empleado", "Error", 4000, null, null, '');
        navigate("/app/clientes/editar-cliente/" + cliente + "/info"); // Redirige a la página de clientes si hay un error
      }
    });
    
  }, [empresa, fetchUsuarioEmpresa]);

  useEffect(() => {
    fetchDetalleCliente(cliente);
  }, [cliente, fetchDetalleCliente]);

  const volverAClientes = () => {
    navigate("/app/clientes");
  };

  if (!detalleCliente) {
    return <div className="loading" />;
  }

  return (
    <Fragment>
      <div className="container">
        <Row>
          <div className="col-md-12 mb-2">
            <Button color="link" className="pl-0" onClick={volverAClientes}>
              &lt; Volver
            </Button>
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
          <div className="col-md-12"></div>
          <div className="col-md-12">
            <div className="separator mt-3"></div>
          </div>
        </Row>

        <Row>
          <Col sm="12">
          <Tarjeta titulo="Datos del cliente">
            <Form>
              <InputGroup className="mb-3">
                <InputGroupText>Empresa</InputGroupText>
                <Input
                  placeholder="Nombre de la Empresa"
                  value={""}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupText>Responsable</InputGroupText>
                <Input
                  placeholder="Nombre de la persona responsable"
                  value={""}
                  onChange={(e) => setNombreResponsable(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupText>E-mail</InputGroupText>
                <Input
                  placeholder="email@email.com"
                  value={""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
              <Button type="submit" color="success" size="lg" className="top-right-button mt-4">
                Editar
              </Button>
            </Form>
          </Tarjeta>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  detalleCliente: state.clientesReducer.detalleClienteState,
  usuarioEmpresa: state.usuariosReducer.usuariosEmpresa,
});

export default connect(mapStateToProps, { fetchUsuarioEmpresa, listarUsuariosEmpleados, fetchDetalleCliente })(
  EditarEmpleado,
);
