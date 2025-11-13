import React, { Fragment, useState } from "react";
import { InputGroup, InputGroupAddon, Input, Row, Button } from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta"
import { NotificationManager } from "../../components/common/react-notifications";

export const AltaUsuario= (props) => {
    const [nombre, setNombre] = useState('');
    const [clave, setClave] = useState('');
    const [email, setemail] = useState('');
    
    const guardarUsuario = () => {
        props.altaUsuario(email,clave,nombre).then(function(res){
            console.log(res)
			if(res && res.payload && res.payload.stat === 1){
				NotificationManager.success("El usuario se ha cargado exitosamente","Hecho",3000,null,null,'');
                setNombre('');
                setClave('');
                setemail('');

			}else if(res && res.payload && res.payload.stat === 0){
                NotificationManager.error(res.payload.err,"Hecho",3000,null,null,'')
            }
		})
    }

    return (
        <Fragment>
            <Tarjeta titulo="Nuevo Usuario">
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
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                Contraseña:
                            </InputGroupAddon>
                            <Input placeholder="contraseña" type="password" value={clave} onChange={e => setClave(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="col-md-3">
                        <Button color="success" size="lg" style={{ width: "100%" }} onClick={guardarUsuario}>
                            <i className="simple-icon-plus" /> CREAR NUEVO USUARIO
                        </Button>
                    </div>
                </Row>
            </Tarjeta>
        </Fragment>
    )
}