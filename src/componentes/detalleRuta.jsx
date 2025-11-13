import React, { Fragment, useState } from 'react';
import { Row, Input, Button, InputGroupAddon, InputGroup, Modal, ModalBody, ModalFooter } from "reactstrap";

export const DetalleRuta = (props) => {

    const [nombre, setNombre] = useState(props.ruta.nombre);
    const [descripcion, setDescripcion] = useState(props.ruta.descripcion);
    const [mostrarModalConfirmarEliminarRuta, setMostrarModalConfirmarEliminarRuta] = useState(false);

    const eliminarRuta = () => {
        props.borrarRuta(props.ruta.id);
    }

    const actualizarRuta = () => {
        props.updateRuta(props.ruta.id, nombre, descripcion);
    }

    return (
        <Fragment>
            <Modal isOpen={mostrarModalConfirmarEliminarRuta} size="md">
                <ModalBody>
                    <p>¿Desea eliminar esta ruta?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={eliminarRuta}>
                        Si, eliminar
                    </Button>
                    <Button className="neutro" onClick={() => { setMostrarModalConfirmarEliminarRuta(false) }}>
                        No, cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Row>
                <div className="col-md-12">
                    <Button color="link" className="pl-0" onClick={() => { props.salirDetalleRuta() }}>&lt; Rutas</Button>
                </div>
                <div className="col">
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <span className="input-group-text"> <i className="simple-icon-organization" style={{ "fontSize": "2em" }} /></span>
                        </InputGroupAddon>
                        <Input value={nombre} className="form-title" onChange={e => setNombre(e.target.value)} />
                    </InputGroup>
                </div>
                <div style={{ "flex": "0 0 170px" }}>
                    <Button color="success" size="sm" onClick={actualizarRuta}>GUARDAR CAMBIOS</Button>
                </div>
                <div className="col-md-12">
                    <Input type="textarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                </div>
                <div className="col-md-12 text-right mt-2">
                    <Button color="danger" size="sm" onClick={() => { setMostrarModalConfirmarEliminarRuta(true) }}> <i className="simple-icon-trash" /> ELIMINAR RUTA</Button>
                </div>
            </Row>

        </Fragment>
    );
};