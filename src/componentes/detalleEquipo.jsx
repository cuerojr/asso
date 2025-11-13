import React, { useState, Fragment, useEffect } from 'react';
import { Row, Input, Button, InputGroupAddon, InputGroup, Modal, ModalBody, ModalFooter, Col} from "reactstrap";
import { connect } from 'react-redux';
import { fetchlistarcomponentes } from '../reducers/componentes-reducer';
import { ItemListaComponente } from './itemListaComponente';
import NuevoComponente from './nuevoComponente';
import DetalleComponente from './detalleComponente';
import { altaComponente, actualizarComponente, eliminarComponente } from '../lib/componentes-api';
import { recargarEstadosEquipo } from '../lib/equipos-api';
import { NotificationManager } from "../components/common/react-notifications";
import { fetchlistarSecciones } from '../reducers/secciones-reducer';
import { fetchlistarRutas } from '../reducers/rutas-reducer';
import {guardarEquipoNoControladoIndividual } from '../lib/controles-api';
import moment from "moment";
import {fetchModalCargaControles} from '../reducers/controles-reducer';
import CargarVariosControles from './cargarVariosControles';

const DetalleEquipo = (props) => {

    const [nombre, setNombre] = useState(props.equipo.nombre);
    const [observacion, setObservacion] = useState(props.equipo.descripcion);
    const [ModalNuevoComponente, setModalNuevoComponente] = useState(false);
    const [detalleComponente, setDetalleComponente] = useState(null);
    const [mostrarModalConfirmarEliminarEquipo, setMostrarModalConfirmarEliminarEquipo] = useState(false);
    const [seccion, setSeccion] = useState('');
    const [ruta, setRuta] = useState(props.equipo.ruta);

    const [estado1Control, setEstado1Control] = useState(props.equipo.estados["1"].control);
    const [estado1Estado, setEstado1Estado] = useState(props.equipo.estados["1"].estado);
    const [estado1Color, setEstado1Color] = useState(props.equipo.estados["1"].color);

    const [estado2Control, setEstado2Control] = useState(props.equipo.estados["2"].control);
    const [estado2Estado, setEstado2Estado] = useState(props.equipo.estados["2"].estado);
    const [estado2Color, setEstado2Color] = useState(props.equipo.estados["2"].color);

    const [noControlado, setNoControlado] = useState(false);
    const [datosNoControlados, setDatosNoControlados] = useState({});
    const [fecha, setFecha] = useState(moment());

    useEffect(() => {
        props.fetchlistarcomponentes(props.idEmpresa, props.equipo.id);
        props.fetchlistarSecciones(props.idEmpresa);
        props.fetchlistarRutas(props.idEmpresa)


    }, [])

    useEffect(() => {
        if(props.secciones){
            props.secciones.forEach(seccion => {
                if(seccion.nombre == props.equipo.seccion){
                    setSeccion(seccion.id);
                }
            })
        }
    }, [props.secciones])

    useEffect(() => {
        if(props.rutas){
            props.rutas.forEach(ruta => {
                if(ruta.nombre == props.equipo.ruta){
                    setRuta(ruta.id);
                }
            })
        }
    }, [props.rutas])

    const volverEquipos = () => {
        props.salirDetalleEquipo()
    }

    const actualizarSeccion = () => {
        props.updateEquipo(props.equipo.id, nombre, observacion, seccion, ruta);
    }

    const eliminarSeccion = () => {
        props.borrarEquipo(props.equipo.id);
    }

    const mostrarDetalleComponente = (componente) => {
        setDetalleComponente(componente);
    }

    const salirDetalleComponente = () => {
        setDetalleComponente(null);
        recargarEstadosEquipo(props.equipo.id).then((res)=>{
            setEstado1Control(res[0].estados["1"].control)
            setEstado1Estado(res[0].estados["1"].estado)
            setEstado1Color(res[0].estados["1"].color)

            setEstado2Control(res[0].estados["2"].control)
            setEstado2Estado(res[0].estados["2"].estado)
            setEstado2Color(res[0].estados["2"].color)
        })
    }

    const updateComponente = (idComponente, nombre, observacion ,bajaRPM) => {
        actualizarComponente(props.equipo.id, idComponente, nombre, observacion, bajaRPM).then((res) => {
            if (res.stat == 1) {
                props.fetchlistarcomponentes(props.idEmpresa, props.equipo.id);
                //setDetalleComponente(null);
                NotificationManager.success("El componente ha sido Actualizado", "Hecho", 3000, null, null, '')
            } else if (res.stat == 0) {
                NotificationManager.error(res.err, "Error");
            }
        })
    }

    const deleteComponente = (idComponente) => {
        eliminarComponente(idComponente).then((res) => {
            if (res.stat == 1) {
                props.fetchlistarcomponentes(props.idEmpresa, props.equipo.id);
                setDetalleComponente(null);
                NotificationManager.success("El componente ha sido Eliminado", "Hecho", 3000, null, null, '')
            } else if (res.stat == 0) {
                NotificationManager.error(res.err, "Error");
            }
        })
    }

    const cargarComponente = (nombre, observacion, bajaRPM) => {
        altaComponente(props.equipo.id, nombre, observacion, bajaRPM).then((res) => {
            if (res.stat == 1) {
                props.fetchlistarcomponentes(props.idEmpresa, props.equipo.id);
                setModalNuevoComponente(false);
                NotificationManager.success("El componente ha sido Creado", "Hecho", 3000, null, null, '')
            } else if (res.stat == 0) {
                NotificationManager.error(res.err, "Error");
            }
        })
    }

    const guardarDatosNoControlados = (key, value) => {
        setDatosNoControlados(prevDatos => ({
          ...prevDatos,
          [key]: value,
        }));
      };

      const guardarEquipoNoControlado = () => {
        const motivos = datosNoControlados.motivos || '';
        const observacion = datosNoControlados.observacion || '';

        guardarEquipoNoControladoIndividual(
            props.equipo.id,
            motivos,
            observacion,
            moment(fecha).format('YYYY-MM-DD'),
            props.idEmpresa
        ).then((res)=>{
            if(res.stat === 1){
                NotificationManager.success("El control ha sido actualizado como equipo no Controlado", "Hecho", 3000, null, null, '')
            }
        })
    };

    const handleChangeEmbedded = (date) => {
        setFecha(date)
        console.log(date.format('YYYY-MM-DD'));
    }

    return (
        <Fragment>
            <CargarVariosControles equipo={props.equipo} />
            {!detalleComponente && (<Fragment>
                <Modal isOpen={mostrarModalConfirmarEliminarEquipo} size="md">
                    <ModalBody>
                        <Row>
                            <Col xs="2"><i className='glyph-icon iconsminds-danger' style={{"fontSize":"2rem"}}/></Col>
                            <Col xs="10">ATENCIÓN: Al borrar un equipo, también borrarás todos los componentes y controles asociados.</Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <span className='mr-2'>¿Estás seguro?</span>
                        <Button color="danger" onClick={eliminarSeccion}>
                            Si, eliminar
                        </Button>
                        <Button className="neutro" onClick={() => { setMostrarModalConfirmarEliminarEquipo(false) }}>
                            No, cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
                <Row>
                    <div className="col-md-12">
                        <Button color="link" className="pl-0" onClick={volverEquipos}>&lt; Equipos</Button>
                    </div>
                    <div className="col-md-12 d-flex pl-0">
                        <div className="col">
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <span className="input-group-text"> <i className="simple-icon-grid" style={{ "fontSize": "2em" }} /></span>
                                </InputGroupAddon>
                                <Input value={nombre} className="form-title" onChange={e => setNombre(e.target.value)} />
                            </InputGroup>
                        </div>
                        {!noControlado && <div style={{ "flex": "0 0 170px" }}>
                            <Button color="success" size="sm" onClick={actualizarSeccion}>GUARDAR CAMBIOS</Button>
                        </div>}
                        {noControlado && <Fragment>
                            <div style={{ "flex": "0 0 170px" }}>
                            <Button color="success" size="sm" onClick={guardarEquipoNoControlado}>GUARDAR CAMBIOS</Button>
                        </div>
                    </Fragment>}
                    </div>

                    <div className="col-md-6 mb-3">
                        Sección:
                        <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setSeccion(e.target.value) }} value={seccion}>
                            <option>-- Seleccione una sección -- </option>
                            {props.secciones && props.secciones.map((seccion) => {
                                return (<option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>)
                            })}
                        </Input>
                    </div>
                    <div className="col-md-6 mb-3">
                        Ruta:
                        <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setRuta(e.target.value) }} value={ruta}>
                            <option>-- Seleccione una Ruta -- </option>
                            {props.rutas && props.rutas.map((ruta) => {
                                return (<option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>)
                            })}
                        </Input>
                    </div>
                    <Col xs='12'>
                        <Input type="textarea" value={observacion} onChange={e => setObservacion(e.target.value)} />
                    </Col>
                </Row>
                {/*<Row>
                    <Col xs='12' className='pl-4 ml-2'>
                        <div style={{marginTop:'10px'}} ><Input type="checkbox" checked={noControlado} onChange={(evt)=>{setNoControlado(evt.target.checked)}} /> <Label>EQUIPO NO CONTROLADO</Label></div>
                    </Col>
                </Row>*/}
                {/*noControlado &&<Row>
                    <Col xs={6}><EditarCargarControlEquipoNoControlado idEmpresa={props.idEmpresa} guardarDatosNoControlados={guardarDatosNoControlados} /></Col>
                    <Col xs={6}>
                        <h3>Fecha del Control</h3>
                        <div className="col-md-12 mb-3">
                            <DatePicker
                                locale={'es'}
                                calendarClassName="embedded"
                                inline
                                selected={fecha}
                                onChange={handleChangeEmbedded} />
                        </div>
                    </Col>
                </Row>*/}
                {!noControlado && <Row>
                    <div className="col-md-6 mt-2">
                        <h5 className='mt-4 mb-3'>ESTADO DEL EQUIPO: </h5>

                        <p className="mb-0">{estado1Control}:
                           {estado1Estado  ?
                            (<span className='estados-tag pl-2 pr-2 ml-2' style={{ 'background': estado1Color }}>{estado1Estado}</span>) :
                            (" ---")}
                        </p>
                        <p className="mb-0">{props.equipo.estados["2"].control}:
                        {estado2Estado  ?
                            (<span className='estados-tag pl-2 pr-2 ml-2' style={{ 'background': estado2Color }}>{estado2Estado}</span>) :
                            (" ---")}
                        </p>
                    <Button onClick={()=>{props.fetchModalCargaControles(true)}}>CARGAR NUEVO CONTROL</Button>
                    </div>
                    <div className="col-md-6 text-right mt-2">
                        <Button color="danger" size="sm" onClick={() => { setMostrarModalConfirmarEliminarEquipo(true) }}> <i className="simple-icon-trash" /> ELIMINAR EQUIPO</Button>
                    </div>
                </Row>}
                {!noControlado && <Row className="mt-4">
                    <div className="col-md-12">
                        <h1>COMPONENTES DEL EQUIPO:</h1>
                        <div className="text-zero top-right-button-container">
                            <Button
                                color="primary"
                                size="lg"
                                className="top-right-button"
                                onClick={() => { setModalNuevoComponente(true) }}
                            > <i className="simple-icon-puzzle" /> NUEVO COMPONENTE
                            </Button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="separator mb-5"></div>
                    </div>
                    <div className="col-md-12">
                        {props.componentes && props.componentes.map((item, index) => (
                            <ItemListaComponente
                                item={item}
                                key={index}
                                mostrarDetalleComponente={mostrarDetalleComponente}
                            />
                        ))}

                        {props.componentes.length == 0 && <p> No hay componentes cargados</p>}
                    </div>
                    <NuevoComponente mostrarModal={ModalNuevoComponente} idEmpresa={props.idEmpresa} nombreEmpresa={props.nombreEmpresa} nombreEquipo={nombre} manejarModal={setModalNuevoComponente} cargarComponente={cargarComponente} />
                </Row>}
            </Fragment>)}
            {detalleComponente && (
                <DetalleComponente idEmpresa={props.idEmpresa} nombreEmpresa={props.nombreEmpresa} nombreEquipo={nombre} componente={detalleComponente} equipo={props.equipo}
                    volverEquipos={volverEquipos} salirDetalleComponente={salirDetalleComponente} updateComponente={updateComponente} deleteComponente={deleteComponente} />
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        componentes: state.componentesReducer.componentes,
        secciones: state.seccionesReducer.secciones,
        rutas: state.rutasReducer.rutas,
    }
}
export default connect(mapStateToProps, { fetchlistarcomponentes, fetchlistarSecciones, fetchlistarRutas, fetchModalCargaControles })(DetalleEquipo);


