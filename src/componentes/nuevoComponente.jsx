import React, { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, Label, Row, Button, Input } from "reactstrap";
import { booleanToNumber } from './utils/utils';
import { connect } from 'react-redux';

const NuevoComponente = (props) => {
    const [modal, setModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [bajaRPM, setBajaRPM] = useState(false);


    useEffect(() => {
        setModal(props.mostrarModal)
        if (props.mostrarModal) {

        }
    }, [props.mostrarModal])

    const cargarEquipo = () => {
        props.cargarComponente(nombre, descripcion, booleanToNumber(bajaRPM));
        setNombre('');
        setDescripcion('');
    }
    return (
        <Fragment>
            <Modal isOpen={modal} wrapClassName="modal-right">
                <ModalBody>
                    <Button color="link" className="float-right" onClick={(e) => { e.preventDefault(); props.manejarModal(false); }} href="#">
                        <span aria-hidden="true" className='h4'>×</span>
                    </Button>
                    <h3 className='mb-2'>Cliente: <br />{props.nombreEmpresa}</h3>
                    <h3>Equipo: <br />{props.nombreEquipo}</h3>
                    <Row>
                        <div className='col-md-12 mt-5'>
                            <h2>NUEVO COMPONENTE:</h2>
                        </div>
                        <div className='col-md-12'>
                            <div className="separator mb-5"></div>
                        </div>
                        <div className="col-md-12 mb-3">
                            Nombre:
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div className="col-md-12 mb-3">
                            Descripción Breve:
                            <Input type="textarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </div>
                        <div className='col-md-12 pl-4'>
                            <div style={{marginLeft:'15px', marginBottom: '40px'}} >
                                <Input type="checkbox" value={bajaRPM} onChange={(evt)=>{setBajaRPM(evt.target.checked)}} /> <Label>Baja RPM</Label>
                            </div>
                        </div>


                        <div className="col-md-12 mb-3 d-flex justify-content-between">
                            <Button onClick={() => { props.manejarModal(false); }} color="secondary">CANCELAR</Button>
                            <Button color="success" disabled={!nombre} onClick={cargarEquipo}>
                                CREAR COMPONENTE
                            </Button>
                        </div>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};


/*const mapStateToProps = (state) => {
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
)(NuevoComponente);*/


export default NuevoComponente;