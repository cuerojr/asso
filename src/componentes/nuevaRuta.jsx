import React, { Fragment, useState } from 'react';
import { Tarjeta } from "./tarjeta";
import {
    Input,
    Row,
    Button,
    InputGroup,
    InputGroupAddon
} from "reactstrap";


export const NuevaRuta = (props) => {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [descripcionBreve, setDescripcionBreve] = useState('');

    const guardarCambios = () => {
        props.cargarRuta(nuevoNombre, descripcionBreve);
        setNuevoNombre('');
        setDescripcionBreve('');
    }

    return (
        <Fragment>
            <Tarjeta titulo="Nueva Ruta">
                <Row>
                    <div className='col-md-4'>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">Nombre</InputGroupAddon>
                            <Input value={nuevoNombre} id="nuevoNombre" onChange={e => setNuevoNombre(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className='col-md-6'>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">Descripción Breve</InputGroupAddon>
                            <Input value={descripcionBreve} onChange={e => setDescripcionBreve(e.target.value)} />
                            </InputGroup>
                        </div>
                        <div className='col-md-2'>
                        <Button color="success" className="w-100" onClick={guardarCambios}>Crear Ruta</Button>
                        </div>
                </Row>
            </Tarjeta>
        </Fragment>
    );
};

