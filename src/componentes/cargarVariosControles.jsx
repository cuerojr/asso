import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Row, Modal, ModalBody, ModalHeader, Col, InputGroup, InputGroupAddon, Button} from "reactstrap";
import { Tarjeta } from './tarjeta';

import {fetchModalCargaControles} from '../reducers/controles-reducer';
import CargaControlItem from '../views/app/cargamasiva/paso2/cargaControlItem/Index';
import EquipoNoControlado from '../views/app/cargamasiva/paso2/EquipoNoControlado';
import { seleccionarEquipoCargaIndividual, fetchlistarEquipos } from '../reducers/equipos-reducer';
import { altaControl } from '../lib/controles-api';
import { guardarEquipoNoControladoIndividual} from '../lib/controles-api';
import { setearEquipoNoControlado, setearCargaMasiva, fetchDetalleDeComponentesYControles} from '../reducers/cargas-masivas-reducer';
import { NotificationManager } from "../components/common/react-notifications";
import { fetchlistarFallas } from '../reducers/fallas-reducer';

import { fetchlistarEstados } from '../reducers/estados-reducer';
import {listarEquiposEnCargaMasiva} from '../lib/equipos-api';

import moment from 'moment';

const CargarVariosControles = (props) => {
    
    const [fechaEquipoNoControlado, setFechaEquipoNoControlado] = useState(moment());
    const [otroMotivoNoControlado, setOtroMotivoNoControlado] = useState("");
    const [motivoNoControlado, setMotivoNoControlado] = useState("");
    const [observacionesMotivosNoControlados, setObservacionesMotivosNoControlados] = useState("");
    const [equipoControlado, setEquipoControlado] = useState(false);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        //props.fetchlistarEquipos(props.clienteSeleccionado, props.rutaSeleccionada);
        //listarEquiposEnCargaMasiva(props.clienteSeleccionado, props.idCargaMasiva).then(res =>{
        //    setEquipos(res)
        //})
        //seleccionarEquipo(props.equipo.id);
        setEquipoSeleccionado(props.equipo.id)
        
    }, [])

    useEffect(() => {
        if (equipoSeleccionado != "") {
            fetchDetalleDeComponentesYControles(props.idCargaMasiva, equipoSeleccionado);
            fetchlistarEstados(props.clienteSeleccionado);
            fetchlistarFallas(props.clienteSeleccionado);
            //setMostrarFormularioControles(true);
        }
    }, [equipoSeleccionado])

    useEffect(() => {
        if (props.modalCargaControles) {
            const data = props.seleccionarEquipoCargaIndividual(props.equipo);            
        } else {
            props.seleccionarEquipoCargaIndividual(null);
        }
    }, [props.equipo, props.modalCargaControles, seleccionarEquipoCargaIndividual]);

    const seleccionarEquipo = (val) => {
        setEquipoSeleccionado(val);
        
        //setMostrarFormularioControles(false);
    }

    const handleGuardar = () => {
        if(props.equipoNoControlado){
            guardarEquipoNoControladoIndividual(props.equipo.id, props.equipoNoControlado.motivoNoControlado, props.equipoNoControlado.observacionesMotivosNoControlados, props.equipoNoControlado.fechaEquipoNoControlado, props.detalleCliente.id).then((res)=>{
                if(res.stat === 1){
                    NotificationManager.success("El equipo no controlado ha sido guardado", "Hecho", 3000, null, null, '');
                    props.fetchModalCargaControles(false);
                    props.setearCargaMasiva({
                            tituloDeReferencia: "",
                        });
                    props.setearEquipoNoControlado(null);
                }
            })
        }else{
            const promesas = props.controlesDelEquipo.map(equipo => {
                const idsDeFallas = equipo.fallasSeleccionada.map(falla => falla.value);
                if(equipo.estado)
                return altaControl(1, equipo.estado.id, equipo.componente, moment(equipo.fecha).format("YYYY-MM-DD"), JSON.stringify(idsDeFallas), equipo.observacion, equipo.recomendacion, equipo.file);
            });

            Promise.all(promesas).then((respuestas) => {
                if(respuestas[0].stat === 1){
                    NotificationManager.success("Los controles han sido guardados", "Hecho", 3000, null, null, '');
                    props.fetchModalCargaControles(false);
                    props.setearCargaMasiva({
                        tituloDeReferencia: "",
                      });
                }
            }).catch((error) => {
                NotificationManager.error(error.err,"Error",3000,null,null,'');
                console.error("Error en alguna de las promesas:", error);
            });
        }
    }

    return (
        <Modal isOpen={props.modalCargaControles} size="lg" className="modal-carga-varios-controles bg-black">
            <ModalHeader toggle={() => { props.fetchModalCargaControles(false) }}>
            </ModalHeader>
            <ModalBody>
                <Tarjeta titulo={'NUEVO CONTROL SOBRE LOS COMPONENTES DEL EQUIPO'}>
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend" style={{background:'#000', color:'#FFF'}}>
                        NOMBRE DEL EQUIPO:
                    </InputGroupAddon>
                    <div style={{border:'1px solid #424242', flex:'1', lineHeight:'40px', paddingLeft:'20px'}}>{props.equipo.nombre}</div>
                </InputGroup>
                <Button color='success' onClick={handleGuardar} style={{position:'absolute', right: '30px'}}>GUARDAR</Button>
                    {equipoSeleccionado && <EquipoNoControlado 
                        equipoControlado={equipoControlado} 
                        setMotivoNoControlado={setMotivoNoControlado}
                        motivoNoControlado={motivoNoControlado} 
                        fechaEquipoNoControlado={fechaEquipoNoControlado} 
                        setFechaEquipoNoControlado={setFechaEquipoNoControlado} 
                        otroMotivoNoControlado={otroMotivoNoControlado}
                        setOtroMotivoNoControlado={setOtroMotivoNoControlado} 
                        observacionesMotivosNoControlados={observacionesMotivosNoControlados}
                        setObservacionesMotivosNoControlados={setObservacionesMotivosNoControlados} 
                        clienteSeleccionado={props.clienteSeleccionado} 
                    />}
                </Tarjeta>
                {props.componentes && props.componentes.map((componente, i)=> (<CargaControlItem key={i} componente={componente} />))}
            </ModalBody>
        </Modal>
    );
};

const mapStateToProps = (state) => {
    return {
        modalCargaControles: state.controlesReducer.modalCargaControles,
        componentes: state.componentesReducer.componentes,
        controlesDelEquipo: state.cargasMasivasReducer.controlesDelEquipo,
        equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
        detalleCliente: state.clientesReducer.detalleClienteState,
        equipos: state.equiposReducer.equipos,
        estados: state.estadosReducer.estados,
        fallas: state.fallasReducer.fallas,
        detalleDeComponentesYControles: state.cargasMasivasReducer.detalleDeComponentesYControles,
        rutaSeleccionada: state.cargasMasivasReducer.rutaSeleccionada,
    }
}
export default connect(
    mapStateToProps,
    { 
        fetchModalCargaControles, 
        seleccionarEquipoCargaIndividual, 
        setearEquipoNoControlado, 
        setearCargaMasiva, 
        fetchlistarEquipos, 
        fetchDetalleDeComponentesYControles, 
        fetchlistarEstados, 
        fetchlistarFallas,
        
    }
)(CargarVariosControles);
