import React, { useState } from 'react';
import { GithubPicker } from 'react-color';
import { SwatchesPicker } from 'react-color';

import {
    Button, DropdownMenu, DropdownToggle, Input, InputGroup,
    InputGroupAddon, Row, UncontrolledDropdown
} from "reactstrap";
import { Tarjeta } from "./tarjeta";

export const NuevoEstado = (props) => {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [descripcionBreve, setDescripcionBreve] = useState('');
    const [colorSeleccionado, setColorSeleccionado] = useState('');
    const opcionesDeColores = ['#bfbfbf', '#a9dcff', '#87e032', '#ffce00', '#ffeea4', '#ff7f00', '#be1e52', '#cc0000'];
    const [nombreCorto, setNombreCorto] = useState('');

    const eventNombreCorto = (nmb) => {
        setNombreCorto(nmb.toUpperCase());
    }

    const seleccionarColor = (col) =>{
        setColorSeleccionado(col.hex);
    }

    const guardarCambios = () => {
        props.cargarEstado(nuevoNombre, colorSeleccionado, descripcionBreve, nombreCorto);
        setNuevoNombre('');
        setDescripcionBreve('');
        setColorSeleccionado('');
        setNombreCorto('');
    }
    return (
        <div>
            <div className="col-md-12 mb-4 pr-0 pl-0 dashed-border">
                <Tarjeta titulo="Nuevo estado">
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
                                         {/*<GithubPicker color={colorSeleccionado} onChange={seleccionarColor} width={220} />*/}
                                         <SwatchesPicker color={colorSeleccionado} onChange={seleccionarColor} />
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
                            <Button color="success" disabled={nuevoNombre == '' || colorSeleccionado == '' || nombreCorto == ''} className="w-100" onClick={guardarCambios}>Crear Estado</Button>
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
