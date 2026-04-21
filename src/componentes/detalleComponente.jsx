import React, { useState, Fragment, useEffect } from "react";
import {
  Row,
  Input,
  Button,
  InputGroupAddon,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  Col,
  Label,
} from "reactstrap";
import { connect } from "react-redux";
import { fetchlistarControles } from "../reducers/controles-reducer";
import { ItemListaControles } from "./itemListaControles";
import {
  listarTipoTesteos,
  altaControl,
  eliminarControl,
  actualizarControl,
  recargarEstadosControl,
} from "../lib/controles-api";

import CargarControl from "./cargarControl";
import EditarControl from "./editarControl";

import useDetalleComponente from "../hooks/useDetalleComponente";

import { NotificationManager } from "../components/common/react-notifications";
import { booleanToNumber, numberToBoolean } from "./utils/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const DetalleComponente = (props) => {
  
 const {
    controles, nombre, setNombre, descripcion, setDescripcion,
    nuevoControl, setNuevoControl, editarControl, setEditarControl,
    controlSeleccionado, tipoTesteos, mostrarModalConfirmarEliminarComponente,
    setMostrarModalConfirmarEliminarComponente, filtro, estados, bajaRPM, setBajaRPM,
    volverComponentes, editarControlSeleccionado, actualizarComponente,
    eliminarComponente, cargarControl, borrarControl, updateControl, filtrarControl,
  } = useDetalleComponente(props);
  return (
    <Fragment>
      {!nuevoControl && !editarControl && (
        <Fragment>
          <Modal isOpen={mostrarModalConfirmarEliminarComponente} size="md">
            <ModalBody>
              <Row>
                <Col xs="2">
                  <i
                    className="glyph-icon iconsminds-danger"
                    style={{ fontSize: "2rem" }}
                  />
                </Col>
                <Col xs="10">
                  ATENCIÓN: Al borrar un componente, también borrarás todos los
                  controles asociados.
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <span className="mr-2">¿Estás seguro?</span>
              <Button color="danger" onClick={eliminarComponente}>
                Si, eliminar
              </Button>
              <Button
                className="neutro"
                onClick={() => {
                  setMostrarModalConfirmarEliminarComponente(false);
                }}
              >
                No, cancelar
              </Button>
            </ModalFooter>
          </Modal>
          <Row>
            <div className="col-md-12">
              <Button
                color="link"
                className="pl-0"
                onClick={props.volverEquipos}
              >
                &lt; Equipos
              </Button>
              <Button color="link" className="pl-0" onClick={volverComponentes}>
                &lt; {props.nombreEquipo}
              </Button>
            </div>
            <div className="col">
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon
                      icon={faPuzzlePiece}
                      style={{ fontSize: "2em" }}
                    />
                  </span>
                </InputGroupAddon>
                <Input
                  value={nombre}
                  className="form-title"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </InputGroup>
            </div>
            <div style={{ flex: "0 0 170px" }}>
              <Button color="success" size="sm" onClick={actualizarComponente}>
                GUARDAR CAMBIOS
              </Button>
            </div>
            <div className="col-md-12">
              <Input
                type="textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <Col xs="12" className="pl-4">
              <div style={{ marginLeft: "15px", marginTop: "10px" }}>
                <Input
                  type="checkbox"
                  checked={bajaRPM}
                  onChange={(evt) => {
                    setBajaRPM(evt.target.checked);
                  }}
                />{" "}
                <Label>Baja RPM</Label>
              </div>
            </Col>
            <div className="col-md-6 mt-2">
              <h5 className="mt-4 mb-3">ÚLTIMO ESTADO DEL COMPONENTE</h5>
              <p className="mb-0">
                {estados["1"].nombrecontrol}:
                {estados["1"].estado ? (
                  <span
                    className="estados-tag pl-2 pr-2 ml-2"
                    style={{ background: estados["1"].color }}
                  >
                    {estados["1"].estado}
                  </span>
                ) : (
                  " ---"
                )}
              </p>
              <p className="mb-0">
                {estados["2"].nombrecontrol}:
                {estados["2"].estado ? (
                  <span
                    className="estados-tag pl-2 pr-2 ml-2"
                    style={{ background: estados["2"].color }}
                  >
                    {estados["2"].estado}
                  </span>
                ) : (
                  " ---"
                )}
              </p>
            </div>
            <div className="col-md-6 text-right mt-2">
              <Button
                color="danger"
                size="sm"
                onClick={() => {
                  setMostrarModalConfirmarEliminarComponente(true);
                }}
              >
                {" "}
                <FontAwesomeIcon icon={faTrashCan} /> ELIMINAR COMPONENTE
              </Button>
            </div>
          </Row>
          <Row className="mt-4">
            <div className="col-md-12">
              <h2>CONTROLES REALIZADOS AL COMPONENTE</h2>
            </div>
            <div className="col-md-12 d-flex  align-items-center justify-content-between">
              <div
                className="border mr-2 p-2 d-flex justify-content-around"
                style={{ flex: "0.6" }}
              >
                <div>Testeos: </div>
                {tipoTesteos &&
                  tipoTesteos.map((tipoTesteo) => {
                    return (
                      <div key={tipoTesteo.id}>
                        <div>
                          <Input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) =>
                              filtrarControl(
                                e.target.checked,
                                tipoTesteo.control,
                              )
                            }
                          />{" "}
                          {tipoTesteo.control}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="text-zero top-right-button-container">
                {/*<Button
                                color="primary"
                                size="lg"
                                className="top-right-button"
                                onClick={() => { setNuevoControl(true) }}
                            > <i className="simple-icon-target" ></i> NUEVO CONTROL
                            </Button>*/}
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="separator mb-5"></div>
            </div>
            <div className="col-md-12">
              {props.controles &&
                tipoTesteos &&
                filtro &&
                props.controles.map((item, index) => {
                  let visible = filtro.find((fil) => {
                    if (fil.nombre == item.nombre) {
                      return fil.visible;
                    }
                  });
                  return (
                    <div key={index} className={visible ? "d-block" : "d-none"}>
                      <ItemListaControles
                        item={item}
                        editarControlSeleccionado={editarControlSeleccionado}
                      />
                    </div>
                  );
                })}
              {props.controles.length == 0 && (
                <p> No hay controles realizados</p>
              )}
            </div>
          </Row>
        </Fragment>
      )}
      {nuevoControl && (
        <CargarControl
          idEmpresa={props.idEmpresa}
          idEquipo={props.equipo.id}
          idComponente={props.componente.id}
          salirDetalleControl={() => {
            setNuevoControl(false);
          }}
          salirDetalleComponente={props.salirDetalleComponente}
          volverEquipos={props.volverEquipos}
          nombreComponente={props.componente.nombre}
          nombreEquipo={props.nombreEquipo}
          cargarControl={cargarControl}
          tiposControles={tipoTesteos}
          editar={false}
        />
      )}
      {editarControl && (
        <EditarControl
          idEmpresa={props.idEmpresa}
          idEquipo={props.equipo.id}
          idComponente={props.componente.id}
          salirDetalleControl={() => {
            setEditarControl(false);
          }}
          salirDetalleComponente={props.salirDetalleComponente}
          volverEquipos={props.volverEquipos}
          nombreComponente={props.componente.nombre}
          nombreEquipo={props.nombreEquipo}
          controlSeleccionado={controlSeleccionado}
          tiposControles={tipoTesteos}
          borrarControl={borrarControl}
          updateControl={updateControl}
          editar={true}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    controles: state.controlesReducer.controles,
  };
};
export default connect(mapStateToProps, { fetchlistarControles })(
  DetalleComponente,
);
