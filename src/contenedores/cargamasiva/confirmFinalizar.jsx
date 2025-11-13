import React, { useState, Fragment } from "react";
import { Row, Col, Button, Modal, ModalBody } from "reactstrap";
import DatosPrincipales from "./datosPrincipales";
import { WithWizard } from "react-albus";
import moment from "moment";

const ConfirmarFinalizarCarga = (props) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  useState(() => {
    if (props.detalleConfirmFinalizarCarga != "") {
      setMostrarModal(true);
    }
  }, [props.detalleConfirmFinalizarCarga]);

  const cerrarModal = () => {
    props.setDetalleConfirmFinalizarCarga("");
    setMostrarModal(false);
  };
  return (
    <Fragment>
      <Modal
        isOpen={mostrarModal}
        size="lg"
        style={{ maxWidth: "1400px", width: "95%" }}
      >
        <ModalBody>
          <Row>
            <Col className="text-center">
              <h2> FINALIZAR LA CARGA DE CONTROLES</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <DatosPrincipales
                titulodeReferencia={props.titulodeReferencia}
                clienteSeleccionadoLabel={props.clienteSeleccionadoLabel}
                tipoDeControlSeleccionadoLabel={
                  props.tipoDeControlSeleccionadoLabel
                }
              />
            </Col>
          </Row>
          <Row>
            <Col className="border p-2 bg-black borde-gris">
              CANT. DE EQUIPOS:{" "}
              {props.detalleConfirmFinalizarCarga.total_equipos}
            </Col>
            <Col className="border p-2 bg-black borde-gris">
              CONTROLADOS:{" "}
              {props.detalleConfirmFinalizarCarga.equipos_testeados}
            </Col>
            <Col className="border p-2 bg-black borde-gris" md="6">
              FECHA DE INSPECCIÓN: ENTRE{" "}
              {moment(props.detalleConfirmFinalizarCarga.primer_test).format(
                "DD/MM/YYYY"
              )}{" "}
              Y{" "}
              {moment(props.detalleConfirmFinalizarCarga.ultimo_test).format(
                "DD/MM/YYYY"
              )}
            </Col>
          </Row>
          <Row className="mt-5 text-center">
            <Col>
              <h3>¿ESTÁ SEGURO QUE QUIERE FINALIZAR LA CARGA?</h3>
              <p>
                Al finalizar la carga de controles, todos los daots ingresados
                quedarán publicados y visibles para el cliente.
                <br />
                Por favor, revise bien los datos antes de finalizar.
              </p>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col className="text-center">
              <Button color="primary" className="mr-2" onClick={cerrarModal}>
                {" "}
                NO, VOLVER A LA CARGA DE CONTROLES{" "}
                <i className="simple-icon-close" />
              </Button>
              <WithWizard
                render={({ next, previous, step, steps }) => (
                  <Button
                    color="success"
                    onClick={() => {
                      props.finalizar(next, steps, step);
                    }}
                    className="ml-2"
                  >
                    SI, FINALIZAR LA CARGA DE CONTROLES{" "}
                    <i className="simple-icon-check" />
                  </Button>
                )}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h3>RESUMEN:</h3>
            </Col>
          </Row>
          <Row>
            <Col className="table-resumen">
              <table>
                <tbody>
                  <tr>
                    <th>EQUIPO</th>
                    <th>FECHA</th>
                    <th>ESTADO</th>
                    <th>FALLA</th>
                    <th>OBSERVACIONES</th>
                    <th>RECOMENDACIONES</th>
                  </tr>
                  {props.detalleConfirmFinalizarCarga.equipos.map((equipo) => {
                    return (
                      <Fragment>
                        <tr>
                          <td colSpan="6" style={{ background: "#000" }}>
                            <strong>{equipo.nombre_equipo}</strong>
                          </td>
                        </tr>
                        {equipo.componentes.length > 0 &&
                          equipo.componentes.map((componente) => {
                            return (
                              <tr>
                                <td>{componente.nombre}</td>
                                <td>
                                  {componente.tests.length > 0 &&
                                    componente.tests[0].fecha}
                                </td>
                                {equipo.noControlado === 1 ? (
                                  <td>NO CONTROLADO</td>
                                ) : (
                                  <>
                                    {componente.tests.length > 0 ? (
                                      <td
                                        style={{
                                          background: componente.tests[0].color,
                                        }}
                                      >
                                        {componente.tests[0].estado}
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                  </>
                                )}
                                {componente.tests.length > 0 ? (
                                  <td>
                                    {componente.tests[0].fallas.length > 0 ? (
                                      componente.tests[0].fallas[0].falla
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                ) : (
                                  <td></td>
                                )}
                                {equipo.noControlado === 1 ? (
                                  <td>
                                    Motivo: {equipo.motivoNoControlado} <br />{" "}
                                    Observaciones:{" "}
                                    {equipo.observacionNoControlado}
                                  </td>
                                ) : (
                                  <td>
                                    {componente.tests.length > 0 &&
                                      componente.tests[0].observaciones}
                                  </td>
                                )}
                                <td>
                                  {componente.tests.length > 0 &&
                                    componente.tests[0].recomendaciones}
                                </td>
                              </tr>
                            );
                          })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default ConfirmarFinalizarCarga;
