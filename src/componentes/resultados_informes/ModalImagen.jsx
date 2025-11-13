import React from 'react';
import {  Modal, ModalBody,  ModalHeader,} from "reactstrap";

const ModalImagen = ({mostrarImagen, setMostarImagen, imagen}) => {
    return (
        <Modal isOpen={mostrarImagen} size="md" wrapClassName="modal-imagen" >
            <ModalHeader toggle={() => { setMostarImagen(false) }}></ModalHeader>
            <ModalBody>
                <img src={imagen} alt="imagen" className="img-fluid" />
            </ModalBody>
        </Modal>
    );
};

export default ModalImagen;