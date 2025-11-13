import React, { Fragment, useEffect, useState } from 'react';
import { Row, Button, Input,  DropdownToggle,DropdownItem,DropdownMenu,UncontrolledDropdown,Modal, ModalBody  } from "reactstrap";
import { SwatchesPicker } from 'react-color';
import { GithubPicker } from 'react-color';

const EditarFalla = (props) => {
    const [modal, setModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [nombreCorto, setnombreCorto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [color, setColor] = useState('');
    const opcionesDeColores = ['#bfbfbf', '#a9dcff', '#87e032', '#ffce00', '#ffeea4', '#ff7f00', '#be1e52', '#cc0000'];
    
    useEffect(() => {
        setModal(props.mostrarModal)
        if (props.mostrarModal) {
            setNombre(props.falla.nombre)
            setDescripcion(props.falla.descripcion)
            setColor(props.falla.color)
            setnombreCorto(props.falla.nombre_corto)
        }
    }, [props.mostrarModal])

    const guardarCambios = () => {
        props.updateFalla(props.falla.id, nombre, color, nombreCorto, descripcion );
    }

    const seleccionarColor = (col) =>{
        setColor(col.hex);
    }

    const eventNombreCorto = (nmb) => {
        setnombreCorto(nmb.toUpperCase());
    }

    return (
        <Fragment>
            <Modal isOpen={modal} wrapClassName="modal-right">
                <ModalBody>
                    <Button color="link" className="position-absolute" style={{"right":"0", "top":"0"}} onClick={(e) => { e.preventDefault(); props.manejarModal(false); }} href="#">
                        <span aria-hidden="true" className='h4'>×</span>
                    </Button>
                    <Row>
                        <div className='col-md-12 mt-5'>
                            <h2>EDITAR FALLA:</h2>
                        </div>
                        <div className='col-md-12'>
                            <div className="separator mb-5"></div>
                        </div>
                        <div className="col-md-12 mb-3">
                            Nombre:
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} maxLength="15" />
                        </div>
                        <div className="col-md-6 mb-3">
                            Nombre Corto:
                            <Input value={nombreCorto} onChange={e => eventNombreCorto(e.target.value)} maxLength="3" />
                        </div>
                        <div className="col-md-12 mb-3">
                        <UncontrolledDropdown addonType="append" className="d-flex align-items-center">
                                    Color:
                                    <DropdownToggle className="btn-outline-white color-wrapper ml-2" style={{"borderRadius":"0", "height":"45px", "width":"100%"}}>
                                         <span style={{"background":color}} className="font-weight-bold font-italic"></span>
                                    </DropdownToggle>
                                    <DropdownMenu className="color-menu">
                                         <GithubPicker color={color} onChange={seleccionarColor} width={220} />
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                        </div>
                        <div className="col-md-12 mb-3">
                            Descripción Breve:
                            <Input type="textarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </div>
                        
                        <div className="col-md-12 mb-3 d-flex justify-content-between">
                        <Button color="success" onClick={guardarCambios}>
                            GUARDAR
                        </Button>
                    </div>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default EditarFalla;