import React, { Fragment, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Col, Dropdown, DropdownToggle, DropdownMenu, Button, Label } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { connect } from 'react-redux';
import CustomSelectInput from "../../components/common/CustomSelectInput";
import DropzoneComponent from "react-dropzone-component";
import { NotificationManager } from "../../components/common/react-notifications";
import { eliminarImagenDeCargaMasiva } from "../../lib/cargas-masivas-api";
import { Tarjeta } from "../../componentes/tarjeta";
import { fetchListarObservaciones, fetchListarRecomendaciones } from '../../reducers/autocompletar-reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'

import ReactDOMServer from 'react-dom/server';

const FormularioCargaControles = forwardRef((props, ref) => {
    const [startDate, setStartDate] = useState(moment());
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [estadoSeleccionadoNombre, setEstadoSeleccionadoNombre] = useState('');
    const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState('');
    const [estadoSeleccionadoColor, setEstadoSeleccionadoColor] = useState('');
    const [selectedFallas, setSelectedFallas] = useState([]);
    const [selectedFallasIds, setSelectedFallasIds] = useState([]);
    const [opcionesFallas, setOpcionesFallas] = useState([]);
    const [observaciones, setObservaciones] = useState('');
    const [recomendaciones, setRecomendaciones] = useState('');
    const [archivo, setArchivo] = useState([]);
    const [filesEditando, setFilesEditando] = useState([]);
    const [observacionAutocompletar, setobservacionAutocompletar] = useState([]);
    const [recomendacionAutocompletar, setrecomendacionAutocompletar] = useState([]);


    const setFecha = (date, event, index) => {
        let fechas = [...startDate];
        fechas[index] = date;
        setStartDate(fechas);
    };

    useImperativeHandle(ref, () => ({
        guardarDesdeParent() {
            props.guardar(startDate, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, props.componentes);
        },
    }));

    const limpiarFormularioDesdeParent = () => {
        setObservaciones(Array(props.componentes.length).fill(""));
        setRecomendaciones(Array(props.componentes.length).fill(""));
        setSelectedFallas(Array(props.componentes.length).fill(""));
        setEstadoSeleccionadoNombre(Array(props.componentes.length).fill(""));
        setEstadoSeleccionadoId(Array(props.componentes.length).fill(""));
        setEstadoSeleccionadoColor(Array(props.componentes.length).fill(""));
        setStartDate(Array(props.componentes.length).fill(null));
        props.setEquipoControlado(prevState => !prevState);

    }

    useEffect(() => {
        if (!props.observaciones) {
            props.fetchListarObservaciones();
        }
    }, [props.fetchListarObservaciones, props.observaciones])


    useEffect(() => {
        if (!props.recomendaciones) {
            props.fetchListarRecomendaciones();
        }
    }, [props.fetchListarRecomendaciones, props.recomendaciones])

    useEffect(() => {
        if (props.componentes && props.componentes.length > 0) {
            let fechaIncio = [];
            let estadosSeleccionadosNombreAr = [];
            let estadosSeleccionadosId = [];
            let estadosSeleccionadosColor = [];
            let fallasSelecionadasAmostrar = [];
            let fallasSeleccionadasAmostrarIds = [];
            let observacionesAMostrar = [];
            let recomendacionesAMostrar = [];
            let archivosAMostrar = [];
            setobservacionAutocompletar(Array.from({ length: props.componentes.length }, () => ''))
            setrecomendacionAutocompletar(Array.from({ length: props.componentes.length }, () => ''))

            const fullfillDataComponente = (elem) => {
                let fallasDentroDelComponente = [];
                let fallasIdDentrodelComponente = [];

                if (props.fechaGlobal) {
                    fechaIncio.push(moment(props.fechaGlobal))
                } else {
                    if (elem[0].fecha === "0000-00-00 00:00:00") {
                        fechaIncio.push(moment("2000-01-01 00:00:00"));
                    } else if (elem[0].fecha === "") {
                        fechaIncio.push(moment(props.fechaGlobal));
                    } else {
                        fechaIncio.push(moment(elem[0].fecha));
                    }
                }

                props.estados.forEach(estado => {
                    if (estado.nombre === elem[0].estado) {
                        estadosSeleccionadosNombreAr.push(estado.nombre);
                        estadosSeleccionadosId.push(estado.id);
                        estadosSeleccionadosColor.push(estado.color);
                    }
                })
                props.fallas.forEach((falla) => {
                    elem[0].fallas && elem[0].fallas.forEach((fallaControl) => {
                        if (falla.id === fallaControl.falla) {
                            let fallita = { color: falla.color, value: falla.id, label: <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' + falla.color + '"></div>' + falla.nombre + '</div>' }} /> }
                            fallasDentroDelComponente.push(fallita)
                            fallasIdDentrodelComponente.push(falla.id);
                        }
                    })
                })
                observacionesAMostrar.push(elem[0].observaciones);
                recomendacionesAMostrar.push(elem[0].recomendaciones);
                fallasSelecionadasAmostrar.push(fallasDentroDelComponente);
                fallasSeleccionadasAmostrarIds.push(fallasIdDentrodelComponente);
                archivosAMostrar.push(elem[0].imagenes);

            }

            props.componentes.forEach((componente, index) => {

                if (componente.tests.length > 0) {
                    fullfillDataComponente(componente.tests)

                } else if (componente.test_anterior) {
                    fullfillDataComponente(componente.test_anterior)
                } else {
                    fechaIncio.push(moment(props.fechaGlobal));
                    estadosSeleccionadosNombreAr.push('');
                    estadosSeleccionadosId.push('');
                    estadosSeleccionadosColor.push('');
                    fallasSelecionadasAmostrar.push('');
                    fallasSeleccionadasAmostrarIds.push('');
                    observacionesAMostrar.push('');
                    recomendacionesAMostrar.push('');
                }
            })

            setStartDate(fechaIncio);

            setDropdownOpen(Array(props.componentes.length).fill(false));
            setEstadoSeleccionadoNombre(estadosSeleccionadosNombreAr);
            setEstadoSeleccionadoId(estadosSeleccionadosId);
            setEstadoSeleccionadoColor(estadosSeleccionadosColor);
            setSelectedFallas(fallasSelecionadasAmostrar);
            setSelectedFallasIds(fallasSeleccionadasAmostrarIds);
            setObservaciones(observacionesAMostrar);
            setRecomendaciones(recomendacionesAMostrar);
            setArchivo(Array(props.componentes.length).fill([]));
            setFilesEditando(archivosAMostrar);
        }

    }, [props.componentes, props.estados, props.fallas])

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

    const handleChangeMulti = (el, index) => {
        if (!props.equipoControlado) {
            let fallasIds = [];
            el.forEach(falla => {
                fallasIds.push(falla.value)
            })
            let lasfallasIds = selectedFallasIds;
            lasfallasIds[index] = fallasIds;
            setSelectedFallasIds(lasfallasIds);

            let fallasSelecionadas = [...selectedFallas];
            fallasSelecionadas[index] = el;
            setSelectedFallas(fallasSelecionadas);
        }
    };

    const toggles = (index) => {
        if (!props.equipoControlado) {
            let dropdowns = [...dropdownOpen];
            dropdowns[index] = !dropdownOpen[index];
            setDropdownOpen(dropdowns);
        }
    }

    const seleccionarEstado = (estado, index) => {
        let estados = [...estadoSeleccionadoNombre];
        let estadosIds = [...estadoSeleccionadoId];
        let estadosColor = [...estadoSeleccionadoColor]
        estados[index] = estado.nombre;
        estadosIds[index] = estado.id;
        estadosColor[index] = estado.color;

        setEstadoSeleccionadoNombre(estados);
        setEstadoSeleccionadoId(estadosIds);
        setEstadoSeleccionadoColor(estadosColor);
    }

    const cargarObservacion = (observacion, index) => {
        let lasobservaciones = [...observaciones];
        lasobservaciones[index] = observacion;
        setObservaciones(lasobservaciones);
    }

    const cargarRecomendaciones = (recomendacion, index) => {
        let lasrecomendaciones = [...recomendaciones];
        lasrecomendaciones[index] = recomendacion;
        setRecomendaciones(lasrecomendaciones);
    }

    const cargarArchivos = (laimg, index) => {
        let losarchivos = archivo;
        if (losarchivos[index].length > 0) {
            losarchivos[index].push(laimg);
        } else {
            losarchivos[index] = new Array(laimg);
        }

        setArchivo(losarchivos);
    }

    const removerArchivo = (file, index) => {
        let losarchivos = archivo;
        losarchivos[index].forEach((archivo, indice) => {
            if (archivo.name === file.name) {
                losarchivos[index].splice(indice, 1);
            }
        })
        setArchivo(losarchivos);
        setTimeout(function () {
            console.log(archivo);
        }, 3000)
    }

    const dropzoneComponentConfig = {
        postUrl: 'no-url'
    };

    const handleChangeStatus = ({ meta }, status) => {
        console.log(status, meta)
    }

    const anteriorEquipo = () => {
        let error = chequearCompletados();
        if (error) {
            return;
        }
        let yPos = document.querySelector("#carga-masiva").getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: yPos, left: 0, behavior: 'smooth' });
        setTimeout(() => {
            props.guardar(startDate, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, props.componentes);
            props.seleccionarAnteriorSiguienteEquipo('anterior');
        }, 500)
    }

    const siguienteEquipo = () => {
        let error = chequearCompletados();
        if (error) {
            return;
        }
        let yPos = document.querySelector("#carga-masiva").getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: yPos, left: 0, behavior: 'smooth' });
        setTimeout(() => {
            props.guardar(startDate, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, props.componentes);
            props.seleccionarAnteriorSiguienteEquipo();
        }, 500)

    }

    const chequearCompletados = () => {
        let errorDevuelto = null;
        props.componentes.forEach((component, index) => {
            if (estadoSeleccionadoId[index] == "" && (selectedFallas[index] != "" || selectedFallas[index].length > 0 || observaciones[index] != "" || recomendaciones[index] || document.querySelector(".dz-image-preview") != null)) {
                errorDevuelto = true;
            }

        })
        if (errorDevuelto) {
            NotificationManager.error("Es necesario cargar los estados para que la carga sea efectiva", "Error");
        }
        return errorDevuelto;
    }

    const eliminarImagen = (idImagenCargaMasiva, indice) => {
        let losarchivos = [...filesEditando];

        eliminarImagenDeCargaMasiva(idImagenCargaMasiva).then(res => {
            if (res.stat == '1') {
                NotificationManager.success('Imagen eliminada correctamente', "Hecho", 3000, null, null, '');
                losarchivos[indice].forEach((archivo, indice) => {
                    if (archivo.id === idImagenCargaMasiva) {
                        losarchivos[indice].splice(indice, 1);
                    }
                })

                setFilesEditando(losarchivos);
            } else {
                NotificationManager.error('Error al eliminar imagen', "Error", 3000, null, null, '');
            }

        })
    }

    const limpiarFormulario = (index) => {

        cargarObservacion("", index);
        cargarRecomendaciones("", index);
        cargarArchivos([], index);
        seleccionarEstado({ id: "", nombre: "" }, index);
        handleChangeMulti([], index);

        setTimeout(() => {
            props.guardar(startDate, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, props.componentes);
        }, 2000)

    }

    useEffect(() => {
        if (props.avisarFinalizar === true) {
            props.guardar(startDate, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, props.componentes);
        }

    }, [props.avisarFinalizar])

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

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            padding: '10px',
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
        })
    };

    const cargarObservacionDeSelect = (index, valor) => {
        setobservacionAutocompletar(prevState => {
            const nuevoArray = [...prevState];
            nuevoArray[index] = valor;
            return nuevoArray;
        });
    };

    const cargarRecomendacionesDeSelect = (index, valor) => {
        setrecomendacionAutocompletar(prevState => {
            const nuevoArray = [...prevState];
            nuevoArray[index] = valor;
            return nuevoArray;
        });
    };

    return (
        <Fragment ref={ref}>
            <div className='position-relative'>
                <Label check className={props.equipoControlado ? 'equipo-controlado' : 'equipo-no-controlado'}>
                    EQUIPO NO CONTROLADO:
                    <div className="d-inline ml-2" onClick={limpiarFormularioDesdeParent}>
                        {props.equipoControlado && <FontAwesomeIcon icon={faSquareCheck} />}
                        {!props.equipoControlado && <FontAwesomeIcon icon={faSquare} />}
                    </div>
                </Label>
                <Button color="info" className={props.equipoControlado ? "ml-2 siguiente-equipo-controlado" : "ml-2 siguiente-equipo"} onClick={() => { props.siguienteEquipoFormulario(siguienteEquipo) }} disabled={props.desahabilitarSiguiente}>
                    SIGUIENTE EQUIPO <span className='ml-2'>&gt;</span>
                </Button>
            </div>
            {props.componentes && props.componentes.length > 0 && props.componentes.map((componente, index) => {
                return (<Fragment key={index}>
                    <Tarjeta titulo="">

                        <div className={props.equipoControlado ? "tarjeta-disabled" : ""}>
                            <Row className="mt-2">
                                <Col>
                                    <h5 className='border p-2 bg-black borde-gris mb-4'>COMPONENTE: <strong>{componente.nombre}</strong></h5>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <h6 className='mt-3'>CONTROL: </h6>
                                </Col>
                                <Col className="text-right">
                                    {(function () {
                                        if (estadoSeleccionadoId[index] || (selectedFallas[index] && selectedFallas[index].length > 0) || observaciones[index] || recomendaciones[index] || document.querySelector(".dz-image-preview") != null) {
                                            return <Button color="link" className="pr-1" onClick={() => { limpiarFormulario(index) }}> Limpiar Formulario</Button>
                                        }
                                    })()}
                                </Col>
                            </Row>
                            <Row className="formulario-carga-controles">
                                <Col>
                                    <div className='form-inline fecha-estado-falla'>
                                        <InputGroup style={{ "flex": "0 0 auto" }}>
                                            <InputGroupAddon addonType="prepend">
                                                FECHA:
                                            </InputGroupAddon>
                                            <DatePicker selected={startDate[index]} onChange={(evt, date) => setFecha(evt, date, index)} disabled={props.equipoControlado} popperPlacement="bottom-end" />
                                        </InputGroup>
                                        <InputGroup className="estados-wrapper" id={"estados-wrap-" + index}>
                                            <InputGroupAddon addonType="prepend" className="x-trapad">
                                                ESTADO:
                                            </InputGroupAddon>
                                            <Dropdown isOpen={dropdownOpen[index]} toggle={() => { toggles(index) }} className="rich-dropdown  borde-gris">
                                                <DropdownToggle
                                                    tag="div"
                                                    onClick={() => { toggles(index) }}
                                                    data-toggle="dropdown"
                                                    className="pl-2"
                                                >
                                                    {estadoSeleccionadoNombre[index] != '' ? <div className='d-flex' dangerouslySetInnerHTML={{ __html: '<span class="estado-seleccionado-color" style="background:' + estadoSeleccionadoColor[index] + '"></span>' + estadoSeleccionadoNombre[index] }} /> : "Seleccione un Estado"}
                                                </DropdownToggle>
                                                <DropdownMenu>

                                                    {props.estados && props.estados.map((estado) => {
                                                        return (<div className='color-wrapper' onClick={() => { seleccionarEstado(estado, index); toggles(index); }} key={estado.id}>
                                                            <span style={{ "background": estado.color }}></span><div className='ml-5'>{estado.nombre}</div>
                                                        </div>)
                                                    })}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </InputGroup>
                                        <InputGroup >
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
                                                onChange={(el) => { handleChangeMulti(el, index) }}
                                                options={opcionesFallas}
                                                isDisabled={props.equipoControlado}
                                            /></InputGroup>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {props.observaciones && <Input type="select" name="observacion_autocompletar" className='mt-4' onChange={(evt) => { cargarObservacion(evt.target.value, index); cargarObservacionDeSelect(index, evt.target.value) }} value={observacionAutocompletar[index]}>
                                        <option>-- Observaciones Guardadas: -- </option>
                                        {props.observaciones && props.observaciones.map((observacion) => {
                                            return (<option key={observacion.id} value={observacion.texto}>{observacion.nombre_corto}</option>)
                                        })}
                                    </Input>}
                                    <InputGroup className="mt-4 borde-gris mb-4">
                                        <div className='legend'>OBSERVACIONES: {props.equipoControlado}</div>
                                        <Input className='no-border mt-2' type="textarea" id="observaciones" value={observaciones[index]} onChange={e => cargarObservacion(e.target.value, index)} disabled={props.equipoControlado} />
                                    </InputGroup>

                                    {props.recomendaciones && <Input type="select" name="recomendaciones_autocompletar" className='mt-4' onChange={(evt) => { cargarRecomendaciones(evt.target.value, index); cargarRecomendacionesDeSelect(index, evt.target.value) }} value={recomendacionAutocompletar[index]}>
                                        <option>-- Recomendaciones Guardadadas: -- </option>
                                        {props.recomendaciones && props.recomendaciones.map((recomendacion) => {
                                            return (<option key={recomendacion.id} value={recomendacion.texto}>{recomendacion.nombre_corto}</option>)
                                        })}
                                    </Input>}
                                    <InputGroup className='mt-4 borde-gris'>
                                        <div className='legend'>RECOMENDACIONES:</div>
                                        <Input className='no-border mt-2' type="textarea" id="observaciones" value={recomendaciones[index]} onChange={e => cargarRecomendaciones(e.target.value, index)} disabled={props.equipoControlado} />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="container">
                                    {filesEditando && filesEditando[index] && filesEditando[index].length > 0 && <Row className="mt-2">
                                        <div className='col-md-12'><h4>Imágenes adjuntas</h4></div>
                                        <div className="row">                                            
                                            {filesEditando[index].map((archivo) => {
                                                return <Fragment key={archivo.id}>
                                                    <div className='col-xs-12 col-md-3 position-relative mb-4'>
                                                        <div style={{ "background": "#6A6A6A" }} className="text-center">
                                                            <img src={archivo.filename} alt={archivo.id} className="img-fluid" width={450} height={450}/>
                                                            <Button className="position-absolute remove-image" color="danger" onClick={() => { eliminarImagen(archivo.id, index) }}>
                                                                <i className='simple-icon-trash' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Fragment>;
                                            })}
                                        </div>
                                    </Row>}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                {archivo.length > 0 && <div className="col-md-12">
                                    <DropzoneComponent
                                        className="borde-gris"
                                        config={dropzoneComponentConfig}
                                        onChangeStatus={handleChangeStatus}
                                        djsConfig={dropzoneConfig}
                                        eventHandlers={{
                                            init:  (esto) =>{                                                 
                                                esto.on("maxfilesexceeded", (file) => {
                                                    esto.removeFile(file);
                                                    NotificationManager.error("Sólo puede subir un archivo", "Error", 3000, null, null, '')
                                                });
                                            },
                                            addedfile: (file) => {                                                
                                                /*const files = archivo[index];
                                                files.push(file);*/
                                                cargarArchivos(file, index);
                                            },
                                            removedfile: (file) => {
                                                removerArchivo(file, index);
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
                                    {props.equipoControlado && <div className="disabled-drag-component"></div>}
                                </div>}
                            </Row>
                            <Row>
                                <Col><hr /></Col>
                            </Row></div></Tarjeta> <Row className="mt-3 mb-3"></Row>
                </Fragment>)
            })}
            <Row>
                <Col className='d-flex justify-content-center'>
                    <Button color="success" onClick={anteriorEquipo} disabled={props.desahabilitarAnterior}>
                        <span className='mr-2'>&lt;</span> EQUIPO ANTERIOR
                    </Button>
                    <Button color="info" className="ml-2" onClick={siguienteEquipo} disabled={props.desahabilitarSiguiente}>
                        SIGUIENTE EQUIPO <span className='ml-2'>&gt;</span>
                    </Button>
                </Col>
            </Row>
        </Fragment>
    );
});

const mapStateToProps = (state) => {
    return {
        componentes: state.cargasMasivasReducer.detalleDeComponentesYControles.componentes,
        estados: state.estadosReducer.estados,
        fallas: state.fallasReducer.fallas,
        observaciones: state.autocompletarReducer.observaciones,
        recomendaciones: state.autocompletarReducer.recomendaciones,
        fechaGlobal: state.cargasMasivasReducer.fechaGlobal
    }
}
export default connect(
    mapStateToProps, { fetchListarObservaciones, fetchListarRecomendaciones }
)(FormularioCargaControles);