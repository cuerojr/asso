import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const InformeResultado = (props) => {
  const [mesesActivosState, setMesesActivosState] = useState([]);
  const [equiposActivosState, setEquiposActivosState] = useState([]);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [imagen, setImagen] = useState("");

  const meses = [
    null,
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const mesesActivos = [];
  const equipos = [];

  useEffect(() => {
    if (props.detalleInforme) {
      props.detalleInforme.forEach((item) => {
        const mesActivo = meses[Number(item.mes)] + " " + item.anio;
        mesesActivos.push(mesActivo);
        equipos.push(item.equipos);
      });

      setMesesActivosState(mesesActivos);
      setEquiposActivosState(equipos);
    }
  }, [props.detalleInforme]);

  const [mesSeleccionado, setMesSeleccionado] = useState(0);

  const mostrarImagenModal = (imagen) => {
    setImagen(imagen);
    setMostrarImagen(true);
    console.log(imagen);
  };

  return (
    <Fragment>
      <Row className="month-navigator overflow-hidden p-0">
        <Col xs="6" sm="6" className="text-left">
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

        <Col xs="6" sm="6" className="text-right">
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
      <Row>
        <Col xs="12" className="text-center">
          <h4 className="font-weight-bold">
            {mesesActivosState[mesSeleccionado]}
          </h4>
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
                              "DD/MM/YYYY"
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
                                  "#000000"
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
                                    "#000000"
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
                            {componente.files.map((img) => {
                              return (
                                <img
                                  onClick={() => {
                                    mostrarImagenModal(img.file);
                                  }}
                                  src={img.file}
                                  alt={""}
                                  style={{ width: "150px", height: "auto" }}
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
        </tbody>
      </Table>
      <ModalImagen
        mostrarImagen={mostrarImagen}
        setMostarImagen={setMostrarImagen}
        imagen={imagen}
      />
    </Fragment>
  );
};

export default InformeResultado;
