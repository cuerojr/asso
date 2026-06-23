import React, { Fragment, useEffect } from "react";
import "../../assets/css/informeResultado.css";

import useInformeResultado from "../../hooks/useInformeResultado";
import {
  Row,
  Col,
  Button,
  Table,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import CustomSelectInput from "../../components/common/CustomSelectInput";

import SelectMultiple from "../selectMultiple";

import {
  faArrowRight,
  faArrowLeft,
  faPlusSquare,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { pickTextColorBasedOnBgColorSimple } from "../utils/utils";
import ReactTooltip from "react-tooltip";
import ModalImagen from "./ModalImagen";
import moment from "moment";

import { fetchlistarEstados } from "../../reducers/estados-reducer";
import { fetchlistarFallas } from "../../reducers/fallas-reducer";

const InformeResultado = ({
  detalleInforme,
  fallas,
  estados,
  idEmpresa,
  idInforme,
  fetchlistarEstados,
  fetchlistarFallas,
  filtroFallasIniciales,
  filtroEstadosIniciales,
  theme = "dark",
}) => {
  const {
    mesesActivosState,
    equiposActivosState,
    mesSeleccionado,
    setMesSeleccionado,

    mostrarImagenModal,
    setMostrarImagen,
    mostrarImagen,
    imagen,

    opcionesFallas,
    opcionesEstados,

    handleChangeMulti,
    seleccionarEstado,

    selectedFallas,
    selectedEstados,

    selectedFallasIds,

    guardarInformeFiltrado,
  } = useInformeResultado({
    idEmpresa,
    detalleInforme,
    fallas,
    estados,
    fetchlistarFallas,
    fetchlistarEstados,
    filtroFallasIniciales: filtroFallasIniciales,
    filtroEstadosIniciales: filtroEstadosIniciales,
  });

  return (
    <div className={theme === "light" ? "informe-resultado--light" : ""}>
      <Row>
        <Col xs="12" md="4" className="mx-auto">
          <h4 className="font-weight-bold">Fallas por sección y equipo</h4>
          <p>
            Filtrar resultados por Estado / fallas: Elige mostrar el resultado
            de la tabla con equipos que tengan determinados estados y/o tipos de
            fallas.
          </p>
        </Col>
        <Col xs="12" md="4">
          <InputGroup className="mb-3">
            <InputGroupText className="w-20" addonType="prepend">
              ESTADOS
            </InputGroupText>
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select-fallas informe-multi-select w-80"
              classNamePrefix="react-select"
              isMulti
              placeholder="Seleccione uno o varios estados"
              name="form-field-name"
              value={selectedEstados}
              onChange={(el) => seleccionarEstado(el)}
              options={opcionesEstados}
            />
          </InputGroup>
        </Col>
        <Col xs="12" md="4">
          <InputGroup className="mb-3">
            <InputGroupText className="w-15" addonType="prepend">
              FALLAS
            </InputGroupText>
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select-fallas informe-multi-select w-85"
              classNamePrefix="react-select"
              isMulti
              placeholder="Seleccione una o varias fallas"
              name="form-field-name"
              value={selectedFallas}
              onChange={(el) => handleChangeMulti(el)}
              options={opcionesFallas}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="month-navigator overflow-hidden px-0 py-4 ">
        <Col xs="4" sm="4" className="text-left">
          {mesSeleccionado < mesesActivosState.length - 1 && (
            <Button
              outline
              className="text-primary h5 button-color"
              onClick={() => {
                setMesSeleccionado(mesSeleccionado + 1);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
              {mesesActivosState[mesSeleccionado + 1]}
            </Button>
          )}
        </Col>
        <Col xs="4" sm="4" className="text-center">
          <h4 className="font-weight-bold">
            {mesesActivosState[mesSeleccionado]}
          </h4>
        </Col>
        <Col xs="4" sm="4" className="text-right">
          {mesSeleccionado > 0 && (
            <Button
              outline
              className="text-primary h5 button-color"
              onClick={() => {
                setMesSeleccionado(mesSeleccionado - 1);
              }}
            >
              <Fragment>
                {mesesActivosState[mesSeleccionado - 1]}{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </Fragment>
            </Button>
          )}
        </Col>
      </Row>

      <Table className="table table-bordered mt-4 table-informes" responsive>
        <thead>
          <tr className="color-azul-fondo text-white">
            <th className="col-md-2">SECCIÓN</th>
            <th className="border-right-table col-md-2">EQUIPO</th>
            <th style={{ width: "110px" }} className="text-center">
              FECHA
            </th>
            <th>ESTADO</th>
            <th>FALLA</th>
            <th>OBSERVACIONES</th>
            <th>RECOMENDACIONES</th>
            <th>IMÁGEN</th>
          </tr>
        </thead>
        <tbody>
          {equiposActivosState.length > 0 &&
            equiposActivosState[mesSeleccionado].map((equipo, vector) => {
              return (
                <Fragment key={vector}>
                  <tr>
                    <td
                      rowSpan={equipo?.componentes?.length + 1}
                      className="grayback"
                    >
                      <strong>{equipo.nombre_seccion}</strong>
                    </td>
                    <td className="grayback text-right border-right-table">
                      <strong>{equipo.nombre_equipo}</strong>
                    </td>
                    <td className="grayback text-right border-right-table">
                      {equipo.noControlado === 1 &&
                        equipo.fechaNoControlado && (
                          <>
                            {moment(equipo.fechaNoControlado).format(
                              "DD/MM/YYYY",
                            )}
                          </>
                        )}
                      {equipo.noControlado === 0 && equipo.eq_fecha_control && (
                        <>
                          {moment(equipo.eq_fecha_control).format("DD/MM/YYYY")}
                        </>
                      )}
                    </td>
                    <td className="grayback position-relative">
                      {equipo.noControlado === 1 && (
                        <>
                          <p className="m-0">
                            NO CONTROLADO |{" "}
                            <span style={{ fontSize: "12px" }}>
                              Motivo: {equipo.motivoNoControlado} | Observacion:{" "}
                              {equipo.observacionNoControlado}
                            </span>
                          </p>
                        </>
                      )}
                      {equipo.noControlado === 0 && (
                        <>
                          {equipo.eq_color_estado && (
                            <div
                              style={{
                                backgroundColor: equipo.eq_color_estado,
                                color: pickTextColorBasedOnBgColorSimple(
                                  equipo.eq_color_estado,
                                  "#FFFFFF",
                                  "#000000",
                                ),
                              }}
                              className="estado-td-coloreado"
                            >
                              {equipo.eq_estado}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className="grayback" colSpan={4}>
                      &nbsp;
                    </td>
                  </tr>
                  {equipo.componentes &&
                    equipo.componentes.map((componente, vect) => {
                      let elcolor = "#FFFFFF";
                      if (componente.color) {
                        elcolor = componente.color;
                      }
                      return (
                        <tr key={vect}>
                          <td className="text-right softgrayback border-right-table">
                            {componente.nombre}
                          </td>
                          <td className="text-center">
                            {componente.fecha &&
                              moment(componente.fecha).format("DD/MM/YYYY")}
                          </td>
                          <td
                            className={
                              componente.estado && componente.comentario_cliente
                                ? "position-relative estado-comentario"
                                : "position-relative estado-td"
                            }
                          >
                            <>
                              {componente.estado && (
                                <>
                                  {componente.comentario_cliente && (
                                    <div
                                      className="read-note"
                                      data-tip
                                      data-for={`estado_${componente.id}`}
                                    >
                                      <FontAwesomeIcon icon={faComments} />
                                    </div>
                                  )}
                                </>
                              )}
                              <ReactTooltip
                                id={`estado_${componente.id}`}
                                place="top"
                                effect="solid"
                                type="info"
                              >
                                {componente.comentario_cliente ? (
                                  <>{componente.comentario_cliente}</>
                                ) : (
                                  <>Agregar una nota</>
                                )}
                              </ReactTooltip>
                              <div
                                className="p-2 pl-3"
                                style={{
                                  backgroundColor: componente.color,
                                  color: pickTextColorBasedOnBgColorSimple(
                                    elcolor,
                                    "#FFFFFF",
                                    "#000000",
                                  ),
                                  borderRadius: 20,
                                }}
                              >
                                {componente.estado}
                              </div>
                            </>
                          </td>
                          <td>
                            {componente.fallas.length > 0 &&
                              componente.fallas.map((falla, index) => {
                                return (
                                  <Fragment key={index}>
                                    {falla.falla},{" "}
                                  </Fragment>
                                );
                              })}
                          </td>
                          <td>{componente.observaciones}</td>
                          <td>{componente.recomendaciones}</td>
                          <td style={{ textAlign: "center" }}>
                            {componente.files.map((img, index) => {
                              return (
                                <img
                                  key={img.id}
                                  onClick={() => {
                                    mostrarImagenModal(img.file);
                                  }}
                                  src={img.file}
                                  alt={""}
                                  style={{
                                    width: "150px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                />
                              );
                            })}
                          </td>
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}

          {equiposActivosState[mesSeleccionado]?.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center">
                No hay datos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <ModalImagen
        mostrarImagen={mostrarImagen}
        setMostarImagen={setMostrarImagen}
        imagen={imagen}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    estados: state.estadosReducer.estados,
    fallas: state.fallasReducer.fallas,
  };
};
export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  {
    fetchlistarEstados,
    fetchlistarFallas,
  },
)(InformeResultado);
