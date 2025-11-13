import React, { Fragment, useState, useEffect } from "react";
import { Container, Row, Col, Button, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faDownload,
  faFloppyDisk,
  faAngleLeft,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import ResultadoConsulta from "../../componentes/resultados_informes/resultadoConsulta";
import EdicionGenerarConsulta from "../../componentes/resultados_informes/edicionGenerarConsulta";
import {
  altaInformeTipoOnline,
  updateInformeTipoOnline,
} from "../../lib/informe-online-api";
import { NotificationManager } from "../../components/common/react-notifications";
import { agregarCero } from "../../componentes/utils/utils";
import { mostrarOcultarModalCompartir } from "../../reducers/informes-reducer";
import CompartirModal from "../../componentes/resultados_informes/compartirModal";

import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import "./style.scss";

const InformGenerado = (props) => {
  const { idEmpresa, idInforme } = useParams();
  const navigate = useNavigate();

  const [editarInforme, setEditarInforme] = useState(false);
  const [informeYaGenerado, setInformeYaGenerado] = useState(true);
  const [mostrarResultado, setMostrarResultado] = useState(true);
  const [resultadoConsulta, setResultadoConsulta] = useState(null);
  const [mantenerDatos, setMantenerDatos] = useState({});
  const [resultadoConsultaEdicion, setResultadoConsultaEdicion] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [hps, setHps] = useState(null);
  const [introduccion, setIntroduccion] = useState("");
  const [informeYaGeneradoYModificado, setInformeYaGeneradoYModificado] =
    useState(false);

  const aplicarConsulta = (
    idEmpresa,
    seccionesIds,
    desdeMes,
    desdeAnio,
    hastaMes,
    hastaAnio,
    tipoTesteoSeleccionado
  ) => {
    setMantenerDatos({
      idEmpresa,
      seccionesIds,
      desdeMes,
      desdeAnio,
      hastaMes,
      hastaAnio,
      tipoTesteoSeleccionado,
    });
    setInformeYaGenerado(false);
    setInformeYaGeneradoYModificado(true);
    setMostrarResultado(false);

    const dataObj = {
      idEmpresa,
      seccionesIds: JSON.stringify(seccionesIds),
      titulo,
      mesDesde: agregarCero(desdeMes),
      añoDesde: desdeAnio,
      mesHasta: agregarCero(hastaMes),
      añoHasta: hastaAnio,
      tipoTesteoSeleccionado,
      introduccion,
      guardar: 0,
    };

    altaInformeTipoOnline(dataObj).then((res) => {
      if (res.stat === 0) {
        NotificationManager.error(res.err, "Hubo un error", 3000);
      } else {
        setResultadoConsulta(res);
        setMostrarResultado(true);
      }
    });
  };

  const finalmenteGuarda = () => {
    let idEmp;
    let seccionesIds = [];
    let desdeMes;
    let desdeAnio;
    let hastaMes;
    let hastaAnio;
    let tipoTesteoSeleccionado;

    if (!mantenerDatos.idEmpresa) {
      idEmp = resultadoConsultaEdicion.idEmpresa;
      resultadoConsultaEdicion.detalle_secciones.forEach((s) => {
        seccionesIds.push(s.id_seccion);
      });
      seccionesIds = JSON.stringify(seccionesIds);
      desdeMes = resultadoConsultaEdicion.desde.split("-")[0];
      desdeAnio = resultadoConsultaEdicion.desde.split("-")[1];
      hastaMes = resultadoConsultaEdicion.hasta.split("-")[0];
      hastaAnio = resultadoConsultaEdicion.hasta.split("-")[1];
      tipoTesteoSeleccionado = document.querySelector(
        "select[name='tipoTesteos']"
      ).value;
    } else {
      idEmp = mantenerDatos.idEmpresa;
      seccionesIds = JSON.stringify(mantenerDatos.seccionesIds);
      desdeMes = agregarCero(mantenerDatos.desdeMes);
      desdeAnio = mantenerDatos.desdeAnio;
      hastaMes = agregarCero(mantenerDatos.hastaMes);
      hastaAnio = mantenerDatos.hastaAnio;
      tipoTesteoSeleccionado = mantenerDatos.tipoTesteoSeleccionado;
    }

    updateInformeTipoOnline(
      idInforme,
      idEmp,
      seccionesIds,
      titulo,
      null,
      desdeMes,
      desdeAnio,
      hastaMes,
      hastaAnio,
      tipoTesteoSeleccionado,
      introduccion,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1
    ).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El informe ha sido actualizado correctamente",
          "Informe guardado",
          3000
        );
        navigate(`/app/clientes/editar-cliente/${idEmp}/informes`);
        document.body.classList.remove("pb-0");
      } else {
        NotificationManager.error(res.err, "Hubo un error", 3000);
      }
    });
  };

  const terminarEdicion = () => {
    setEditarInforme(false);
    setTitulo(resultadoConsultaEdicion.titulo);
  };

  useEffect(() => {
    document.body.classList.add("pb-0");
    return () => {
      document.body.classList.remove("pb-0");
    };
  }, []);

  const volver = (e) => {
    e.preventDefault();
    navigate(`/app/clientes/editar-cliente/${idEmpresa}/informes`);
    document.body.classList.remove("pb-0");
  };

  return (
    <Fragment>
      <CompartirModal
        titulo={titulo}
        idEmpresa={idEmpresa}
        idInforme={idInforme}
        hps={hps}
      />
      <Container fluid className="informe-header">
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <h1 className="p-4 form-inline">
              <span className="icon-wrapper mr-3 pr-3">
                <Button
                  style={{ fontSize: "22px" }}
                  className="mr-3"
                  onClick={volver}
                  color="link"
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
                <FontAwesomeIcon icon={faFileImport} className="text-primary" />
              </span>
              {!editarInforme && (
                <span style={{ fontSize: "26px" }} className="pl-1">
                  {titulo}
                </span>
              )}
              {editarInforme && (
                <Input
                  type="text"
                  name="titulo"
                  bsSize="lg"
                  className="pt-0 pb-0 pl-1"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              )}
            </h1>
            <div>
              <Button
                className="ml-4"
                color="light"
                onClick={() => props.mostrarOcultarModalCompartir(true)}
              >
                COMPARTIR <FontAwesomeIcon icon={faShareNodes} />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid className="body informe-generado">
        {editarInforme && (
          <Fragment>
            <Row className="mt-4 ml-3 mr-3">
              <Col>
                <h2>Editar Consulta:</h2>
              </Col>
              <Col className="text-right">
                <Button color="primary" onClick={terminarEdicion}>
                  CANCELAR
                </Button>
                <Button color="success" className="ml-2" onClick={finalmenteGuarda}>
                  GUARDAR <FontAwesomeIcon icon={faFloppyDisk} />
                </Button>
              </Col>
            </Row>
            <Row className="ml-3 mr-3">
              <Col>
                <EdicionGenerarConsulta
                  aplicarConsulta={aplicarConsulta}
                  idEmpresa={idEmpresa}
                  resultadoConsulta={resultadoConsultaEdicion}
                />
              </Col>
            </Row>
          </Fragment>
        )}
        <Row>
          <Col className="py-4 p-md-5">
            {mostrarResultado && (
              <ResultadoConsulta
                idInforme={idInforme}
                informeYaGenerado={informeYaGenerado}
                setEditarInforme={setEditarInforme}
                resultadoConsulta={resultadoConsulta}
                setTitulo={setTitulo}
                setResultadoConsultaEdicion={setResultadoConsultaEdicion}
                setHps={setHps}
                setIntroduccion={setIntroduccion}
                informeYaGeneradoYModificado={informeYaGeneradoYModificado}
                idEmpresa={idEmpresa}
              />
            )}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  modalCompartirInforme: state.informesReducer.modalCompartirInforme,
});

export default connect(mapStateToProps, { mostrarOcultarModalCompartir })(
  InformGenerado
);
