import React, { useEffect, Fragment, useState } from "react";
import {
  Row,
  Input,
  Button,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { MiniTarjeta } from "./miniTarjeta";
import Introduccion from "./introduccion";
import Resumen from "./resumen";
import ResumenAdministracion from "./resumenAdministracion";
import InformeResultado from "./informe";
import FallasConsulta from "./fallas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faDownload,
  faPencil,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

import { usePdfDownload, imageUrlToBase64 } from "../../hooks/usePdfDownload";

// Importás el hook y los reducers
import useInformeResultado from "../../hooks/useInformeResultado";
import { fetchlistarEstados } from "../../reducers/estados-reducer";
import { fetchlistarFallas } from "../../reducers/fallas-reducer";
import { fetchlistarcomponentesPorEmpresa } from "../../reducers/componentes-reducer";
import { connect } from "react-redux";

import classnames from "classnames";
import {
  introduccionInformeOnline,
  informeInformeOnline,
  getFallas,
  getResumenDeEstado,
} from "../../lib/informe-online-api";

import { transpose } from "../utils/utils";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
window.moment = moment;

const ResultadoConsulta = (props) => {
  const { download, isGenerating, error } = usePdfDownload();

  const [currentTab, setCurrentTab] = useState(null);
  const [contenidoHTML, setContenidoHTML] = useState(null);
  const [menuTabs, setmenuTabs] = useState([
    "informe",
    "resumen de estados",
    "fallas",
    "resumen de administracion",
  ]);
  const [detalleInforme, setDetalleInforme] = useState(null);

  const [datosPdf, setDatosPdf] = useState(null);
  const [datosPdf2, setDatosPdf2] = useState(null);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [control, setControl] = useState("");
  const [equipos, setEquipos] = useState("");
  const [secciones, setSecciones] = useState("");
  const [editable, setEditable] = useState(null);
  const [resultadoConsultaEdicion, setResultadoConsultaEdicion] =
    useState(null);
  const [fallasTab, setFallasTab] = useState(null);
  const [resumenTab, setResumenTab] = useState(null);
  const [administracionTab, setAdministracionTab] = useState(null);

  const [filtroFallasIniciales, setFiltroFallasIniciales] = useState([]);
  const [filtroEstadosIniciales, setFiltroEstadosIniciales] = useState([]);
  const [filtroComponentesIniciales, setFiltroComponentesIniciales] = useState([]);
  //const datosUser = JSON.parse(window.localStorage.getItem('cliente'));
  const { idEmpresa, fallas, estados, fetchlistarFallas, fetchlistarEstados, fetchlistarcomponentesPorEmpresa } =
    props;

  const informeHook = useInformeResultado({
    idEmpresa,
    detalleInforme,
    fallas,
    estados,
    componentes: props.componentesPorEmpresa, // ✅
    fetchlistarFallas,
    fetchlistarEstados,
    fetchlistarcomponentesPorEmpresa,
    filtroFallasIniciales,
    filtroEstadosIniciales,
    filtroComponentesIniciales
  });
  console.log("🚀 ~ ResultadoConsulta ~ informeHook:", informeHook);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const distruirDatos = (res) => {
    const fechaDesde = new Date(res.desde.split("-")[0]);
    const fechaHasta = new Date(res.hasta.split("-")[0]);

    setFechaDesde(
      `${capitalizeFirstLetter(fechaDesde.toLocaleString("es-ES", { month: "long" }))} ${res.desde.split("-")[1]}`,
    );
    setFechaHasta(
      `${capitalizeFirstLetter(fechaHasta.toLocaleString("es-ES", { month: "long" }))} ${res.hasta.split("-")[1]}`,
    );

    setControl(res.control);
    setEquipos(res.equipos);
    if (props.setTitulo) {
      props.setTitulo(res.titulo);
    }

    setSecciones(
      Object.values(res.detalle_secciones)
        .map((item) => item.seccion)
        .join(", "),
    );
    setDetalleInforme(res.detalle_informe);
    if (props.informeYaGenerado && res.editable && res.editable == 1) {
      setEditable(true);
    }
    res.idEmpresa = idEmpresa;
    setResultadoConsultaEdicion(res);
    if (res.hps) {
      props.setHps(res.hps);
    }

    if (res.filtro_fallas?.length) {
      setFiltroFallasIniciales(res.filtro_fallas.map((f) => f.id_falla));
    }
    if (res.filtro_estados?.length) {
      setFiltroEstadosIniciales(res.filtro_estados.map((e) => e.id_estado));
    }
    if (res.filtro_componentes?.length) {
      setFiltroComponentesIniciales(res.filtro_componentes.map((c) => c.componente));
    }
  };

  useEffect(() => {
    if (props.informeYaGenerado) {
      introduccionInformeOnline(idEmpresa, props.idInforme).then((res) => {
        if (res) {
          if (res.html) {
            if (props.setIntroduccion) {
              props.setIntroduccion(res.html);
            }
            setContenidoHTML(res.html);
            setmenuTabs((menuActual) => ["introduccion", ...menuActual]);
            setCurrentTab("introduccion");
          } else {
            setCurrentTab("informe");
          }
        }
      });

      informeInformeOnline(idEmpresa, props.idInforme).then((res) => {
        if (res) {
          setDatosPdf(res);
          distruirDatos(res);
        }
      });
    } else {
      setCurrentTab("informe");

      distruirDatos(JSON.parse(props.resultadoConsulta.detalle));
      setFallasTab(JSON.parse(props.resultadoConsulta.fallas));
      setResumenTab(JSON.parse(props.resultadoConsulta.resumen));
      setAdministracionTab(JSON.parse(props.resultadoConsulta.admin));
    }

    if (props.informeYaGeneradoYModificado) {
      introduccionInformeOnline(idEmpresa, props.idInforme).then((res) => {
        if (res) {
          if (res.html) {
            if (props.setIntroduccion) {
              props.setIntroduccion(res.html);
            }
            setContenidoHTML(res.html);
            setmenuTabs((menuActual) => ["introduccion", ...menuActual]);
            setCurrentTab("introduccion");
          } else {
            setCurrentTab("informe");
          }
        }
      });

      distruirDatos(JSON.parse(props.resultadoConsulta.detalle));
      setFallasTab(JSON.parse(props.resultadoConsulta.fallas));
      setResumenTab(JSON.parse(props.resultadoConsulta.resumen));
      setAdministracionTab(JSON.parse(props.resultadoConsulta.admin));
    }
  }, []);

  const handleDownload = async () => {
    const [introduccionRes, resumenRes, fallasRes] = await Promise.all([
      introduccionInformeOnline(idEmpresa, props.idInforme),
      getResumenDeEstado(idEmpresa, props.idInforme),
      getFallas(idEmpresa, props.idInforme),
    ]);

    // Reconstruir detalle_informe con el formato que espera buildInforme
    // pero reemplazando equipos con los filtrados del hook
    const detalleInformeFiltrado = datosPdf?.detalle_informe?.map(
      (mesData, idx) => ({
        ...mesData,
        equipos: informeHook.equiposActivosState[idx] ?? [],
      }),
    );

    const datosPdfCompletos = {
      ...(introduccionRes?.html ? { intro: introduccionRes.html } : {}),
      ...datosPdf,
      detalle_informe: detalleInformeFiltrado,
      ...(resumenRes ? { resumenRes } : {}),
      ...(fallasRes ? { fallasRes } : {}),
    };

    const logoBase64 = await imageUrlToBase64("/assets/images/logo.png");

    download({
      filename: `Informe Online - ${datosPdfCompletos.titulo}`,
      title: `Informe Online - ${datosPdfCompletos.titulo}`,
      logoBase64,
      subtitle: "Actualizado al " + new Date().toLocaleDateString("es-AR"),
      data: datosPdfCompletos,
    });
  };

  return (
    <>
      <MiniTarjeta>
        <div className="mb-2">
          <h2>RESULTADO DE LA CONSULTA:</h2>
        </div>
        <Row>
          <Col xs="12" md="6" lg="4" className="mb-2">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <div className="">
                <p
                  style={{
                    opacity: "70%",
                    fontSize: ".75rem",
                    marginBottom: ".25rem",
                  }}
                >
                  DESDE
                </p>
                <h5>{fechaDesde}</h5>
              </div>
              <div className="">
                <p
                  style={{
                    opacity: "70%",
                    fontSize: ".75rem",
                    marginBottom: ".25rem",
                  }}
                >
                  HASTA
                </p>
                <h5>{fechaHasta}</h5>
              </div>
            </div>
          </Col>

          <Col xs="12" md="6" lg="8" className="mb-2">
            <p
              style={{
                opacity: "70%",
                fontSize: ".75rem",
                marginBottom: ".25rem",
              }}
            >
              SECCIONES
            </p>
            <h5>{secciones}</h5>
          </Col>
          <Col xs="12" md="6" lg="4" className="mb-2">
            <p
              style={{
                opacity: "70%",
                fontSize: ".75rem",
                marginBottom: ".25rem",
              }}
            >
              TIPO DE CONTROL
            </p>
            <h5>{control}</h5>
          </Col>
          <Col xs="12" md="6" lg="4" className="mb-2">
            <p
              style={{
                opacity: "70%",
                fontSize: ".75rem",
                marginBottom: ".25rem",
              }}
            >
              EQUIPOS
            </p>
            <h5>{equipos}</h5>
          </Col>

          <Col
            xs="6"
            className="ml-auto d-flex align-items-end justify-content-end"
          >
            {props.mostrarbts && (
              <>
                <Button
                  color="success"
                  className="mr-2"
                  onClick={() => {
                    props.setMostrarModalGuarda(true);
                  }}
                >
                  GUARDAR INFORME <FontAwesomeIcon icon={faFloppyDisk} />{" "}
                </Button>
                {/*<Button color="primary">EXPORTAR A XLS <FontAwesomeIcon icon={faDownload} /> </Button>*/}
              </>
            )}
            {editable && (
              <Button
                color="success"
                className="mr-2"
                onClick={() => {
                  props.setEditarInforme(true);
                  props.setResultadoConsultaEdicion(resultadoConsultaEdicion);
                }}
              >
                EDITAR <FontAwesomeIcon icon={faPencil} className="ml-2" />{" "}
              </Button>
            )}
            <Button
              color="primary"
              className="mr-2"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? "Generando…" : `Descargar PDF`}
              <FontAwesomeIcon icon={faFilePdf} className="ml-2" />{" "}
            </Button>
          </Col>
        </Row>
      </MiniTarjeta>

      <div className="container-fluid mt-4">
        <div className="row px-2">
          <Nav tabs>
            {menuTabs?.map((menuItem, index) => (
              <NavItem key={index}>
                <NavLink
                  className={classnames({
                    active: currentTab === menuItem,
                    "nav-link": true,
                  })}
                  onClick={() => setCurrentTab(menuItem)}
                >
                  <strong>{menuItem.toUpperCase()}</strong>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </div>

      <div className="mt-3 resultados-consulta">
        <TabContent activeTab={currentTab} className="mt-4 col-md-12">
          {contenidoHTML && (
            <TabPane tabId="introduccion">
              <Introduccion contenidoHTML={contenidoHTML} />
            </TabPane>
          )}

          <TabPane tabId="resumen de estados">
            <Resumen
              idEmpresa={idEmpresa}
              idInforme={props.idInforme}
              currentTab={currentTab}
              resumenTab={resumenTab}
            />
          </TabPane>

          <TabPane tabId="informe">
            <InformeResultado
              detalleInforme={detalleInforme}
              idEmpresa={idEmpresa}
              informeHook={informeHook}
              idInforme={props.idInforme}
              filtroFallasIniciales={filtroFallasIniciales}
              filtroEstadosIniciales={filtroEstadosIniciales}
              theme={props.theme}
            />
          </TabPane>

          <TabPane tabId="fallas">
            <FallasConsulta
              idEmpresa={idEmpresa}
              idInforme={props.idInforme}
              currentTab={currentTab}
              fallasTab={fallasTab}
            />
          </TabPane>

          <TabPane tabId="resumen de administracion">
            <ResumenAdministracion
              idEmpresa={idEmpresa}
              idInforme={props.idInforme}
              currentTab={currentTab}
              resumenTab={administracionTab}
            />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

// Agregás el connect acá también
const mapStateToProps = (state) => ({
  estados: state.estadosReducer.estados,
  fallas: state.fallasReducer.fallas,
  componentesPorEmpresa: state.componentesReducer.componentesPorEmpresa, // ✅
});

export default connect(mapStateToProps, {
  fetchlistarEstados,
  fetchlistarFallas,
  fetchlistarcomponentesPorEmpresa,
})(ResultadoConsulta);
