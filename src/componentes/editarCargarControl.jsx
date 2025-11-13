import React, { Fragment, useState, useEffect } from 'react';
import { Row, Input, Button, InputGroupAddon, InputGroup, Modal, ModalBody, ModalFooter, Col, Label } from "reactstrap";
import { fetchlistarEstados } from '../reducers/estados-reducer';
import { fetchlistarFallas } from '../reducers/fallas-reducer';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import moment from "moment";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';
import { NotificationManager } from "../components/common/react-notifications";
import "dropzone/dist/min/dropzone.min.css";
import DropzoneComponent from "react-dropzone-component";
import { eliminarImagenControl, guardarEquipoNoControladoIndividual } from '../lib/controles-api';
import Select from "react-select";
import CustomSelectInput from "../components/common/CustomSelectInput";
import ComentarioCliente from './equipos/ComentarioCliente';

import ReactDOMServer from 'react-dom/server';

const Delta = ReactQuill.Quill.import("delta");
const Break = ReactQuill.Quill.import("blots/break");
const Embed = ReactQuill.Quill.import("blots/embed");

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
ReactQuill.Quill.register(SmartBreak);

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'color': [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
        ],
        ["link"],
        ["clean"],
        [{ align: [] }],
    ],
    clipboard: {
        matchers: [["BR", lineBreakMatcher]],
        matchVisual: false
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
                    if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
                        this.quill.insertEmbed(range.index, "break", true, "user");
                    }
                    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                }
            }
        }
    }
};

const dropzoneComponentConfig = {
    postUrl: 'no-url'
};

const handleChangeStatus = ({ meta }, status) => {
    console.log("stts", status, "meta",meta)
}

const dropzoneConfig = {
    thumbnailHeight: 160,
    maxFilesize: 2,
    acceptedFiles: 'image/jpg, image/jpeg',
    autoProcessQueue: false,
    maxFiles: 10,
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
                <i className="glyph-icon simple-icon-trash" />{" "}
            </a>
        </div>
    ),
    headers: { "My-Awesome-Header": "header value" }
};

