import React, { Fragment, useEffect, useState } from 'react';
import { Row, Button, Input,  DropdownToggle,DropdownItem,DropdownMenu,UncontrolledDropdown,Modal, ModalBody  } from "reactstrap";
import { SwatchesPicker } from 'react-color';


const EditarEstado = (props) => {
    const [modal, setModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [color, setColor] = useState('');
    const opcionesDeColores = ['#bfbfbf', '#a9dcff', '#87e032', '#ffce00', '#ffeea4', '#ff7f00', '#be1e52', '#cc0000'];
    const [nombreCorto, setNombreCorto] = useState('');

    useEffect(() => {
        setModal(props.mostrarModal)
        if (props.mostrarModal) {
            setNombre(props.estado.nombre)
            setDescripcion(props.estado.descripcion)
            setColor(props.estado.color)
            setNombreCorto(props.estado.nombre_corto)
        }
    }, [props.mostrarModal])

    const guardarCambios = () => {
        props.updateEstado(props.estado.id, nombre, color, descripcion,nombreCorto );
    }

    const seleccionarColor = (col) =>{
        setColor(col.hex);
    }

    const eventNombreCorto = (nmb) => {
        setNombreCorto(nmb.toUpperCase());
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
                            <h2>EDITAR ESTADO:</h2>
                        </div>
                        <div className='col-md-12'>
                            <div className="separator mb-5"></div>
                        </div>
                        <div className="col-md-12 mb-3">
                            Nombre:
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} maxLength="15" />
                        </div>
                        <div className="col-md-12 mb-3">
                        <UncontrolledDropdown addonType="append" className="d-flex align-items-center">
                                    Color:
                                    <DropdownToggle className="btn-outline-white color-wrapper ml-2" style={{"borderRadius":"0", "height":"45px", "width":"100%"}}>
                                         <span style={{"background":color}} className="font-weight-bold font-italic"></span>
                                    </DropdownToggle>
                                    <DropdownMenu className="color-menu">
                                        {/*opcionesDeColores.map(col => {
                                            return (
                                                <DropdownItem className="color-option" key={col} onClick={() => setColor(col)}>
                                                    <span style={{'background':col}} className='font-weight-bold font-italic'></span>
                                                </DropdownItem>
                                            )
                                        })
                                    */}
                                     <SwatchesPicker color={color} onChange={seleccionarColor} />
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                        </div>

                        <div className="col-md-12 mb-3">
                            Nombre Corto:
                                <Input value={nombreCorto} id="nuevoNombre" onChange={e => eventNombreCorto(e.target.value)} maxLength="3" />
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

export default EditarEstado;