import React, {
  Fragment,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  Label,
} from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import DropzoneComponent from "react-dropzone-component";
import { Tarjeta } from "../../componentes/tarjeta";
import {
  fetchListarObservaciones,
  fetchListarRecomendaciones,
} from "../../reducers/autocompletar-reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faSquareCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useFormularioCargaControles } from "../../hooks/useFormularioCargaControles";

const FormularioCargaControles = (props) => {
  const {
    // State
    startDate,
    dropdownOpen,
    estadoSeleccionadoNombre,
    estadoSeleccionadoId,
    estadoSeleccionadoColor,
    selectedFallas,
    opcionesFallas,
    observaciones,
    recomendaciones,
    archivo,
    filesEditando,
    observacionAutocompletar,
    recomendacionAutocompletar,
    // Configs
    dropzoneComponentConfig,
    dropzoneConfig,
    customStyles,
    // Handlers
    setFecha,
    guardarDesdeParent,
    limpiarFormularioDesdeParent,
    handleChangeMulti,
    toggles,
    seleccionarEstado,
    cargarObservacion,
    cargarRecomendaciones,
    cargarArchivos,
    removerArchivo,
    handleChangeStatus,
    anteriorEquipo,
    siguienteEquipo,
    eliminarImagen,
    limpiarFormulario,
    cargarObservacionDeSelect,
    cargarRecomendacionesDeSelect,
  } = useFormularioCargaControles(props);

  /*useImperativeHandle(ref, () => ({
    guardarDesdeParent,
  }));*/

  return (
    <Fragment ref={ref}>
      <div className="position-relative">
        <Label
          check
          className={
            props.equipoControlado
              ? "equipo-controlado"
              : "equipo-no-controlado"
          }
        >
          EQUIPO NO CONTROLADO:
          <div className="d-inline ml-2" onClick={limpiarFormularioDesdeParent}>
            {props.equipoControlado && <FontAwesomeIcon icon={faSquareCheck} />}
            {!props.equipoControlado && <FontAwesomeIcon icon={faSquare} />}
          </div>
        </Label>
        <Button
          color="info"
          className={
            props.equipoControlado
              ? "ml-2 siguiente-equipo-controlado"
              : "ml-2 siguiente-equipo"
          }
          onClick={() => {
            props.siguienteEquipoFormulario(siguienteEquipo);
            console.log("🚀 ~ FormularioCargaControles ~ props.detalleDeComponentesYControles.componentes:", props.detalleDeComponentesYControles.componentes)
          }}
          disabled={props.desahabilitarSiguiente}
        >
          SIGUIENTE EQUIPO <span className="ml-2">&gt;</span>
        </Button>
      </div>
      {props.componentes &&
        props.componentes.length > 0 &&
        props.componentes.map((componente, index) => {
          return (
            <Fragment key={index}>
              <Tarjeta titulo="">
                <div
                  className={props.equipoControlado ? "tarjeta-disabled" : ""}
                >
                  <Row className="mt-2">
                    <Col>
                      <h5 className="border p-2 bg-black borde-gris mb-4">
                        COMPONENTE: <strong>{componente.nombre}</strong>
                      </h5>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <h6 className="mt-3">CONTROL: </h6>
                    </Col>
                    <Col className="text-right">
                      {(function () {
                        if (
                          estadoSeleccionadoId[index] ||
                          (selectedFallas[index] &&
                            selectedFallas[index].length > 0) ||
                          observaciones[index] ||
                          recomendaciones[index] ||
                          document.querySelector(".dz-image-preview") != null
                        ) {
                          return (
                            <Button
                              color="link"
                              className="pr-1"
                              onClick={() => {
                                limpiarFormulario(index);
                              }}
                            >
                              {" "}
                              Limpiar Formulario
                            </Button>
                          );
                        }
                      })()}
                    </Col>
                  </Row>
                  <Row className="formulario-carga-controles">
                    <Col>
                      <div className="form-inline fecha-estado-falla">
                        <InputGroup style={{ flex: "0 0 auto" }}>
                          <InputGroupAddon addonType="prepend">
                            FECHA:
                          </InputGroupAddon>
                          <DatePicker
                            selected={startDate[index]}
                            onChange={(evt, date) => setFecha(evt, date, index)}
                            disabled={props.equipoControlado}
                            popperPlacement="bottom-end"
                          />
                        </InputGroup>
                        <InputGroup
                          className="estados-wrapper"
                          id={"estados-wrap-" + index}
                        >
                          <InputGroupAddon
                            addonType="prepend"
                            className="x-trapad"
                          >
                            ESTADO:
                          </InputGroupAddon>
                          <Dropdown
                            isOpen={dropdownOpen[index]}
                            toggle={() => {
                              toggles(index);
                            }}
                            className="rich-dropdown  borde-gris"
                          >
                            <DropdownToggle
                              tag="div"
                              onClick={() => {
                                toggles(index);
                              }}
                              data-toggle="dropdown"
                              className="pl-2"
                            >
                              {estadoSeleccionadoNombre[index] != "" ? (
                                <div
                                  className="d-flex"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      '<span class="estado-seleccionado-color" style="background:' +
                                      estadoSeleccionadoColor[index] +
                                      '"></span>' +
                                      estadoSeleccionadoNombre[index],
                                  }}
                                />
                              ) : (
                                "Seleccione un Estado"
                              )}
                            </DropdownToggle>
                            <DropdownMenu>
                              {props.estados &&
                                props.estados.map((estado) => {
                                  return (
                                    <div
                                      className="color-wrapper"
                                      onClick={() => {
                                        seleccionarEstado(estado, index);
                                        toggles(index);
                                      }}
                                      key={estado.id}
                                    >
                                      <span
                                        style={{ background: estado.color }}
                                      ></span>
                                      <div className="ml-5">
                                        {estado.nombre}
                                      </div>
                                    </div>
                                  );
                                })}
                            </DropdownMenu>
                          </Dropdown>
                        </InputGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            TIPO DE FALLA:
                          </InputGroupAddon>
                          <Select
                            components={{ Input: CustomSelectInput }}
                            className="react-select-fallas borde-gris"
                            classNamePrefix="react-select"
                            styles={customStyles}
                            isMulti
                            placeholder="Seleccione una o varias fallas"
                            name="form-field-name"
                            value={selectedFallas[index]}
                            onChange={(el) => {
                              handleChangeMulti(el, index);
                            }}
                            options={opcionesFallas}
                            isDisabled={props.equipoControlado}
                          />
                        </InputGroup>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {props.observaciones && (
                        <Input
                          type="select"
                          name="observacion_autocompletar"
                          className="mt-4"
                          onChange={(evt) => {
                            cargarObservacion(evt.target.value, index);
                            cargarObservacionDeSelect(index, evt.target.value);
                          }}
                          value={observacionAutocompletar[index]}
                        >
                          <option>-- Observaciones Guardadas: -- </option>
                          {props.observaciones &&
                            props.observaciones.map((observacion) => {
                              return (
                                <option
                                  key={observacion.id}
                                  value={observacion.texto}
                                >
                                  {observacion.nombre_corto}
                                </option>
                              );
                            })}
                        </Input>
                      )}
                      <InputGroup className="mt-4 borde-gris mb-4">
                        <div className="legend">
                          OBSERVACIONES: {props.equipoControlado}
                        </div>
                        <Input
                          className="no-border mt-2"
                          type="textarea"
                          id="observaciones"
                          value={observaciones[index]}
                          onChange={(e) =>
                            cargarObservacion(e.target.value, index)
                          }
                          disabled={props.equipoControlado}
                        />
                      </InputGroup>

                      {props.recomendaciones && (
                        <Input
                          type="select"
                          name="recomendaciones_autocompletar"
                          className="mt-4"
                          onChange={(evt) => {
                            cargarRecomendaciones(evt.target.value, index);
                            cargarRecomendacionesDeSelect(
                              index,
                              evt.target.value,
                            );
                          }}
                          value={recomendacionAutocompletar[index]}
                        >
                          <option>-- Recomendaciones Guardadadas: -- </option>
                          {props.recomendaciones &&
                            props.recomendaciones.map((recomendacion) => {
                              return (
                                <option
                                  key={recomendacion.id}
                                  value={recomendacion.texto}
                                >
                                  {recomendacion.nombre_corto}
                                </option>
                              );
                            })}
                        </Input>
                      )}
                      <InputGroup className="mt-4 borde-gris">
                        <div className="legend">RECOMENDACIONES:</div>
                        <Input
                          className="no-border mt-2"
                          type="textarea"
                          id="observaciones"
                          value={recomendaciones[index]}
                          onChange={(e) =>
                            cargarRecomendaciones(e.target.value, index)
                          }
                          disabled={props.equipoControlado}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="container">
                      {filesEditando &&
                        filesEditando[index] &&
                        filesEditando[index].length > 0 && (
                          <Row className="mt-2">
                            <div className="col-md-12">
                              <h4>Imágenes adjuntas</h4>
                            </div>
                            <div className="row">
                              {filesEditando[index].map((archivo) => {
                                return (
                                  <Fragment key={archivo.id}>
                                    <div className="col-xs-12 col-md-3 position-relative mb-4">
                                      <div
                                        style={{ background: "#6A6A6A" }}
                                        className="text-center"
                                      >
                                        <img
                                          src={archivo.filename}
                                          alt={archivo.id}
                                          className="img-fluid"
                                          width={450}
                                          height={450}
                                        />
                                        <Button
                                          className="position-absolute d-flex justify-content-center align-items-center"
                                          color="danger"
                                          onClick={() => {
                                            eliminarImagen(archivo.id, index);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                      </div>
                                    </div>
                                  </Fragment>
                                );
                              })}
                            </div>
                          </Row>
                        )}
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    {archivo.length > 0 && (
                      <div className="col-md-12">
                        <DropzoneComponent
                          className="borde-gris"
                          config={dropzoneComponentConfig}
                          onChangeStatus={handleChangeStatus}
                          djsConfig={dropzoneConfig}
                          eventHandlers={{
                            init: (esto) => {
                              esto.on("maxfilesexceeded", (file) => {
                                esto.removeFile(file);
                                NotificationManager.error(
                                  "Sólo puede subir un archivo",
                                  "Error",
                                  3000,
                                  null,
                                  null,
                                  "",
                                );
                              });
                            },
                            addedfile: (file) => {
                              cargarArchivos(file, index);
                            },
                            removedfile: (file) => {
                              removerArchivo(file, index);
                            },
                          }}
                        >
                          <div className="dz-message">
                            <div className="col-md-12 mt-5">
                              <p>
                                <i className="simple-icon-doc dropzone-icon" />
                              </p>
                            </div>
                            <div className="col-md-12 mt-5 mb-5">
                              <h5>ADJUNTAR UNA IMAGEN</h5>
                              <p>
                                Arrastre una imagen aquí para adjuntarla al test
                              </p>
                            </div>
                          </div>
                        </DropzoneComponent>
                        {props.equipoControlado && (
                          <div className="disabled-drag-component"></div>
                        )}
                      </div>
                    )}
                  </Row>
                  <Row>
                    <Col>
                      <hr />
                    </Col>
                  </Row>
                </div>
              </Tarjeta>{" "}
              <Row className="mt-3 mb-3"></Row>
            </Fragment>
          );
        })}
      <Row>
        <Col className="d-flex justify-content-center">
          <Button
            color="success"
            onClick={anteriorEquipo}
            disabled={props.desahabilitarAnterior}
          >
            <span className="mr-2">&lt;</span> EQUIPO ANTERIOR
          </Button>
          <Button
            color="info"
            className="ml-2"
            onClick={siguienteEquipo}
            disabled={props.desahabilitarSiguiente}
          >
            SIGUIENTE EQUIPO <span className="ml-2">&gt;</span>
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    componentes:
      state.cargasMasivasReducer.detalleDeComponentesYControles.componentes,
    estados: state.estadosReducer.estados,
    fallas: state.fallasReducer.fallas,
    observaciones: state.autocompletarReducer.observaciones,
    recomendaciones: state.autocompletarReducer.recomendaciones,
    fechaGlobal: state.cargasMasivasReducer.fechaGlobal,
  };
};
export default connect(mapStateToProps, {
  fetchListarObservaciones,
  fetchListarRecomendaciones,
})(FormularioCargaControles);