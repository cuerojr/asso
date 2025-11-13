import React, { useState, Fragment, useEffect } from "react";
import { Row, Col, Button, Modal, ModalBody, Table } from "reactstrap";
import DatosPrincipales from "./DatosPrincipales";
import { WithWizard } from "react-albus";
import {
  confirmDetalleFinalizarCarga,
  finalizarCargaMasiva,
  cargaControlPorComponente,
  guardarEquipoNoControlado,
} from "../../../../lib/cargas-masivas-api";
import { connect } from "react-redux";
import moment from "moment";
import { NotificationManager } from "../../../../components/common/react-notifications";
import {
  setearCantidadesFinalesAction,
  setearEquipoNoControlado,
  cleanControlesDelEquipo,
} from "../../../../reducers/cargas-masivas-reducer";

const FInalizar = ({
  cargaMasiva,
  setearCantidadesFinalesAction,
  controlesDelEquipo,
  equipoNoControlado,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detalleConfirmFinalizarCarga, setDetalleConfirmFinalizarCarga] =
    useState(null);
  const [imagenesPorComponente, setImagenesPorComponente] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const abrirModal = async () => {
    setIsLoading(true);

    // Guardar imágenes en un state (por componente)
    const imagenesMap = {};
    controlesDelEquipo.forEach((control) => {
      if (control.componente && control.imagenes?.length > 0) {
        imagenesMap[control.componente] = control.imagenes;
      }
    });
    setImagenesPorComponente(imagenesMap);

    if (equipoNoControlado) {
      const res = await guardarEquipoNoControlado(
        equipoNoControlado.idCargaMasiva,
        equipoNoControlado.equipoSeleccionadoEnCargaMasiva,
        equipoNoControlado.motivoNoControlado,
        equipoNoControlado.observacionesMotivosNoControlados,
        equipoNoControlado.fechaEquipoNoControlado
      );
      if (res.stat === 1) {
        setearEquipoNoControlado(null);
        cleanControlesDelEquipo();
        confirmDetalleFinalizarCarga(cargaMasiva.id).then((res) => {
          setDetalleConfirmFinalizarCarga(res);
          setMostrarModal(true);
          setIsLoading(false);
        });
      }
    } else {
      const promises = controlesDelEquipo.map((control) => {
        const {
          fallasSeleccionada,
          estado,
          componente,
          observacion,
          recomendacion,
          imagenes,
          fecha,
          idCargaMasiva,
        } = control;

        let fallasValues = [];
        if (fallasSeleccionada)
          fallasValues = fallasSeleccionada.map((falla) => String(falla.value));

        const estadoId = estado ? estado.id : null;

        return cargaControlPorComponente(
          idCargaMasiva,
          moment(fecha).format("YYYY-MM-DD"),
          estadoId,
          componente,
          JSON.stringify(fallasValues),
          observacion,
          recomendacion,
          imagenes
        );
      });

      await Promise.all(promises);
      const res3 = await confirmDetalleFinalizarCarga(cargaMasiva.id);
      if (res3) {
        setDetalleConfirmFinalizarCarga(res3);
        setMostrarModal(true);
        setIsLoading(false);
      }
    }
  };

  const onClickNext = (goToNext, steps, step) => {
    goToNext();
  };

  const finalizar = (next, steps, step) => {
    finalizarCargaMasiva(cargaMasiva.id).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "La carga masiva se ha finalizado correctamente",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
        setearCantidadesFinalesAction(res);
        onClickNext(next, steps, step);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  return (
    <>
      {detalleConfirmFinalizarCarga && (
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
                <DatosPrincipales />
              </Col>
            </Row>
            <Row>
              <Col className="border p-2 bg-black borde-gris">
                CANT. DE EQUIPOS: {detalleConfirmFinalizarCarga.total_equipos}
              </Col>
              <Col className="border p-2 bg-black borde-gris">
                CONTROLADOS: {detalleConfirmFinalizarCarga.equipos_testeados}
              </Col>
              <Col className="border p-2 bg-black borde-gris" md="6">
                FECHA DE INSPECCIÓN: ENTRE{" "}
                {moment(detalleConfirmFinalizarCarga.primer_test).format(
                  "DD/MM/YYYY"
                )}{" "}
                Y{" "}
                {moment(detalleConfirmFinalizarCarga.ultimo_test).format(
                  "DD/MM/YYYY"
                )}
              </Col>
            </Row>
            <Row className="mt-5 text-center">
              <Col>
                <h3>¿ESTÁ SEGURO QUE QUIERE FINALIZAR LA CARGA?</h3>
                <p>
                  Al finalizar la carga de controles, todos los datos ingresados
                  quedarán publicados y visibles para el cliente.
                  <br />
                  Por favor, revise bien los datos antes de finalizar.
                </p>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col className="text-center">
                <Button
                  color="primary"
                  className="mr-2"
                  onClick={() => setMostrarModal((prev) => !prev)}
                >
                  {" "}
                  NO, VOLVER A LA CARGA DE CONTROLES{" "}
                  <i className="simple-icon-close" />
                </Button>
                <WithWizard
                  render={({ next, previous, step, steps }) => (
                    <Button
                      color="success"
                      onClick={() => {
                        finalizar(next, steps, step);
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
                <Table
                  responsive
                  className="table table-bordered mt-4 table-informes"
                >
                  <tbody>
                    <tr>
                      <th>SECCIÓN</th>
                      <th>EQUIPO</th>
                      <th>FECHA</th>
                      <th>ESTADO</th>
                      <th>FALLA</th>
                      <th>OBSERVACIONES</th>
                      <th>RECOMENDACIONES</th>
                      <th>IMAGEN</th>
                    </tr>
                    {detalleConfirmFinalizarCarga.equipos.map((equipo) => (
                      <Fragment key={equipo.id}>
                        <tr>
                          <td style={{ background: "#000" }}>
                            {equipo.seccion}
                          </td>
                          <td colSpan="7" style={{ background: "#000" }}>
                            <strong>{equipo.nombre_equipo}</strong>
                          </td>
                        </tr>
                        {equipo.componentes.length > 0 &&
                          equipo.componentes.map((componente) => (
                            <tr key={componente.id}>
                              <td>&nbsp;</td>
                              <td>{componente.nombre}</td>
                              <td>
                                {componente.tests.length > 0 &&
                                  equipo.noControlado !== 1 &&
                                  moment(componente.tests[0].fecha).format(
                                    "DD/MM/YYYY"
                                  )}
                                {equipo.noControlado === 1 && (
                                  <span>
                                    {moment(equipo.fechaNoControlado).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </span>
                                )}
                              </td>
                              {equipo.noControlado === 1 ? (
                                <td>
                                  <p>NO CONTROLADO</p>
                                  <p>Motivo: {equipo.motivoNoControlado}</p>
                                </td>
                              ) : (
                                <>
                                  {componente.tests.length > 0 ? (
                                    <td
                                      style={{
                                        background:
                                          componente.tests[0].color,
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
                                  {componente.tests[0].fallas.length > 0
                                    ? componente.tests[0].fallas[0].falla
                                    : ""}
                                </td>
                              ) : (
                                <td></td>
                              )}
                              <td>
                                {componente.tests.length > 0 &&
                                  componente.tests[0].observaciones}
                                {equipo.noControlado === 1 &&
                                  equipo.observacionNoControlado}
                              </td>
                              <td>
                                {componente.tests.length > 0 &&
                                  componente.tests[0].recomendaciones}
                              </td>
                              <td>
                                {imagenesPorComponente[componente.id]?.[0]
                                  ?.filename && (
                                  <img
                                    src={
                                      imagenesPorComponente[componente.id][0]
                                        ?.filename
                                    }
                                    alt="imagen"
                                    width="100"
                                    style={{
                                      margin: "0 auto",
                                      display: "block",
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      )}
      <Button color="success" onClick={abrirModal} disabled={isLoading}>
        {isLoading ? (
          " CARGANDO"
        ) : (
          <>
            FINALIZAR <span className="ml-2">&gt;</span>
          </>
        )}
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
  controlesDelEquipo: state.cargasMasivasReducer.controlesDelEquipo,
  equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
});

export default connect(mapStateToProps, {
  setearCantidadesFinalesAction,
  setearEquipoNoControlado,
  cleanControlesDelEquipo,
})(FInalizar);