const EditarCargarControl = (props) => {
    const tiposControles = props.tiposControles;
    const [tipoControlSeleccionado, setTipoControlSeleccionado] = useState('');
    const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState('');
    const [estadoSeleccionadoNombre, setEstadoSeleccionadoNombre] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const [recomendaciones, setRecomendaciones] = useState('');
    const [fecha, setFecha] = useState(moment());
    const [textQuillStandart, setTextQuillStandart] = useState('');
    const [archivo, setArchivo] = useState([]);
    const [filesEditando, setFilesEditando] = useState([]);
    const [modalConfirmarBorrarControl, setModalConfirmarBorrarControl] = useState(false);
    const [confirmarBorrarImagen, setConfirmarBorrarImagen] = useState(false);
    const [imagenIdSeleccionada, setImagenIdSeleccionada] = useState('');
    const [selectedFallas, setSelectedFallas] = useState([]);
    const [selectedFallasId, setSelectedFallasId] = useState([]);
    const [opcionesFallas, setOpcionesFallas] = useState([]);

    const toggle = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const handleChangeMulti = (el) => {
        let fallasIds = [];
        el.forEach(falla => {
            fallasIds.push(falla.value)
        })
        setSelectedFallasId(fallasIds);
        setSelectedFallas(el);
    };

    useEffect(() => {
        if (props.controlSeleccionado) { // porque está editando
            //setTipoControlSeleccionado(props.controlSeleccionado.nombre);
            console.log(props.controlSeleccionado)
            setEstadoSeleccionadoNombre(props.controlSeleccionado.estado);
            setObservaciones(props.controlSeleccionado.observaciones);
            setRecomendaciones(props.controlSeleccionado.recomendaciones);
            setFecha(moment(props.controlSeleccionado.fecha, 'YYYY-MM-DD'));
            setTextQuillStandart(props.controlSeleccionado.reporte);
            setFilesEditando(props.controlSeleccionado.files);
            let fallasIds = [];
            props.controlSeleccionado.fallas.forEach((fallaControl) => {
                fallasIds.push(fallaControl.id)
            })
            setSelectedFallasId(fallasIds);
            tiposControles.forEach((tipo) => {
                if (tipo.control === props.controlSeleccionado.nombre) {
                    setTipoControlSeleccionado(tipo.id);
                }
            })

            props.estados.forEach((estado) => {
                if (estado.nombre === props.controlSeleccionado.estado) {
                    setEstadoSeleccionadoId(estado.id);
                }
            })

            let fallasSelecionadasAmostrar = [];
            props.fallas.forEach((falla) => {
                props.controlSeleccionado.fallas.forEach((fallaControl) => {
                    if (falla.id === fallaControl.id) {
                        let fallita = {color: falla.color, value: falla.id, label:  <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' + falla.color + '"></div>' + falla.nombre + '</div>' }} />}
                        fallasSelecionadasAmostrar.push(fallita)
                    }
                })
            })
            setSelectedFallas(fallasSelecionadasAmostrar);
        }
        props.fetchlistarEstados(props.idEmpresa);
        props.fetchlistarFallas(props.idEmpresa);
    }, []);

    useEffect(() => {
        if (props.fallas.length) {
            let fallasAray = []
            props.fallas.forEach((falla) => {
                let registro = { label: <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' + falla.color + '"></div>' + falla.nombre + '</div>' }} />, value: falla.id, color: falla.color };
                fallasAray.push(registro);
            })
            setOpcionesFallas(fallasAray);
        }
    }, [props.fallas]);

    const handleChangeEmbedded = (date) => {
        setFecha(date)
        console.log(date.format('YYYY-MM-DD'));
    }

    const guardarCambios = () => {
        if (props.editar) {
            props.updateControl(props.controlSeleccionado.id, tipoControlSeleccionado, estadoSeleccionadoId, moment(fecha).format("YYYY-MM-DD"), selectedFallasId, observaciones, recomendaciones, textQuillStandart, archivo);
        } else {
            props.cargarControl(tipoControlSeleccionado, estadoSeleccionadoId, moment(fecha).format("YYYY-MM-DD"), selectedFallasId, observaciones, recomendaciones, textQuillStandart, archivo);
        }
    }

    const eliminarControl = () => {
        props.borrarControl(props.controlSeleccionado.id)
        setModalConfirmarBorrarControl(false);
    }

    const abrirConfirmarBorrarImagen = (idImagen) => {
        setImagenIdSeleccionada(idImagen)
        setConfirmarBorrarImagen(true)
    }

    const eliminarImagen = () => {
        eliminarImagenControl(imagenIdSeleccionada).then(res => {
            if (res.stat === 1) {
                filesEditando.map((imagen) => {
                    if (imagenIdSeleccionada === imagen.id) {
                        setFilesEditando(filesEditando.filter(file => file.id !== imagen.id))
                    }
                })
                setConfirmarBorrarImagen(false);
            }
        })
    }

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            padding: '10px',
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
        })
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
                    <Button className="neutro" onClick={() => { modalConfirmarBorrarControl(false) }}>
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
                    <Button className="neutro" onClick={() => { setConfirmarBorrarImagen(false) }}>
                        No, cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Row>
                <div className="col-md-12">
                    <Button color="link" className="pl-0" onClick={props.volverEquipos}>&lt; Equipos</Button>
                    <Button color="link" className="pl-0" onClick={props.salirDetalleComponente}>&lt; {props.nombreEquipo}</Button>
                    <Button color="link" className="pl-0" onClick={props.salirDetalleControl}>&lt; {props.nombreComponente}</Button>
                </div>
            </Row>
            <Row>
                <div className="col-md-12 d-flex h3 align-items-center justify-content-between">
                    <div className='d-flex align-items-center'>
                        <div><i className="simple-icon-target" style={{ "fontSize": "1em" }} /> </div>
                        <div className='ml-3'>
                            {props.editar ? ("CONTROL REALIZADO:") : ("NUEVO CONTROL")} <br />
                            COMPONENTE: {props.nombreComponente} | EQUIPO: {props.nombreEquipo}
                        </div>
                    </div>
                    <div className='d-flex align-items-center position-relative'>
                        {props.controlSeleccionado && props.controlSeleccionado.comentario_cliente && props.controlSeleccionado.comentario_cliente !== '' && <ComentarioCliente comentario={props.controlSeleccionado.comentario_cliente} />}
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="separator mb-5"></div>
                </div>
            </Row>
            <Row className="mt-3">
                <div className="col-md-6">
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            Tipo
                        </InputGroupAddon>
                        <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setTipoControlSeleccionado(e.target.value) }} value={tipoControlSeleccionado}>
                            <option>Seleccione un control</option>
                            {tiposControles.map((tipo) => {
                                return (<option key={tipo.id} value={tipo.id}>{tipo.control}</option>)
                            })}
                        </Input>
                    </InputGroup>


                </div>
                <div className="col-md-6">
                    <h3>Fecha del Control</h3>
                    <div className="col-md-12 mb-3">
                        <DatePicker
                            locale={'es'}
                            calendarClassName="embedded"
                            inline
                            selected={fecha}
                            onChange={handleChangeEmbedded} />
                    </div>
                </div>
            </Row>
            <Fragment>
                <Row>
                    <div className="col-md-12">
                        <h4>Reporte</h4>
                        <ReactQuill
                            id="mensaje"
                            theme="snow"
                            value={textQuillStandart}
                            onChange={setTextQuillStandart}
                            modules={quillModules}
                        />
                    </div>
                </Row>
                {filesEditando.length > 0 && (<div className="mt-2 container">
                    <div className='col-md-12'><h4>Imágenes adjuntas</h4></div>
                    <div className="row">
                        {filesEditando.map((archivo) => {
                            return <Fragment key={archivo.id}>
                                <div className='col-xs-12 col-md-3 position-relative mb-4'>
                                    <img src={archivo.file} alt={archivo.id} className="img-fluid" />
                                    <Button className="position-absolute remove-image" color="danger" onClick={() => { abrirConfirmarBorrarImagen(archivo.id) }}>
                                        <i className='simple-icon-trash' />
                                    </Button>
                                </div>
                            </Fragment>;
                        })}
                    </div>
                </div>)}

                <Row className="mt-3">
                    <div className="col-md-12">
                        <DropzoneComponent
                            config={dropzoneComponentConfig}
                            onChangeStatus={handleChangeStatus}
                            djsConfig={dropzoneConfig}
                            eventHandlers={{
                                init: (esto) => {
                                    esto.on("maxfilesexceeded", (file) => {
                                        esto.removeFile(file);
                                        NotificationManager.error("Sólo puede subir un archivo", "Error", 3000, null, null, '')
                                    });
                                },
                                addedfile: (file) => {
                                    const files = archivo;
                                    files.push(file);
                                    setArchivo(files);
                                }
                            }}
                        >
                            <div className="dz-message">
                                <div className="col-md-12 mt-5"><p><i className="simple-icon-doc dropzone-icon" /></p></div>
                                <div className="col-md-12 mt-5 mb-5">
                                    <h5>ADJUNTAR UNA IMAGEN</h5>
                                    <p>Arrastre una imagen aquí para adjuntarla al test</p>
                                </div>

                            </div>
                        </DropzoneComponent>
                    </div>
                    <div className="col-md-12 d-flex justify-content-between mt-4">
                        <Button color="success" onClick={guardarCambios}>GUARDAR CONTROL</Button>
                        {props.editar ? (<Button color="danger" onClick={() => { setModalConfirmarBorrarControl(true) }}>ELIMINAR CONTROL</Button>) :
                            (<Button color="secondary" onClick={props.salirDetalleControl}>CANCELAR</Button>)}
                    </div>
                </Row>
            </Fragment>

        </Fragment>

    );
};

const mapStateToProps = (state) => {
    return {
        estados: state.estadosReducer.estados,
        fallas: state.fallasReducer.fallas
    }
}
export default connect(
    //función que mapea propiedades del state con propiedades del componente
    mapStateToProps,
    //mapeo de funciones
    { fetchlistarEstados, fetchlistarFallas }
)(EditarCargarControl);

