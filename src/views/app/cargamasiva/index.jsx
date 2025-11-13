import React, { Fragment, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { fetchListarClientes } from "../../../reducers/clientes-reducer";
import { fetchListarCargasMasivas } from "../../../reducers/cargas-masivas-reducer";
import { fetchlistarRutas } from "../../../reducers/rutas-reducer";
import { setearCargaMasiva, setearDisabledInputs } from "../../../reducers/cargas-masivas-reducer";
import {
  setearRutaSeleccionadaLabel,
  setearRutaSeleccionada,
} from "../../../reducers/cargas-masivas-reducer";
import { connect } from "react-redux";
import CargasMasivasNoFinalizadas from "./paso1/CargasMasivasNoFinalizadas";
import { TopNavigation } from "../../../components/wizard/TopNavigation";
import { Wizard, Steps, Step } from "react-albus";
import DatosGlobales from "./paso1/Index";
import CargaControles from "./paso2/Index";
import Paso3 from "./paso3/Index";

const CargaMasiva = (props) => {
  const { fetchListarCargasMasivas, cargasMasivas, equipoSeleccionadoEnCargaMasiva } = props;

  useEffect(() => {
    fetchListarCargasMasivas();
  }, [fetchListarCargasMasivas]);

  useEffect(() => {
    return () => {
      props.setearCargaMasiva({
        tituloDeReferencia: "",
      });
      props.setearDisabledInputs(false)
    };
  }, []);

  const onClickNext = (goToNext, steps, step) => {
    goToNext();
  };

  const topNavClick = (stepItem, push) => {
    //const estados = clienteSeleccionado === "" && props.rutaSeleccionada === "" && tipoDeControlSeleccionado === ""
    if (stepItem.id === "step2" || stepItem.id === "step3" /*&& estados*/) {
      return;
    } else {
      push(stepItem.id);
    }
  };

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <h1>
            <i className="simple-icon-organization mr-2" />
            CARGA MASIVA DE CONTROLES
          </h1>
        </Col>
        <Col xs={12} className="mt-2">
          <div className="separator mb-5"></div>
        </Col>
      </Row>
      <Wizard>
        <Row>
          <Col
            style={{
              height: cargasMasivas ? "auto" : "550px",
              position: "relative",
            }}
          >
            {cargasMasivas ? (
              <CargasMasivasNoFinalizadas />
            ) : (
              <div className="loading" />
            )}
          </Col>
        </Row>
        <Row className="carga-masiva" id="carga-masiva">
          <Col xs="12">
            <TopNavigation
              className="justify-content-center mb-4"
              topNavClick={topNavClick}
            />
          </Col>
          <Col xs="12">
            <Steps>
              <Step id="step1" name="Datos Globales">
                <DatosGlobales onClickNext={onClickNext} />
              </Step>
              <Step id="step2" name="Carga de controles">
                <CargaControles equipoSeleccionadoEnCargaMasiva={equipoSeleccionadoEnCargaMasiva}/>
              </Step>
              <Step id="step3" name="Notificar Cliente">
                <Paso3 />
              </Step>
            </Steps>
          </Col>
        </Row>
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
    equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva,
  };
};

export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  {
    fetchListarClientes,
    fetchlistarRutas,
    fetchListarCargasMasivas,
    setearRutaSeleccionadaLabel,
    setearRutaSeleccionada,
    setearCargaMasiva,
    setearDisabledInputs
  }
)(CargaMasiva);
