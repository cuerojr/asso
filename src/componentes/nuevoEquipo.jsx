import React, { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody } from "reactstrap";
import { connect } from 'react-redux';
import { Row, Button, Input } from "reactstrap";
import { fetchlistarSecciones } from '../reducers/secciones-reducer';
import { fetchlistarRutas } from '../reducers/rutas-reducer';

const NuevoEquipo = (props) => {
    const [modal, setModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [seccion, setSeccion] = useState('');
    const [ruta, setRuta] = useState('');

    useEffect(() => {
        setModal(props.mostrarModal)
        if (props.mostrarModal) {
            props.fetchlistarSecciones(props.idEmpresa);
            props.fetchlistarRutas(props.idEmpresa)
        }
    }, [props.mostrarModal])

    const cargarEquipo = () => {
       props.cargarEquipo(nombre, seccion, ruta);
       setNombre('');
       setSeccion('');
       setRuta('');
    }
    
    return (
        <Fragment>
            <Modal isOpen={modal} wrapClassName="modal-right">
                <ModalBody>
                    <Button 
                        color="link" 
                        className="float-right" 
                        onClick={(e) => { 
                            e.preventDefault(); props.manejarModal(false); 
                        }} href="#">
                        <span aria-hidden="true" className='h4'>×</span>
                    </Button>
                    <h3>Cliente: <br />{props.nombreEmpresa}</h3>
                    <Row>
                        <div className='col-md-12 mt-5'>
                            <h2>NUEVO EQUIPO</h2>
                        </div>
                        <div className='col-md-12'>
                            <div className="separator mb-5"></div>
                        </div>
                        <div className="col-md-12 mb-3">
                            Nombre:
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div className="col-md-12 mb-3">
                            Sección:
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setSeccion(e.target.value) }} value={seccion}>
                                <option>-- Seleccione una sección -- </option>
                                {props.secciones && props.secciones.map((seccion) => {
                                    return (<option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>)
                                })}
                            </Input>
                        </div>
                        <div className="col-md-12 mb-3">
                            Ruta:
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setRuta(e.target.value) }} value={ruta}>
                                <option>-- Seleccione una Ruta -- </option>
                                {props.rutas && props.rutas.map((ruta) => {
                                    return (<option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>)
                                })}
                            </Input>
                        </div>
                        <div className="col-md-12 mb-3 d-flex justify-content-between">
                            <Button onClick={() => { props.manejarModal(false); }} color="secondary">CANCELAR</Button>
                            <Button color="success" disabled={!nombre || !seccion || !ruta} onClick={cargarEquipo}>
                                CREAR EQUIPO
                            </Button>
                        </div>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};


const mapStateToProps = (state) => {
    return {
        secciones: state.seccionesReducer.secciones,
        rutas: state.rutasReducer.rutas,
    }
}
export default connect(
    //función que mapea propiedades del state con propiedades del componente
    mapStateToProps,
    //mapeo de funciones
    { fetchlistarSecciones, fetchlistarRutas }
)(NuevoEquipo);

