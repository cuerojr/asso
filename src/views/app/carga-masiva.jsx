import React, { Fragment, useEffect, useState } from "react";
import { Row, Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta";
import { Wizard, Steps, Step } from "react-albus";
import { TopNavigation } from "../../components/wizard/TopNavigation";
import DatosGlobales from "../../contenedores/cargamasiva/datosGlobales";
import CargaControles from "../../contenedores/cargamasiva/cargaControles";
import NotificarCLiente from "../../contenedores/cargamasiva/notificarCliente";
import { ItemListaCargaMasivaNoFinalizada } from "../../componentes/itemListaCargaMasivaNoFinalizada";
import { fetchListarClientes } from "../../reducers/clientes-reducer";
import { fetchListarCargasMasivas } from "../../reducers/cargas-masivas-reducer";
import { eliminarCargaMasiva } from "../../lib/cargas-masivas-api";
import { fetchlistarRutas } from "../../reducers/rutas-reducer";
import { NotificationManager } from "../../components/common/react-notifications";
import {
  setearRutaSeleccionadaLabel,
  setearRutaSeleccionada,
} from "../../reducers/cargas-masivas-reducer";
import { connect } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CargaMasivaDeControles = (props) => {
  const navigate = useNavigate();

  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [tipoDeControlSeleccionado, setTipoDeControlSeleccionado] =
    useState("");
  const [titulodeReferencia, setTitulodeReferencia] = useState("");
  const [clienteSeleccionadoLabel, setClienteSeleccionadoLabel] = useState("");
  const [tipoDeControlSeleccionadoLabel, setTipoDeControlSeleccionadoLabel] =
    useState("");
  const [idCargaMasiva, setIdCargaMasiva] = useState("");
  const [idCargaMasivaAEliminar, setIdCargaMasivaAEliminar] = useState("");
  const [
    mostrarModalConfirmarEliminarCargaMasiva,
    setMostrarModalConfirmarEliminarCargaMasiva,
  ] = useState(false);
  const [cargaMasivaNoFinalizada, setCargaMasivaNoFinalizada] = useState(false);

  const [cantidaEquipos, setCantidadEquipos] = useState(null);
  const [cantidadControlados, setCantidadControlados] = useState(null);
  const [fechaInscripcion, setFechaInscripcion] = useState(null);
  const [deshabilitarCargaSeleccionada, setDeshabilitarCargaSeleccionada] =
    useState(false);

  const onClickNext = (goToNext, steps, step) => {
    goToNext();
  };

  const topNavClick = (stepItem, push) => {
    if (
      (stepItem.id === "step2" || stepItem.id === "step3") &&
      clienteSeleccionado === "" &&
      props.rutaSeleccionada === "" &&
      tipoDeControlSeleccionado === ""
    ) {
      return;
    } else {
      push(stepItem.id);
    }
  };

  const seleccionarEmpresa = (empresa) => {
    setClienteSeleccionado(empresa);
    props.fetchlistarRutas(empresa);
  };

  const confirmCargaMasiva = (id_cargaMasiva) => {
    setIdCargaMasivaAEliminar(id_cargaMasiva);
    setMostrarModalConfirmarEliminarCargaMasiva(true);
  };

  const borrarCargaMasiva = () => {
    eliminarCargaMasiva(idCargaMasivaAEliminar)
      .then(() => {
        props.fetchListarCargasMasivas();
        setMostrarModalConfirmarEliminarCargaMasiva(false);
        NotificationManager.success(
          "La carga ha sido eliminada",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
      })
      .catch((error) => {
        NotificationManager.error(error.err, "Error");
      });
  };

  const limpiarTodo = () => {
    setClienteSeleccionado("");
    props.setearRutaSeleccionada("");
    setTipoDeControlSeleccionado("");
    setTitulodeReferencia("");
    setClienteSeleccionadoLabel("");
    props.setearRutaSeleccionadaLabel("");
    setTipoDeControlSeleccionadoLabel("");
    setIdCargaMasiva("");
    setIdCargaMasivaAEliminar("");
    setMostrarModalConfirmarEliminarCargaMasiva(false);
    setCargaMasivaNoFinalizada(false);
    props.fetchListarCargasMasivas();
  };

  const setearCantidades = (res) => {
    setCantidadEquipos(res.total_equipos);
    setCantidadControlados(res.equipos_testeados);
    setFechaInscripcion(
      "ENTRE " +
        moment(res.primer_test).format("DD/MM/YYYY") +
        " Y " +
        moment(res.ultimo_test).format("DD/MM/YYYY")
    );
  };

  const seleccionarCargaMasivaInciada = (item, push) => {
    push("step1");
    let yPos =
      document.querySelector("#carga-masiva").getBoundingClientRect().top +
      window.scrollY;
    window.scrollTo({ top: yPos, left: 0, behavior: "smooth" });
    setDeshabilitarCargaSeleccionada(true);
    setCargaMasivaNoFinalizada(item);
  };

  useEffect(() => {
    props.fetchListarCargasMasivas();
    props.fetchListarClientes();
  }, []);

  return (
    <Fragment>
      <Modal isOpen={mostrarModalConfirmarEliminarCargaMasiva} size="md">
        <ModalBody>
          <p>¿Desea eliminar esta Carga Masiva?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={borrarCargaMasiva}>
            Si, eliminar
          </Button>
          <Button
            className="neutro"
            onClick={() => {
              setMostrarModalConfirmarEliminarCargaMasiva(false);
            }}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Row>
        <div className="col-md-12">
          <h1>
            <i className="simple-icon-organization mr-2" />
            CARGA MASIVA DE CONTROLES:
          </h1>
        </div>
        <div className="col-md-12 mt-2">
          <div className="separator mb-5"></div>
        </div>
      </Row>

      <Wizard>
        <Fragment>
          {props.cargasMasivas && props.cargasMasivas.length > 0 && (
            <Fragment>
              <Row>
                <div className="col-md-12">
                  <h3>CARGA NO FINALIZADAS:</h3>
                </div>
                {props.cargasMasivas.map((item, index) => {
                  return (
                    <ItemListaCargaMasivaNoFinalizada
                      key={index}
                      item={item}
                      navigate={navigate}
                      habDeshab={true}
                      confirmCargaMasiva={confirmCargaMasiva}
                      seleccionarCargaMasivaInciada={
                        seleccionarCargaMasivaInciada
                      }
                    />
                  );
                })}
              </Row>
              <Row>
                <div className="col-md-12 mt-2">
                  <div className="separator mb-5"></div>
                </div>
              </Row>
            </Fragment>
          )}
        </Fragment>
        <div className="carga-masiva" id="carga-masiva">
          <TopNavigation
            className="justify-content-center mb-4"
            topNavClick={topNavClick}
          />
          <Steps>
            <Step id="step1" name="Datos Globales">
              <Tarjeta titulo="">
                <DatosGlobales
                  clienteSeleccionado={clienteSeleccionado}
                  tipoDeControlSeleccionado={tipoDeControlSeleccionado}
                  titulodeReferencia={titulodeReferencia}
                  setTitulodeReferencia={setTitulodeReferencia}
                  seleccionarEmpresa={seleccionarEmpresa}
                  setTipoDeControlSeleccionado={setTipoDeControlSeleccionado}
                  onClickNext={onClickNext}
                  setClienteSeleccionadoLabel={setClienteSeleccionadoLabel}
                  setTipoDeControlSeleccionadoLabel={
                    setTipoDeControlSeleccionadoLabel
                  }
                  setIdCargaMasiva={setIdCargaMasiva}
                  cargaMasivaNoFinalizada={cargaMasivaNoFinalizada}
                  deshabilitarCargaSeleccionada={deshabilitarCargaSeleccionada}
                />
              </Tarjeta>
            </Step>
            <Step id="step2" name="Carga de controles">
              <CargaControles
                clienteSeleccionadoLabel={clienteSeleccionadoLabel}
                tipoDeControlSeleccionado={tipoDeControlSeleccionado}
                clienteSeleccionado={clienteSeleccionado}
                titulodeReferencia={titulodeReferencia}
                tipoDeControlSeleccionadoLabel={tipoDeControlSeleccionadoLabel}
                onClickNext={onClickNext}
                idCargaMasiva={idCargaMasiva}
                setearCantidades={setearCantidades}
              />
            </Step>
            <Step id="step3" name="Notificar Cliente">
              <Tarjeta titulo="">
                <NotificarCLiente
                  titulodeReferencia={titulodeReferencia}
                  clienteSeleccionadoLabel={clienteSeleccionadoLabel}
                  clienteSeleccionado={clienteSeleccionado}
                  tipoDeControlSeleccionadoLabel={
                    tipoDeControlSeleccionadoLabel
                  }
                  limpiarTodo={limpiarTodo}
                  cantidaEquipos={cantidaEquipos}
                  cantidadControlados={cantidadControlados}
                  fechaInscripcion={fechaInscripcion}
                  idCargaMasiva={idCargaMasiva}
                />
              </Tarjeta>
            </Step>
          </Steps>
        </div>
      </Wizard>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    clientes: state.clientesReducer.clientes,
    rutas: state.rutasReducer.rutas,
    rutaSeleccionada: state.cargasMasivasReducer.rutaSeleccionada,
    cargasMasivas: state.cargasMasivasReducer.cargasMasivas,
  };
};

export default connect(mapStateToProps, {
  fetchListarClientes,
  fetchlistarRutas,
  fetchListarCargasMasivas,
  setearRutaSeleccionadaLabel,
  setearRutaSeleccionada,
})(CargaMasivaDeControles);
