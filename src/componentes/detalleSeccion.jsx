import React, { Fragment, useState, useEffect } from 'react';
import { Row, Input, Nav, NavItem, TabContent, TabPane, Button, Modal, ModalBody, ModalFooter, InputGroupAddon, InputGroup,} from "reactstrap";
/*import { fetchListarServiciosPorSeccion } from '../reducers/servicios-reducer';
import { fetchlistarInformesEmpresaSeccionServicio, fetchgetDetalleInforme, fetchDeleteInforme } from '../reducers/informes-reducer';*/
import { fetchdeleteSeccion, fetchUpdateSeccion } from '../reducers/secciones-reducer';
/*import { ItemListaInforme } from "../componentes/itemListaInforme";*/
import { NotificationManager } from "../components/common/react-notifications";
/*import DetalleInforme from "../contenedores/informes/detalleInforme";
import { NavLink } from "react-router-dom";*/
import { connect } from 'react-redux';
/*import classnames from "classnames";*/
import NuevoEquipo from './nuevoEquipo';
import { altaEquipo } from '../lib/equipos-api';


const DetalleSeccion = ({ seccion, abrirModal, fetchdeleteSeccion, salirSeleccion, recargarSecciones, fetchUpdateSeccion, volverSecciones, nombreEmpresa }) => {
    const [nombre, setNombre] = useState(seccion.nombre);
    const [observacion, setObservacion] = useState(seccion.observacion);
    /*const [currentTab, setCurrentTab] = useState(0);*/
    const [mostrarDetalle, setMostrarDetalle] = useState(0);
    const [mostrarModalCantidadInformes, setMostrarModalCantidadInformes] = useState(false);
    const [mostrarModalConfirmarBorradoSeccion, setMostrarModalConfirmarBorradoSeccion] = useState(false);
    const [modalNuevoEquipo, setModalNuevoEquipo] = useState(false);
    const [estado, setEstado] = useState(Number(seccion.estado));
    /*useEffect(() => {
        fetchListarServiciosPorSeccion(seccion.id).then((res) => {
            if (res.payload) {
                setCurrentTab(res.payload[0].id)
                //fetchlistarInformesEmpresaSeccionServicio(seccion.id_empresa, seccion.id, res.payload[0].id)
            }
        })
    }, []);

    const seleccionTab = (e, servicioId) => {
        e.preventDefault();
        setCurrentTab(servicioId);
        fetchlistarInformesEmpresaSeccionServicio(seccion.id_empresa, seccion.id, servicioId)
    };*/

    const eliminarSeccion = () => {
        if (seccion.informes != 0) {
            setMostrarModalCantidadInformes(true);
        } else {
            setMostrarModalConfirmarBorradoSeccion(true)
        }
    }

    const confirmaEliminarSeccion = () => {
        fetchdeleteSeccion(seccion.id).then(() => {
            NotificationManager.success("La sección ha sido eliminada", "Hecho", 3000, null, null, '')
            salirSeleccion()
            recargarSecciones(seccion.id_empresa)
        })
    }

    const actualizarSeccion = () => {
        fetchUpdateSeccion(seccion.id, seccion.id_empresa, nombre, observacion, estado).then(() => {
            NotificationManager.success("La sección ha sido actualizada", "Hecho", 3000, null, null, '')
            salirSeleccion()
            recargarSecciones(seccion.id_empresa)
        })
    }

    const cargarEquipo = (nombre, seccion, ruta) => {
        altaEquipo(seccion.id_empresa, nombre, seccion, ruta).then((res) => {
            if (res.stat == 1) {
                NotificationManager.success("El equipo ha sido Cargado", "Hecho", 3000, null, null, '')
                setModalNuevoEquipo(false);
            }
        })
    }

    const cambiarEstado = () => {
        if (estado == 1) {
            setEstado(0)
        } else {
            setEstado(1)
        }
    }

    /*const verDetalleInforme = (e, idEmpresa, idInforme) => {
        e.preventDefault();
        fetchgetDetalleInforme(idEmpresa, idInforme).then(() => {
            setMostrarDetalle(1);
        });
    }
    const deleteInforme = (id) => {
        fetchDeleteInforme(id).then(() => {
            NotificationManager.success("El Informe ha sido eliminado", "Hecho", 3000, null, null, '');
            fetchlistarInformesEmpresaSeccionServicio(seccion.id_empresa, seccion.id, currentTab)
        })
    }*/

    return (
        <Fragment>
            {/* modal cuando tiene informes cargados */}
            <Modal isOpen={mostrarModalCantidadInformes} size="md">
                <ModalBody>
                    Esta sección tiene informes cargados, primero debe quitarlos de esta sección para poder eliminarla
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" className="btn btn-danger btn-sm btn-outline-danger" onClick={() => { setMostrarModalCantidadInformes(false) }}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
            {/* confirmación antes de borrar */}
            <Modal isOpen={mostrarModalConfirmarBorradoSeccion} size="md">
                <ModalBody>
                    Vas a eliminar esta sección. ¿Estás seguro?
                </ModalBody>
                <ModalFooter>
                    <Button className="neutro" onClick={() => { setMostrarModalConfirmarBorradoSeccion(false) }}>
                        Cancelar
                    </Button>
                    <Button color="danger" onClick={confirmaEliminarSeccion}>
                        Borrar
                    </Button>
                </ModalFooter>
            </Modal>
            {<Row>
                <div className="col-md-12">
                    <Button color="link" className="pl-0" onClick={volverSecciones}>&lt; Secciones</Button>
                </div>
                <div className="col-md-12 mb-2 d-flex pl-0">
                    <div className="col">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text"> <i className="simple-icon-folder-alt" style={{ "fontSize": "2em" }} /></span>
                            </InputGroupAddon>
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div style={{ "flex": "0 0 170px" }}>
                        <Button color="success" size="sm" onClick={actualizarSeccion}>GUARDAR CAMBIOS</Button>
                    </div>
                </div>
                <div className="col-md-12">
                    <Input type="textarea" value={observacion} onChange={e => setObservacion(e.target.value)} />
                </div>
                <div className="col-md-12 d-flex justify-content-between mt-3">
                    <div className="custom-control custom-switch hab-seccion">
                        <input type="checkbox" className="custom-control-input" defaultChecked={estado} id="customSwitch1" onClick={cambiarEstado} />
                        <label className="custom-control-label" htmlFor="customSwitch1">{estado ? ("Sección habilitada") : ("Sección deshabilitada")}</label>
                    </div>
                    <div>
                        <Button color="danger" size="sm" className="ml-2" onClick={eliminarSeccion}> <i className="simple-icon-trash"></i>ELIMINAR SECCIÓN</Button>
                    </div>
                </div>
            </Row>}
            {/*mostrarDetalle == 0 && <Row>
                <div className="col-md-12">
                    <Nav tabs className="card-header-tabs ">
                        {serviciosPorSeccion && serviciosPorSeccion.map((servicio) => {
                            return (
                                <NavItem key={servicio.id}>
                                    <NavLink
                                        className={classnames({
                                            active: currentTab === servicio.id,
                                            "nav-link": true
                                        })}
                                        onClick={(e) => { seleccionTab(e, servicio.id) }} to="#" location={{}} >
                                        {servicio.servicio}
                                    </NavLink>
                                </NavItem>
                            )
                        })}
                    </Nav>
                </div>
                    </Row>*/}
            <Row>
                {/*mostrarDetalle == 0 && <div className="col-md-12">
                    <Button color="primary" size="sm" onClick={() => { abrirModal(seccion.id_empresa, seccion.id) }} className="float-right">Cargar informe</Button>
                </div>*/}
                {/*mostrarDetalle == 1 && <div className="col-md-12">
                    <Button color="warning" outline onClick={() => {setMostrarDetalle(0)}}>Volver</Button>
            </div>*/}

                {/*<TabContent activeTab={currentTab} className="mt-4 col-md-12 pl-0 pr-0">
                    {serviciosPorSeccion && serviciosPorSeccion.map((servicio) => {
                        return (
                            <TabPane tabId={servicio.id} key={servicio.id}>
                                {mostrarDetalle === 0 &&
                                    informesEmpresaSeccionServicio && informesEmpresaSeccionServicio.length > 0 && informesEmpresaSeccionServicio.map((informe) => {
                                        return (<ItemListaInforme key={informe.id} item={informe} history={history} verDetalleInforme={verDetalleInforme} deleteInforme={deleteInforme} />)
                                    })}
                                {mostrarDetalle == 1 && (
                                    detalleInforme ? (
                                        <DetalleInforme detalleInforme={detalleInforme} />
                                    ) : (
                                        <div className="loading" />
                                    )
                                )}
                                {!informesEmpresaSeccionServicio && <p>no hay informes asociados</p>}
                            </TabPane>
                        )
                    })}

                </TabContent>*/}

                <div className="col-md-12 mt-3 d-flex">
                    <div className='h5'><i className="simple-icon-doc h3" /> {seccion.informes} Informes</div>
                    <div className='ml-3'><Button color="primary btn-sm" onClick={() => { abrirModal(seccion.id_empresa, seccion.id) }}><i className='iconsminds-add-file h5'></i> NUEVO INFORME</Button></div>
                </div>
                <div className="col-md-12 d-flex mt-3">
                    <div className='h5'><i className="simple-icon-doc h3" /> {seccion.equipos} Equipos</div>
                    <div className='ml-3'><Button color="primary btn-sm" onClick={() => { setModalNuevoEquipo(true) }}><i className='iconsminds-add-file h5'></i> NUEVO EQUIPO</Button></div>
                </div>
                <NuevoEquipo idEmpresa={seccion.id_empresa} mostrarModal={modalNuevoEquipo} manejarModal={setModalNuevoEquipo} nombreEmpresa={nombreEmpresa} cargarEquipo={cargarEquipo} />
            </Row>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        /*serviciosPorSeccion: state.serviciosReducer.serviciosPorSeccion,
        informesEmpresaSeccionServicio: state.informesReducer.informesEmpresaSeccionServicio,*/
        detalleInforme: state.informesReducer.detalleInforme,
    }
}

export default connect(
    mapStateToProps,
    { fetchdeleteSeccion, fetchUpdateSeccion,  /*fetchListarServiciosPorSeccion, fetchlistarInformesEmpresaSeccionServicio, fetchgetDetalleInforme, fetchDeleteInforme*/ }
)(DetalleSeccion);