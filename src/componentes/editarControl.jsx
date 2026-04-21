import { Fragment, useState, useEffect } from "react";
import {
  Row,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { fetchlistarEstados } from "../reducers/estados-reducer";
import { fetchlistarFallas } from "../reducers/fallas-reducer";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";

import { NotificationManager } from "../components/common/react-notifications";

import {
  fetchSetControlIndividualSeleccionado,
  fetchModalEditarControl,
} from "../reducers/controles-reducer";

import {
  eliminarImagenControl,
  guardarEquipoNoControladoIndividual,
} from "../lib/controles-api";
import Select from "react-select";
import CustomSelectInput from "../components/common/CustomSelectInput";
import ComentarioCliente from "./equipos/ComentarioCliente";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import ReactDOMServer from "react-dom/server";
import { set } from "react-hook-form";

const EditarCargarControl = (props) => {
  //console.log("🚀 ~ EditarCargarControl ~ props:", props);
  const {
    controlSeleccionado,
    tiposControles,
    fetchSetControlIndividualSeleccionado,
    controlIndividualSeleccionado,
    controles,
    estados,
    fallas,
    fetchlistarEstados,
    fetchlistarFallas,
    fetchModalEditarControl,
    idEmpresa,
  } = props;

  //const tiposControles = props.tiposControles;
  const [componenteDetalle, setComponenteDetalle] = useState(null);
  
  const [tipoControlSeleccionado, setTipoControlSeleccionado] = useState("");
  const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState("");
  const [estadoSeleccionadoNombre, setEstadoSeleccionadoNombre] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [fecha, setFecha] = useState(moment());
  const [textQuillStandart, setTextQuillStandart] = useState("");
  const [archivo, setArchivo] = useState([]);
  const [filesEditando, setFilesEditando] = useState([]);
  const [modalConfirmarBorrarControl, setModalConfirmarBorrarControl] =
    useState(false);
  const [confirmarBorrarImagen, setConfirmarBorrarImagen] = useState(false);
  const [imagenIdSeleccionada, setImagenIdSeleccionada] = useState("");
  const [selectedFallas, setSelectedFallas] = useState([]);
  const [selectedFallasId, setSelectedFallasId] = useState([]);
  const [opcionesFallas, setOpcionesFallas] = useState([]);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    console.log("🚀 ~ EditarCargarControl ~ controlSeleccionado:", controlSeleccionado)
    if (controlSeleccionado) {

      // porque está editando
      fetchSetControlIndividualSeleccionado(controlSeleccionado);

      setTipoControlSeleccionado(controlSeleccionado.nombre);
      setEstadoSeleccionadoNombre(controlSeleccionado.estado);
      setObservaciones(controlSeleccionado.observaciones);
      setRecomendaciones(controlSeleccionado.recomendaciones);
      setFecha(moment(controlSeleccionado.fecha, "YYYY-MM-DD"));
      setTextQuillStandart(controlSeleccionado.reporte);
      setFilesEditando(controlSeleccionado.files);

      let fallasIds = [];
      controlSeleccionado.fallas?.forEach((fallaControl) => {
        fallasIds.push(fallaControl.id);
      });
      setSelectedFallasId(fallasIds);

      tiposControles.forEach((tipo) => {
        if (tipo.control === controlSeleccionado.nombre) {
          setTipoControlSeleccionado(tipo.id);
        }
      });

      estados.forEach((estado) => {
        if (estado.nombre === controlSeleccionado.estado) {
          setEstadoSeleccionadoId(estado.id);
        }
      });

      setFilesEditando(controlSeleccionado.files);

      let fallasSelecionadasAmostrar = [];
      fallas?.forEach((falla) => {
        controlSeleccionado.fallas?.forEach((fallaControl) => {
          if (falla.id === fallaControl.id) {
            let fallita = {
              color: falla.color,
              value: falla.id,
              label: (
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' +
                      falla.color +
                      '"></div>' +
                      falla.nombre +
                      "</div>",
                  }}
                />
              ),
            };
            fallasSelecionadasAmostrar.push(fallita);
          }
        });
      });
      setSelectedFallas(fallasSelecionadasAmostrar);
    }

    fetchlistarEstados(idEmpresa);
    fetchlistarFallas(idEmpresa);
  }, []);

  useEffect(() => {
    if (controlIndividualSeleccionado) {
      // porque está editando
      //fetchSetControlIndividualSeleccionado(controlSeleccionado);

      setTipoControlSeleccionado(controlIndividualSeleccionado.nombre);
      //setColorEstadoSeleccionado(controlIndividualSeleccionado.color_estado)
      setEstadoSeleccionadoNombre(controlIndividualSeleccionado.estado);
      setObservaciones(controlIndividualSeleccionado.observaciones);
      setRecomendaciones(controlIndividualSeleccionado.recomendaciones);
      setFecha(moment(controlIndividualSeleccionado.fecha, "YYYY-MM-DD"));
      setTextQuillStandart(controlIndividualSeleccionado.reporte);
      setFilesEditando(controlIndividualSeleccionado.files);

      let fallasIds = [];
      controlIndividualSeleccionado.fallas?.forEach((fallaControl) => {
        fallasIds.push(fallaControl.id);
      });
      setSelectedFallasId(fallasIds);

      tiposControles.forEach((tipo) => {
        if (tipo.control === controlIndividualSeleccionado.nombre) {
          setTipoControlSeleccionado(tipo.id);
        }
      });

      estados.forEach((estado) => {
        if (estado.nombre === controlIndividualSeleccionado.estado) {
          setEstadoSeleccionadoId(estado.id);
        }
      });

      let fallasSelecionadasAmostrar = [];
      fallas?.forEach((falla) => {
        controlIndividualSeleccionado.fallas?.forEach((fallaControl) => {
          if (falla.id === fallaControl.id) {
            let fallita = {
              color: falla.color,
              value: falla.id,
              label: (
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' +
                      falla.color +
                      '"></div>' +
                      falla.nombre +
                      "</div>",
                  }}
                />
              ),
            };
            fallasSelecionadasAmostrar.push(fallita);
          }
        });
      });
      setSelectedFallas(fallasSelecionadasAmostrar);

    }

    fetchlistarEstados(idEmpresa);
    fetchlistarFallas(idEmpresa);

  }, [controlIndividualSeleccionado]);

  useEffect(() => {
    const componenteEncontrado = controles.find(
      (control) => control.id === controlSeleccionado.id,
    );
        
    setComponenteDetalle(componenteEncontrado);

    let fallasSelecionadasAmostrar = [];
      fallas?.forEach((falla) => {
        controlIndividualSeleccionado?.fallas?.forEach((fallaControl) => {
          if (falla.id === fallaControl.id) {
            let fallita = {
              color: falla.color,
              value: falla.id,
              label: (
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' +
                      falla.color +
                      '"></div>' +
                      falla.nombre +
                      "</div>",
                  }}
                />
              ),
            };
            fallasSelecionadasAmostrar.push(fallita);
          }
        });
      });
      setSelectedFallas(fallasSelecionadasAmostrar);

    tiposControles.forEach((tipo) => {
      if (tipo.control === componenteEncontrado.nombre) {
        setTipoControlSeleccionado(tipo.id);
      }
    });

    estados.forEach((estado) => {
      if (estado.nombre === componenteEncontrado.estado) {
        setEstadoSeleccionadoId(estado.id);
      }
    });
    setFilesEditando(componenteEncontrado.files);
  }, [controles]);

  const eliminarControl = () => {
    props.borrarControl(controlSeleccionado.id);
    setModalConfirmarBorrarControl(false);
  };

  const abrirConfirmarBorrarImagen = (idImagen) => {
    setImagenIdSeleccionada(idImagen);
    setConfirmarBorrarImagen(true);
  };

  const eliminarImagen = async () => {
    const res = await eliminarImagenControl(imagenIdSeleccionada);
    if (res.stat === 1) {
      filesEditando.map((imagen) => {
        if (imagenIdSeleccionada === imagen.id) {
          setFilesEditando(
            filesEditando.filter((file) => file.id !== imagen.id),
          );
        }
      });
      setConfirmarBorrarImagen(false);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
  };

  return (
    <Fragment>
      <Modal isOpen={modalConfirmarBorrarControl} size="md">
        <ModalBody>
          <p>¿Desea eliminar este Control?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={eliminarControl}>
            Si, eliminar
          </Button>
          <Button
            className="neutro"
            onClick={() => {
              setModalConfirmarBorrarControl(false);
            }}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={confirmarBorrarImagen} size="md">
        <ModalBody>
          <p>¿Desea eliminar la imagen de este Control?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={eliminarImagen}>
            Si, eliminar
          </Button>
          <Button
            className="neutro"
            onClick={() => {
              setConfirmarBorrarImagen(false);
            }}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Row>
        <div className="col-md-12">
          <Button color="link" className="pl-0" onClick={props.volverEquipos}>
            &lt; Equipos
          </Button>
          <Button
            color="link"
            className="pl-0"
            onClick={props.salirDetalleComponente}
          >
            &lt; {props.nombreEquipo}
          </Button>
          <Button
            color="link"
            className="pl-0"
            onClick={props.salirDetalleControl}
          >
            &lt; {props.nombreComponente}
          </Button>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 d-flex h3 align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div>
              <i
                className="simple-icon-target"
                style={{ fontSize: "1em" }}
              />{" "}
            </div>
            <h3 className="text-uppercase">
              {/*props.editar ? "CONTROL DE ViBRACIONES" : "NUEVO CONTROL"*/}
              Control de {props.controlSeleccionado.nombre}
            </h3>
          </div>
          <div className="relative d-flex align-items-center justify-content-end">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                caret
                color="primary"
                style={{
                  fontSize: ".75rem",
                }}
              >
                ACCIONES
              </DropdownToggle>
              <DropdownMenu down>
                <DropdownItem onClick={() => fetchModalEditarControl(true)}>
                  EDITAR
                </DropdownItem>
                <DropdownItem
                  onClick={() => setModalConfirmarBorrarControl(true)}
                >
                  BORRAR
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="d-flex align-items-center position-relative">
          {controlSeleccionado && controlSeleccionado.comentario_cliente && (
            <ComentarioCliente
              comentario={controlSeleccionado.comentario_cliente}
            />
          )}
        </div>
        <div className="col-md-12">
          <div className="separator mb-5"></div>
        </div>
      </Row>
      <Row className="my-4">
        <div className="col-6 col-md-2 d-flex flex-column">
          <h5 className="opacity-75">EQUIPO</h5>
          <p>{props.nombreEquipo}</p>
        </div>
        <div className="col-6 col-md-2 d-flex flex-column">
          <h5 className="opacity-75">COMPONENTE</h5>
          <p> {props.nombreComponente}</p>
        </div>
        <div className="col-6 col-md-2 d-flex flex-column">
          <h5 className="opacity-75">FECHA</h5>
          <p> {fecha.format("DD/MM/YYYY")}</p>
        </div>
        <div className="col-6 col-md-2 d-flex flex-column">
          <h5 className="opacity-75">ESTADO</h5>
          <p
            className="estados-tag pl-2 pr-2 py-1"
            style={{
              backgroundColor:
                props.controlIndividualSeleccionado?.color_estado,
            }}
          >
            {" "}
            {estadoSeleccionadoNombre}
          </p>
        </div>
        <div className="col-6 col-md-2 d-flex flex-column">
          <h5 className="opacity-75">FALLAS</h5>
          <p>
            {" "}
            {selectedFallas.length > 0
              ? selectedFallas.map((falla) => falla.label)
              : "Sin fallas"}
          </p>
        </div>
      </Row>
      <Row className="my-4">
        <div className="col-md-12 mb-4">
          <h5 className="opacity-75">OBSERVACIONES</h5>
          {observaciones || "Sin observaciones"}
        </div>
        <div className="col-md-12">
          <h5 className="opacity-75">RECOMENDACIONES</h5>
          {recomendaciones || "Sin recomendaciones"}
        </div>
      </Row>
      {filesEditando && (
        <Row className="my-4">
          {filesEditando.map((file) => (
            <div
              className="col-12 col-md-3 mb-3 position-relative"
              key={file.id}
            >
              <Button
                className="position-absolute bg-danger text-white border-0"
                style={{ right: "-.75rem", top: "-1rem", zIndex: 10 }}
                onClick={() => {
                  setImagenIdSeleccionada(file.id);
                  setConfirmarBorrarImagen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
              <img
                src={file.file}
                alt="Imagen reporte"
                className="img-fluid "
              />
            </div>
          ))}
        </Row>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    estados: state.estadosReducer.estados,
    fallas: state.fallasReducer.fallas,
    modalEditarControl: state.controlesReducer.modalEditarControl,
    controlIndividualSeleccionado:
      state.controlesReducer.controlIndividualSeleccionado,
    controles: state.controlesReducer.controles,
  };
};
export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,

  //mapeo de funciones
  {
    fetchModalEditarControl,
    fetchlistarEstados,
    fetchlistarFallas,
    fetchSetControlIndividualSeleccionado,
  },
)(EditarCargarControl);
