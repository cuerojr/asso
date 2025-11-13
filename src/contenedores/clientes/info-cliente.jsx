import React, { Fragment, useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Button,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { NavLink } from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta";
import { NotificationManager } from "../../components/common/react-notifications";
import {
  fetchDetalleCliente,
  fetchUpdateCliente,
  fetchdeleteCliente,
} from "../../reducers/clientes-reducer";
import classnames from "classnames";
import { connect } from "react-redux";
import Estados from "./estados";
import Fallas from "./fallas";
import { habilitarDeshabilitarCliente } from "../../lib/clientes-api";
import Empleados from "./empleados";
import { useNavigate } from "react-router-dom";

const InfoCliente = (props) => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [responsable, setResponsable] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [tituloContrato, setTituloContrato] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [currentTab, setCurrentTab] = useState("datos");
  const [mostrarModalConfirmarEliminarCliente, setMostrarModalConfirmarEliminarCliente] =
    useState(false);
  const [habilitacion, setHabilitacion] = useState(null);

  useEffect(() => {
    if (props.currentTab === "info") {
      props.fetchDetalleCliente(props.idEmpresa);
    }
  }, [props.currentTab]);

  useEffect(() => {
    if (props.detalleCliente) {
      const cliente = props.detalleCliente;
      setClienteId(cliente.id);
      setNombre(cliente.empresa);
      setResponsable(cliente.responsable);
      setEmail(cliente.email);
      setNumero(cliente.contrato_vigente_nro);
      setDescripcion(cliente.descripcion);
      setTituloContrato(cliente.titulo);
      setHabilitacion(Number(cliente.habilitado));
    }
  }, [props.detalleCliente]);

  const cambiarTab = (e, tab) => {
    e.preventDefault();
    setCurrentTab(tab);
  };

  const habDeshab = () => {
    const h = habilitacion === 1 ? 0 : 1;
    setHabilitacion(h);
    habilitarDeshabilitarCliente(props.detalleCliente.id, h);
  };

  const actualizarCliente = (
    id,
    email,
    nombre,
    responsable,
    numeroContratoVigente,
    tituloContrato,
    descripcion
  ) => {
    props
      .fetchUpdateCliente(
        id,
        email,
        nombre,
        responsable,
        numeroContratoVigente,
        tituloContrato,
        descripcion
      )
      .then(function (res) {
        if (res && res.payload && res.payload.stat === 1) {
          NotificationManager.success(
            "La información del cliente ha sido actualizada",
            "Hecho",
            3000,
            null,
            null,
            ""
          );
          props.fetchDetalleCliente(props.idEmpresa);
        }
      });
  };

  const deleteCliente = () => {
    props.fetchdeleteCliente(clienteId).then(function (res) {
      if (res && res.payload && res.payload.stat === 1) {
        NotificationManager.success(
          "El cliente ha sido eliminado",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
        navigate("/app/clientes"); 
      }
    });
  };

  return (
    <Fragment>
      <Modal isOpen={mostrarModalConfirmarEliminarCliente} size="md">
        <ModalBody>
          <p>
            Advertencia: vas a eliminar un cliente. Toda la información que esté
            asociada a este cliente, también será eliminada del sistema.
          </p>
          <p>
            Si solo quiere evitar el acceso al sistema de este cliente, pero
            mantener su información, puede utilizar la opción “deshabilitar”.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteCliente}>
            Si, eliminar cliente
          </Button>
          <Button
            color="info"
            onClick={() => {
              setMostrarModalConfirmarEliminarCliente(false);
            }}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Row>
        <div className="col-md-12">
          <Nav tabs className="card-header-tabs float-left">
            <NavItem>
              <NavLink
                className={classnames({
                  active: currentTab === "datos",
                  "nav-link": true,
                })}
                onClick={(e) => {
                  cambiarTab(e, "datos");
                }}
                to="#"
              >
                DATOS DEL CLIENTE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: currentTab === "contrato",
                  "nav-link": true,
                })}
                onClick={(e) => {
                  cambiarTab(e, "contrato");
                }}
                to="#"
              >
                CONTRATO VIGENTE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: currentTab === "empleados",
                  "nav-link": true,
                })}
                onClick={(e) => {
                  cambiarTab(e, "empleados");
                }}
                to="#"
              >
                USUARIOS EMPLEADO
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: currentTab === "escala",
                  "nav-link": true,
                })}
                onClick={(e) => {
                  cambiarTab(e, "escala");
                }}
                to="#"
              >
                ESCALA DE ESTADOS DE EQUIPOS
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: currentTab === "fallas",
                  "nav-link": true,
                })}
                onClick={(e) => {
                  cambiarTab(e, "fallas");
                }}
                to="#"
              >
                TIPOS DE FALLAS
              </NavLink>
            </NavItem>
          </Nav>
          {(currentTab === "datos" || currentTab === "contrato") && (
            <div className="float-right">
              <Button
                color="success"
                className="mr-2"
                onClick={() => {
                  actualizarCliente(
                    clienteId,
                    email,
                    nombre,
                    responsable,
                    numero,
                    tituloContrato,
                    descripcion
                  );
                }}
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>
      </Row>

      <Row>
        <TabContent activeTab={currentTab} className="mt-4 col-md-12">
          <TabPane tabId="datos">
            <Tarjeta titulo="Datos del cliente">
              <div className="habilitar-switch">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={!!habilitacion}
                    id="customSwitch1"
                    onChange={habDeshab}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customSwitch1"
                  >
                    {habilitacion ? "habilitado" : "deshabilitado"}
                  </label>
                </div>
              </div>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">Empresa</InputGroupAddon>
                <Input
                  placeholder="Nombre de la empresa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  Responsable
                </InputGroupAddon>
                <Input
                  placeholder="Nombre de la persona responsable"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">E-mail</InputGroupAddon>
                <Input
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Tarjeta>
            <h3 className="mt-3">ELIMINAR CLIENTE:</h3>
            <p>
              Atención: Al eliminar el cliente, todos los datos y documentos
              relacionados al mismo, se borrarán del sistema de forma definitiva.
            </p>
            <Button
              color="danger"
              onClick={() => {
                setMostrarModalConfirmarEliminarCliente(true);
              }}
            >
              ENTENDIDO, ELIMINAR CLIENTE
            </Button>
          </TabPane>

          <TabPane tabId="contrato">
            <Tarjeta titulo="Contrato vigente">
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">Número</InputGroupAddon>
                <Input
                  placeholder="C001890AR"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">Título</InputGroupAddon>
                <Input
                  placeholder="Título del contrato"
                  value={tituloContrato}
                  onChange={(e) => setTituloContrato(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  Descripción
                </InputGroupAddon>
                <Input
                  placeholder="Breve descripción del Contrato"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </InputGroup>
            </Tarjeta>
          </TabPane>

          <TabPane tabId="empleados">
            <Empleados />
          </TabPane>

          <TabPane tabId="escala">
            <Estados idEmpresa={props.idEmpresa} />
          </TabPane>

          <TabPane tabId="fallas">
            <Fallas idEmpresa={props.idEmpresa} />
          </TabPane>
        </TabContent>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    detalleCliente: state.clientesReducer.detalleClienteState,
  };
};

export default connect(mapStateToProps, {
  fetchDetalleCliente,
  fetchUpdateCliente,
  fetchdeleteCliente,
})(InfoCliente);
