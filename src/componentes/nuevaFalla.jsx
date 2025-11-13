import React, { useState } from 'react';
import { Tarjeta } from "./tarjeta";
import { SwatchesPicker } from 'react-color';
import { GithubPicker } from 'react-color';

import {
    InputGroup,
    InputGroupAddon,
    Input,
    Row,
    Button,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    UncontrolledDropdown
} from "reactstrap";

export const NuevaFalla = (props) => {

    const [nuevoNombre, setNuevoNombre] = useState('');
    const [descripcionBreve, setDescripcionBreve] = useState('');
    const [nombreCorto, setNombreCorto] = useState('');
    const [colorSeleccionado, setColorSeleccionado] = useState('');
    const opcionesDeColores = ['#bfbfbf', '#a9dcff', '#87e032', '#ffce00', '#ffeea4', '#ff7f00', '#be1e52', '#cc0000'];

    const guardarCambios = () => {
        props.cargarFalla(nuevoNombre, colorSeleccionado, nombreCorto, descripcionBreve);
        setNuevoNombre('');
        setDescripcionBreve('');
        setColorSeleccionado('');
        setNombreCorto('');
    }

    const seleccionarColor = (col) =>{
        setColorSeleccionado(col.hex);
    }

    const eventNombreCorto = (nmb) => {
        setNombreCorto(nmb.toUpperCase());
    }

    return (
        <div>
            <div className="col-md-12 mb-4 pr-0 pl-0 dashed-border">
                <Tarjeta titulo="Nuevo tipo de falla">
                    <Row>
                        <div className='col-md-5'>
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">Nombre</InputGroupAddon>
                                <Input value={nuevoNombre} id="nuevoNombre" onChange={e => setNuevoNombre(e.target.value)} maxLength="15" />
                                
                                <UncontrolledDropdown addonType="append">
                                    <DropdownToggle className="btn-outline-white color-wrapper">
                                        {colorSeleccionado === '' ? 'Color' : <span style={{ "background": colorSeleccionado }} className="font-weight-bold font-italic"></span>}
                                    </DropdownToggle>
                                    <DropdownMenu className="color-menu">
                                    <GithubPicker color={colorSeleccionado} onChange={seleccionarColor} width={220} />
                                    </DropdownMenu>
                                    </UncontrolledDropdown>
                            </InputGroup>
                        </div>
                        <div className='col-md-5'>
                        <InputGroup className="mb-3 col-md-6">
                            <InputGroupAddon addonType="prepend">Nombre Corto</InputGroupAddon>
                            <Input value={nombreCorto} id="nuevoNombre" onChange={e => eventNombreCorto(e.target.value)} maxLength="3" />
                            </InputGroup>
                        </div>
                        <div className='col-md-2'>
                            <Button color="success" disabled={nuevoNombre == '' || colorSeleccionado == '' || nombreCorto == ''} className="w-100" onClick={guardarCambios}>Crear Falla</Button>
                        </div>
                        <div className='col-md-12'>
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">Descripción Breve</InputGroupAddon>
                                <Input value={descripcionBreve} onChange={e => setDescripcionBreve(e.target.value)} />
                            </InputGroup>
                        </div>
                        
                    </Row>
                </Tarjeta>
            </div>
        </div>
    );
};
