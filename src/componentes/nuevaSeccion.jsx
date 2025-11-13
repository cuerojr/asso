import React, { useState, useEffect} from 'react';
import { Tarjeta } from "./tarjeta";
import { Button, Input } from "reactstrap";
import { connect } from 'react-redux';
import { fetchAltaSeccion } from'../reducers/secciones-reducer';
import { NotificationManager } from "../components/common/react-notifications";

const NuevaSeccion = (props) => {
    const [edicionEnable, setEdicionEnable] = useState(false)
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [observacion, setObservacion] = useState('')
    useEffect(() =>{
        if(document.getElementById("nuevoNombre")){
            document.getElementById("nuevoNombre").focus();
        }
    },[edicionEnable])
    const crearSeccion = (e) => {
        e.preventDefault();
        setEdicionEnable(true);
    }
    const cerrarEdicion = (e) => {
        e.preventDefault();
        setEdicionEnable(false);
    }

    const guardar = () => {
        props.fetchAltaSeccion(props.idEmpresa, nuevoNombre, observacion).then(function(res){
			if(res && res.payload && res.payload.stat === 1){
				NotificationManager.success("La sección ha sido creada","Hecho",3000,null,null,'')
                props.recargarSecciones(props.idEmpresa);
                setNuevoNombre('');
                setObservacion('');
			}
		})
    }
    return (
        <div className={edicionEnable ? "col-md-4 seccion-item nueva-seccion nueva-seccion-editar pl-0" : "col-md-4 seccion-item nueva-seccion pl-0"}>
            <Tarjeta>

                {!edicionEnable && <h3 className="titulo-seccion"><Button color="link" onClick={crearSeccion} href="#">Nueva Seccion</Button></h3>}
                {edicionEnable &&
                    <div className="ml-5">
                        <Input value={nuevoNombre} id="nuevoNombre" onChange={e => setNuevoNombre(e.target.value)} placeholder="Nombre de la sección" />
                        <Input value={observacion} id="nuevoNombre" type="textarea" onChange={e => setObservacion(e.target.value)} placeholder="Observaciones" className="mt-2" />
                        <Button color="success" className="float-right mt-2" onClick={guardar}>Guardar</Button>
                        <Button className="neutro float-right mt-2 mr-2"   onClick={cerrarEdicion}  >Cancelar</Button>
                    </div>
                }
                <i className="simple-icon-folder-alt" />
            </Tarjeta>
        </div>
    );
};


const mapStateToProps = (state) => {
	return {
		guardado:state.seccionesReducer.guardado,
	}
}
export default connect(
	mapStateToProps,
	{fetchAltaSeccion}
)(NuevaSeccion);
