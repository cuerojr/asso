import React, { Fragment, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Input, ModalHeader, Label, InputGroup, InputGroupAddon } from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';

const GuardarInformeModal = (props) => {
    const [inputs, setInputs] = useState({});
    const [introduccion, setIntroduccion] = useState('')

    const finalmenteGuardar = () => {
        props.finalmenteGuarda(inputs.titulo, null, introduccion, inputs.planta, inputs.linea1, inputs.linea2, inputs.linea3, inputs.referencia, inputs.firma, inputs.opcionales)
    }

    return (
        <Fragment>
            <Modal isOpen={props.mostrarModalGuarda} size="md" className="guardar-informe" style={{ maxWidth: '900px', width: '95%' }}>
                <ModalHeader toggle={() => { props.setMostrarModalGuarda(false) }}>GUARDAR INFORME:</ModalHeader>
                <ModalBody>
                    <Label for="titulo">TITULO DEL INFORME: </Label>
                    <Input id="titulo" name="titulo" className="form-title" onChange={({ target }) => setInputs(state => ({ ...state, titulo: target.value }))} value={inputs.titulo || ''} />
                    <Label for="planta" className='mt-3'>Planta: </Label>
                    <Input id="planta" name="planta" onChange={({ target }) => setInputs(state => ({ ...state, planta: target.value }))} value={inputs.planta || ''} />
                    <hr />
                    <Label>ATENCIÓN: </Label>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <span className="input-group-text"><strong>Nombre </strong></span>
                        </InputGroupAddon>
                        <Input id="linea1" name="linea1" onChange={({ target }) => setInputs(state => ({ ...state, linea1: target.value }))} value={inputs.linea1 || ''} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <span className="input-group-text">Línea 2 </span>
                        </InputGroupAddon>
                        <Input id="linea2" name="linea2" onChange={({ target }) => setInputs(state => ({ ...state, linea2: target.value }))} value={inputs.linea2 || ''} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <span className="input-group-text">Línea 3 </span>
                        </InputGroupAddon>
                        <Input id="linea3" name="linea3" onChange={({ target }) => setInputs(state => ({ ...state, linea3: target.value }))} value={inputs.linea3 || ''} />
                    </InputGroup>
                    <Label for="referencia" className='mt-3'>REFERENCIA: </Label>
                    <Input id="referencia" name="referencia" onChange={({ target }) => setInputs(state => ({ ...state, referencia: target.value }))} value={inputs.referencia || ''} />
                    <hr />
                    <Label for="introduccion" className='mt-3'>TEXTO DE INTRODUCCIÓN DE INFORME: </Label>
                    <ReactQuill
                        id="introducción"
                        theme="snow"
                        value={introduccion}
                        onChange={setIntroduccion}
                    />
                    <hr />
                    <Label for="firma">FIRMA: </Label>
                    <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                            <span className="input-group-text">INSPECCIÓN Y ANÁLISIS: </span>
                        </InputGroupAddon>
                        <Input id="firma" name="firma" onChange={({ target }) => setInputs(state => ({ ...state, firma: target.value }))} value={inputs.firma || ''} />
                    </InputGroup>
                    <Label for="datosopcionales" className='mt-3'>DATOS OPCIONALES: </Label>
                    <Input id="datosopcionales" name="datosopcionales" onChange={({ target }) => setInputs(state => ({ ...state, opcionales: target.value }))} value={inputs.opcionales || ''} />
                </ModalBody>
                <ModalFooter>
                    <Button className="neutro" onClick={() => { props.setMostrarModalGuarda(false) }}>
                        No, cancelar
                    </Button>
                    <Button color="success" onClick={finalmenteGuardar}>
                        Guardar
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default GuardarInformeModal;