import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  NavItem,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { fetchListarClientes } from "../reducers/clientes-reducer";
import {
  enviarNotificacionCliente,
  deleteNotificacion,
} from "../lib/clientes-api";
import { NotificacionEnviada } from "./notificacionEnviada";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import { NotificationManager } from "../components/common/react-notifications";

import "dropzone/dist/min/dropzone.min.css";
import DropzoneComponent from "react-dropzone-component";
import ReactDOMServer from "react-dom/server";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import BuscarMensaje from "./mensajes/buscar-mensajes";

// Importaciones correctas para Quill
const Delta = Quill.import("delta");
const Break = Quill.import("blots/break");
const Embed = Quill.import("blots/embed");

const lineBreakMatcher = () => {
  let newDelta = new Delta();
  newDelta.insert({ break: "" });
  return newDelta;
};

class SmartBreak extends Break {
  length() {
    return 1;
  }
  value() {
    return "\n";
  }

  insertInto(parent, ref) {
    Embed.prototype.insertInto.call(this, parent, ref);
  }
}

SmartBreak.blotName = "break";
SmartBreak.tagName = "BR";

// Registrar solo una vez
if (!Quill.imports["blots/break"]) {
  Quill.register(SmartBreak);
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ color: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
    [{ align: [] }],
  ],
  clipboard: {
    matchers: [["BR", lineBreakMatcher]],
    matchVisual: false,
  },
  keyboard: {
    bindings: {
      linebreak: {
        key: 13,
        shiftKey: true,
        handler: function (range) {
          const currentLeaf = this.quill.getLeaf(range.index)[0];
          const nextLeaf = this.quill.getLeaf(range.index + 1)[0];
          this.quill.insertEmbed(range.index, "break", true, "user");
          // Insert a second break if:
          // At the end of the editor, OR next leaf has a different parent (<p>)
          if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
            this.quill.insertEmbed(range.index, "break", true, "user");
          }
          // Now that we've inserted a line break, move the cursor forward
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        },
      },
    },
  },
};

const dropzoneComponentConfig = {
  postUrl: "no-url",
};

const handleChangeStatus = ({ meta }, status) => {
  console.log(status, meta);
};

const dropzoneConfig = {
  thumbnailHeight: 160,
  maxFilesize: 2,
  acceptedFiles: "image/jpg, image/jpeg",
  autoProcessQueue: false,
  maxFiles: 1,
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview mb-3">
      <div className="d-flex flex-row ">
        <div className="p-0 w-30 position-relative">
          <div className="dz-error-mark">
            <span>
              <i />{" "}
            </span>
          </div>
          <div className="dz-success-mark">
            <span>
              <i />
            </span>
          </div>
          <div className="preview-container">
            {/*  eslint-disable-next-line jsx-a11y/alt-text */}
            <img data-dz-thumbnail className="img-thumbnail border-0" />
            <i className="simple-icon-doc preview-icon" />
          </div>
        </div>
        <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
          <div>
            {" "}
            <span data-dz-name />{" "}
          </div>
          <div className="text-primary text-extra-small" data-dz-size />
          <div className="dz-progress">
            <span className="dz-upload" data-dz-uploadprogress />
          </div>
          <div className="dz-error-message">
            <span data-dz-errormessage />
          </div>
        </div>
      </div>
      <a href="#/" className="remove" data-dz-remove>
        {" "}
        <FontAwesomeIcon icon={faTrashCan} />{" "}
      </a>
    </div>
  ),
  headers: { "My-Awesome-Header": "header value" },
};

