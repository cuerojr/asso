import React,{Fragment,useEffect,useState} from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Button } from "reactstrap";
import { fetchupdateUsuario } from '../../reducers/usuarios-reducer';
import { fetchLogoutUser } from '../../reducers/profile';
import { Tarjeta } from "../../componentes/tarjeta";
import { getUsuario, actualizarPwd } from '../../lib/usuarios-api';
import { connect } from 'react-redux';
import { NotificationManager } from "../../components/common/react-notifications";

const MiUsuario = (props) => {
    const [nombre, setNombre] = useState('');
    const [email, setemail] = useState('');
    const [firma, setFirma] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [repetirContrasenia, setRepetirContrasenia] = useState('');
    const [errorCoincidencias, setErrorCoincidencias] = useState(false);
    const [usuarioId, setUsuarioId] = useState(JSON.parse(window.localStorage.getItem('usuario')).id);
    
    useEffect(()=>{
        getUsuario(usuarioId).then(res =>{
            setNombre(res.nombre);
            setemail(res.email);
            setFirma(res.firma);
        })
    },[])
    

    const compararContrasenias = (tipo, valor) => {
        let valorAComparar = '';
        if(tipo == "repeat"){
            setRepetirContrasenia(valor)
            valorAComparar = contrasenia;
        }else{
            setContrasenia(valor) 
            valorAComparar = repetirContrasenia;
        }
        if(valor != valorAComparar){
            setErrorCoincidencias(true)
        }else{
            setErrorCoincidencias(false)
        }
    }

    const actualizarUsuario = () => {
        props.fetchupdateUsuario(usuarioId, email, nombre, firma).then((res) => {
            if (res && res.payload && res.payload.stat === 1) {
                NotificationManager.success("El usuario se ha actualizado exitosamente", "Hecho", 3000, null, null, '')
            } else if (res && res.payload && res.payload.stat === 0) {
                NotificationManager.error(res.payload.err, "Hecho", 3000, null, null, '')
            }
        })
    }

    const actualizarContrasenia = () => {
            actualizarPwd(contrasenia).then((res) => {
                if (res && res.stat === 1) {
                    NotificationManager.success("La contraseña se ha actualizado exitosamente", "Hecho", 3000, null, null, '');
                    window.localStorage.removeItem('usuario')
                    props.fetchLogoutUser();
                    setTimeout(function(){window.location.href = '/'}, 3000);
                } else if (res && res.stat === 0) {
                    NotificationManager.error(res.err, "Hecho", 3000, null, null, '')
                }
            })
    }

    return (
        <Fragment>
            <Row>
				<div className="col-md-12">
					<h1>Mi Usuario</h1>
				</div>
			</Row>
            <Tarjeta titulo="Perfil de mi usuario">
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
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                Mi Firma
                            </InputGroupAddon>
                            <Input placeholder="e@mail.com" value={firma} onChange={e => setFirma(e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="col-md-3">
                        <Button color="success" style={{ width: "100%" }} onClick={actualizarUsuario}>
                            <i className="iconsminds-save" /> Guardar Datos
                        </Button>
                    </div>
                </Row>
            </Tarjeta>
            <div className='mt-4'></div>
            <Tarjeta titulo="Cambiar contraseña">
                <Row>
                    <div className="col-md-9">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                Nueva Contraseña
                            </InputGroupAddon>
                            <Input type="password" value={contrasenia} onChange={e => compararContrasenias("contra",e.target.value)} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                Repetir contraseña
                            </InputGroupAddon>
                            <Input type="password" value={repetirContrasenia} onChange={e => compararContrasenias("repeat",e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="col-md-3">
                        <Button color="success" style={{ width: "100%" }} onClick={actualizarContrasenia} disabled={contrasenia == '' || errorCoincidencias}>
                            <i className="iconsminds-save" /> Guardar Contraseña
                        </Button>
                    </div>
                    <div className='col-md-12'>
                    {errorCoincidencias ? <p className="text-danger">Las contraseñas no coinciden</p> : null}
                    </div>
                </Row>
            </Tarjeta>
        </Fragment>
    );
};



export default connect(
    null,
    { fetchupdateUsuario, fetchLogoutUser }
)(MiUsuario);