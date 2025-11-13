import React, { Fragment, useEffect, useState } from 'react';
import { Row, Button } from 'reactstrap';
import { AltaUsuario } from "../../contenedores/usuarios/alta-usuario";
import { ListaUsuarios } from "../../contenedores/usuarios/lista-usuarios";
import { fetchlistarUsuarios, fetchAltaUsuario, fetchdeleteUsuario, fetchupdateUsuario } from '../../reducers/usuarios-reducer';
import { DetalleUsuario } from "../../contenedores/usuarios/detalle-usuario";
import { NotificationManager } from "../../components/common/react-notifications";

import { connect } from 'react-redux';

const Usuarios = (props) => {
    const [detalleUsuario, setDetalleUsuario] = useState(0)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    useEffect(() => {
        props.fetchlistarUsuarios();
    }, [props.guardado]);


    const mostrarDetalleUsuario = (item) => {
        setUsuarioSeleccionado(item)
        setDetalleUsuario(1)
    }

    const salirDetalleUsuario = () => {
        setUsuarioSeleccionado(null)
        setDetalleUsuario(0)
    }

    const actualizarUsuario = (id, email, nombre) => {
        props.fetchupdateUsuario(id, email, nombre).then(function (res) {
            console.log(res)
            if (res && res.payload && res.payload.stat === 1) {
                NotificationManager.success("El usuario se ha cargado exitosamente", "Hecho", 3000, null, null, '')
                setDetalleUsuario(0)
            } else if (res && res.payload && res.payload.stat === 0) {
                NotificationManager.error(res.payload.err, "Hecho", 3000, null, null, '')
            }
        })
    }

    return (
        <Fragment>
            <Row>
                {detalleUsuario == 1 && <div className="col-md-12 mb-2">
                    <Button color="link" className="pl-0" onClick={salirDetalleUsuario}>&lt; Volver</Button>
                </div>}
            </Row>
            <Row>
                <div className="col-md-12">
                    <h1>Usuarios del sistema</h1>
                </div>
                <div className="col-md-12">
                    <div className="separator mb-5"></div>
                </div>
            </Row>
            {!detalleUsuario && <Row>
                <div className="col-md-12 mb-3">
                    <AltaUsuario altaUsuario={props.fetchAltaUsuario} />
                </div>
                <div className="col-md-12 mb-3">
                    <ListaUsuarios usuarios={props.usuarios} fetchdeleteUsuario={props.fetchdeleteUsuario} mostrarDetalleUsuario={mostrarDetalleUsuario} />
                </div>
            </Row>}
            {detalleUsuario == 1 && <Row>
                <div className="col-md-12">
                    <DetalleUsuario usuario={usuarioSeleccionado} salirDetalleUsuario={salirDetalleUsuario} actualizarUsuario={actualizarUsuario} />
                </div>
            </Row>}

        </Fragment>
    )
}


const mapStateToProps = (state) => {
    return {
        usuarios: state.usuariosReducer.usuarios,
        guardado: state.usuariosReducer.guardado
    }
}

export default connect(
    mapStateToProps,
    { fetchlistarUsuarios, fetchAltaUsuario, fetchdeleteUsuario, fetchupdateUsuario }
)(Usuarios);