const Notificaciones = (props) => {
  const [mostrarModalNotificaciones, setMostrarModalNotificaciones] =
    useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [textQuillStandart, setTextQuillStandart] = useState("");
  const [asunto, setAsunto] = useState("");
  const [archivo, setArchivo] = useState("");
  const [estadoEnviado, setEstadoEnviado] = useState(false);
  const [quillKey, setQuillKey] = useState(0); // Key para forzar re-render del editor

  const mostrarNotificaciones = () => {
    setMostrarModalNotificaciones(true);
  };

  const seleccionarCliente = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  // Usar useCallback para evitar re-creación de función
  const handleQuillChange = useCallback((content, delta, source, editor) => {
    // Solo actualizar si el cambio viene del usuario
    if (source === "user") {
      setTextQuillStandart(content);
    }
  }, []);

  const enviarNotificacion = (e) => {
    enviarNotificacionCliente(
      clienteSeleccionado,
      asunto,
      textQuillStandart,
      archivo
    ).then((res) => {
      console.log(res);
      if (res.stat === 1) {
        setEstadoEnviado(true);
      }
    });
  };

  const volver = () => {
    setTextQuillStandart("");
    setAsunto("");
    setArchivo("");
    setEstadoEnviado(false);
    setQuillKey(prev => prev + 1); // Forzar re-render del editor
  };

  const finalizar = () => {
    setMostrarModalNotificaciones(false);
    volver();
  };

  const cerrarModal = () => {
    setMostrarModalNotificaciones(false);
    volver(); // Limpiar al cerrar
  };

  const borrarNotificacion = (idNotificacion) => {
    deleteNotificacion(idNotificacion).then((res) => {
      if (res) {
        props.fetchListarClientes();
      }
    });
  };

  useEffect(() => {
    if (props.clientes && props.clientes.length > 0) {
      if (props.detalleClienteState) {
        setClienteSeleccionado(props.detalleClienteState.id);
      } else {
        setClienteSeleccionado("");
      }
    }
  }, [props.clientes, props.detalleClienteState]);

  useEffect(() => {
    props.fetchListarClientes();
  }, [props.fetchListarClientes]);

  return (
    <Fragment>
      {!props.mostrarBt && (
        <NavLink to="#" onClick={mostrarNotificaciones}>
          {" "}
          <i className="simple-icon-bell" /> Enviar mensajes
        </NavLink>
      )}
      
      {props.mostrarBt && (
        <Button
          color="primary"
          size="md"
          className="top-right-button"
          onClick={mostrarNotificaciones}
        >
          <i className="simple-icon-bell" />{" "}
          {props.cambiarLabel ? "COMENZAR" : "ENVIAR MENSAJE"}
        </Button>
      )}
      <Modal isOpen={mostrarModalNotificaciones} size="lg" keyboard={false}>
        <ModalHeader toggle={cerrarModal}>
          ENVIAR MENSAJE AL CLIENTE
        </ModalHeader>
        {!estadoEnviado && (
          <Fragment>
            <ModalBody>
              <FormGroup>
                <Label for="select">Cliente: </Label>
                <Input
                  type="select"
                  name="select"
                  id="select"
                  onChange={seleccionarCliente}
                  value={clienteSeleccionado}
                  className="mb-2"
                >
                  <option>Seleccione un cliente</option>
                  {props.clientes &&
                    props.clientes.map((cliente) => {
                      return (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.empresa}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="asunto">Asunto: </Label>
                <Input
                  type="text"
                  name="asunto"
                  id="asunto"
                  placeholder="Asunto"
                  className="mb-2"
                  value={asunto}
                  onChange={(e) => {
                    setAsunto(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="mensaje">Mensaje: </Label>
                <ReactQuill
                  style={{
                    backgroundColor: "white",
                  }}
                  key={quillKey}
                  id="mensaje"
                  theme="snow"
                  value={textQuillStandart}
                  onChange={handleQuillChange}
                  modules={quillModules}
                  preserveWhitespace
                />
              </FormGroup>

              <DropzoneComponent
                config={dropzoneComponentConfig}
                onChangeStatus={handleChangeStatus}
                djsConfig={dropzoneConfig}
                eventHandlers={{
                  init: function (esto) {
                    esto.on("maxfilesexceeded", function (file) {
                      esto.removeFile(file);
                      NotificationManager.error(
                        "Sólo puede subir un archivo",
                        "Error",
                        3000,
                        null,
                        null,
                        ""
                      );
                    });
                  },
                  addedfile: (file) => {
                    setArchivo(file);
                  },
                }}
              >
                <div className="dz-message">
                  <div className="col-md-12">
                    <p>
                      <i className="simple-icon-doc dropzone-icon" />
                    </p>
                  </div>
                  <div className="col-md-12 mt-4">
                    <h4>Adjuntar archivo</h4>
                    <p>Arrástrelo o haga click aquí</p>
                  </div>
                </div>
              </DropzoneComponent>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={enviarNotificacion}>
                Enviar
              </Button>
            </ModalFooter>
          </Fragment>
        )}

        {estadoEnviado && (
          <NotificacionEnviada
            cliente={clienteSeleccionado}
            volver={volver}
            finalizar={finalizar}
          />
        )}
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    clientes: state.clientesReducer.clientes,
    detalleClienteState: state.clientesReducer.detalleClienteState,
  };
};

export default connect(mapStateToProps, { fetchListarClientes })(
  Notificaciones
);