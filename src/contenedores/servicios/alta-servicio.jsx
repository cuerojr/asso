import React, { Fragment, useState, useEffect } from "react";
import { InputGroup, InputGroupAddon, Input, Row, Button } from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta"

export const AltaServicio = (props) => {
    const [nombreServicio, setnombreServicio] = useState('');
    const guardado = props.guardado;
    useEffect(() => {
      if(guardado && guardado.stat === 1){
        setnombreServicio('');
      }
    }, [guardado]);
    return (
        <Fragment>
            <Tarjeta titulo="Nuevo Servicio">
                <Row>
                    <div className="col-md-9">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                Nombre
                            </InputGroupAddon>
                            <Input placeholder="Nombre del servicio" value={nombreServicio} onChange={e => setnombreServicio(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="col-md-3">
                        <Button color="success" size="lg" style={{ width: "100%" }} onClick={() => props.guardar(nombreServicio)}>
                            <i className="simple-icon-plus" /> CREAR NUEVO SERVICIO
                        </Button>
                    </div>
                </Row>
            </Tarjeta>
        </Fragment>
    )
}