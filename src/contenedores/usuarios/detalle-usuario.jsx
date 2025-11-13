import React,{Fragment,useState} from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Button } from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta";

export const DetalleUsuario = (props) => {
    const [nombre, setNombre] = useState(props.usuario.nombre);
    const [email, setemail] = useState(props.usuario.email);
    
 

    return (
        <Fragment>
            <Tarjeta titulo="Información del usuario">
                <Row>
                    <div className="col-md-9">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                Nombre
                            </InputGroupAddon>
                            <Input placeholder="Nombre completo del usuario" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                email
                            </InputGroupAddon>
                            <Input placeholder="e@mail.com" value={email} onChange={e => setemail(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="col-md-3">
                        <Button color="success" style={{ width: "100%" }} onClick={() => {props.actualizarUsuario(props.usuario.id, email, nombre)}}>
                            <i className="iconsminds-save" /> Guardar Datos
                        </Button>
                        <Button style={{ width: "100%" }} className="neutro mt-2" onClick={props.salirDetalleUsuario}>
                            <i className="simple-icon-close" /> Cancelar
                        </Button>

                    </div>
                </Row>
            </Tarjeta>
        </Fragment>
    );
};
