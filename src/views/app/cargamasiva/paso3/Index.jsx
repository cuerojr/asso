import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import DatosPrincipales from "../paso2/DatosPrincipales";
import { WithWizard } from "react-albus";
import { Link } from "react-router-dom";
import { enviarNotificacionCliente } from "../../../../lib/cargas-masivas-api";
import { NotificationManager } from "../../../../components/common/react-notifications";
import { setearCargaMasiva } from "../../../../reducers/cargas-masivas-reducer";
import { connect } from "react-redux";
import moment from "moment";
import ModalNotificacionWhatsapp from "../../../../componentes/ModalNotificacionWhatsapp";
import { setMostrarModalWhatsapp } from "../../../../reducers/notificacionesWhatsapp-reducer";
import { useNotificacion } from "../../../../hooks/useNotification";

const Paso3 = ({
  cantidadesFinal,
  cargaMasiva,
  setearCargaMasiva,
  setMostrarModalWhatsapp,
}) => {
  const {
    enviandoNotificacion,
    clienteNotificado,
    notificarAlCliente,
    notificarAlClienteViaWhatsapp,
    volverAlInicio,
  } = useNotificacion(cargaMasiva);

  return (
    <Fragment>
      <Col className="mt-2">
        <DatosPrincipales />

        {cantidadesFinal && (
          <Row>
            <Col className="border p-2 bg-black borde-gris">
              CANT. DE EQUIPOS: {cantidadesFinal.total_equipos}
            </Col>
            <Col className="border p-2 bg-black borde-gris">
              CONTROLADOS: {cantidadesFinal.equipos_testeados}
            </Col>
            <Col className="border p-2 bg-black borde-gris" md="6">
              FECHA DE INSPECCIÓN:{" "}
              {"ENTRE " +
                moment(cantidadesFinal.primer_test).format("DD/MM/YYYY") +
                " Y " +
                moment(cantidadesFinal.ultimo_test).format("DD/MM/YYYY")}
            </Col>
          </Row>
        )}
      </Col>
      <Row>
        <Col className="mt-4">
          <hr className="w-100" />
        </Col>
      </Row>
      <Row className="text-center mb-4">
        <Col className="mt-2">ACCIONES</Col>
      </Row>
      <Row className="text-center">
        <Col>
          <Col md="12">
            {!enviandoNotificacion && !clienteNotificado && (
              <Button
                className="mb-2"
                color="warning"
                onClick={notificarAlCliente}
              >
                NOTIFICAR AL CLIENTE POR EMAIL
                <i className="ml-3 simple-icon-paper-plane"></i>
              </Button>
            )}
            {enviandoNotificacion && (
              <Button
                color="warning"
                className="d-flex ml-auto mr-auto justify-content-around"
                style={{ width: "215px" }}
              >
                <div style={{ flex: "1", marginLeft: "75px" }}>
                  <div class="dot-flashing"></div>
                </div>
                <i className="ml-3 simple-icon-paper-plane"></i>
              </Button>
            )}
            {clienteNotificado && (
              <Button disabled color="secondary" style={{ width: "215px" }}>
                CLIENTE NOTIFICADO <i className="ml-3 simple-icon-check"></i>
              </Button>
            )}
            <p>
              Se enviará un email al cliente con el detalle de equipos
              controlados y sus estados.
            </p>

            <Button
              color="success"
              className="mt-2"
              onClick={() => setMostrarModalWhatsapp(true)}
            >
              NOTIFICAR POR WHATSAPP
              <i className="ml-3 simple-icon-paper-plane"></i>
            </Button>
            <p className="mt-2">
              Se enviará un mensaje de WhatsApp al cliente para notificar la
              carga de un informe de equipos controlados y sus estados. (El
              número de teléfono se obtiene del cliente seleccionado en la carga
              masiva).
            </p>
          </Col>
          <Col md="12"></Col>
        </Col>
        <Col>
          <Col md="12">
            <WithWizard
              render={({ push }) => (
                <Button
                  color="success"
                  className="mb-2"
                  onClick={() => {
                    volverAlInicio(push);
                  }}
                >
                  CARGAR OTRA RUTA
                  <i className="ml-3 simple-icon-cloud-upload"></i>
                </Button>
              )}
            />
          </Col>
          <Col md="12">Comenzar de cero una nueva carga de ruta.</Col>
        </Col>
        <Col>
          {cargaMasiva && cargaMasiva.clienteSeleccionado && (
            <Col md="12">
              <Link
                to={`/app/clientes/nuevo-informe/${cargaMasiva.clienteSeleccionado.value}/generar-consulta`}
              >
                <Button color="primary" className="mb-2">
                  GENERAR UN INFORME
                </Button>
              </Link>
            </Col>
          )}
          <Col md="12">Crear un informe con los datos ingresados.</Col>
        </Col>
      </Row>
      <Row className="text-center mt-4">
        <Col md="12"> Terminé por ahora: </Col>
        <Col md="12">
          <Link to="/app/clientes">
            <Button color="secondary" className="mt-2">
              LISTO
            </Button>
          </Link>
        </Col>
      </Row>
      <ModalNotificacionWhatsapp
        mostrarModalWhatsapp={false}
        detalleCliente={cargaMasiva?.clienteSeleccionado.value}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
    mostrarModalWhatsapp:
      state.notificacionesWhatsappReducer.mostrarModalWhatsapp,
    cantidadesFinal: state.cargasMasivasReducer.cantidadesFinal,
  };
};
export default connect(mapStateToProps, {
  setearCargaMasiva,
  setMostrarModalWhatsapp,
})(Paso3);
